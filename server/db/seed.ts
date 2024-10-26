import { categoryTable, inspirationTable } from '@/server/db/schema';
import { db } from '@/server/db';

const main = async () => {
  const args = process.argv.slice(2);
  switch (args[0]) {
    case 'seed':
      await seed();
      break;
    case 'reset':
      await reset();
      break;
  }
};

main();

async function seed() {
  console.log('Starting seed process...');

  // insert categories
  console.log('Inserting categories...');
  await db
    .insert(categoryTable)
    .values([{ name: 'image' }, { name: 'quote' }, { name: 'video' }]);
  console.log('Categories inserted successfully.');

  // get category IDs
  console.log('Fetching category IDs...');
  const categories = await db.select().from(categoryTable).all();
  const videoCategoryId = categories.find((c) => c.name === 'video')?.id;
  const imageCategoryId = categories.find((c) => c.name === 'image')?.id;
  const quoteCategoryId = categories.find((c) => c.name === 'quote')?.id;
  console.log('Category IDs fetched successfully.');

  // insert inspirations
  console.log('Inserting inspirations...');
  await db.insert(inspirationTable).values([
    {
      content: 'https://placehold.co/600x400',
      source: 'Placeholder Image Service',
      created_at: new Date(),
      category_id: imageCategoryId!,
    },
    {
      content: 'The only way to do great work is to love what you do.',
      source: 'Steve Jobs',
      created_at: new Date(),
      category_id: quoteCategoryId!,
    },
    {
      content: 'https://www.youtube.com/embed/------',
      created_at: new Date(),
      category_id: videoCategoryId!,
    },
    {
      content: 'https://placehold.co/600x400',
      source: 'Placeholder Image Service',
      created_at: new Date(),
      category_id: imageCategoryId!,
    },
    {
      content: "Believe you can and you're halfway there.",
      source: 'Theodore Roosevelt',
      created_at: new Date(),
      category_id: quoteCategoryId!,
    },
    {
      content: 'https://placehold.co/600x400',
      source: 'Placeholder Image Service',
      created_at: new Date(),
      category_id: imageCategoryId!,
    },
    {
      content: 'Stay hungry, stay foolish.',
      source: 'Steve Jobs',
      created_at: new Date(),
      category_id: quoteCategoryId!,
    },
    {
      content: 'https://placehold.co/600x400',
      source: 'Placeholder Image Service',
      created_at: new Date(),
      category_id: imageCategoryId!,
    },
    {
      content: 'https://www.youtube.com/embed/------',
      created_at: new Date(),
      category_id: videoCategoryId!,
    },
    {
      content:
        'The future belongs to those who believe in the beauty of their dreams.',
      source: 'Eleanor Roosevelt',
      created_at: new Date(),
      category_id: quoteCategoryId!,
    },
    {
      content: 'https://placehold.co/600x400',
      source: 'Placeholder Image Service',
      created_at: new Date(),
      category_id: imageCategoryId!,
    },
    {
      content: "It always seems impossible until it's done.",
      source: 'Nelson Mandela',
      created_at: new Date(),
      category_id: quoteCategoryId!,
    },
    {
      content: 'https://placehold.co/600x400',
      source: 'Placeholder Image Service',
      created_at: new Date(),
      category_id: imageCategoryId!,
    },
    {
      content: 'https://www.youtube.com/embed/------',
      created_at: new Date(),
      category_id: videoCategoryId!,
    },
    {
      content: 'https://placehold.co/600x400',
      source: 'Placeholder Image Service',
      created_at: new Date(),
      category_id: imageCategoryId!,
    },
    {
      content: 'The best way to predict the future is to invent it.',
      source: 'Alan Kay',
      created_at: new Date(),
      category_id: quoteCategoryId!,
    },
  ]);
  console.log('Inspirations inserted successfully.');

  console.log('Seed process completed successfully.');
}

async function reset() {
  await db.delete(categoryTable);
  await db.delete(inspirationTable);
}
