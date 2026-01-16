from typing import Dict, Optional, Tuple
import logging
import os
import secrets
import time
from urllib.parse import urlencode

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ..db.database import get_db
from ..db import models
from ..services.auth import hash_password, verify_password, create_access_token

try:
    from google.oauth2 import id_token as google_id_token
    from google.auth.transport import requests as google_requests
except Exception:
    google_id_token = None
    google_requests = None

try:
    import requests
except Exception:
    requests = None


router = APIRouter(prefix="/api/auth", tags=["Auth"])
oauth_router = APIRouter(tags=["Auth"])
logger = logging.getLogger("tradesense.auth")
USED_OAUTH_CODES: Dict[str, float] = {}
OAUTH_CODE_TTL_SECONDS = 300


class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str
    account_type: Optional[str] = None
    plan: Optional[str] = None


class LoginRequest(BaseModel):
    email: str
    password: str


class GoogleAuthRequest(BaseModel):
    id_token: str
    account_type: Optional[str] = None
    plan: Optional[str] = None


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    email: str
    username: str
    is_admin: bool


def _get_google_oauth_config() -> Tuple[str, str, str]:
    client_id = os.environ.get("GOOGLE_CLIENT_ID", "").strip()
    client_secret = os.environ.get("GOOGLE_CLIENT_SECRET", "").strip()
    callback_url = os.environ.get("GOOGLE_CALLBACK_URL", "").strip()
    if not client_id or not client_secret or not callback_url:
        logger.error(
            "Google OAuth env missing: client_id=%s client_secret=%s callback_url=%s",
            bool(client_id),
            bool(client_secret),
            bool(callback_url),
        )
        raise HTTPException(status_code=500, detail="Google OAuth is not configured")
    return client_id, client_secret, callback_url


def _get_frontend_url() -> str:
    frontend_url = os.getenv("FRONTEND_URL", "https://tradsense-puce.vercel.app").strip()
    print("FRONTEND_URL =", os.getenv("FRONTEND_URL"))
    if not frontend_url:
        logger.warning("Frontend URL missing: FRONTEND_URL; using fallback")
        frontend_url = "https://tradsense-puce.vercel.app"
    return frontend_url.rstrip("/")


def _get_google_client_id() -> str:
    client_id = os.environ.get("GOOGLE_CLIENT_ID", "").strip()
    if not client_id:
        logger.error("Google OAuth env missing: GOOGLE_CLIENT_ID")
        raise HTTPException(status_code=500, detail="Google OAuth is not configured")
    return client_id


def _find_unique_username(db: Session, base: str) -> str:
    base = (base or "user").strip() or "user"
    username = base
    suffix = 1
    while db.query(models.User).filter_by(username=username).first() is not None:
        suffix += 1
        username = f"{base}{suffix}"
    return username


def _auth_user_from_google(
    db: Session,
    idinfo: Dict[str, str],
    account_type: Optional[str] = None,
    plan: Optional[str] = None,
) -> Dict[str, str]:
    email = idinfo.get("email")
    if not email or "@" not in email:
        raise HTTPException(status_code=400, detail="Google account email is missing")

    user = db.query(models.User).filter_by(email=email.lower().strip()).first()
    if user is None:
        name = idinfo.get("name") or email.split("@", 1)[0]
        username = _find_unique_username(db, name.replace(" ", "").lower())
        user = models.User(
            username=username,
            email=email.lower().strip(),
            password_hash=None,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        account_type = (account_type or "").lower().strip()
        plan = (plan or "").lower().strip()
        if account_type in {"demo", "trial", "paid"}:
            balance = 0.0
            status = "active"
            challenge_type = account_type
            if account_type == "demo":
                balance = 10000.0
            elif account_type == "trial":
                balance = 2000.0
            else:
                challenge = db.query(models.Challenge).filter(
                    models.Challenge.name.ilike(plan or "")
                ).first()
                if challenge:
                    balance = challenge.initial_balance
                    challenge_type = challenge.name.lower()
                status = "pending"

            new_account = models.Account(
                user_id=user.id,
                balance=balance,
                equity=balance,
                initial_balance=balance,
                daily_starting_equity=balance,
                challenge_type=challenge_type,
                status=status,
            )
            db.add(new_account)
            db.commit()

    token = create_access_token(str(user.id))
    db.add(models.AuthToken(user_id=user.id, token=token))
    db.commit()
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "email": user.email,
        "username": user.username,
        "is_admin": bool(user.is_admin),
    }


