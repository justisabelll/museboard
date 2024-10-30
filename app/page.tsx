import SignIn from '@/app/components/sign-in';
import { TileGrid } from '@/app/components/tiles/tile-grid';

import { db } from '@/server/db';
import { categoryTable, inspirationTable } from '@/server/db/schema';
import AddItemButton from '@/app/components/add-item-button';
import { auth } from '@/server/auth';
import { ModeToggle } from '@/app/components/mode-toggle';

export default async function Home() {
  const session = await auth();

  const items = await db.select().from(inspirationTable).all();
  const categories = await db.select().from(categoryTable).all();
  const categoryDictionary = Object.fromEntries(
    categories.map((category) => [category.id, category.name])
  );

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="py-12 sm:py-24 mb-8 sm:mb-16">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="flex justify-end gap-4 mb-8">
            <ModeToggle />
            <SignIn />
          </div>
          <h1 className="text-4xl sm:text-7xl font-light tracking-widest text-center uppercase text-foreground">
            Muse<span className="font-normal">board</span>
          </h1>
        </div>
      </header>

      <div className="container flex-grow px-4 sm:px-8 mx-auto">
        <TileGrid items={items} dictionary={categoryDictionary} />
      </div>
      {session ? (
        <div className="fixed right-4 sm:right-8 bottom-4 sm:bottom-8 z-50">
          <AddItemButton categoryDictionary={categoryDictionary} />
        </div>
      ) : null}
    </div>
  );
}
