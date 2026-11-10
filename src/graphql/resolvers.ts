import { and, eq, like, or, sql, desc, inArray } from 'drizzle-orm';
import { GraphQLError } from 'graphql';

import { db } from '@/db/client';
import { orders } from '@/db/schema/orders';
import { products } from '@/db/schema/products';
import { guarantees } from '@/db/schema/guarantees';
import { prices } from '@/db/schema/prices';
import { orderProducts } from '@/db/schema/orderProducts';

type Currency = 'USD' | 'UAH';

interface PriceInput {
  value: number;
  symbol: Currency;
  isDefault: boolean;
}

interface CreateOrderInput {
  title: string;
  description?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  productIds?: string[];
  date?: string | null;
}

interface UpdateOrderInput {
  title?: string | null;
  description?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  date?: string | null;
}

interface CreateProductInput {
  serialNumber: string;
  isNew?: boolean;
  photo?: string | null;
  title: string;
  specification?: string | null;
  prices: PriceInput[];
  date?: string | null;
}

interface UpdateProductInput {
  serialNumber?: string | null;
  isNew?: boolean | null;
  photo?: string | null;
  title?: string | null;
  specification?: string | null;
  prices?: PriceInput[] | null;
  date?: string | null;
}

function toISO(mysqlDate: string | null | undefined): string | null {
  if (!mysqlDate) return null;
  return mysqlDate.replace(' ', 'T') + 'Z';
}

function toMySQL(iso: string | null | undefined): string | null {
  if (!iso) return null;
  return iso.replace('T', ' ').replace(/Z$/i, '').slice(0, 23);
}

function nowMySQL(): string {
  return new Date().toISOString().replace('T', ' ').replace(/Z$/i, '').slice(0, 23);
}

async function loadOrder(id: number) {
  const [row] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return row ? mapOrder(row) : null;
}

async function loadProduct(id: number) {
  const [row] = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return row ? mapProduct(row) : null;
}

function mapOrder(row: typeof orders.$inferSelect) {
  return {
    id: String(row.id),
    title: row.title,
    description: row.description,
    address: row.address,
    latitude: row.latitude,
    longitude: row.longitude,
    date: toISO(row.date)!,
  };
}

function mapProduct(row: typeof products.$inferSelect) {
  return {
    id: String(row.id),
    serialNumber: row.serialNumber,
    isNew: row.isNew,
    photo: row.photo,
    title: row.title,
    specification: row.specification,
    date: toISO(row.date)!,
  };
}

function mapGuarantee(row: typeof guarantees.$inferSelect) {
  return {
    id: String(row.id),
    productId: String(row.productId),
    orderId: String(row.orderId),
    start: toISO(row.start),
    end: toISO(row.end),
  };
}

function mapPrice(row: typeof prices.$inferSelect) {
  return {
    id: String(row.id),
    value: Number(row.value),
    symbol: row.symbol,
    isDefault: row.isDefault,
  };
}