@oauth_router.get("/auth/google")
def google_oauth_start(request: Request) -> RedirectResponse:
    client_id, _, callback_url = _get_google_oauth_config()
    logger.info("Google OAuth start: client_id=%s callback_url=%s", client_id, callback_url)
    params = {
        "client_id": client_id,
        "redirect_uri": callback_url,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent",
        "state": secrets.token_urlsafe(16),
    }
    url = f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}"
    return RedirectResponse(url=url)


@oauth_router.get("/auth/google/callback")
def google_oauth_callback(
    request: Request,
    db: Session = Depends(get_db),
) -> Dict[str, str]:
    try:
        client_id, client_secret, callback_url = _get_google_oauth_config()
        logger.info("Google OAuth callback: client_id=%s callback_url=%s", client_id, callback_url)
        error = request.query_params.get("error")
        if error:
            error_desc = request.query_params.get("error_description")
            logger.warning("Google OAuth callback error: %s %s", error, error_desc or "")
            raise HTTPException(status_code=401, detail=error_desc or error)
        code = request.query_params.get("code")
        if not code:
            raise HTTPException(status_code=400, detail="Missing authorization code")
        now = time.time()
        expired = [key for key, ts in USED_OAUTH_CODES.items() if now - ts > OAUTH_CODE_TTL_SECONDS]
        for key in expired:
            USED_OAUTH_CODES.pop(key, None)
        if code in USED_OAUTH_CODES:
            logger.warning("Google OAuth code already used")
            raise HTTPException(status_code=400, detail="Authorization code already used")
        USED_OAUTH_CODES[code] = now
        if requests is None:
            raise HTTPException(status_code=500, detail="Requests library is not installed")
        try:
            token_response = requests.post(
                "https://oauth2.googleapis.com/token",
                data={
                    "code": code,
                    "client_id": client_id,
                    "client_secret": client_secret,
                    "redirect_uri": callback_url,
                    "grant_type": "authorization_code",
                },
                headers={"Content-Type": "application/x-www-form-urlencoded"},
                timeout=10,
            )
        except Exception:
            logger.exception("Google OAuth token exchange request failed")
            raise HTTPException(status_code=502, detail="Google OAuth token exchange failed")
        try:
            token_payload = token_response.json() if token_response.content else {}
        except ValueError:
            logger.error("Google OAuth token exchange returned invalid JSON")
            raise HTTPException(status_code=502, detail="Invalid response from Google")
        if not token_response.ok:
            logger.error(
                "Google OAuth token exchange failed: status=%s payload=%s",
                token_response.status_code,
                token_payload,
            )
            detail = token_payload.get("error_description") or token_payload.get("error") or "Google OAuth failed"
            raise HTTPException(status_code=401, detail=detail)
        id_token_value = token_payload.get("id_token")
        if not id_token_value:
            raise HTTPException(status_code=401, detail="Missing id_token from Google")
        if google_id_token is None or google_requests is None:
            raise HTTPException(status_code=500, detail="Google auth libraries are not installed")
        request_adapter = google_requests.Request()
        try:
            idinfo = google_id_token.verify_oauth2_token(id_token_value, request_adapter, client_id)
        except Exception:
            logger.exception("Google OAuth id_token verification failed")
            raise HTTPException(status_code=401, detail="Invalid Google token")
        if idinfo.get("iss") not in {"accounts.google.com", "https://accounts.google.com"}:
            raise HTTPException(status_code=401, detail="Invalid Google token issuer")
        if not idinfo.get("email_verified", False):
            raise HTTPException(status_code=401, detail="Google account email is not verified")
        auth_payload = _auth_user_from_google(db, idinfo)
        frontend_url = _get_frontend_url()
        response = RedirectResponse(url=f"{frontend_url}/dashboard")
        response.set_cookie(
            key="auth_token",
            value=auth_payload["access_token"],
            httponly=True,
            secure=True,
            samesite="none",
            max_age=60 * 60 * 24 * 7,
        )
        response.set_cookie(
            key="auth_user_id",
            value=str(auth_payload["user_id"]),
            httponly=True,
            secure=True,
            samesite="none",
            max_age=60 * 60 * 24 * 7,
        )
        response.set_cookie(
            key="auth_email",
            value=auth_payload["email"],
            httponly=True,
            secure=True,
            samesite="none",
            max_age=60 * 60 * 24 * 7,
        )
        response.set_cookie(
            key="auth_username",
            value=auth_payload["username"],
            httponly=True,
            secure=True,
            samesite="none",
            max_age=60 * 60 * 24 * 7,
        )
        response.set_cookie(
            key="auth_is_admin",
            value=str(auth_payload["is_admin"]),
            httponly=True,
            secure=True,
            samesite="none",
            max_age=60 * 60 * 24 * 7,
        )
        return response
    except HTTPException:
        raise
    except Exception:
        logger.exception("Google OAuth callback failed with unexpected error")
        raise HTTPException(status_code=500, detail="Google OAuth failed")


