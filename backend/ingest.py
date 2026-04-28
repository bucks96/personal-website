"""
Ingest knowledge-base/ into ChromaDB.

Run this whenever you add or edit files in knowledge-base/:
    python ingest.py
"""

import re
from pathlib import Path

import chromadb
from sentence_transformers import SentenceTransformer

KNOWLEDGE_DIR = Path(__file__).parent / "knowledge-base"
CHROMA_DIR = Path(__file__).parent / "chroma_db"
COLLECTION_NAME = "vaibhav_knowledge"
EMBED_MODEL = "all-MiniLM-L6-v2"

# Approx word counts for chunking
CHUNK_WORDS = 180
OVERLAP_WORDS = 30


def load_documents() -> list[dict]:
    docs = []
    supported = {".md", ".txt"}

    for path in sorted(KNOWLEDGE_DIR.glob("**/*")):
        if path.suffix.lower() in supported and path.name != "README.md":
            text = path.read_text(encoding="utf-8").strip()
            if text:
                docs.append({"text": text, "source": path.name})
                print(f"  Loaded: {path.name} ({len(text.split())} words)")

        elif path.suffix.lower() == ".pdf":
            try:
                import pypdf
                reader = pypdf.PdfReader(str(path))
                pages = [p.extract_text() or "" for p in reader.pages]
                text = "\n\n".join(pages).strip()
                if text:
                    docs.append({"text": text, "source": path.name})
                    print(f"  Loaded PDF: {path.name}")
            except ImportError:
                print(f"  Skipped {path.name}: install pypdf for PDF support")

    return docs


def chunk(text: str, source: str) -> list[dict]:
    # Split on blank lines (paragraph boundaries)
    paragraphs = [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()]

    chunks: list[dict] = []
    buffer: list[str] = []
    buf_words = 0

    for para in paragraphs:
        words = para.split()
        # If adding this paragraph would overflow, flush first
        if buf_words + len(words) > CHUNK_WORDS and buffer:
            chunks.append({"text": " ".join(buffer), "source": source})
            # Carry the last OVERLAP_WORDS into the next chunk
            overlap = buffer[-OVERLAP_WORDS:] if len(buffer) > OVERLAP_WORDS else buffer[:]
            buffer = overlap
            buf_words = len(buffer)

        buffer.extend(words)
        buf_words += len(words)

    if buffer:
        chunks.append({"text": " ".join(buffer), "source": source})

    return chunks


def ingest():
    print(f"\nScanning {KNOWLEDGE_DIR} ...")
    docs = load_documents()

    if not docs:
        print(
            "\n⚠️  No documents found.\n"
            "Add .md or .txt files to knowledge-base/ and re-run.\n"
        )
        return

    print(f"\nChunking {len(docs)} documents...")
    all_chunks: list[dict] = []
    for doc in docs:
        chunks = chunk(doc["text"], doc["source"])
        all_chunks.extend(chunks)
        print(f"  {doc['source']}: {len(chunks)} chunks")

    print(f"\nEmbedding {len(all_chunks)} chunks with {EMBED_MODEL}...")
    embedder = SentenceTransformer(EMBED_MODEL)
    texts = [c["text"] for c in all_chunks]
    embeddings = embedder.encode(texts, show_progress_bar=True, batch_size=32)

    print("\nStoring in ChromaDB...")
    chroma = chromadb.PersistentClient(path=str(CHROMA_DIR))

    # Always rebuild clean
    try:
        chroma.delete_collection(COLLECTION_NAME)
    except Exception:
        pass

    collection = chroma.create_collection(COLLECTION_NAME)
    collection.add(
        ids=[f"chunk_{i}" for i in range(len(all_chunks))],
        documents=texts,
        embeddings=embeddings.tolist(),
        metadatas=[{"source": c["source"]} for c in all_chunks],
    )

    print(f"\n✓ Done — {len(all_chunks)} chunks stored in {CHROMA_DIR}\n")
    print("Restart server.py to pick up the new knowledge base.")


if __name__ == "__main__":
    ingest()
