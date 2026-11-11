import '../../loadEnv';

import { eq } from 'drizzle-orm';

import { db } from './client';
import { guarantees } from './schema/guarantees';
import { orderProducts } from './schema/orderProducts';
import { orders } from './schema/orders';
import { prices } from './schema/prices';
import { products } from './schema/products';
import { users } from './schema/users';
import { hashPassword } from '@/utils/hash';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const toMysql = (d: Date) => d.toISOString().replace('T', ' ').replace('Z', '');

const CATALOG = {
  Monitors: {
    photo: '/products/monitors.svg',
    base: 250,
    items: [
      ['Dell UltraSharp U2723DE', '27" QHD IPS, 2560x1440, 60Hz, USB-C Hub'],
      ['LG UltraGear 27GP850', '27" QHD Nano IPS, 180Hz, 1ms, G-Sync Compatible'],
      ['Samsung Odyssey G7', '32" QHD Curved VA, 240Hz, 1ms, HDR600'],
      ['ASUS ProArt PA278QV', '27" WQHD IPS, 75Hz, Calman Verified'],
      ['BenQ PD2700U', '27" 4K UHD IPS, 60Hz, CAD/CAM Mode, USB-C'],
    ],
  },
  Laptops: {
    photo: '/products/laptops.svg',
    base: 900,
    items: [
      ['Lenovo ThinkPad T14', '14" FHD IPS, Ryzen 7, 16GB RAM, 512GB SSD'],
      ['Dell Latitude 5440', '14" FHD, Core i5, 16GB RAM, 512GB SSD'],
      ['HP EliteBook 840 G10', '14" WUXGA, Core i7, 32GB RAM, 1TB SSD'],
      ['ASUS Zenbook 14', '14" OLED, Core Ultra 7, 16GB RAM, 1TB SSD'],
    ],
  },
  Keyboards: {
    photo: '/products/keyboards.svg',
    base: 60,
    items: [
      ['Logitech MX Keys', 'Wireless, backlit, multi-device, USB-C'],
      ['Keychron K8 Pro', 'Mechanical, hot-swappable, Bluetooth 5.1'],
      ['Razer BlackWidow V4', 'Mechanical, RGB, green switches'],
    ],
  },
  Mice: {
    photo: '/products/mice.svg',
    base: 45,
    items: [
      ['Logitech MX Master 3S', 'Wireless, 8K DPI, silent clicks'],
      ['Razer DeathAdder V3', 'Wired, 30K DPI, 59g'],
      ['Microsoft Bluetooth Mouse', 'Compact, Bluetooth, 12 months battery'],
    ],
  },
} as const;

const ORDER_TITLES = [
  'Office Setup - Dual Monitors',
  'Gaming Rig Upgrade',
  'Design Studio Order',
  'Home Office Essentials',
  'Corporate Bulk Purchase',
  'Student Discount Pack',
  'Content Creator Bundle',
  'IT Department Restock',
  'Remote Work Kit',
  'Professional Photo Editing',
  'Esports Team Order',
  'Architecture Firm Setup',
  'Video Production Monitors',
  'Retail Display Screens',
  'Medical Imaging Displays',
  'Financial Trading Desks',
  'Education Lab Monitors',
  'Startup Office Package',
  'Freelancer Workspace',
  'Enterprise Multi-Monitor',
  'Color Grading Suite',
  'CAD Workstation',
  'Streaming Setup',
  'Security Operations Center',
  'Conference Room Displays',
];

