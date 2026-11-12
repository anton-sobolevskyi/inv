'use client';

import { useTranslations } from 'next-intl';
import { useId, useState } from 'react';

import { ProductsPage } from '@/types';
import { setProductType, useAppDispatch, useAppSelector } from '@/lib/store';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useGetProductsQuery } from '@/hooks/useProducts';
import ProductRow from './ProductRow';
import './ProductRow.scss';
import Pagination from '@/ui/components/Pagination';

export default function Products({ initial }: { initial: ProductsPage | null }) {
  const t = useTranslations('Products');
  const tc = useTranslations('Common');
  const dispatch = useAppDispatch();
  const selectId = useId();
  const type = useAppSelector((s) => s.ui.productType);
  const search = useDebouncedValue(useAppSelector((s) => s.ui.search).trim());

  const [page, setPage] = useState(0);
  const [prev, setPrev] = useState({ type, search });
  if (prev.type !== type || prev.search !== search) {
    setPrev({ type, search });
    setPage(0);
  }

  const { data, isError, isFetching, refetch } = useGetProductsQuery({
    type,
    search,
    page,
    pageSize: 10,
  });
  const view = data ?? (!type && search === '' && page === 0 ? (initial ?? undefined) : undefined);
  const types = view?.productTypes ?? [];

  return (
    <div className="p-4">
      <header className="d-flex flex-wrap align-items-center column-gap-5 row-gap-3 mb-5">
        <h1 className="m-0 fw-bold fs-4">
          {t('title')}{' '}
          <span className="fw-normal text-body-secondary">/ {view?.productsCount ?? '…'}</span>
        </h1>
        <div className="d-inline-flex align-items-center gap-3">
          <label className="form-label m-0 text-body-secondary small" htmlFor={selectId}>
            {t('type')}:
          </label>
          <select
            id={selectId}
            className="form-control w-auto fw-semibold"
            value={type && types.includes(type) ? type : ''}
            onChange={(e) => dispatch(setProductType(e.target.value || null))}
          >
            <option value="">{t('allTypes')}</option>
            {types.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </header>

      {isError && !view && (
        <div>
          {tc('error')}
          <button type="button" className="btn btn-danger" onClick={() => refetch()}>
            {tc('retry')}
          </button>
        </div>
      )}
      {!view && !isError && <div>Loading...</div>}
      {view && view.products.length === 0 && (
        <div className="py-5 px-4 text-center text-body-secondary">{t('noProducts')}</div>
      )}

      {view && view.products.length > 0 && (
        <div className="overflow-x-auto p-4" style={{ marginInline: '-1rem' }}>
          <table className="products-table">
            <thead>
              <tr className="product-row product-row--head d-grid align-items-center gap-5 mb-3 px-4 py-0 border-0 bg-transparent text-body-secondary fw-bold text-uppercase small">
                <th />
                <th />
                <th>{t('colTitle')}</th>
                <th>{t('colType')}</th>
                <th>{t('colGuarantee')}</th>
                <th>{t('colCondition')}</th>
                <th>{t('colPrice')}</th>
                <th>{t('colOrder')}</th>
                <th>{t('colSpec')}</th>
                <th>{t('colDate')}</th>
              </tr>
            </thead>

            <tbody>
              {view.products.map((product, i) => (
                <ProductRow key={product.id} product={product} index={i} />
              ))}
            </tbody>
          </table>
        </div>
      )}
      {view && (
        <Pagination page={page} total={view.productsCount} pageSize={10} onChange={setPage} />
      )}
    </div>
  );
}