@router.post("/register", response_model=AuthResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> Dict[str, str]:
    if "@" not in payload.email:
        raise HTTPException(status_code=400, detail="Invalid email address")
    if len(payload.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    existing = db.query(models.User).filter_by(email=payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = models.User(
        username=payload.username.strip(),
        email=payload.email.lower().strip(),
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    account_type = (payload.account_type or "").lower().strip()
    plan = (payload.plan or "").lower().strip()
    if account_type in {"demo", "trial", "paid"}:
        balance = 0.0
        status = "active"
        challenge_type = account_type
        if account_type == "demo":
            balance = 10000.0
        elif account_type == "trial":
            balance = 2000.0
        else:
            challenge = db.query(models.Challenge).filter(
                models.Challenge.name.ilike(plan or "")
            ).first()
            if challenge:
                balance = challenge.initial_balance
                challenge_type = challenge.name.lower()
            status = "pending"

        new_account = models.Account(
            user_id=user.id,
            balance=balance,
            equity=balance,
            initial_balance=balance,
            daily_starting_equity=balance,
            challenge_type=challenge_type,
            status=status,
        )
        db.add(new_account)
        db.commit()

    token = create_access_token(str(user.id))
    db.add(models.AuthToken(user_id=user.id, token=token))
    db.commit()
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "email": user.email,
        "username": user.username,
        "is_admin": bool(user.is_admin),
    }


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> Dict[str, str]:
    if "@" not in payload.email:
        raise HTTPException(status_code=400, detail="Invalid email address")
    user = db.query(models.User).filter_by(email=payload.email.lower().strip()).first()
    if user is None or not user.password_hash:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(str(user.id))
    db.add(models.AuthToken(user_id=user.id, token=token))
    db.commit()
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "email": user.email,
        "username": user.username,
        "is_admin": bool(user.is_admin),
    }


@router.post("/google", response_model=AuthResponse)
def google_auth(payload: GoogleAuthRequest, db: Session = Depends(get_db)) -> Dict[str, str]:
    if google_id_token is None or google_requests is None:
        raise HTTPException(status_code=500, detail="Google auth libraries are not installed")

    request = google_requests.Request()
    allowed = [_get_google_client_id()]
    try:
        idinfo = None
        last_error = None
        for aud in allowed:
            try:
                try:
                    idinfo = google_id_token.verify_oauth2_token(
                        payload.id_token,
                        request,
                        aud,
                        clock_skew_in_seconds=300,
                    )
                except TypeError:
                    idinfo = google_id_token.verify_oauth2_token(payload.id_token, request, aud)
                break
            except Exception as exc:
                last_error = exc
        if idinfo is None:
            raise last_error or Exception("Invalid Google token")
    except Exception:
        logger.warning("Google auth: token verification failed", exc_info=True)
        raise HTTPException(status_code=401, detail="Invalid Google token")

    if idinfo.get("aud") not in allowed:
        logger.warning("Google auth: audience mismatch aud=%s allowed=%s", idinfo.get("aud"), allowed)
        raise HTTPException(status_code=401, detail="Google token audience mismatch")
    if idinfo.get("iss") not in {"accounts.google.com", "https://accounts.google.com"}:
        logger.warning("Google auth: invalid issuer iss=%s", idinfo.get("iss"))
        raise HTTPException(status_code=401, detail="Invalid Google token issuer")
    if not idinfo.get("email_verified", False):
        logger.warning("Google auth: email not verified email=%s", idinfo.get("email"))
        raise HTTPException(status_code=401, detail="Google account email is not verified")
    return _auth_user_from_google(db, idinfo, payload.account_type, payload.plan)
