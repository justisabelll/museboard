import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './app/server/db/drizzle',
  schema: './app/server/db/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DB_FILE_NAME!,
  },
});
