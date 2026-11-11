'use client';

import { cn } from '@/utils/cn';
import { getFormattedDate, getFormattedTime } from '@/utils/format';
import { ClockIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export default function Clock() {
  const [time, setTime] = useState<Date>(new Date());
  const t = useTranslations('Clock');

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={cn('d-flex flex-column')}>
      <span>{t('today')}</span>
      <span className={cn('d-inline-flex gap-4')}>
        <time dateTime={time.toISOString()} className={cn('d-inline-flex')}>
          {time && getFormattedDate(time)}
        </time>
        <span className={cn('d-inline-flex align-items-center gap-2')}>
          <ClockIcon size={12} className={cn('fg-primary')} />
          <time className={cn('fs-6')} dateTime={time.toISOString()}>
            {time && getFormattedTime(time)}
          </time>
        </span>
      </span>
    </div>
  );
}
