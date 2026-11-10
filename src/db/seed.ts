import 'dotenv/config';

import connect from './client';
import { products } from './schema/products';
import { orders } from './schema/orders';
import { guarantees } from './schema/guarantees';

async function seed() {
  const db = await connect();

  await db.delete(products);
  await db.delete(orders);
  await db.delete(guarantees);

  // 1. Seed Guarantees (10 warranties)
  const guaranteeData = [
    { start: '2024-01-01 00:00:00.000', end: '2025-01-01 00:00:00.000' },
    { start: '2024-03-15 00:00:00.000', end: '2026-03-15 00:00:00.000' },
    { start: '2024-06-01 00:00:00.000', end: '2025-06-01 00:00:00.000' },
    { start: '2024-09-10 00:00:00.000', end: '2027-09-10 00:00:00.000' },
    { start: '2025-01-01 00:00:00.000', end: '2026-01-01 00:00:00.000' },
    { start: '2025-02-20 00:00:00.000', end: '2026-02-20 00:00:00.000' },
    { start: '2025-04-05 00:00:00.000', end: '2028-04-05 00:00:00.000' },
    { start: '2025-07-12 00:00:00.000', end: '2026-07-12 00:00:00.000' },
    { start: '2025-10-01 00:00:00.000', end: '2027-10-01 00:00:00.000' },
    { start: '2026-01-15 00:00:00.000', end: '2027-01-15 00:00:00.000' },
  ];

  const insertedGuarantees = await db.insert(guarantees).values(guaranteeData).$returningId();
  console.log(`Inserted ${insertedGuarantees.length} guarantees`);

  // 2. Seed Orders (25 orders)
  const orderTitles = [
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

  const orderData = orderTitles.map((title, index) => ({
    title,
    description: `Order for high-quality monitors. ${index % 2 === 0 ? 'Priority delivery requested.' : 'Standard shipping.'} Includes installation notes.`,
    date: new Date(
      2024 + Math.floor(index / 12),
      index % 12,
      (index % 28) + 1,
      10 + (index % 8),
      30
    )
      .toISOString()
      .replace('T', ' ')
      .slice(0, 23),
  }));

  const insertedOrders = await db.insert(orders).values(orderData).$returningId();
  console.log(`Inserted ${insertedOrders.length} orders`);

  // 3. Seed Products (30 products - monitors)
  const monitorModels = [
    {
      title: 'Dell UltraSharp U2723DE',
      spec: '27" QHD IPS, 2560x1440, 60Hz, USB-C Hub, Height Adjustable',
    },
    {
      title: 'LG UltraGear 27GP850',
      spec: '27" QHD Nano IPS, 2560x1440, 180Hz, 1ms, G-Sync Compatible',
    },
    { title: 'Samsung Odyssey G7', spec: '32" QHD Curved VA, 2560x1440, 240Hz, 1ms, HDR600' },
    {
      title: 'ASUS ProArt PA278QV',
      spec: '27" WQHD IPS, 2560x1440, 75Hz, Calman Verified, USB Hub',
    },
    { title: 'BenQ PD2700U', spec: '27" 4K UHD IPS, 3840x2160, 60Hz, CAD/CAM Mode, USB-C' },
    {
      title: 'ViewSonic VP2785',
      spec: '27" 4K IPS, 3840x2160, 60Hz, Hardware Calibration, Pantone',
    },
    { title: 'Acer Predator XB273U', spec: '27" QHD IPS, 2560x1440, 170Hz, 0.5ms, G-Sync' },
    { title: 'HP Z27k G3', spec: '27" 4K IPS, 3840x2160, 60Hz, USB-C, Factory Calibrated' },
    {
      title: 'Eizo ColorEdge CG2700X',
      spec: '27" 4K IPS, 3840x2160, Hardware Calibration, Built-in Sensor',
    },
    { title: 'MSI MAG274QRF', spec: '27" QHD Rapid IPS, 2560x1440, 165Hz, 1ms, Quantum Dot' },
  ];

  const productData = [];
  for (let i = 0; i < 30; i++) {
    const model = monitorModels[i % monitorModels.length];
    const order = insertedOrders[i % insertedOrders.length];
    const guarantee = insertedGuarantees[i % insertedGuarantees.length];
    const isNew = i % 3 !== 0;

    productData.push({
      serialNumber: `SN-${2024 + (i % 3)}-${String(10000 + i).padStart(5, '0')}`,
      isNew,
      photo: `https://picsum.photos/seed/monitor${i}/800/600`,
      title: `${model.title}${i > 9 ? ` #${i + 1}` : ''}`,
      specification:
        model.spec + (isNew ? ' | Brand new, sealed box.' : ' | Refurbished, certified.'),
      orderId: order!.id,
      guaranteeId: guarantee!.id,
      type: 'monitors' as const,
      date: new Date(2024 + Math.floor(i / 15), i % 12, (i % 28) + 1, 14, 0)
        .toISOString()
        .replace('T', ' ')
        .slice(0, 23),
    });
  }

  const insertedProducts = await db.insert(products).values(productData);
  console.log(`Inserted ${insertedProducts.length} products`);

  console.log('Seeding completed successfully!');
  process.exit();
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
