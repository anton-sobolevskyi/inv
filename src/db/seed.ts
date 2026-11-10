import 'dotenv/config';

import { db } from './client';
import { products } from './schema/products';
import { orders } from './schema/orders';
import { guarantees } from './schema/guarantees';
import { prices } from './schema/prices';
import { orderProducts } from './schema/orderProducts';

async function seed() {
  await db.delete(prices);
  await db.delete(guarantees);
  await db.delete(orderProducts);
  await db.delete(products);
  await db.delete(orders);

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
    const isNew = i % 3 !== 0;
    productData.push({
      serialNumber: `SN-${2024 + (i % 3)}-${String(10000 + i).padStart(5, '0')}`,
      isNew,
      photo: `https://picsum.photos/seed/monitor${i}/800/600`,
      title: `${model.title}${i > 9 ? ` #${i + 1}` : ''}`,
      specification:
        model.spec + (isNew ? ' | Brand new, sealed box.' : ' | Refurbished, certified.'),
      type: 'monitors' as const,
      date: new Date(2024 + Math.floor(i / 15), i % 12, (i % 28) + 1, 14, 0)
        .toISOString()
        .replace('T', ' ')
        .slice(0, 23),
    });
  }

  const insertedProducts = await db.insert(products).values(productData).$returningId();
  console.log(`Inserted ${insertedProducts.length} products`);

  const priceData = [];
  for (let i = 0; i < insertedProducts.length; i++) {
    const productId = insertedProducts[i]!.id;
    const baseUsd = 250 + (i % 15) * 40 + Math.floor(Math.random() * 50);
    priceData.push({
      productId,
      value: baseUsd.toFixed(2),
      symbol: 'USD' as const,
      isDefault: true,
    });
    if (i % 5 < 2) {
      priceData.push({
        productId,
        value: (baseUsd * 41.5).toFixed(2),
        symbol: 'UAH' as const,
        isDefault: false,
      });
    }
  }
  await db.insert(prices).values(priceData);
  console.log(`Inserted ${priceData.length} prices`);

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

  const locations = [
    { address: '45 Shevchenka St, Lviv, Ukraine', latitude: 49.8397, longitude: 24.0297 },
    { address: '12 Rynok Square, Lviv, Ukraine', latitude: 49.8419, longitude: 24.0316 },
    { address: '88 Prospekt Svobody, Lviv, Ukraine', latitude: 49.8444, longitude: 24.0261 },
    { address: '3 Horodotska St, Lviv, Ukraine', latitude: 49.8378, longitude: 24.0235 },
    { address: '210 Zelena St, Lviv, Ukraine', latitude: 49.8221, longitude: 24.0412 },
    { address: '7 Franka St, Lviv, Ukraine', latitude: 49.8332, longitude: 24.0189 },
    { address: '15 Bandery St, Lviv, Ukraine', latitude: 49.8355, longitude: 24.0123 },
    { address: '99 Kulparkivska St, Lviv, Ukraine', latitude: 49.8156, longitude: 23.9987 },
    { address: '22 Sichovykh Striltsiv St, Lviv, Ukraine', latitude: 49.8421, longitude: 24.0228 },
    { address: '56 Lypska St, Kyiv, Ukraine', latitude: 50.4423, longitude: 30.5245 },
    { address: '1 Khreshchatyk, Kyiv, Ukraine', latitude: 50.4501, longitude: 30.5234 },
    {
      address: '34 Bohdana Khmelnytskoho St, Kyiv, Ukraine',
      latitude: 50.4478,
      longitude: 30.5132,
    },
    { address: '18 Velyka Vasylkivska St, Kyiv, Ukraine', latitude: 50.4389, longitude: 30.5156 },
    { address: '9 Mechnykova St, Kyiv, Ukraine', latitude: 50.4412, longitude: 30.5289 },
    { address: '77 Saksahanskoho St, Kyiv, Ukraine', latitude: 50.4356, longitude: 30.5098 },
    { address: '4 Soborna St, Odesa, Ukraine', latitude: 46.4825, longitude: 30.7233 },
    { address: '21 Deribasivska St, Odesa, Ukraine', latitude: 46.4845, longitude: 30.7321 },
    { address: '13 Rishelievska St, Odesa, Ukraine', latitude: 46.4798, longitude: 30.7289 },
    { address: '55 Preobrazhenska St, Odesa, Ukraine', latitude: 46.4712, longitude: 30.7356 },
    { address: '8 Yevropeiska St, Dnipro, Ukraine', latitude: 48.4647, longitude: 35.0462 },
    { address: '19 Naberezhna Peremohy, Dnipro, Ukraine', latitude: 48.4689, longitude: 35.0415 },
    { address: '6 Haharin Ave, Dnipro, Ukraine', latitude: 48.4556, longitude: 35.0523 },
    { address: '42 Polova St, Kharkiv, Ukraine', latitude: 49.9935, longitude: 36.2304 },
    { address: '11 Sumska St, Kharkiv, Ukraine', latitude: 49.9901, longitude: 36.2345 },
    { address: '27 Nauky Ave, Kharkiv, Ukraine', latitude: 50.0012, longitude: 36.2289 },
  ];

  const orderData = orderTitles.map((title, index) => {
    const loc = locations[index % locations.length];
    return {
      title,
      description: `Order for high-quality monitors. ${index % 2 === 0 ? 'Priority delivery requested.' : 'Standard shipping.'}`,
      address: loc.address,
      latitude: loc.latitude,
      longitude: loc.longitude,
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
    };
  });

  const insertedOrders = await db.insert(orders).values(orderData).$returningId();
  console.log(`Inserted ${insertedOrders.length} orders`);

  const orderProductData = [];
  const guaranteeData = [];

  for (let i = 0; i < insertedProducts.length; i++) {
    const productId = insertedProducts[i]!.id;
    const orderIdx = i % insertedOrders.length;
    const orderId = insertedOrders[orderIdx]!.id;
    const orderDate = orderData[orderIdx].date;

    orderProductData.push({ orderId, productId });

    const endDate = new Date(orderDate.replace(' ', 'T') + 'Z');
    endDate.setFullYear(endDate.getFullYear() + 1 + (i % 3));
    const end = endDate.toISOString().replace('T', ' ').slice(0, 23);

    guaranteeData.push({
      orderId,
      productId,
      start: orderDate,
      end,
    });
  }

  await db.insert(orderProducts).values(orderProductData);
  await db.insert(guarantees).values(guaranteeData);
  console.log(`Linked ${orderProductData.length} products to orders and created guarantees`);

  console.log('Seeding completed successfully!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