export const resolvers = {
  Query: {
    orders: async (_: unknown, { limit = 50, offset = 0 }: { limit?: number; offset?: number }) => {
      const rows = await db
        .select()
        .from(orders)
        .orderBy(desc(orders.date))
        .limit(limit)
        .offset(offset);
      return rows.map(mapOrder);
    },

    order: async (_: unknown, { id }: { id: string }) => loadOrder(Number(id)),

    products: async (
      _: unknown,
      {
        filter,
        limit = 50,
        offset = 0,
      }: {
        filter?: { type?: string; orderId?: string; isNew?: boolean; search?: string };
        limit?: number;
        offset?: number;
      }
    ) => {
      const conditions = [];

      if (filter?.isNew !== undefined) conditions.push(eq(products.isNew, filter.isNew));
      if (filter?.search) {
        const term = `%${filter.search}%`;
        conditions.push(or(like(products.title, term), like(products.serialNumber, term))!);
      }

      const query = db.select().from(products);

      // Filter by order via junction
      if (filter?.orderId) {
        const links = await db
          .select({ productId: orderProducts.productId })
          .from(orderProducts)
          .where(eq(orderProducts.orderId, Number(filter.orderId)));
        const ids = links.map((l) => l.productId);
        if (ids.length === 0) return [];
        conditions.push(inArray(products.id, ids));
      }

      const rows = await query
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(desc(products.date))
        .limit(limit)
        .offset(offset);

      return rows.map(mapProduct);
    },

    product: async (_: unknown, { id }: { id: string }) => loadProduct(Number(id)),
  },

  Mutation: {
    createOrder: async (_: unknown, { input }: { input: CreateOrderInput }) => {
      const orderDate = input.date ? toMySQL(input.date)! : nowMySQL();

      const [inserted] = await db
        .insert(orders)
        .values({
          title: input.title,
          description: input.description ?? null,
          address: input.address ?? null,
          latitude: input.latitude ?? null,
          longitude: input.longitude ?? null,
          date: orderDate,
        })
        .$returningId();

      const orderId = inserted.id;

      // Link products and create guarantees (start = order date)
      if (input.productIds?.length) {
        const productIds = input.productIds.map(Number);
        await db
          .insert(orderProducts)
          .values(productIds.map((productId: number) => ({ orderId, productId })));

        await db.insert(guarantees).values(
          productIds.map((productId: number) => ({
            orderId,
            productId,
            start: orderDate,
            end: null,
          }))
        );
      }

      return loadOrder(orderId);
    },

    updateOrder: async (_: unknown, { id, input }: { id: string; input: UpdateOrderInput }) => {
      const updates: Partial<typeof orders.$inferInsert> = {};
      updates.title = input.title ?? undefined;
      if (input.description !== undefined) updates.description = input.description;
      if (input.address !== undefined) updates.address = input.address;
      if (input.latitude !== undefined) updates.latitude = input.latitude;
      if (input.longitude !== undefined) updates.longitude = input.longitude;
      updates.date = toMySQL(input.date) ?? undefined;

      if (Object.keys(updates).length) {
        await db
          .update(orders)
          .set(updates)
          .where(eq(orders.id, Number(id)));
      }
      return loadOrder(Number(id));
    },

    deleteOrder: async (_: unknown, { id }: { id: string }) => {
      const result = await db.delete(orders).where(eq(orders.id, Number(id)));
      return result[0].affectedRows > 0;
    },

    createProduct: async (_: unknown, { input }: { input: CreateProductInput }) => {
      const defaults = input.prices.filter((p) => p.isDefault);
      if (defaults.length !== 1) {
        throw new GraphQLError('Exactly one price must have isDefault: true');
      }

      const [p] = await db
        .insert(products)
        .values({
          serialNumber: input.serialNumber,
          isNew: input.isNew ?? true,
          photo: input.photo ?? null,
          title: input.title,
          type: 'monitors',
          specification: input.specification ?? null,
          date: input.date ? toMySQL(input.date)! : nowMySQL(),
        })
        .$returningId();

      await db.insert(prices).values(
        input.prices.map((price) => ({
          productId: p.id,
          value: String(price.value),
          symbol: price.symbol,
          isDefault: price.isDefault,
        }))
      );

      return loadProduct(p.id);
    },

    updateProduct: async (_: unknown, { id, input }: { id: string; input: UpdateProductInput }) => {
      const productId = Number(id);
      const existing = await loadProduct(productId);
      if (!existing) throw new GraphQLError('Product not found');

      const updates: Partial<typeof products.$inferInsert> = {};
      updates.serialNumber = input.serialNumber ?? undefined;
      updates.isNew = input.isNew ?? undefined;
      if (input.photo !== undefined) updates.photo = input.photo;
      updates.title = input.title ?? undefined;
      if (input.specification !== undefined) updates.specification = input.specification;
      updates.date = toMySQL(input.date) ?? undefined;

      if (Object.keys(updates).length) {
        await db.update(products).set(updates).where(eq(products.id, productId));
      }

      if (input.prices) {
        const defaults = input.prices.filter((p) => p.isDefault);
        if (defaults.length !== 1) {
          throw new GraphQLError('Exactly one price must have isDefault: true');
        }
        await db.delete(prices).where(eq(prices.productId, productId));
        await db.insert(prices).values(
          input.prices.map((price) => ({
            productId,
            value: String(price.value),
            symbol: price.symbol,
            isDefault: price.isDefault,
          }))
        );
      }

      return loadProduct(productId);
    },

    deleteProduct: async (_: unknown, { id }: { id: string }) => {
      const result = await db.delete(products).where(eq(products.id, Number(id)));
      return result[0].affectedRows > 0;
    },
  },

  Order: {
    products: async (parent: { id: string }) => {
      const links = await db
        .select({ productId: orderProducts.productId })
        .from(orderProducts)
        .where(eq(orderProducts.orderId, Number(parent.id)));

      if (links.length === 0) return [];

      const conditions = [
        inArray(
          products.id,
          links.map((l) => l.productId)
        ),
      ];

      const productRows = await db
        .select()
        .from(products)
        .where(and(...conditions));

      // Load guarantees for this order and attach the matching one to each product
      const guaranteeRows = await db
        .select()
        .from(guarantees)
        .where(eq(guarantees.orderId, Number(parent.id)));

      const guaranteeByProduct = new Map(guaranteeRows.map((g) => [g.productId, g]));

      return productRows.map((row) => ({
        ...mapProduct(row),
        guarantee: guaranteeByProduct.has(row.id)
          ? mapGuarantee(guaranteeByProduct.get(row.id)!)
          : null,
      }));
    },

    guarantees: async (parent: { id: string }) => {
      const rows = await db
        .select()
        .from(guarantees)
        .where(eq(guarantees.orderId, Number(parent.id)));
      return rows.map(mapGuarantee);
    },

    productsCount: async (parent: { id: string }) => {
      const [row] = await db
        .select({ count: sql<number>`count(*)` })
        .from(orderProducts)
        .where(eq(orderProducts.orderId, Number(parent.id)));
      return Number(row?.count ?? 0);
    },

    totals: async (parent: { id: string }) => {
      const rows = await db
        .select({
          symbol: prices.symbol,
          total: sql<string>`sum(${prices.value})`,
        })
        .from(prices)
        .innerJoin(orderProducts, eq(prices.productId, orderProducts.productId))
        .where(eq(orderProducts.orderId, Number(parent.id)))
        .groupBy(prices.symbol);

      return rows.map((r) => ({
        value: Number(r.total),
        symbol: r.symbol,
      }));
    },
  },

  Product: {
    guarantee: async (parent: {
      id: string;
      guarantee?: ReturnType<typeof mapGuarantee> | null;
    }) => {
      // Already attached when loaded via Order.products
      if (parent.guarantee !== undefined) return parent.guarantee;
      return null;
    },

    prices: async (parent: { id: string }) => {
      const rows = await db
        .select()
        .from(prices)
        .where(eq(prices.productId, Number(parent.id)));
      return rows.map(mapPrice);
    },

    defaultPrice: async (parent: { id: string }) => {
      const [row] = await db
        .select()
        .from(prices)
        .where(and(eq(prices.productId, Number(parent.id)), eq(prices.isDefault, true)))
        .limit(1);
      return row ? mapPrice(row) : null;
    },
  },
};
