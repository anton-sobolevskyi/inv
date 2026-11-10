import { boolean, decimal, foreignKey, int, mysqlEnum, mysqlTable } from 'drizzle-orm/mysql-core';
import { products } from '@/db/schema/products';

export const prices = mysqlTable(
  'prices',
  {
    id: int('id').autoincrement().primaryKey(),
    productId: int('product_id').notNull(),
    value: decimal('value', { precision: 12, scale: 2 }).notNull(),
    symbol: mysqlEnum('symbol', ['USD', 'UAH']).notNull(),
    isDefault: boolean('is_default').notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.productId],
      foreignColumns: [products.id],
    }).onDelete('cascade'),
  ]
);
