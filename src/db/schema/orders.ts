import { mysqlTable, datetime, int, varchar } from 'drizzle-orm/mysql-core';

export const orders = mysqlTable('orders', {
  id: int('id').autoincrement().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: varchar('description', { length: 1000 }),
  date: datetime('date', { mode: 'string', fsp: 3 }).notNull(),
});
