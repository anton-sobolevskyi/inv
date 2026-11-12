import type { DashboardOrder, Money } from '@/types';

export interface MonthlyPoint {
  month: string; // YYYY-MM
  usd: number;
  uah: number;
  orders: number;
}
export interface TypePoint {
  type: string;
  count: number;
}
export interface GraphNode {
  id: string;
  kind: 'root' | 'order' | 'product';
  label: string;
  x: number;
  y: number;
  r: number;
}
export interface GraphEdge {
  from: string;
  to: string;
}
export interface StatsResult {
  kpis: { orders: number; products: number; totalUsd: number; totalUah: number };
  monthly: MonthlyPoint[];
  byType: TypePoint[];
  graph: { width: number; height: number; nodes: GraphNode[]; edges: GraphEdge[] };
}

const round2 = (n: number) => Math.round(n * 100) / 100;
const totalOf = (totals: Money[], symbol: Money['symbol']) =>
  totals.filter((t) => t.symbol === symbol).reduce((acc, t) => acc + t.value, 0);
const truncate = (text: string, max: number) =>
  text.length > max ? `${text.slice(0, max - 1)}…` : text;

export const GRAPH_ORDERS = 8;
export const GRAPH_PRODUCTS_PER_ORDER = 4;

export function computeStats(orders: DashboardOrder[], productsCount: number): StatsResult {
  let totalUsd = 0;
  let totalUah = 0;
  const months = new Map<string, MonthlyPoint>();
  const types = new Map<string, number>();

  for (const order of orders) {
    const usd = totalOf(order.totals, 'USD');
    const uah = totalOf(order.totals, 'UAH');
    totalUsd += usd;
    totalUah += uah;

    const key = order.date.slice(0, 7);
    const point = months.get(key) ?? { month: key, usd: 0, uah: 0, orders: 0 };
    point.usd += usd;
    point.uah += uah;
    point.orders += 1;
    months.set(key, point);

    for (const product of order.products) {
      types.set(product.type, (types.get(product.type) ?? 0) + 1);
    }
  }

  const monthly = [...months.values()]
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-12)
    .map((m) => ({ ...m, usd: round2(m.usd), uah: round2(m.uah) }));

  const byType = [...types.entries()]
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count || a.type.localeCompare(b.type));

  return {
    kpis: {
      orders: orders.length,
      products: productsCount,
      totalUsd: round2(totalUsd),
      totalUah: round2(totalUah),
    },
    monthly,
    byType,
    graph: buildGraph(orders),
  };
}

export function buildGraph(orders: DashboardOrder[]): StatsResult['graph'] {
  const width = 800;
  const height = 600;
  const cx = width / 2;
  const cy = height / 2;
  const ringRadius = 195;
  const productRadius = 72;

  const top = [...orders]
    .sort((a, b) => b.productsCount - a.productsCount || b.date.localeCompare(a.date))
    .slice(0, GRAPH_ORDERS);

  const nodes: GraphNode[] = [
    { id: 'root', kind: 'root', label: 'Inventory', x: cx, y: cy, r: 22 },
  ];
  const edges: GraphEdge[] = [];

  top.forEach((order, i) => {
    const theta = -Math.PI / 2 + (2 * Math.PI * i) / top.length;
    const hub = { x: cx + ringRadius * Math.cos(theta), y: cy + ringRadius * Math.sin(theta) };
    const orderId = `o-${order.id}`;
    nodes.push({ id: orderId, kind: 'order', label: truncate(order.title, 22), ...hub, r: 14 });
    edges.push({ from: 'root', to: orderId });

    const shown = order.products.slice(0, GRAPH_PRODUCTS_PER_ORDER);
    shown.forEach((product, k) => {
      const phi = theta + (k - (shown.length - 1) / 2) * 0.45;
      const productId = `p-${product.id}`;
      nodes.push({
        id: productId,
        kind: 'product',
        label: truncate(product.title, 16),
        x: hub.x + productRadius * Math.cos(phi),
        y: hub.y + productRadius * Math.sin(phi),
        r: 6,
      });
      edges.push({ from: orderId, to: productId });
    });
  });

  return { width, height, nodes, edges };
}
