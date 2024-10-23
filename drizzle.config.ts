import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: 'server/db/drizzle',
  schema: 'server/db/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: 'db.sqlite',
  },
});
