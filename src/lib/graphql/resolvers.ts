import { and, desc, eq, inArray, like, ne, or, sql, type SQL } from 'drizzle-orm';
import { GraphQLError } from 'graphql';
import { db } from '@/db/client';
import { orderProducts } from '@/db/schema/orderProducts';
import { orders } from '@/db/schema/orders';
import { products } from '@/db/schema/products';
import type { GraphQLContext } from './context';
import { mapOrder, mapProduct, type OrderDTO, type ProductDTO } from './mappers';
import type { SessionUser } from '@/types';

type AuthedContext = GraphQLContext & { user: SessionUser };
const MAX_LIMIT = 200;
const clampLimit = (limit: number | undefined) => Math.min(Math.max(limit ?? 50, 1), MAX_LIMIT);
const clampOffset = (offset: number | undefined) => Math.max(offset ?? 0, 0);

function authed<A, R>(fn: (args: A, ctx: AuthedContext) => Promise<R> | R) {
  return (_parent: unknown, args: A, ctx: GraphQLContext): Promise<R> | R => {
    if (!ctx.user) {
      throw new GraphQLError('Authentication required', {
        extensions: { code: 'UNAUTHENTICATED', http: { status: 401 } },
      });
    }
    return fn(args, ctx as AuthedContext);
  };
}

const escapeLike = (term: string) => `%${term.replace(/[\\%_]/g, '\\$&')}%`;

interface OrderFilter {
  search?: string | null;
}
interface ProductFilter {
  type?: string | null;
  orderId?: string | null;
  isNew?: boolean | null;
  search?: string | null;
}

const orderWhere = (filter?: OrderFilter | null): SQL | undefined =>
  filter?.search?.trim() ? like(orders.title, escapeLike(filter.search.trim())) : undefined;

function productWhere(filter?: ProductFilter | null): SQL | undefined {
  const conditions: SQL[] = [];
  if (filter?.type) conditions.push(eq(products.type, filter.type));
  if (filter?.isNew != null) conditions.push(eq(products.isNew, filter.isNew));
  if (filter?.search?.trim()) {
    const term = escapeLike(filter.search.trim());
    conditions.push(or(like(products.title, term), like(products.serialNumber, term))!);
  }
  if (filter?.orderId) {
    conditions.push(
      inArray(
        products.id,
        db
          .select({ id: orderProducts.productId })
          .from(orderProducts)
          .where(eq(orderProducts.orderId, Number(filter.orderId)))
      )
    );
  }
  return conditions.length ? and(...conditions) : undefined;
}

async function loadOrder(id: number) {
  const [row] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return row ? mapOrder(row) : null;
}

async function loadProduct(id: number) {
  const [row] = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return row ? mapProduct(row) : null;
}

export const resolvers = {
  Query: {
    me: (_: unknown, __: unknown, ctx: GraphQLContext) =>
      ctx.user
        ? { id: String(ctx.user.id), email: ctx.user.email, displayName: ctx.user.displayName }
        : null,

    orders: authed(
      async ({
        filter,
        limit,
        offset,
      }: {
        filter?: OrderFilter | null;
        limit?: number;
        offset?: number;
      }) => {
        const rows = await db
          .select()
          .from(orders)
          .where(orderWhere(filter))
          .orderBy(desc(orders.date), desc(orders.id))
          .limit(clampLimit(limit))
          .offset(clampOffset(offset));
        return rows.map(mapOrder);
      }
    ),

    ordersCount: authed(async ({ filter }: { filter?: OrderFilter | null }) => {
      const [row] = await db
        .select({ count: sql<number>`count(*)` })
        .from(orders)
        .where(orderWhere(filter));
      return Number(row?.count ?? 0);
    }),

    order: authed(({ id }: { id: string }) => loadOrder(Number(id))),

    products: authed(
      async ({
        filter,
        limit,
        offset,
      }: {
        filter?: ProductFilter | null;
        limit?: number;
        offset?: number;
      }) => {
        const rows = await db
          .select()
          .from(products)
          .where(productWhere(filter))
          .orderBy(desc(products.date), desc(products.id))
          .limit(clampLimit(limit))
          .offset(clampOffset(offset));
        return rows.map(mapProduct);
      }
    ),

    productsCount: authed(async ({ filter }: { filter?: ProductFilter | null }) => {
      const [row] = await db
        .select({ count: sql<number>`count(*)` })
        .from(products)
        .where(productWhere(filter));
      return Number(row?.count ?? 0);
    }),

    product: authed(({ id }: { id: string }) => loadProduct(Number(id))),

    productTypes: authed(async () => {
      const rows = await db
        .selectDistinct({ type: products.type })
        .from(products)
        .orderBy(products.type);
      return rows.map((r) => r.type);
    }),
  },

  Mutation: {
    deleteOrder: authed(async ({ id }: { id: string }) => {
      const orderId = Number(id);
      const deleted = await db.transaction(async (tx) => {
        const links = await tx
          .select({ productId: orderProducts.productId })
          .from(orderProducts)
          .where(eq(orderProducts.orderId, orderId));
        const productIds = links.map((l) => l.productId);

        if (productIds.length) {
          const shared = await tx
            .select({ productId: orderProducts.productId })
            .from(orderProducts)
            .where(
              and(inArray(orderProducts.productId, productIds), ne(orderProducts.orderId, orderId))
            );
          const sharedIds = new Set(shared.map((s) => s.productId));
          const exclusive = productIds.filter((p) => !sharedIds.has(p));
          if (exclusive.length) await tx.delete(products).where(inArray(products.id, exclusive));
        }

        const result = await tx.delete(orders).where(eq(orders.id, orderId));
        return result[0].affectedRows > 0;
      });

      return deleted;
    }),
  },

  Order: {
    products: (parent: OrderDTO, _: unknown, ctx: GraphQLContext) =>
      ctx.loaders.productsByOrder.load(Number(parent.id)),
    guarantees: (parent: OrderDTO, _: unknown, ctx: GraphQLContext) =>
      ctx.loaders.guaranteesByOrder.load(Number(parent.id)),
    productsCount: (parent: OrderDTO, _: unknown, ctx: GraphQLContext) =>
      ctx.loaders.productsCountByOrder.load(Number(parent.id)),
    totals: (parent: OrderDTO, _: unknown, ctx: GraphQLContext) =>
      ctx.loaders.totalsByOrder.load(Number(parent.id)),
  },

  Product: {
    guarantee: (parent: ProductDTO, _: unknown, ctx: GraphQLContext) =>
      ctx.loaders.guaranteeByProduct.load(Number(parent.id)),
    prices: (parent: ProductDTO, _: unknown, ctx: GraphQLContext) =>
      ctx.loaders.pricesByProduct.load(Number(parent.id)),
    defaultPrice: async (parent: ProductDTO, _: unknown, ctx: GraphQLContext) => {
      const all = await ctx.loaders.pricesByProduct.load(Number(parent.id));
      return all.find((p) => p.isDefault) ?? null;
    },
    order: (parent: ProductDTO, _: unknown, ctx: GraphQLContext) =>
      ctx.loaders.orderByProduct.load(Number(parent.id)),
  },
};
