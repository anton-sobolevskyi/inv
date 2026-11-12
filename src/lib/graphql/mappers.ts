import type { guarantees } from '@/db/schema/guarantees';
import type { orders } from '@/db/schema/orders';
import type { prices } from '@/db/schema/prices';
import type { products } from '@/db/schema/products';

export function toISO(mysqlDate: string | null | undefined): string | null {
  if (!mysqlDate) return null;
  return mysqlDate.replace(' ', 'T') + 'Z';
}

export function toMySQL(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().replace('T', ' ').replace(/Z$/i, '').slice(0, 23);
}

export const nowMySQL = (): string => toMySQL(new Date().toISOString())!;

export const mapOrder = (row: typeof orders.$inferSelect) => ({
  id: String(row.id),
  title: row.title,
  description: row.description,
  address: row.address,
  latitude: row.latitude,
  longitude: row.longitude,
  date: toISO(row.date)!,
});

export const mapProduct = (row: typeof products.$inferSelect) => ({
  id: String(row.id),
  serialNumber: row.serialNumber,
  isNew: row.isNew,
  photo: row.photo,
  title: row.title,
  type: row.type,
  specification: row.specification,
  date: toISO(row.date)!,
});

export const mapGuarantee = (row: typeof guarantees.$inferSelect) => ({
  id: String(row.id),
  productId: String(row.productId),
  orderId: String(row.orderId),
  start: toISO(row.start),
  end: toISO(row.end),
});

export const mapPrice = (row: typeof prices.$inferSelect) => ({
  id: String(row.id),
  value: Number(row.value),
  symbol: row.symbol,
  isDefault: row.isDefault,
});

export type OrderDTO = ReturnType<typeof mapOrder>;
export type ProductDTO = ReturnType<typeof mapProduct>;
