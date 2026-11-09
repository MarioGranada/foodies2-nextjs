# Project Constitution — Foodies

This document defines the non-negotiable foundations for this repository. Read it before adding or changing features.

## Guiding Principles

- **Simplicity first** — prefer the smallest solution that solves the problem. If a change needs a long explanation, it is probably over-engineered.
- **No hardcoded secrets or endpoints** — configuration belongs in environment variables; visual design tokens belong in styles, not in `.env` files.
- **Traceability** — every value, dependency, and route should make its origin and purpose obvious.
- **Debuggability** — fail loudly and visibly; avoid silent fallbacks that hide broken data.
- **Official patterns** — use the documented API of each framework and library before inventing a workaround.
- **Portfolio clarity** — this repository is part of a public portfolio. Code should read as clean, intentional, and easy for a reviewer to follow. As a follow-along project, its purpose is to demonstrate the concepts practised in the course, not to imitate production scale.

## Technology Stack Foundations

| Layer | Choice | Rationale |
| --- | --- | --- |
| Framework | Next.js 14 (App Router) | Server components and server actions keep data access on the server. |
| Language | JavaScript | The course project uses JSX with the App Router. |
| Database | SQLite via better-sqlite3 | Zero-configuration local persistence for the course project. |
| Styling | CSS Modules | Component-scoped styles without a UI dependency. |
| Utilities | slugify + xss | Stable meal URLs and sanitised instructions. |

**Rule of thumb:** a new dependency must solve a concrete problem that the current stack cannot solve cleanly. Justify it in the change that introduces it.

## Core Premises

### 1. Scope

A course project that demonstrates the Next.js App Router, server components, server actions, and SQLite persistence. It is not a multi-user production product; authentication and moderation are out of scope.

### 2. Environment Isolation

- This project has no runtime secrets. Do not introduce `.env` files unless a real secret or environment-specific URL appears.
- If configuration is added, use environment variables and document them in the README.
- Never commit keys, tokens, database URLs, or credentials.

### 3. Architecture

- Data access belongs in `src/lib/meals.ts`; components should not contain SQL.
- Mutations go through server actions, not client-side fetches.
- Keep route-specific UI inside `app/meals/` and shared UI in `src/components/`.

### 4. Data and State

- SQLite is the local source of truth; `meals.db` is generated and gitignored.
- Uploaded images are files on disk, not database blobs.
- Validate and sanitise all user input before persistence.

### 5. Styling and UX

- CSS Modules are used per component and per route.
- Keep shared visual patterns in the header/grid components rather than duplicating rules.
- Images should use the existing grid/detail proportions and alt text.

### 6. Quality Gates

- `npm run lint` and `npm run build` are the gates.
- Manually test the grid, a detail page, a valid share submission, invalid input, and the not-found route.
- Confirm uploaded images appear after submission.

### 7. Deployment

- Deploy the Next.js app to Vercel.
- Replace SQLite and local uploads with Supabase Postgres and Storage before relying on production persistence.
- Keep server-only credentials out of client bundles.

## What to Avoid

- Committing `meals.db` or uploaded images.
- Putting database code in client components.
- Trusting user HTML without sanitisation.
- Assuming the local filesystem is writable in production.

## Checklist Before Adding Anything New

- Does this solve a real problem for this project, or am I adding scope for its own sake?
- Is every new value configuration-driven rather than hardcoded?
- Does the change follow the existing folder and naming patterns?
- Is there a clear failure path when data, the network, or the environment is unavailable?
- Have I run the available lint/build/test command and fixed what it reports?
- Did I update `README.md` and `MEMORY.md` if behaviour or setup changed?

## Philosophy Statement

This repository exists to show thoughtful front-end engineering: clear structure, readable code, and deliberate trade-offs. The goal is not to use every tool available, but to make every file explain itself. Simplicity is the feature.
