import DataLoader from 'dataloader';
import { eq, inArray, sql } from 'drizzle-orm';

import { db } from '@/db/client';
import { guarantees } from '@/db/schema/guarantees';
import { orderProducts } from '@/db/schema/orderProducts';
import { orders } from '@/db/schema/orders';
import { prices } from '@/db/schema/prices';
import { products } from '@/db/schema/products';

import {
  mapGuarantee,
  mapOrder,
  mapPrice,
  mapProduct,
  type OrderDTO,
  type ProductDTO,
} from './mappers';

function group<T, K>(ids: readonly K[], rows: T[], key: (row: T) => K): T[][] {
  const map = new Map<K, T[]>();
  for (const row of rows) {
    const k = key(row);
    const list = map.get(k);
    if (list) list.push(row);
    else map.set(k, [row]);
  }
  return ids.map((id) => map.get(id) ?? []);
}

export function createLoaders() {
  return {
    productsByOrder: new DataLoader<number, ProductDTO[]>(async (orderIds) => {
      const rows = await db
        .select({ orderId: orderProducts.orderId, product: products })
        .from(orderProducts)
        .innerJoin(products, eq(products.id, orderProducts.productId))
        .where(inArray(orderProducts.orderId, [...orderIds]))
        .orderBy(products.id);
      return group(orderIds, rows, (r) => r.orderId).map((g) =>
        g.map((r) => mapProduct(r.product))
      );
    }),

    orderByProduct: new DataLoader<number, OrderDTO | null>(async (productIds) => {
      const rows = await db
        .select({ productId: orderProducts.productId, order: orders })
        .from(orderProducts)
        .innerJoin(orders, eq(orders.id, orderProducts.orderId))
        .where(inArray(orderProducts.productId, [...productIds]));
      return group(productIds, rows, (r) => r.productId).map((g) =>
        g[0] ? mapOrder(g[0].order) : null
      );
    }),

    guaranteeByProduct: new DataLoader(async (productIds: readonly number[]) => {
      const rows = await db
        .select()
        .from(guarantees)
        .where(inArray(guarantees.productId, [...productIds]));
      return group(productIds, rows, (r) => r.productId).map((g) =>
        g[0] ? mapGuarantee(g[0]) : null
      );
    }),

    guaranteesByOrder: new DataLoader(async (orderIds: readonly number[]) => {
      const rows = await db
        .select()
        .from(guarantees)
        .where(inArray(guarantees.orderId, [...orderIds]));
      return group(orderIds, rows, (r) => r.orderId).map((g) => g.map(mapGuarantee));
    }),

    pricesByProduct: new DataLoader(async (productIds: readonly number[]) => {
      const rows = await db
        .select()
        .from(prices)
        .where(inArray(prices.productId, [...productIds]))
        .orderBy(prices.id);
      return group(productIds, rows, (r) => r.productId).map((g) => g.map(mapPrice));
    }),

    productsCountByOrder: new DataLoader(async (orderIds: readonly number[]) => {
      const rows = await db
        .select({ orderId: orderProducts.orderId, count: sql<number>`count(*)` })
        .from(orderProducts)
        .where(inArray(orderProducts.orderId, [...orderIds]))
        .groupBy(orderProducts.orderId);
      const map = new Map(rows.map((r) => [r.orderId, Number(r.count)]));
      return orderIds.map((id) => map.get(id) ?? 0);
    }),

    totalsByOrder: new DataLoader(async (orderIds: readonly number[]) => {
      const rows = await db
        .select({
          orderId: orderProducts.orderId,
          symbol: prices.symbol,
          total: sql<string>`sum(${prices.value})`,
        })
        .from(orderProducts)
        .innerJoin(prices, eq(prices.productId, orderProducts.productId))
        .where(inArray(orderProducts.orderId, [...orderIds]))
        .groupBy(orderProducts.orderId, prices.symbol);
      return group(orderIds, rows, (r) => r.orderId).map((g) =>
        g.map((r) => ({ value: Number(r.total), symbol: r.symbol }))
      );
    }),
  };
}

export type Loaders = ReturnType<typeof createLoaders>;
