"""
FastAPI auth-proxy in front of a local Ollama instance for InNederland.ai.

Why a proxy: Ollama itself has no authentication, so it must never be exposed to the public
internet directly. This proxy requires a bearer token (BACKEND_API_KEY) and forwards requests
to Ollama on localhost. The Next.js app (on Vercel) calls these endpoints server-side.

Endpoints:
  GET  /health              -> liveness + model name
  POST /generate            -> single completion (optionally JSON mode)
  POST /chat                -> streamed chat completion (plain text chunks)
  POST /api/chat            -> simple helper kept from the original design (message + level)
"""

import os
from typing import Optional

import ollama
from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

MODEL = os.environ.get("OLLAMA_MODEL", "llama3.2:3b")
BACKEND_API_KEY = os.environ.get("BACKEND_API_KEY")  # set this on Railway; leave unset only for local dev

app = FastAPI(title="InNederland.ai — Ollama backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def require_key(authorization: Optional[str] = Header(default=None)) -> None:
    """Rejects requests without the correct bearer token (when BACKEND_API_KEY is configured)."""
    if not BACKEND_API_KEY:
        return
    expected = f"Bearer {BACKEND_API_KEY}"
    if authorization != expected:
        raise HTTPException(status_code=401, detail="Ongeldige of ontbrekende API-sleutel.")


class Message(BaseModel):
    role: str
    content: str


class GenerateRequest(BaseModel):
    prompt: str
    system: Optional[str] = None
    json: bool = False
    temperature: float = 0.4


class ChatRequest(BaseModel):
    messages: list[Message]
    system: Optional[str] = None
    temperature: float = 0.6


class SimpleChatRequest(BaseModel):
    message: str
    level: str = "A1-B2"


@app.get("/health")
def health():
    return {"status": "ok", "model": MODEL}


@app.post("/generate", dependencies=[Depends(require_key)])
def generate(req: GenerateRequest):
    try:
        result = ollama.generate(
            model=MODEL,
            prompt=req.prompt,
            system=req.system or "",
            format="json" if req.json else "",
            options={"temperature": req.temperature},
        )
        return {"text": result.get("response", "")}
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=502, detail=str(exc))


@app.post("/chat", dependencies=[Depends(require_key)])
def chat(req: ChatRequest):
    messages = []
    if req.system:
        messages.append({"role": "system", "content": req.system})
    messages.extend({"role": m.role, "content": m.content} for m in req.messages)

    def stream():
        try:
            for part in ollama.chat(
                model=MODEL, messages=messages, stream=True, options={"temperature": req.temperature}
            ):
                yield part["message"]["content"]
        except Exception as exc:  # noqa: BLE001
            yield f"[fout] {exc}"

    return StreamingResponse(stream(), media_type="text/plain; charset=utf-8")


@app.post("/api/chat", dependencies=[Depends(require_key)])
def simple_chat(req: SimpleChatRequest):
    """Kept from the original design: a one-shot Dutch tutor reply."""
    try:
        result = ollama.chat(
            model=MODEL,
            messages=[
                {
                    "role": "system",
                    "content": (
                        f"Je bent een vriendelijke Nederlandse taalleraar voor niveau {req.level}. "
                        "Geef duidelijk antwoord in het Nederlands. Corrigeer fouten vriendelijk. "
                        "Houd antwoorden niet te lang."
                    ),
                },
                {"role": "user", "content": req.message},
            ],
        )
        return {"reply": result["message"]["content"]}
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=str(exc))
