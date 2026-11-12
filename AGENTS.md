# AGENTS.md — Foodies

Compact guide for future OpenCode sessions. It records only the facts an agent is likely to miss or get wrong.

## Quickstart

| Command | Description |
| --- | --- |
| `npm install` | Install dependencies. |
| `vercel env pull .env.local` | Fetch `POSTGRES_URL` from the linked Vercel project. |
| `npm run db:migrate` | Apply the idempotent schema + seed in `db/migration.sql`. |
| `npm run dev` | Start the app at http://localhost:3000. |
| `npm run build` | Verify the production build. |

## Requirements

- Node.js 22+.
- A Postgres database (production: the shared portfolio Supabase project).
- npm (a `package-lock.json` is committed).

## Environment

- `POSTGRES_URL` (required): pooled connection string injected by the Supabase ↔ Vercel integration.
- `POSTGRES_URL_NON_POOLING` (optional): used by `npm run db:migrate`.
- `CRON_SECRET`: protects `app/api/cron/reset/route.js` (nightly Vercel Cron in `vercel.json`), which deletes every meal shared by visitors (the 7 seed meals stay) and revalidates `/meals`. Missing secret → every request is refused. Never print or commit it.
- Documented in `.env.example`; never commit real values.

## Architecture

- `src/lib/db.js` — shared postgres.js client (`prepare: false` for the Supabase transaction pooler).
- `src/lib/meals.ts` — database reads and writes (`foodies.meals`).
- `src/lib/actions/index.js` — `shareMeal` server action.
- `app/meals/` — grid, detail, share, and route fallbacks.
- `src/components/` — header, meal grid, and form UI.
- `db/migration.sql` + `scripts/db-migrate.mjs` — schema and seed.

## Commands and build order

- Run `npm run db:migrate` before the first `npm run dev`; `POSTGRES_URL` must also be set for `npm run build`.
- Use `npm run build` to catch server/client boundary mistakes.
- `npm run lint` is the only static check; there are no tests.

## Conventions and gotchas

- Never import `src/lib/db.js` or `meals.ts` into a client component.
- Server actions must keep the `"use server"` directive.
- Uploads are disabled: `saveMeal` always stores `EXAMPLE_MEAL_IMAGE`.
- The shared Supabase database hosts other apps' schemas too (`news`, `auth_demo`, `newsletter`); only touch `foodies`.

## Memory

- Read `MEMORY.md` first to understand the current status and decisions.
- Before changing behaviour, read `constitution.md` and keep the change aligned with it.
- After a task, update `MEMORY.md` with status, decisions, and mistakes to avoid. Keep it short.
- If a rule becomes permanent, move it into this file instead of leaving it in memory.
- Never store secrets, tokens, or personal data in `MEMORY.md`.
