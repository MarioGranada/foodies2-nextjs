# Foodies — Working Memory

_Last updated: 2026-11-12_

## Current status

- Meal grid, detail, share flow, and route fallbacks are implemented.
- Data lives in Supabase Postgres (`foodies` schema); schema + seed in `db/migration.sql` (idempotent).
- Linked to Vercel project `foodies2-nextjs` (GitHub connected). Live at https://foodies2-nextjs.vercel.app since 2026-11-12.
- No tests yet.

## Key decisions

- 2026-11-12: replaced better-sqlite3 with postgres.js on the shared portfolio Supabase project (one schema per app).
- Image uploads disabled on purpose; every shared meal uses `public/images/test.jpeg`. `ImagePicker` kept for a future Storage-backed version.
- Slugs are de-duplicated with a timestamp suffix instead of failing on the unique constraint.

## Known limitations and follow-ups

- No authentication, moderation, editing, or deletion; the public demo accepts any submission.
- 5 s artificial delay in `getMeals` is intentional (Suspense demo).

## Mistakes to avoid

- `shareMeal` is used with `useFormState`, so its signature must be `(prevState, formData)` (was broken before 2026-11-12).
- Building without `POSTGRES_URL` fails: `/meals` prerenders at build time.
- Importing the database helper into a client component breaks the build.

## Next steps

- Add tests around the share action and slug generation.

---

Keep this file under ~60 lines. Summarise or delete notes that no longer add value.
