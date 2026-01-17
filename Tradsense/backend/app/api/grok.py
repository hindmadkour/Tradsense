import os
from typing import Any, Dict, List, Literal, Optional, Tuple

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
import requests


router = APIRouter(prefix="/api", tags=["Chat"])


class ChatMessage(BaseModel):
    role: Literal["system", "user", "assistant"]
    content: str = Field(..., min_length=1, max_length=4000)


class ChatRequest(BaseModel):
    messages: List[ChatMessage] = Field(default_factory=list)
    model: Optional[str] = None
    temperature: Optional[float] = 0.3


class ChatResponse(BaseModel):
    reply: str


def _system_prompt() -> str:
    return (
        "You are the TradeSense assistant. Be concise and friendly. "
        "Provide info about the platform, rules, and pricing. "
        "Do not give personalized financial advice; provide general education only."
    )


def _get_gemini_config(payload: ChatRequest) -> Tuple[str, str]:
    api_key = os.environ.get("GEMINI_API_KEY", "").strip()
    if not api_key:
        api_key = os.environ.get("GOOGLE_API_KEY", "").strip()
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured")

    model_name = (payload.model or os.environ.get("GEMINI_MODEL", "gemini-1.5-flash")).strip()
    if not model_name:
        raise HTTPException(status_code=400, detail="Model is required")
    return api_key, model_name


def _to_gemini_contents(history: List[ChatMessage]) -> Tuple[Optional[str], List[Dict[str, Any]]]:
    system_prompt = None
    contents: List[Dict[str, Any]] = []
    for msg in history:
        if msg.role == "system":
            system_prompt = msg.content
            continue
        mapped_role = "user" if msg.role == "user" else "model"
        contents.append({"role": mapped_role, "parts": [{"text": msg.content}]})
    return system_prompt, contents


@router.post("/chat/grok", response_model=ChatResponse)
def chat_grok(payload: ChatRequest) -> ChatResponse:
    api_key, model_name = _get_gemini_config(payload)

    history_models = payload.messages[-8:]
    history = [
        (msg.model_dump() if hasattr(msg, "model_dump") else msg.dict())
        for msg in history_models
    ]
    if not any(msg["role"] == "system" for msg in history):
        history = [{"role": "system", "content": _system_prompt()}] + history

    message_models = [
        ChatMessage(**item) if isinstance(item, dict) else item
        for item in history
    ]
    system_prompt, contents = _to_gemini_contents(message_models)
    if not contents:
        raise HTTPException(status_code=400, detail="No user messages provided")

    payload_json: Dict[str, Any] = {
        "contents": contents,
        "generationConfig": {
            "temperature": payload.temperature,
        },
    }
    if system_prompt:
        payload_json["systemInstruction"] = {"parts": [{"text": system_prompt}]}

    try:
        response = requests.post(
            f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent",
            params={"key": api_key},
            headers={"Content-Type": "application/json"},
            json=payload_json,
            timeout=20,
        )
    except requests.RequestException as exc:
        raise HTTPException(status_code=502, detail=f"Gemini API request failed: {exc}")

    if response.status_code != 200:
        detail = response.text.strip() or "Gemini API error"
        raise HTTPException(status_code=502, detail=f"Gemini API error ({response.status_code}): {detail}")

    data = response.json()
    try:
        reply = data["candidates"][0]["content"]["parts"][0]["text"].strip()
    except (KeyError, IndexError, AttributeError, TypeError):
        raise HTTPException(status_code=502, detail="Unexpected Gemini response")

    if not reply:
        raise HTTPException(status_code=502, detail="Empty response from Gemini")

    return ChatResponse(reply=reply)
