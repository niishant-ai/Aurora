# Deploying AURORA

Local preparation is **done and committed** (`902f7cd`): dependencies install, typecheck is clean, `next build` compiles all 23 routes, and 6/6 tests pass. What remains needs an authenticated account — `gh` and `vercel` are both logged out on this machine, and no Supabase project has been supplied.

Run the steps below in order. Replace everything in `<angle brackets>`.

---

## 1. Supabase (database)

Create a project at <https://supabase.com/dashboard>, then open **Connect** and copy two strings.

| Variable | Which string | Port |
| --- | --- | --- |
| `DATABASE_URL` | **Transaction pooler** | 6543 |
| `DIRECT_DATABASE_URL` | **Session pooler** (same host) | 5432 |

`DATABASE_URL` must use the pooler because Vercel Functions open many short-lived connections. `DIRECT_DATABASE_URL` is used only by `drizzle-kit`, because DDL does not survive a transaction pooler.

> **Do not use the `db.<PROJECT-REF>.supabase.co` host from the "Direct connection" panel for migrations.** On free plans that host is IPv6-only, so on an IPv4-only network it fails with `getaddrinfo ENOTFOUND`. The session pooler on port 5432 is the IPv4-reachable equivalent and supports DDL. Both hosts are shown on the same **Connect** panel.

From `Connect → Transaction pooler`:

```text
postgresql://postgres.<PROJECT-REF>:<PASSWORD>@aws-<N>-<REGION>.pooler.supabase.com:6543/postgres?uselibpqcompat=true&sslmode=require
```

Four details that cause the most failed first deploys:

- The pooled username is `postgres.<PROJECT-REF>`, **not** bare `postgres`.
- The `aws-<N>` index in the host is not guessable. If you pick the wrong one you get `tenant/user postgres.<ref> not found`; if the host is wrong entirely you get `ENOTFOUND`. Copy it from the dashboard.
- Keep **both** `uselibpqcompat=true` and `sslmode=require`. node-postgres defaults to **no** SSL, and on pg 8.20 a bare `sslmode=require` is treated as `verify-full`, which fails against Supabase's chain with `self-signed certificate in certificate chain` — especially behind a TLS-inspecting proxy. `uselibpqcompat=true` restores libpq semantics: encrypt, do not verify.
- Do **not** append `pgbouncer=true` or `connection_limit=1`. Those are Prisma flags; node-postgres ignores both. Pool size is set in `src/db/index.ts`.

Then create the tables and seed:

```powershell
Copy-Item .env.example .env.local    # paste both real strings into it
npx drizzle-kit push                  # creates the 6 tables
```

The archive seeds itself on the first request to the running app.

---

## 2. GitHub

`gh` is not logged in. Either authenticate it:

```powershell
gh auth login
```

…or create the repo in the browser, then:

```powershell
git remote add origin https://github.com/<owner>/<repo>.git
git push -u origin master
```

The commit is already made and the tree is clean; `node_modules`, `.next`, `.env.local`, and `.zwork` are gitignored, so no secret can be pushed by accident. If you prefer a token, a fine-grained PAT with **Contents: Read and write** on that one repo is enough.

---

## 3. Vercel

```powershell
vercel login
vercel link
vercel env add DATABASE_URL production
vercel env add DATABASE_URL preview
vercel --prod
```

No `vercel.json` is needed. The build needs no database, because every Postgres-touching route is dynamic (`ƒ` in the build output) rather than statically prerendered.

If you would rather not use the CLI, import the repo at <https://vercel.com/new>, then add `DATABASE_URL` under **Settings → Environment Variables** for Production, Preview, and Development, and deploy.

---

## 4. Verify

```powershell
curl https://aurora-gray-three.vercel.app/api/health
```

Expected: `{"ok":true}`. Then load `/` and check the archive renders. `/api/catalog` returning 13 expeditions and 72 assets confirms the database is reachable and the archive seeded itself.

---

## Known limitation

Vercel Functions have a **read-only filesystem**. `src/lib/intake.ts` writes attachments to `public/uploads`, so on a deployed instance attaching a file to the ingest Desk fails with:

```text
EROFS: read-only file system
```

It throws — it does not silently no-op. On a deployed URL:

- Catalogue-only intake (notes and metadata, no attachment) still works.
- Search, generate, review, schedule, publish, and the seeded datasets are unaffected.
- Locally, on `npm run dev`, the file write succeeds, so the Desk demonstrates end to end.

Persisting uploads needs object storage — Supabase Storage or Vercel Blob — plus a change to the ingest route.
