'use client';

import { useTranslations } from 'next-intl';

import './ProductLine.scss';
import { ProductItem } from '@/types';
import ProductThumb from '@/ui/components/ProductThumb';

export default function ProductLine({ product }: { product: ProductItem }) {
  const t = useTranslations('Products');

  return (
    <li className="product-line d-grid align-items-center gap-3 px-4 py-3 border-bottom">
      <span
        className={`dot d-inline-block rounded-circle flex-shrink-0 ${
          product.isNew ? 'bg-success' : 'bg-secondary'
        }`}
      />
      <ProductThumb src={product.photo} alt="" />
      <span className="d-flex flex-column min-w-0">
        <span className="text-truncate text-decoration-underline">{product.title}</span>
        <span className="text-body-secondary small">
          {t('serial')}-{product.serialNumber}
        </span>
      </span>
      <span className={product.isNew ? 'text-success' : 'text-body'}>
        {product.isNew ? t('new') : t('used')}
      </span>
    </li>
  );
}
