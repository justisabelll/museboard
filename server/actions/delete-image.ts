'use server';

import { utapi } from '@/server/uploadthing';

export async function deleteImage(key: string) {
  await utapi.deleteFiles(key);
}
