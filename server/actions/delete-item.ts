'use server';

import { db } from '@/server/db';
import { inspirationTable } from '@/server/db/schema';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';

export async function deleteItem(id: number) {
  try {
    await db.delete(inspirationTable).where(eq(inspirationTable.id, id));
    revalidatePath('/');
  } catch (error) {
    console.error('Error deleting inspiration:', error);
  }
}
