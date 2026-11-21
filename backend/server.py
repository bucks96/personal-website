import os
import json
import sqlite3
import time
from collections import defaultdict, deque
from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / ".env")

from rag import RAGPipeline

STATIC_DIR = Path(__file__).parent.parent
# Railway sets RAILWAY_VOLUME_MOUNT_PATH when a volume is attached, so the log survives redeploys
DATA_DIR = Path(os.environ.get("RAILWAY_VOLUME_MOUNT_PATH", Path(__file__).parent))
DB_PATH = DATA_DIR / "interactions.db"

# Comma-separated list, e.g. "https://vaibhavsachan.com,https://www.vaibhavsachan.com"
ALLOWED_ORIGINS = [
    o.strip()
    for o in os.environ.get(
        "ALLOWED_ORIGINS", "http://localhost:8000,http://127.0.0.1:8000"
    ).split(",")
    if o.strip()
]

# Rate limits on /api/chat — each request costs Anthropic credits
RATE_PER_MINUTE = int(os.environ.get("RATE_PER_MINUTE", "6"))
RATE_PER_DAY = int(os.environ.get("RATE_PER_DAY", "40"))
GLOBAL_PER_DAY = int(os.environ.get("GLOBAL_PER_DAY", "500"))

rag: RAGPipeline | None = None


class RateLimiter:
    """In-memory sliding-window limiter. Fine for a single uvicorn worker; resets on redeploy."""

    def __init__(self):
        self.hits: dict[str, deque[float]] = defaultdict(deque)
        self.global_hits: deque[float] = deque()
        self.last_sweep = time.time()

    @staticmethod
    def _trim(q: deque[float], now: float, window: float):
        while q and q[0] <= now - window:
            q.popleft()

    def check(self, ip: str) -> int | None:
        """Record a hit for ip, or return seconds to wait if a limit is exceeded."""
        now = time.time()
        if now - self.last_sweep > 3600:
            for key in [k for k, q in self.hits.items() if not q or q[-1] <= now - 86400]:
                del self.hits[key]
            self.last_sweep = now

        q = self.hits[ip]
        self._trim(q, now, 86400)
        self._trim(self.global_hits, now, 86400)

        if len(self.global_hits) >= GLOBAL_PER_DAY:
            return int(self.global_hits[0] + 86400 - now) + 1
        if len(q) >= RATE_PER_DAY:
            return int(q[0] + 86400 - now) + 1
        recent = [t for t in q if t > now - 60]
        if len(recent) >= RATE_PER_MINUTE:
            return int(recent[0] + 60 - now) + 1

        q.append(now)
        self.global_hits.append(now)
        return None


limiter = RateLimiter()


def client_ip(request: Request) -> str:
    # Railway's proxy appends the real client IP as the last X-Forwarded-For entry;
    # earlier entries can be forged by the caller, so they're ignored
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[-1].strip()
    return request.client.host if request.client else "unknown"


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
    allow_origins=ALLOWED_ORIGINS,
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
async def chat(req: ChatRequest, request: Request):
    q = req.question.strip()
    if not q:
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    if len(q) > 1000:
        raise HTTPException(status_code=400, detail="Question too long")

    retry_after = limiter.check(client_ip(request))
    if retry_after is not None:
        raise HTTPException(
            status_code=429,
            detail="Too many questions — please try again later",
            headers={"Retry-After": str(retry_after)},
        )

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
