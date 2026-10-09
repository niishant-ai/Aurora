# 02 — Features (MoSCoW)

## Must
- Drag-and-drop ingest with filename / MIME / expedition-dictionary metadata extraction
- Demo packet ingest so the flow works without a local file
- Catalogue of reports, images, videos, datasets
- Expedition timeline and schematic polar map
- Keyword search with highlighted snippets
- Semantic search over hashed passage embeddings (cosine similarity)
- Hybrid mode blending both
- Multimodal type filters and expedition filter
- Document viewer with selectable, highlightable passages
- Citation-locked generation for website copy and social posts
- Reading level: public, student, researcher
- Inline citations and a lock-check panel mapping each sentence to a verbatim span
- Editorial queue: draft → review → approved → published
- Role-gated actions
- Month calendar with drag-to-reschedule and keyboard date input
- Dashboard: archive stats, funnel, pending reviews, activity
- Public stories rendered from published drafts
- Light / dark / system theme, persisted
- Reduced-motion alternative
- Seeded realistic archive

## Should
- Command palette (Ctrl/Cmd+K)
- Dataset CSV preview
- Semantic fingerprint sparkline for researcher and admin
- IST clock and institutional header
- Activity log on every mutation
- Versioned seed so the archive can be rebuilt cleanly

## Could
- OpenAI / Ollama adapter behind the same citation lock (interface only in this build)
- pgvector column migration
- Real PDF text extraction via a parser service
- Email notifications

## Won't (this prototype)
- Production SSO
- Multi-tenant ministries
- Live satellite ingest
- Un-cited freeform chat

## Feature notes
Semantic search is real math over stored vectors, not a toggle that secretly runs keyword search. Vectors are 128-dimensional feature hashes (tokens, bigrams, and character trigrams). Production path is pgvector; the JSON embedding column is shaped so a later migration can copy values into a `vector(128)` column without changing the ranker contract.
