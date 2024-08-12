'use server';

import { redirect } from 'next/navigation';
import { saveMeal } from '../meals';
import { revalidatePath } from 'next/cache';

const isInvalidText = (text) => {
  return !text || text.trim() === '';
};
export const shareMeal = async (formData) => {
  const meal = {
    title: formData.get('title'),
    summary: formData.get('summary'),
    instructions: formData.get('instructions'),
    image: formData.get('image'),
    creator: formData.get('creator'),
    creator_email: formData.get('email'),
  };

  if (
    isInvalidText(meal.title) ||
    isInvalidText(meal.summary) ||
    isInvalidText(meal.instructions) ||
    isInvalidText(meal.image) ||
    isInvalidText(meal.creator) ||
    isInvalidText(meal.creator_email) ||
    !meal.creator_email.includes('@') ||
    !meal.image ||
    meal.image.size === 0
  ) {
    return {
      message: 'Invalid Input. Please try again.',
    };
  }

  await saveMeal(meal);
  revalidatePath('/meals'); // "page is default, use 'layout' to revalidate nested/beneath pages". If you need to revalidate all pages, use '/' route.
  redirect('/meals');
};
