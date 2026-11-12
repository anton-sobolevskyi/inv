'use client';

import { useTranslations } from 'next-intl';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import type { MonthlyPoint } from '@/stats';

export function MonthlyChart({ data }: { data: MonthlyPoint[] }) {
  const t = useTranslations('Dashboard');
  if (data.length === 0)
    return <p className="py-5 px-4 text-center text-body-secondary mb-0">{t('noData')}</p>;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e6ecf0" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} />
        <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={48} />
        <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} $`, 'USD']} />
        <Bar dataKey="usd" fill="#82b541" radius={[4, 4, 0, 0]} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  );
}
