import { revalidatePath } from 'next/cache';

import sql from '@/src/lib/db';

export const dynamic = 'force-dynamic';

// The seven meals inserted by db/migration.sql. The app only ever adds meals,
// so deleting everything else restores the seed.
const SEED_SLUGS = [
  'juicy-cheese-burger',
  'spicy-curry',
  'homemade-dumplings',
  'classic-mac-n-cheese',
  'authentic-pizza',
  'wiener-schnitzel',
  'fresh-tomato-salad',
];

// Nightly Vercel Cron (vercel.json): removes meals shared by visitors so the
// public demo stays clean. Vercel sends `Authorization: Bearer $CRON_SECRET`;
// without the secret every request is refused.
export async function GET(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return Response.json({ message: 'Unauthorized.' }, { status: 401 });
  }

  const removed = await sql`
    delete from foodies.meals where slug <> all(${SEED_SLUGS}) returning slug`;
  // /meals is statically cached and only revalidated on share; refresh it and
  // the detail pages so removed meals disappear.
  revalidatePath('/meals', 'layout');

  return Response.json({ message: 'Demo data reset.', removed: removed.length });
}
