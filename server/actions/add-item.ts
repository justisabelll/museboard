'use server';

import { db } from '@/server/db';
import { inspirationTable } from '@/server/db/schema';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { toast } from 'sonner';

const addItemSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  source: z.string().optional(),
  category_id: z.number().positive('Category is required'),
});

export async function addItem(data: z.infer<typeof addItemSchema>) {
  const validationResult = addItemSchema.safeParse(data);

  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      })),
    };
  }

  try {
    await db.insert(inspirationTable).values({
      content: validationResult.data.content,
      source: validationResult.data.source,
      category_id: validationResult.data.category_id,
      created_at: new Date(),
    });

    revalidatePath('/');
    toast.success('Inspiration added successfully');
    return { success: true };
  } catch (error) {
    console.error('Error adding inspiration:', error);
    return {
      success: false,
      errors: [{ field: 'general', message: 'Failed to add inspiration' }],
    };
  }
}
