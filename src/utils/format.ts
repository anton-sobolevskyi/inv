import { INTL_LOCALE } from '@/constants';
import { Currency, Locale } from '@/types';

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

const pad = (n: number) => String(n).padStart(2, '0');

const toDate = (value: string | Date) => (value instanceof Date ? value : new Date(value));

export function formatDateShort(value: string | Date): string {
  const d = toDate(value);
  return `${pad(d.getUTCDate())} / ${pad(d.getUTCMonth() + 1)}`;
}

/** Long form: "06 / Apr / 2026" (month name follows the locale). */
export function formatDateLong(value: string | Date, locale: string): string {
  const d = toDate(value);
  const month = new Intl.DateTimeFormat(locale, { month: 'short', timeZone: 'UTC' })
    .format(d)
    .replace(/\.$/, '');
  return `${pad(d.getUTCDate())} / ${month} / ${d.getUTCFullYear()}`;
}

/** Numeric form: "06 / 04 / 2026". */
export function formatDateNumeric(value: string | Date): string {
  const d = toDate(value);
  return `${pad(d.getUTCDate())} / ${pad(d.getUTCMonth() + 1)} / ${d.getUTCFullYear()}`;
}

export function formatAmount(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

const SYMBOLS: Record<Currency, string> = { USD: '$', UAH: '₴' };
export const currencySymbol = (symbol: Currency) => SYMBOLS[symbol];
