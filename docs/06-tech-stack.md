# 06 — Tech stack

Versions below match the sandbox after install. Next.js is 16 (the provided App Router template), not 15. React is 19. The rest of the requested stack is in place; shadcn primitives were hand-built to the same accessibility patterns so we did not take a CLI dependency that rewrites `globals.css`.

| Layer | Choice | Version (sandbox) |
| --- | --- | --- |
| Framework | Next.js App Router | 16.2.6 |
| UI | React | 19.2.6 |
| Language | TypeScript strict | 5.9.3 |
| CSS | Tailwind CSS | 4.1.17 |
| ORM | Drizzle ORM | 0.45.2 |
| Driver | node-postgres | 8.20.0 |
| Database | PostgreSQL | local `app_db` |
| Motion | Framer Motion | 14.0.0 |
| Scroll | GSAP 3.15 + ScrollTrigger, Lenis 1.3 | installed |
| Server state | TanStack Query | 5.104 |
| Client state | Zustand persist | 5.0 |
| Icons | lucide-react | latest |
| Classnames | clsx + tailwind-merge | latest |
| Unit tests | Vitest | latest |
| E2E plan | Playwright | specified in `09-testing.md`; not required to boot the prototype |

## Explicitly not added
- A live OpenAI dependency (adapter interface only)
- pgvector extension (migration documented; feature-hash embeddings ship today)
- pdf.js (text and notes are extracted; binary PDFs are stored and catalogued)

## Scripts
- `npm run dev`
- `npm run build`
- `npx drizzle-kit push`
- `npx vitest run`

## Environment
- `DATABASE_URL` — required, already in `.env`
- `OPENAI_API_KEY` — optional, unused by the live adapter
