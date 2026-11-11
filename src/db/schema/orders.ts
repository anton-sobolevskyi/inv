import { datetime, double, index, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const orders = mysqlTable(
  'orders',
  {
    id: int('id').autoincrement().primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    description: varchar('description', { length: 1000 }),
    address: varchar('address', { length: 500 }),
    latitude: double('latitude'),
    longitude: double('longitude'),
    date: datetime('date', { mode: 'string', fsp: 3 }).notNull(),
  },
  (table) => [index('orders_date_idx').on(table.date)]
);