const LOCATIONS = [
  ['45 Shevchenka St, Lviv', 49.8397, 24.0297],
  ['12 Rynok Square, Lviv', 49.8419, 24.0316],
  ['88 Prospekt Svobody, Lviv', 49.8444, 24.0261],
  ['3 Horodotska St, Lviv', 49.8378, 24.0235],
  ['56 Lypska St, Kyiv', 50.4423, 30.5245],
  ['1 Khreshchatyk, Kyiv', 50.4501, 30.5234],
  ['34 Bohdana Khmelnytskoho St, Kyiv', 50.4478, 30.5132],
  ['18 Velyka Vasylkivska St, Kyiv', 50.4389, 30.5156],
  ['4 Soborna St, Odesa', 46.4825, 30.7233],
  ['21 Deribasivska St, Odesa', 46.4845, 30.7321],
  ['8 Yevropeiska St, Dnipro', 48.4647, 35.0462],
  ['19 Naberezhna Peremohy, Dnipro', 48.4689, 35.0415],
  ['42 Polova St, Kharkiv', 49.9935, 36.2304],
  ['11 Sumska St, Kharkiv', 49.9901, 36.2345],
] as const;

async function seed() {
  const rand = mulberry32(2026);

  const email = (process.env.SEED_ADMIN_EMAIL || 'admin@inventory.local').toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || 'admin12345';
  const passwordHash = await hashPassword(password);
  const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing) {
    await db.update(users).set({ passwordHash }).where(eq(users.id, existing.id));
  } else {
    await db.insert(users).values({
      email,
      displayName: 'Admin',
      passwordHash,
      createdAt: toMysql(new Date()),
    });
  }
  console.log(`User ready: ${email}`);

  await db.delete(prices);
  await db.delete(guarantees);
  await db.delete(orderProducts);
  await db.delete(products);
  await db.delete(orders);

  const start = Date.now() - ORDER_TITLES.length * 12 * DAY_IN_MS;
  const orderData = ORDER_TITLES.map((title, i) => {
    const [address, latitude, longitude] = LOCATIONS[i % LOCATIONS.length];
    return {
      title,
      description: `Order for office equipment. ${i % 2 === 0 ? 'Priority delivery requested.' : 'Standard shipping.'}`,
      address,
      latitude,
      longitude,
      date: toMysql(new Date(start + i * 12 * DAY_IN_MS)),
    };
  });
  const insertedOrders = await db.insert(orders).values(orderData).$returningId();

  const types = Object.keys(CATALOG) as (keyof typeof CATALOG)[];
  const productData = Array.from({ length: 60 }, (_, i) => {
    const type = types[i % types.length];
    const entry = CATALOG[type];
    const [title, spec] = entry.items[Math.floor(i / types.length) % entry.items.length];
    const isNew = i % 3 !== 0;
    return {
      serialNumber: `SN-${2024 + (i % 3)}-${String(10000 + i).padStart(5, '0')}`,
      isNew,
      photo: entry.photo,
      title: i >= 20 ? `${title} #${i + 1}` : title,
      specification: `${spec}${isNew ? ' | Brand new' : ' | Refurbished'}`,
      type,
      date: orderData[i % orderData.length].date,
    };
  });
  const insertedProducts = await db.insert(products).values(productData).$returningId();

  const priceData = insertedProducts.flatMap(({ id }, i) => {
    const entry = CATALOG[types[i % types.length]];
    const usd = Math.round(entry.base * (0.8 + rand() * 0.8));
    return [
      { productId: id, value: usd.toFixed(2), symbol: 'USD' as const, isDefault: false },
      {
        productId: id,
        value: (usd * 41.5).toFixed(2),
        symbol: 'UAH' as const,
        isDefault: true,
      },
    ];
  });
  await db.insert(prices).values(priceData);

  const links = insertedProducts.map(({ id }, i) => ({
    orderId: insertedOrders[i % insertedOrders.length].id,
    productId: id,
  }));
  await db.insert(orderProducts).values(links);

  const guaranteeData = links.map(({ orderId, productId }, i) => {
    const orderDate = new Date(orderData[i % orderData.length].date.replace(' ', 'T') + 'Z');
    const end = new Date(orderDate);
    end.setUTCFullYear(end.getUTCFullYear() + 1 + (i % 3));
    return { orderId, productId, start: toMysql(orderDate), end: toMysql(end) };
  });
  await db.insert(guarantees).values(guaranteeData);

  console.log(
    `Seeded ${insertedOrders.length} orders, ${insertedProducts.length} products, ${priceData.length} prices`
  );
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
