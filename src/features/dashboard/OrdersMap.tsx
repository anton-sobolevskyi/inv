'use client';

import { DashboardOrder } from '@/types';
import PriceStack from '@/ui/components/PriceStack';
import 'leaflet/dist/leaflet.css';
import { useLocale } from 'next-intl';
import { useEffect } from 'react';
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet';

type Point = [number, number];

function FitBounds({ points }: { points: Point[] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length > 0) map.fitBounds(points, { padding: [32, 32], maxZoom: 9 });
  }, [map, points]);
  return null;
}

export default function OrdersMap({ orders }: { orders: DashboardOrder[] }) {
  const locale = useLocale();
  const located = orders.filter(
    (o): o is DashboardOrder & { latitude: number; longitude: number } =>
      o.latitude != null && o.longitude != null
  );
  const points = located.map((o): Point => [o.latitude, o.longitude]);

  return (
    <MapContainer
      className="position-absolute top-0 start-0 end-0 bottom-0 w-100 h-100 z-0 rounded-3"
      center={[49, 31]}
      zoom={5}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds points={points} />
      {located.map((order) => (
        <CircleMarker
          key={order.id}
          center={[order.latitude, order.longitude]}
          radius={6 + Math.min(order.productsCount, 6)}
          pathOptions={{ color: '#6b9a2f', fillColor: '#82b541', fillOpacity: 0.75, weight: 2 }}
        >
          <Popup>
            <strong>{order.title}</strong>
            <br />
            {order.address}
            <br />
            <PriceStack prices={order.totals} locale={locale} />
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
