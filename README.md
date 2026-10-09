# AURORA — Polar Knowledge Portal

Prototype for **SIH26063**, the Integrated Polar Science Outreach, Knowledge Repository and Media Dissemination Portal (Ministry of Earth Sciences / NCPOR).

AURORA catalogues expedition records, searches them by keyword and by passage embedding, and publishes outreach only when every sentence still points at a source span.

## Run

```bash
npm install
copy .env.example .env.local   # then paste your Supabase URLs
npx drizzle-kit push
npm run dev
```

Open the app and use the role switcher in the header. The default role is **Editor**.

The database URL is read from `DATABASE_URL`. Next.js loads `.env.local`, so that is the file to create locally; `.env.example` documents both variables. `src/db/index.ts` throws at boot if `DATABASE_URL` is missing.

Use the Supabase **transaction pooler** (port 6543) for `DATABASE_URL`, and the **session** pooler (port 5432, same host) for `DIRECT_DATABASE_URL`, which `drizzle-kit push` uses. Both need `uselibpqcompat=true&sslmode=require` — without the first flag, pg 8.20 treats `sslmode=require` as `verify-full` and fails against Supabase's certificate chain. Do **not** use the `db.<PROJECT-REF>.supabase.co` host for migrations; it is IPv6-only on free plans. Rationale and exact parameters are in `.env.example`.

## Live deployment

<https://aurora-gray-three.vercel.app> — deployed on Vercel, database on Supabase (Postgres 17, `ap-northeast-2`). See `DEPLOY.md` for the deploy and migration procedure.

The archive seeds itself on the first request. Mock field reports are labeled as such. Photographs and clips are illustrative stock, not station photography.

## Desks

| Path | What it does |
| --- | --- |
| `/` | Editorial entry and pipeline |
| `/archive` | Grid, timeline, and schematic polar map |
| `/search` | Keyword, semantic, and hybrid search |
| `/documents/[id]` | Passage selection, media, dataset preview |
| `/generate` | Citation-locked website copy and social posts |
| `/ingest` | Drag-and-drop intake with metadata inference |
| `/review` | Draft → review → approve → publish |
| `/schedule` | Month calendar, drag or date-field reschedule |
| `/stories` | Published, cited outreach |
| `/dashboard` | Counts, funnel, activity |

## Search to try

- `black carbon albedo`
- `IndARC mixed layer`
- `neutron monitor`
- `dimethyl sulfide`
- `δ18O`

Semantic mode ranks 128-dimensional feature-hash embeddings with cosine similarity. It does not call an external model. Production notes for pgvector are in `docs/04-architecture.md`.

## Tests

```bash
npx vitest run
```

## Deploy

The project builds and deploys as a standard Next.js app on Vercel. No `vercel.json` is required.

1. Push this repository to GitHub.
2. In Vercel, **Add New → Project** and import the repo. Framework preset detects Next.js.
3. Under **Settings → Environment Variables**, add `DATABASE_URL` for Production, Preview, and Development. Use the transaction-pooler string (port 6543) from the Supabase dashboard.
4. Deploy. `next build` needs no database: every route that touches Postgres is dynamic.
5. After the first deploy, the archive seeds itself on the first request.

### Database migrations

DDL does not survive the transaction pooler, so `drizzle-kit` uses `DIRECT_DATABASE_URL` when it is set and falls back to `DATABASE_URL` otherwise:

```bash
npx drizzle-kit push
```

### Connection pooling

`src/db/index.ts` creates one module-scope `Pool` with `max: 1` and short idle timeouts. Vercel Functions are long-lived but suspend when idle; a small pool plus fast socket recycling avoids handing a dead connection to the next request. Override the pool size with `PG_POOL_MAX` if invocations are queuing.

Two vendor notes worth knowing, since they contradict each other: Supabase's serverless guidance is to set the pool to 1, while Vercel's Fluid Compute guidance warns that `max: 1` caps concurrency on a warm instance. The default here follows Supabase because it is the safer failure mode against a limited Postgres. Also note that `pgbouncer=true` and `connection_limit=1` are Prisma flags — node-postgres ignores both, so adding them to the connection string changes nothing.

## Known limitation: file uploads in production

Vercel Functions have a read-only filesystem. `src/lib/intake.ts` writes uploaded files to `public/uploads`, so **attaching a file to the ingest Desk fails in production** with `EROFS: read-only file system`. On a deployed instance:

- Catalogue-only intake (notes, metadata, no attachment) still works.
- The five other seeded datasets, search, generate, review, schedule, and publish are unaffected.

Persisting uploads needs object storage — Supabase Storage or Vercel Blob — plus a change to the ingest route. Locally the write succeeds, so the Desk is demonstrable end to end on `npm run dev`.

## Docs

Product requirements live in `/docs`. The three-minute judge script is `DEMO.md`.
