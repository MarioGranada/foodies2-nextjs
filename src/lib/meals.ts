import slugify from 'slugify';
import xss from 'xss';
import sql from './db';

// Image uploads are disabled in the hosted demo: every shared meal uses this
// bundled example photo (served from public/images).
export const EXAMPLE_MEAL_IMAGE = '/images/test.jpeg';

const columns = sql`id, slug, title, image, summary, instructions, creator, creator_email`;

export const getMeals = async () => {
  // Artificial delay kept on purpose to showcase the Suspense loading state.
  await new Promise((resolve) => setTimeout(resolve, 5000));
  return sql`select ${columns} from foodies.meals order by id`;
};

export const getMeal = async (slug) => {
  const [meal] = await sql`select ${columns} from foodies.meals where slug = ${slug}`;
  return meal;
};

const uniqueSlug = async (title) => {
  const base = slugify(title, { lower: true, strict: true }) || 'meal';
  const [existing] = await sql`select 1 from foodies.meals where slug = ${base}`;
  return existing ? `${base}-${Date.now().toString(36)}` : base;
};

export const saveMeal = async (meal) => {
  const slug = await uniqueSlug(meal.title);

  await sql`
    insert into foodies.meals
      (slug, title, image, summary, instructions, creator, creator_email)
    values (
      ${slug},
      ${meal.title},
      ${EXAMPLE_MEAL_IMAGE},
      ${meal.summary},
      ${xss(meal.instructions)},
      ${meal.creator},
      ${meal.creator_email}
    )
  `;

  return slug;
};
