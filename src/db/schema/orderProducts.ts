import { foreignKey, int, mysqlTable, primaryKey } from 'drizzle-orm/mysql-core';
import { orders } from '@/db/schema/orders';
import { products } from '@/db/schema/products';

export const orderProducts = mysqlTable(
  'order_products',
  {
    orderId: int('order_id').notNull(),
    productId: int('product_id').notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.orderId, table.productId] }),
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
