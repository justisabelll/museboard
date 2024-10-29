'use server';

import { db } from '@/server/db';
import { inspirationTable } from '@/server/db/schema';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { deleteImage } from '@/server/actions/delete-image';

export async function deleteItem(id: number) {
  try {
    // Get the item first to check if it has an image_key
    const item = await db.query.inspirationTable.findFirst({
      where: eq(inspirationTable.id, id),
    });

    if (item?.image_key) {
      // Delete the image from storage if it exists
      await deleteImage(item.image_key);
    }

    // Delete the item from the database
    await db.delete(inspirationTable).where(eq(inspirationTable.id, id));
    revalidatePath('/');
  } catch (error) {
    console.error('Error deleting inspiration:', error);
  }
}
