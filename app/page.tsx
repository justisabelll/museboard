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
      <header className="relative py-24 mb-16">
        <h1 className="text-7xl font-light tracking-widest text-center uppercase text-foreground">
          Muse<span className="font-normal">board</span>
        </h1>
        <div className="flex absolute top-8 right-8 gap-6 items-center">
          <ModeToggle />
          <SignIn />
        </div>
      </header>

      <div className="container flex-grow px-8 mx-auto">
        <TileGrid items={items} dictionary={categoryDictionary} />
      </div>
      {session ? (
        <div className="fixed right-8 bottom-8 z-50">
          <AddItemButton categoryDictionary={categoryDictionary} />
        </div>
      ) : null}
    </div>
  );
}
