import { datetime, foreignKey, index, int, mysqlTable } from 'drizzle-orm/mysql-core';
import { orders } from '@/db/schema/orders';
import { products } from '@/db/schema/products';

export const guarantees = mysqlTable(
  'guarantees',
  {
    id: int('id').autoincrement().primaryKey(),
    orderId: int('order_id').notNull(),
    productId: int('product_id').notNull(),
    start: datetime('start', { mode: 'string', fsp: 3 }),
    end: datetime('end', { mode: 'string', fsp: 3 }),
  },
  (table) => [
    index('guarantees_order_idx').on(table.orderId),
    index('guarantees_product_idx').on(table.productId),
    foreignKey({
      columns: [table.orderId],
      foreignColumns: [orders.id],
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.productId],
      foreignColumns: [products.id],
    }).onDelete('cascade'),
  ]
);
