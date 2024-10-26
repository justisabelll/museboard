import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: 'server/db/drizzle',
  schema: 'server/db/schema.ts',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN!,
  },
});
