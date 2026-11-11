import { boolean, datetime, index, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const products = mysqlTable(
  'products',
  {
    id: int('id').autoincrement().primaryKey(),
    serialNumber: varchar('serial_number', { length: 50 }).notNull(),
    isNew: boolean('is_new').notNull(),
    photo: varchar('photo', { length: 255 }),
    title: varchar('title', { length: 255 }).notNull(),
    specification: varchar('specification', { length: 1000 }),
    type: varchar('type', { length: 50 }).notNull(),
    date: datetime('date', { mode: 'string', fsp: 3 }).notNull(),
  },
  (table) => [index('products_type_idx').on(table.type), index('products_date_idx').on(table.date)]
);
