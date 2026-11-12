import { Keyboard, Laptop, Monitor, Mouse, type LucideIcon } from 'lucide-react';

import './ProductThumb.scss';

const PRODUCT_ICONS: Record<string, LucideIcon> = {
  '/products/monitors.svg': Monitor,
  '/products/laptops.svg': Laptop,
  '/products/keyboards.svg': Keyboard,
  '/products/mice.svg': Mouse,
};

export default function ProductThumb({ src }: { src: string | null; alt?: string }) {
  const Icon = src ? PRODUCT_ICONS[src] : null;
  if (!Icon) return null;

  return (
    <span className="thumb d-flex align-items-center justify-content-center rounded-1 bg-body-secondary text-body">
      <Icon size={26} strokeWidth={1.75} />
    </span>
  );
}
