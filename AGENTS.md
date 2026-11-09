# AGENTS.md — Foodies

Compact guide for future OpenCode sessions. It records only the facts an agent is likely to miss or get wrong.

## Quickstart

| Command | Description |
| --- | --- |
| `npm install` | Install dependencies. |
| `node initdb.js` | Create and seed `meals.db` once. |
| `npm run dev` | Start the app at http://localhost:3000. |
| `npm run build` | Verify the production build. |

## Requirements

- Node.js 18 or 20 (better-sqlite3 is a native module and must match the Node version).
- npm (a `package-lock.json` is committed).

## Environment

- No environment variables are used in the current version.
- If Supabase is added, keep service keys server-side and document them in `.env.example`.

## Architecture

- `src/lib/meals.ts` — database reads and writes.
- `src/lib/actions/index.js` — `shareMeal` server action.
- `app/meals/` — grid, detail, share, and route fallbacks.
- `src/components/` — header, meal grid, and form UI.
- `initdb.js` — schema creation and seed data.

## Commands and build order

- Run `node initdb.js` before the first `npm run dev`.
- Use `npm run build` to catch server/client boundary mistakes.
- `npm run lint` is the only static check; there are no tests.

## Conventions and gotchas

- Never import `better-sqlite3` into a client component.
- Server actions must keep the `"use server"` directive.
- The image write path is relative to the project root; run commands from there.
- Do not re-run the seed script on a populated database.

## Memory

- Read `MEMORY.md` first to understand the current status and decisions.
- Before changing behaviour, read `constitution.md` and keep the change aligned with it.
- After a task, update `MEMORY.md` with status, decisions, and mistakes to avoid. Keep it short.
- If a rule becomes permanent, move it into this file instead of leaving it in memory.
- Never store secrets, tokens, or personal data in `MEMORY.md`.
