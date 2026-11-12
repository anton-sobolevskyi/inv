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

const toDate = (value: string | Date) => (value instanceof Date ? value : new Date(value));

const joinParts = (parts: Intl.DateTimeFormatPart[], sep = '/') =>
  parts
    .filter((p) => p.type !== 'literal')
    .map((p) => p.value.replace(/\.$/, ''))
    .join(sep);

export function formatDateShort(value: string | Date): string {
  return joinParts(
    new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      timeZone: 'UTC',
    }).formatToParts(toDate(value))
  );
}

export function formatDateLong(value: string | Date, locale: string): string {
  return joinParts(
    new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    }).formatToParts(toDate(value))
  );
}

export function formatDateNumeric(value: string | Date): string {
  return joinParts(
    new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'UTC',
    }).formatToParts(toDate(value))
  );
}

export function formatAmount(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

const SYMBOLS: Record<Currency, string> = { USD: '$', UAH: '₴' };
export const currencySymbol = (symbol: Currency) => SYMBOLS[symbol];
