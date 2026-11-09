import {
  boolean,
  datetime,
  foreignKey,
  int,
  mysqlEnum,
  mysqlTable,
  varchar,
} from 'drizzle-orm/mysql-core';
import { orders } from '@/db/schema/orders';
import { guarantees } from '@/db/schema/guarantees';

export const products = mysqlTable(
  'products',
  {
    id: int('id').autoincrement().primaryKey(),
    serialNumber: varchar('serial_number', { length: 50 }).notNull(),
    isNew: boolean('is_new').notNull(),
    photo: varchar('photo', { length: 255 }),
    title: varchar('title', { length: 255 }).notNull(),
    specification: varchar('specification', { length: 1000 }),
    orderId: int('order_id').notNull(),
    guaranteeId: int('guarantee_id').notNull(),
    type: mysqlEnum('type', ['monitors']).notNull(),
    date: datetime('date', { mode: 'string', fsp: 3 }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.orderId],
      foreignColumns: [orders.id],
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.guaranteeId],
      foreignColumns: [guarantees.id],
    }).onDelete('restrict'),
  ]
);
