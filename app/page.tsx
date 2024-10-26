import SignIn from '@/app/components/sign-in';
import { TileGrid } from '@/app/components/tile-grid';

import { db } from '@/server/db';
import { categoryTable, inspirationTable } from '@/server/db/schema';

export default async function Home() {
  const items = await db.select().from(inspirationTable).all();
  const categories = await db.select().from(categoryTable).all();
  const categoryDictionary = Object.fromEntries(
    categories.map((category) => [category.id, category.name])
  );

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <header className="relative py-24 mb-16">
        <h1 className="text-7xl font-light tracking-iwidest text-center uppercase">
          Muse<span className="font-normal">board</span>
        </h1>
        <div className="flex absolute top-8 right-8 gap-6 items-center">
          {/* <ModeToggle /> */}
          <SignIn />
        </div>
      </header>

      <div className="container flex-grow px-8 mx-auto">
        <TileGrid items={items} dictionary={categoryDictionary} />
      </div>
      <div className="fixed right-12 bottom-12">
        {/* NewInspiration component would go here */}
      </div>
      {/* Toaster component would go here */}
    </div>
  );
}
