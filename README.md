# Foodies

A meal-sharing application built with the Next.js App Router. Visitors can browse a meal grid, open a meal detail page, and share their own recipe with an uploaded image.

Meals are stored in a local SQLite database, and the share form uses a server action to validate, sanitise, and persist the submission.

> **Follow-along project.** This app was built while following **Next.js 14 & React — The Complete Guide (Academind / Maximilian Schwarzmüller)**. It is included in the portfolio as a learning exercise, not as a production product. The implementation is my own work based on the course material.

## Features

- Meal grid loaded from SQLite through a server-side data helper.
- Dynamic meal detail route (`/meals/[slug]`).
- Share form with server action, validation, and error feedback.
- Image upload saved to `public/images/`.
- Slug generation and HTML sanitisation before persistence.
- Route-level loading, error, and not-found states.
- Community page and shared header/navigation.

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 14 (App Router) |
| Language | JavaScript |
| Database | SQLite via better-sqlite3 |
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
│   ├── components/           # Header, MealsGrid, MealItem, ImagePicker
│   ├── lib/                  # meals data helpers and server actions
│   └── ImagePicker/
├── assets/                   # Source images
├── public/images/            # Served images and uploads
├── initdb.js                 # Creates and seeds meals.db
└── next.config.js
```

## Getting started

### Requirements

- Node.js 18 or 20 (better-sqlite3 is a native module and must match the Node version).
- npm (a `package-lock.json` is committed).

### 1. Install dependencies

```bash
npm install
node initdb.js
npm run dev
```

### 2. Run locally

**Seed the database (once)**

```bash
node initdb.js
```

Creates `meals.db` and inserts the sample meals. Re-running it against an existing database will fail on duplicate slugs.

**Start the development server**

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
| `node initdb.js` | Create and seed the SQLite database. |

## How it works

`src/lib/meals.ts` owns database access: `getMeals`, `getMeal`, and `saveMeal`. Server components call these helpers directly, so no API route is needed.

`src/lib/actions/index.js` contains the `shareMeal` server action. It validates the form, generates a slug, sanitises instructions with `xss`, writes the uploaded image, and inserts the row.

`app/meals/page.jsx` renders the grid, `app/meals/[slug]/page.jsx` renders a detail page, and `app/meals/share/page.jsx` is a client component that binds the server action through `useFormState`.

Route-level `loading.jsx`, `error.jsx`, and `not-found.jsx` provide the App Router fallbacks.

## Deployment

- Target: Vercel for the Next.js app, with Supabase for persistence. The current SQLite file and local image uploads do not survive on Vercel’s ephemeral filesystem.
- Migration path: replace `better-sqlite3` with Supabase Postgres (or another hosted Postgres) and move image uploads to Supabase Storage, keeping the same server-action boundary.
- If the app stays self-hosted, mount persistent storage for `meals.db` and `public/images/`.

## Notes and limitations

- `meals.db` is gitignored and must be created with `node initdb.js`.
- Uploaded images are written to `public/images/` at runtime; that folder must be writable.
- The share form relies on React 18’s `useFormState` from `react-dom`; it is a course-era API.
- Re-running `initdb.js` against an existing database fails because meal slugs are unique.

---

**Author:** Mario Granada
