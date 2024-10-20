import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const categoryTable = sqliteTable('category', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
});

export const inspirationTable = sqliteTable('inspiration', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  content: text('content').notNull(),
  source: text('source'),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull(),
  category_id: integer('category_id')
    .notNull()
    .references(() => categoryTable.id),
});

export const schema = { categoryTable, inspirationTable };

export type Category = typeof categoryTable.$inferSelect;
export type NewCategory = typeof categoryTable.$inferInsert;

export type Inspiration = typeof inspirationTable.$inferSelect;
export type NewInspiration = typeof inspirationTable.$inferInsert;
