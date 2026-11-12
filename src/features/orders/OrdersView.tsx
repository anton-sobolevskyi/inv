'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import './OrdersView.scss';
import { OrdersPage } from '@/types';
import { useAppSelector } from '@/lib/store';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useGetOrdersQuery } from '@/hooks/useOrders';
import OrderRow from './OrderRow';
import OrderPanel from './OrderPanel';
import Pagination from '@/ui/components/Pagination';
import ModalHost from './ModalHost';

export default function OrdersView({ initial }: { initial: OrdersPage | null }) {
  const t = useTranslations('Orders');
  const tc = useTranslations('Common');
  const selectedId = useAppSelector((s) => s.ui.selectedOrderId);
  const search = useDebouncedValue(useAppSelector((s) => s.ui.search).trim());

  const [page, setPage] = useState(0);
  const [prevSearch, setPrevSearch] = useState(search);
  if (prevSearch !== search) {
    setPrevSearch(search);
    setPage(0);
  }

  const { data, isError, refetch } = useGetOrdersQuery({
    search,
    page,
    pageSize: 10,
  });
  const view = data ?? (search === '' && page === 0 ? (initial ?? undefined) : undefined);

  return (
    <div className="p-4">
      <header className="d-flex flex-wrap align-items-center gap-3 mb-5">
        <h1 className="m-0 fw-bold fs-4">
          {t('title')}{' '}
          <span className="fw-normal text-body-secondary">/ {view?.ordersCount ?? '…'}</span>
        </h1>
      </header>

      {isError && !view && (
        <div className="mb-3">
          {tc('error')}
          <button type="button" className="btn btn-danger btn-sm ms-2" onClick={() => refetch()}>
            {tc('retry')}
          </button>
        </div>
      )}

      <div
        className={`orders d-grid gap-4 align-items-start ${selectedId ? 'orders--with-panel' : ''}`}
      >
        <div>
          {!view && !isError && <div className="text-body-secondary">{tc('loading')}</div>}
          {view && view.orders.length === 0 && (
            <div className="py-5 px-4 text-center text-body-secondary">{t('noOrders')}</div>
          )}
          {view && view.orders.length > 0 && (
            <table className="w-100 m-0">
              <tbody>
                {view.orders.map((order) => (
                  <OrderRow key={order.id} order={order} selected={order.id === selectedId} />
                ))}
              </tbody>
            </table>
          )}
          {view && (
            <Pagination page={page} total={view.ordersCount} pageSize={10} onChange={setPage} />
          )}
        </div>
        {selectedId && <OrderPanel key={selectedId} id={selectedId} />}
      </div>

      <ModalHost />
    </div>
  );
}
