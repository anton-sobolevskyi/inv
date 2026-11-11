'use client';

import { ClockIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { getFormattedDate, getFormattedTime } from '@/utils/format';
import { Locale } from '@/types';

export default function Clock() {
  const [now, setNow] = useState<Date | null>(null);
  const t = useTranslations('Clock');
  const locale = useLocale() as Locale;

  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = setTimeout(tick, 0);
    const interval = setInterval(tick, 1000);

    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="d-flex flex-column gap-1 lh-sm">
      <span>{t('today')}</span>
      <span className="d-inline-flex align-items-center gap-4">
        <span>{now ? getFormattedDate(now, locale).toUpperCase() : '—'}</span>
        <span className="d-inline-flex align-items-center gap-2">
          <ClockIcon size={12} aria-hidden />
          <time>{now ? getFormattedTime(now, locale) : '--:--'}</time>
        </span>
      </span>
    </div>
  );
}
