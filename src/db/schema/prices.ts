import {
  boolean,
  decimal,
  foreignKey,
  index,
  int,
  mysqlEnum,
  mysqlTable,
} from 'drizzle-orm/mysql-core';
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
    index('prices_product_idx').on(table.productId),
    foreignKey({
      columns: [table.productId],
      foreignColumns: [products.id],
    }).onDelete('cascade'),
  ]
);
