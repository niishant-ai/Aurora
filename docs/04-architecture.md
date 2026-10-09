# 04 — Architecture

## System
```
Browser (Next.js App Router, React 19)
  Header, theme, role, command palette  → Zustand persist
  Desks (search, ingest, review, calendar) → TanStack Query
  Motion → Framer Motion + GSAP ScrollTrigger + Lenis
        │
        ▼
Route handlers  /api/*
  role gate (x-aurora-role)
  citation-locked adapter
  feature-hash embeddings
        │
        ▼
PostgreSQL 16 via Drizzle
  expeditions, assets, passages, drafts, activities, meta
```

No separate Python service. Embeddings are deterministic and local, so the prototype works offline after install and does not leak text to a third-party model.

## Data model
- **expeditions** — station or cruise, region, lead, dates, lat/lng, focus
- **assets** — report | image | video | dataset, citation, tags, file URL, provenance
- **passages** — ordered sections, page, `embedding jsonb` (number[48])
- **drafts** — kind, audience, body, citations, status, channel, schedule, reviewer note
- **activities** — actor, action, target, time
- **meta** — seed version

Foreign keys point at expeditions and assets. Status is an application enum, checked in the route handler.

## API contract
| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Liveness + database ping |
| GET | `/api/catalog` | Expeditions, assets, counts |
| GET | `/api/assets/:id` | Asset, expedition, passages |
| POST | `/api/assets` | Multipart ingest |
| GET | `/api/search` | `q`, `mode=keyword\|semantic\|hybrid`, `types`, `expedition` |
| POST | `/api/generate` | Citation-locked draft or preview |
| GET | `/api/drafts` | Queue, optional status filter |
| PATCH | `/api/drafts/:id` | Transition, note, schedule |
| GET | `/api/dashboard` | Stats, funnel, activity, upcoming |
| GET | `/api/datasets/:id` | First rows of a local CSV |

Search response items: `{ asset, passage, score, snippet, highlights[] }`. Highlights are index ranges, never HTML.

Generate response: `{ title, body, citations[], grounding[], glossary[], adapter }`.

## Vector design
- `embed(text)` hashes tokens, bigrams, and character trigrams into 128 signed buckets and L2-normalises.
- Query time: cosine similarity in the route handler.
- Hybrid score = `0.62 * semantic + 0.38 * keyword` when both exist; otherwise the available channel.
- Production migration: `CREATE EXTENSION vector;` then `ALTER TABLE passages ADD COLUMN embedding_vec vector(128);` and an HNSW index. The adapter boundary stays the same.

## Citation lock
`CitationLockedAdapter` is the only live adapter. `GenerationAdapter` is the plug for OpenAI or Ollama. A future model call must still pass `assertCitationLock`: every grounding excerpt is a verbatim substring of a selected passage, and every numeral in an emitted sentence already occurred in that excerpt.

## Storage
- Seed media: remote Pexels URLs, labeled illustrative
- Seed tables: `/public/data/*.csv`
- Uploads: `/public/uploads`

## Auth
Mock role switcher. Not a security control.

## Decisions (context-7)
See `docs/context-7.md`.
