# Knowledge Base

Drop `.md`, `.txt`, or `.pdf` files here. After adding or editing files, run:

    python ingest.py

Then restart `server.py` to pick up the new knowledge base.

`profile.md` is special: it isn't chunked, it's sent with every question as ground truth.
Keep it short and factual (companies, roles, dates, education), and update it when those change.

## Tips
- One file per topic area works well (e.g. `work-supertails.md`, `personal.md`)
- Write naturally — full sentences, real details, specific numbers
- The more specific the content, the better the answers
- Re-run `ingest.py` any time you update a file
