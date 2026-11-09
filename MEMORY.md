# Foodies — Working Memory

_Last updated: 2026-11-02_

## Current status

- Meal grid, detail, share flow, and route fallbacks are implemented.
- SQLite schema and seed data are created by `initdb.js`.
- No tests or deployment workflow yet.

## Key decisions

- Used SQLite for zero-configuration local persistence, matching the course.
- Kept all database access behind `src/lib/meals.ts` so a hosted database can replace it later.

## Known limitations and follow-ups

- SQLite and local image uploads are not durable on Vercel.
- No authentication, editing, or deletion.
- Seed script is not idempotent.

## Mistakes to avoid

- Forgetting `node initdb.js` leaves every meal query empty.
- Re-running the seed on an existing database fails on unique slugs.
- Importing the database helper into a client component breaks the build.

## Next steps

- Migrate persistence to Supabase Postgres and Storage.
- Make the seed script idempotent.
- Add tests around the share action and slug generation.

---

Keep this file under ~60 lines. Summarise or delete notes that no longer add value.
