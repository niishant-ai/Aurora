# context-7 — decision memory

Persistent log for SIH26063 / AURORA. Later edits must stay consistent with this file.

## Product
- Public name: **AURORA**
- Expansion: Archive for Unified Research, Outreach & Repository Access
- Parent: SIH26063, Ministry of Earth Sciences / NCPOR
- Tagline: "The ice remembers. We make it readable."
- Tone: editorial, institutional, precise. Never playful-startup. Never lorem ipsum.

## Design
- Display font Fraunces, UI font Manrope
- Polar palette via `data-theme` CSS variables, Tailwind v4 `@theme inline`
- Themes: light, dark, system. Persist key `aurora-ui`
- Citation color is amber and always paired with a number, not color alone
- Stock media is labeled **Illustrative still** or **Illustrative clip**. Reports are **Mock field report**. Do not caption Pexels photos as if they were shot at Bharati or Maitri.
- Map is a custom dual-hemisphere schematic, not a third-party tile service
- Motion: Lenis + GSAP ScrollTrigger + Framer Motion. Reduced motion is mandatory, not optional.

## Architecture
- App lives in `src/app` (template convention), not a top-level `/app`
- Database is PostgreSQL + Drizzle. Do not switch to SQLite.
- Embeddings: 128-d feature hash (tokens, bigrams, character trigrams) stored as jsonb. Do not pretend pgvector is installed.
- Hybrid rank: 0.62 semantic + 0.38 keyword
- Generation adapter id: `citation-locked`. No external LLM calls.
- Glossary lines are definitions, never findings
- Role header: `x-aurora-role`
- Seed version key: `seed_version` in `meta`
- Passage ids: `{assetId}-p{n}` starting at 1
- Dates displayed in `Asia/Kolkata`
- Health route stays `{ ok: true }` and must not be broken

## Content anchors (use these terms so search demos land)
- IndARC, Kongsfjorden, Himadri, mixed layer, Atlantic Water
- Bharati, black carbon, aerosol optical depth, albedo
- Maitri, δ18O, ice core, neutron monitor
- Southern Ocean, dimethyl sulfide, ice-rafted debris
- Larsemann Hills, active layer, permafrost
- MADICE, katabatic, firn

## Roles
public < researcher < editor < admin
Only admin approves and publishes. Editor and admin ingest and reschedule. Public cannot generate.

## Pipeline statuses
`draft → review → approved → published`
Return sends `review → draft` with a reviewer note.
