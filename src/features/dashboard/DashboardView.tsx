'use client';

import { useLocale, useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

import { useStats } from '@/hooks/useStats';

import './DashboardView.scss';
import { formatAmount } from '@/utils/format';
import { useGetDashboardQuery } from '@/hooks/useDashboard';

function ChartLoading({ label }: { label: string }) {
  return (
    <div className="placeholder-wave chart-plot" role="status" aria-label={label}>
      <span className="placeholder d-block w-100 h-100 rounded" />
      <span className="visually-hidden">{label}</span>
    </div>
  );
}

const MonthlyChart = dynamic(() => import('./Chart').then((m) => m.MonthlyChart), {
  ssr: false,
  loading: () => <ChartLoading label="…" />,
});

const OrdersMap = dynamic(() => import('./OrdersMap'), {
  ssr: false,
  loading: () => <ChartLoading label="…" />,
});

export default function DashboardView() {
  const t = useTranslations('Dashboard');
  const tc = useTranslations('Common');
  const locale = useLocale();
  const { data, isError, refetch } = useGetDashboardQuery();
  const { stats, source } = useStats(data?.orders, data?.productsCount);

  if (isError) {
    return (
      <>
        {tc('error')}
        <button type="button" className="btn btn-danger" onClick={() => refetch()}>
          {tc('retry')}
        </button>
      </>
    );
  }

  const kpis = stats?.kpis;
  const cards = [
    { label: t('orders'), value: kpis ? formatAmount(kpis.orders, locale) : '…' },
    { label: t('products'), value: kpis ? formatAmount(kpis.products, locale) : '…' },
    { label: t('valueUsd'), value: kpis ? `${formatAmount(kpis.totalUsd, locale)} $` : '…' },
    { label: t('valueUah'), value: kpis ? `${formatAmount(kpis.totalUah, locale)} UAH` : '…' },
  ];

  return (
    <div className="p-4">
      <header className="d-flex flex-wrap align-items-center column-gap-5 row-gap-5 mb-5">
        <h1 className="m-0 fw-bold fs-4">{t('title')}</h1>
        {source && (
          <span className="badge bg-success" title={t('computing')}>
            Web Worker: {source === 'worker' ? tc('yes') : tc('no')}
          </span>
        )}
      </header>

      <div className="row g-5">
        <div className="col-12">
          <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-4 g-2">
            {cards.map((c) => (
              <div key={c.label} className="col">
                <div className="card border-0 shadow-sm p-2 h-100">
                  <div className="text-body-secondary small">{c.label}</div>
                  <div className="mt-2 fw-bold fs-5">{c.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <section className="col-12">
          <div className="card border-0 shadow-sm d-flex flex-column p-4 h-100">
            <h2 className="fw-bold fs-5 mb-1">{t('monthly')}</h2>
            <div className="chart-plot">
              {stats ? (
                <MonthlyChart data={stats.monthly} />
              ) : (
                <ChartLoading label={t('loadingChart')} />
              )}
            </div>
          </div>
        </section>

        <section className="col-12">
          <div className="card border-0 shadow-sm d-flex flex-column p-4 h-100">
            <h2 className="fw-bold fs-5 mb-1">{t('map')}</h2>
            <div className="chart-plot" style={{ minHeight: 380 }}>
              {data ? <OrdersMap orders={data.orders} /> : <ChartLoading label={t('loadingMap')} />}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
