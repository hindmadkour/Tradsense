from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import inspect, text
import asyncio
import os
import time

from .db import models
from .db.database import SessionLocal, engine
from .api import market, challenges, extra, compat, auth, grok
from .services.market_scraper_casablanca import scrape_casablanca_live_overview
from .services.auth import hash_password


# --------- LOAD ENV FILE (OPTIONAL) ----------
def load_env_file(path: str) -> None:
    if not os.path.exists(path):
        return
    try:
        with open(path, "r", encoding="utf-8") as handle:
            for raw_line in handle:
                line = raw_line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, value = line.split("=", 1)
                key = key.strip()
                value = value.strip().strip('"').strip("'")
                if key and key not in os.environ:
                    os.environ[key] = value
    except Exception:
        return


load_env_file(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".env")))

# --------- CREATE DATABASE TABLES ----------
models.Base.metadata.create_all(bind=engine)

# --------- CREATE FASTAPI APP ----------
app = FastAPI(
    title="TradeSense AI API",
    description="API for the TradeSense AI trading platform.",
    version="1.0.0"
)

# --------- PAYPAL CLIENT ID ROUTE ----------
@app.get("/api/paypal/client-id")
def get_paypal_client_id():
    return {
        "clientId": os.getenv("PAYPAL_CLIENT_ID", "")
    }

# --------- MIDDLEWARE ----------
app.add_middleware(GZipMiddleware, minimum_size=1024)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # OK for dev / sandbox
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------- SEEDER ----------
def seed_challenges(db: Session):
    if db.query(models.Challenge).first() is None:
        db.add_all([
            models.Challenge(name="Starter", price_dh=200, initial_balance=5000),
            models.Challenge(name="Pro", price_dh=500, initial_balance=25000),
            models.Challenge(name="Elite", price_dh=1000, initial_balance=100000),
        ])
        db.commit()

    admin_email = os.environ.get("ADMIN_EMAIL", "admin@tradesense.ai").lower().strip()
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")

    admin_user = db.query(models.User).filter_by(email=admin_email).first()
    if admin_user is None:
        admin_user = models.User(
            username="admin",
            email=admin_email,
            password_hash=hash_password(admin_password),
            is_admin=1,
        )
        db.add(admin_user)
        db.commit()

# --------- STARTUP ----------
@app.on_event("startup")
def on_startup():
    inspector = inspect(engine)

    if "users" in inspector.get_table_names():
        user_columns = {c["name"] for c in inspector.get_columns("users")}
        if "is_admin" not in user_columns:
            with engine.begin() as conn:
                conn.execute(text("ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0"))

    db = SessionLocal()
    seed_challenges(db)
    db.close()

    async def warm_cache_loop():
        while True:
            try:
                await market.get_market_overview()
                await asyncio.to_thread(scrape_casablanca_live_overview)
            except Exception:
                pass
            await asyncio.sleep(15)

    app.state.warm_cache_task = asyncio.create_task(warm_cache_loop())

# --------- ROUTERS ----------
app.include_router(market.router)
app.include_router(challenges.router)
app.include_router(extra.router)
app.include_router(compat.router)
app.include_router(auth.router)
app.include_router(grok.router)

# --------- HEALTH CHECK ----------
@app.get("/health")
def health():
    return {"status": "healthy", "service": "TradeSense AI Backend"}
