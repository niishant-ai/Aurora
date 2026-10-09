# 09 — Testing

## Unit (Vitest)
Location: `src/lib/citation.test.ts` and `src/lib/embeddings.test.ts`.

Cases:
- Embedding is 48-dimensional and unit length
- Identical text has cosine 1
- Unrelated text scores below related text
- Empty selection does not generate
- Every grounding excerpt is a verbatim substring of a selected passage
- Numerals in emitted sentences already exist in the source excerpt
- Citation markers in the body resolve to the citation list

Run: `npx vitest run`

## Integration
API checks performed manually and by the preview healthcheck:
- `GET /api/health` returns `{ ok: true }`
- `GET /api/search?q=black%20carbon&mode=semantic` returns passages, not an empty keyword cheat
- `POST /api/generate` rejects public role and empty passages
- `PATCH /api/drafts/:id` rejects admin-only transitions from the editor role

## End-to-end (Playwright plan)
Not installed in this sandbox (browser binaries are heavy and not required to boot). Spec to add under `e2e/pipeline.spec.ts`:

1. Open home, switch theme, persist reload
2. Search "IndARC", open the mooring report
3. Select a passage, generate a public social post, assert a citation marker
4. Switch to admin, publish, open the story
5. Drag or set a schedule date and see it on the calendar

## Manual demo script
See `DEMO.md`.

## Regression bar before handoff
- `npx next typegen`
- `npx tsc --noEmit`
- `npm run build`
- `build_and_start` healthcheck
