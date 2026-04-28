import os
import json
import sqlite3
import time
from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / ".env")

from rag import RAGPipeline

STATIC_DIR = Path(__file__).parent.parent
DB_PATH = Path(__file__).parent / "interactions.db"

rag: RAGPipeline | None = None


def init_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS interactions (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp   TEXT    NOT NULL,
            question    TEXT    NOT NULL,
            answer      TEXT    NOT NULL,
            sources     TEXT,
            latency_ms  INTEGER
        )
    """)
    conn.commit()
    conn.close()


def log_interaction(question: str, answer: str, sources: list, latency_ms: int):
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        "INSERT INTO interactions (timestamp, question, answer, sources, latency_ms) "
        "VALUES (?, ?, ?, ?, ?)",
        (
            time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            question,
            answer,
            json.dumps(sources),
            latency_ms,
        ),
    )
    conn.commit()
    conn.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    global rag
    init_db()
    rag = RAGPipeline()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "GET"],
    allow_headers=["Content-Type"],
)


# ── API routes ────────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    question: str


class ChatResponse(BaseModel):
    answer: str
    sources: list[str]


@app.post("/api/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    q = req.question.strip()
    if not q:
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    if len(q) > 1000:
        raise HTTPException(status_code=400, detail="Question too long")

    start = time.time()
    answer, sources = rag.query(q)
    latency_ms = int((time.time() - start) * 1000)

    log_interaction(q, answer, sources, latency_ms)
    return ChatResponse(answer=answer, sources=sources)


@app.get("/api/interactions")
async def get_interactions():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    rows = conn.execute(
        "SELECT id, timestamp, question, answer, sources, latency_ms "
        "FROM interactions ORDER BY id DESC LIMIT 200"
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


# ── Static file serving ───────────────────────────────────────────────────────

BLOCKED_PREFIXES = ("backend/", "backend\\")
MIME = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".jsx": "application/javascript",
    ".json": "application/json",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".woff2": "font/woff2",
    ".woff": "font/woff",
    ".ttf": "font/ttf",
}


@app.get("/")
async def index():
    return FileResponse(STATIC_DIR / "index.html", media_type="text/html")


@app.get("/{path:path}")
async def static_files(path: str):
    # Never expose backend internals
    if any(path.startswith(p) for p in BLOCKED_PREFIXES):
        raise HTTPException(status_code=404)

    file_path = STATIC_DIR / path
    if file_path.is_file():
        ext = file_path.suffix.lower()
        media_type = MIME.get(ext, "application/octet-stream")
        return FileResponse(file_path, media_type=media_type)

    # Fall back to index.html (handles deep-link refreshes if needed)
    return FileResponse(STATIC_DIR / "index.html", media_type="text/html")


if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True,
                reload_dirs=[str(Path(__file__).parent)])
