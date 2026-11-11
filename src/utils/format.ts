import { INTL_LOCALE } from '@/constants';
import { Locale } from '@/types';

export const getFormattedTime = (date: Date, locale: Locale = 'en') =>
  new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);

export const getFormattedDate = (date: Date, locale: Locale = 'en') =>
  new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
