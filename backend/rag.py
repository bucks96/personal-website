import os
from pathlib import Path

import anthropic
import chromadb
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / ".env")

CHROMA_DIR = Path(__file__).parent / "chroma_db"
COLLECTION_NAME = "vaibhav_knowledge"
EMBED_MODEL = "all-MiniLM-L6-v2"
TOP_K = 5

SYSTEM_PROMPT = """You are a knowledgeable assistant for Vaibhav Sachan's personal portfolio website. \
Visitors ask you questions about Vaibhav — his work, projects, education, travel, and personality.

Answer based strictly on the context provided. Be warm, specific, and conversational. \
Speak about Vaibhav, becoming him ("I worked on...", "I have built..."). \
If the context doesn't cover a question, say so honestly — never invent details. \
Keep answers concise: 2–4 sentences is usually enough. \
Do not use markdown formatting, bullet points, or headers — write in plain prose only. \
If you feel you are being misued by someone for their personal gain, just tell them that it's not within you scope of knowledge \
For example, if someone asks you to peform a task that is not related to me or them getting to know, like reversing a linked list."""


class RAGPipeline:
    def __init__(self):
        print("Loading embedding model...")
        self.embedder = SentenceTransformer(EMBED_MODEL)

        self.client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

        chroma = chromadb.PersistentClient(path=str(CHROMA_DIR))
        try:
            self.collection = chroma.get_collection(COLLECTION_NAME)
            count = self.collection.count()
            print(f"Knowledge base loaded: {count} chunks ready.")
        except Exception:
            self.collection = None
            print(
                "⚠️  Knowledge base not found. "
                "Run `python ingest.py` to build it from knowledge-base/."
            )

    def query(self, question: str) -> tuple[str, list[str]]:
        if self.collection is None:
            return (
                "The knowledge base isn't set up yet — "
                "please run ingest.py to load content first.",
                [],
            )

        # Embed and retrieve
        query_vec = self.embedder.encode(question).tolist()
        results = self.collection.query(
            query_embeddings=[query_vec],
            n_results=min(TOP_K, self.collection.count()),
            include=["documents", "metadatas"],
        )

        docs = results["documents"][0]
        metadatas = results["metadatas"][0]
        sources = list({m["source"] for m in metadatas})

        context = "\n\n---\n\n".join(docs)

        # Generate with Claude Haiku
        message = self.client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=600,
            system=SYSTEM_PROMPT,
            messages=[
                {
                    "role": "user",
                    "content": (
                        f"Context from Vaibhav's knowledge base:\n\n{context}"
                        f"\n\n---\n\nQuestion: {question}"
                    ),
                }
            ],
        )

        answer = message.content[0].text.strip()
        return answer, sources
