import { createClient, type Client } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

import * as schema from './schema';

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  client: Client | undefined;
};

console.log(process.env.DB_FILE_NAME);
export const client =
  globalForDb.client ?? createClient({ url: process.env.DB_FILE_NAME! });
if (process.env.NODE_ENV !== 'production') globalForDb.client = client;

export const db = drizzle(client, { schema });
