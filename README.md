# Foodies

A meal-sharing application built with the Next.js App Router. Visitors can browse a meal grid, open a meal detail page, and share their own recipe.

Meals are stored in a `foodies` schema of a hosted Supabase Postgres database, and the share form uses a server action to validate, sanitise, and persist the submission. Image uploads are disabled in the hosted demo: every shared meal uses one bundled example photo.

> **Follow-along project.** This app was built while following **Next.js 14 & React — The Complete Guide (Academind / Maximilian Schwarzmüller)**. It is included in the portfolio as a learning exercise, not as a production product. The implementation is my own work based on the course material.

## Live demo

| | |
| --- | --- |
| **Live site** | https://foodies2-nextjs.vercel.app |
| **Repository** | https://github.com/MarioGranada/foodies2-nextjs |
| **Portfolio summary** | Meal-sharing app in Next.js 14 built on Server Components and Server Actions: browse a recipe grid, open detail pages and share your own meal, persisted to Supabase Postgres. |

The demo is public: visitor-shared meals are deleted every night (04:00 UTC); the 7 seed meals stay.

## Features

- Meal grid loaded from Supabase Postgres through a server-side data helper.
- Dynamic meal detail route (`/meals/[slug]`).
- Share form with server action, validation, and error feedback.
- Shared meals use the bundled example photo (`public/images/test.jpeg`); no file uploads.
- Unique slug generation and HTML sanitisation before persistence.
- Route-level loading, error, and not-found states.
- Community page and shared header/navigation.

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 14 (App Router) |
| Language | JavaScript |
| Database | Supabase Postgres via `postgres` (postgres.js) |
| Styling | CSS Modules |
| Utilities | slugify + xss |

## Project structure

```text
foodies2-nextjs/
├── app/
│   ├── meals/                # Grid, detail, share, loading, error, not-found
│   ├── community/
│   ├── layout.js
│   └── page.js
├── src/
│   ├── components/           # Header, MealsGrid, MealItem
│   ├── lib/                  # db client, meals data helpers, server actions
│   └── ImagePicker/          # Upload picker (unused while uploads are disabled)
├── assets/                   # Source images
├── public/images/            # Served meal images (incl. the example photo)
├── db/migration.sql          # Idempotent schema + seed
├── scripts/db-migrate.mjs    # Applies db/migration.sql
└── next.config.js
```

## Getting started

### Requirements

- Node.js 22+.
- npm (a `package-lock.json` is committed).
- A Postgres database. The deployed app uses the shared portfolio Supabase project, connected to the Vercel project through the Supabase integration.

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
vercel link          # once, links the folder to the Vercel project
vercel env pull .env.local
```

| Variable | Description | Required |
| --- | --- | --- |
| `POSTGRES_URL` | Pooled Postgres connection string (set by the Supabase integration). | Yes |
| `POSTGRES_URL_NON_POOLING` | Direct connection used by `npm run db:migrate`; falls back to `POSTGRES_URL`. | No |
| `CRON_SECRET` | Protects `/api/cron/reset`; Vercel sends it to the nightly cron. Random value set in the Vercel project. | Production |

Any Postgres works locally, e.g. `POSTGRES_URL=postgres://postgres:postgres@localhost:5432/postgres`. See `.env.example`.

### 3. Create the schema and seed data

```bash
npm run db:migrate
```

Safe to re-run: tables use `if not exists` and seed rows `on conflict do nothing`.

### 4. Run locally

```bash
npm run dev
```

Open http://localhost:3000.

### Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Next.js in development mode. |
| `npm run build` | Create a production build. |
| `npm run start` | Serve the production build. |
| `npm run lint` | Run Next.js linting. |
| `npm run db:migrate` | Apply `db/migration.sql` (schema + seed). |

## How it works

`src/lib/meals.ts` owns database access: `getMeals`, `getMeal`, and `saveMeal`, using the shared postgres.js client in `src/lib/db.js`. Server components call these helpers directly, so no API route is needed and the connection string never reaches the browser.

`src/lib/actions/index.js` contains the `shareMeal` server action. It validates the form, then `saveMeal` generates a unique slug, sanitises instructions with `xss`, assigns the example image, and inserts the row. `revalidatePath('/meals')` refreshes the prerendered grid.

`app/meals/page.jsx` renders the grid, `app/meals/[slug]/page.jsx` renders a detail page, and `app/meals/share/page.jsx` is a client component that binds the server action through `useFormState`.

Route-level `loading.jsx`, `error.jsx`, and `not-found.jsx` provide the App Router fallbacks.

## Deployment

- **Live:** https://foodies2-nextjs.vercel.app (Vercel production, deployed from `master`).
- Target: Vercel, with data in the shared portfolio Supabase project (schema `foodies`). The Supabase ↔ Vercel integration injects `POSTGRES_URL` into every environment.
- A daily Vercel Cron (`vercel.json`, 04:00 UTC) calls `/api/cron/reset`, which deletes every meal shared by visitors (the 7 seed meals stay) and revalidates `/meals`. It requires `CRON_SECRET`.
- Run `npm run db:migrate` once against the Supabase database before the first deployment.
- Image uploads are intentionally off. Re-enabling them would need object storage (e.g. Supabase Storage); the old `ImagePicker` component is kept for that.

## Notes and limitations

- Anyone can share a meal on the public demo; there is no moderation or rate limiting.
- `getMeals` waits 5 s on purpose to showcase the Suspense loading state.
- The share form relies on React 18’s `useFormState` from `react-dom`; it is a course-era API.
- The `foodies` schema is not exposed through the Supabase Data API; RLS is enabled with no policies, and the app connects server-side only.
- `/meals` is prerendered at build time, so `POSTGRES_URL` must be available during `next build`.

---

**Author:** Mario Granada
