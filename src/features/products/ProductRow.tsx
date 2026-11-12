'use client';

import { useLocale, useTranslations } from 'next-intl';

import './ProductRow.scss';
import { ProductItem } from '@/types';
import ProductThumb from './ProductThumb';
import { formatDateLong, formatDateNumeric } from '@/utils/format';
import PriceStack from './PriceStack';
import DateStack from './DateStack';

export default function ProductRow({ product, index }: { product: ProductItem; index: number }) {
  const t = useTranslations('Products');
  const locale = useLocale();
  const g = product.guarantee;

  return (
    <tr
      className="product-row d-grid align-items-center gap-5 mb-3 py-3 px-4 border rounded-3 bg-body"
      style={{ animationDelay: `${Math.min(index, 10) * 25}ms` }}
    >
      <td
        className={`dot d-inline-block rounded-circle flex-shrink-0 ${product.isNew ? 'bg-success' : 'bg-secondary'}`}
        aria-hidden
      />
      <td>
        <ProductThumb src={product.photo ?? null} alt={product.title} />
      </td>
      <td className="d-flex flex-column lh-sm min-w-0">
        <span className="text-truncate text-decoration-underline" title={product.title}>
          {product.title}
        </span>
        <span className="text-body-secondary small">
          {t('serial')}-{product.serialNumber}
        </span>
      </td>
      <td>{product.type}</td>
      <td className="d-flex flex-column lh-sm">
        {g?.start ? (
          <>
            <span className="text-body-secondary small" title={formatDateLong(g.start, locale)}>
              {t('guaranteeFrom')} {formatDateNumeric(g.start)}
            </span>
            {g.end && (
              <span className="text-body-secondary small" title={formatDateLong(g.end, locale)}>
                {t('guaranteeTo')} {formatDateNumeric(g.end)}
              </span>
            )}
          </>
        ) : (
          '—'
        )}
      </td>
      <td>{product.isNew ? t('new') : t('used')}</td>
      <td>
        <PriceStack
          prices={product.prices}
          defaultSymbol={product.prices.find((p) => p.isDefault)?.symbol}
          locale={locale}
        />
      </td>

      <td className="text-truncate text-decoration-underline" title={product.order?.title}>
        {product.order?.title ?? t('noOrder')}
      </td>
      <td className="text-truncate text-decoration-underline" title={product.specification ?? ''}>
        {product.specification ?? '—'}
      </td>
      <td>
        <DateStack value={product.date} locale={locale} />
      </td>
    </tr>
  );
}
