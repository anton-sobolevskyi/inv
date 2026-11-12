'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import './OrderPanel.scss';
import ProductLine from './ProductLine';
import { selectOrder, useAppDispatch } from '@/lib/store';
import { useGetOrderDetailsQuery } from '@/hooks/useOrders';

export default function OrderPanel({ id }: { id: string }) {
  const t = useTranslations('Orders');
  const tc = useTranslations('Common');
  const dispatch = useAppDispatch();
  const { data: order, isLoading, isError, refetch } = useGetOrderDetailsQuery(id);

  useEffect(() => {
    if (order === null) dispatch(selectOrder(null));
  }, [order, dispatch]);

  return (
    <section className="order-panel position-relative border rounded-3 bg-body shadow">
      <button
        type="button"
        className="d-inline-flex btn p-2 btn-outline-secondary order-panel__close rounded-circle bg-white position-absolute"
        onClick={() => dispatch(selectOrder(null))}
      >
        <X size={16} />
      </button>

      <div className="px-4 pt-4 pb-3">
        <h2 className="m-0 fs-5 fw-bold">{order?.title ?? '…'}</h2>
      </div>

      {isLoading && <div className="px-4 pb-4 text-body-secondary">{tc('loading')}</div>}
      {isError && (
        <div className="px-4 pb-4">
          {tc('error')}
          <button type="button" className="btn btn-danger btn-sm ms-2" onClick={() => refetch()}>
            {tc('retry')}
          </button>
        </div>
      )}
      {order && order.products.length === 0 && (
        <div className="py-5 px-4 text-center text-body-secondary">{t('noProducts')}</div>
      )}
      {order && order.products.length > 0 && (
        <ul className="list-unstyled m-0 p-0 border-top">
          {order.products.map((p) => (
            <ProductLine key={p.id} product={p} />
          ))}
        </ul>
      )}
    </section>
  );
}
