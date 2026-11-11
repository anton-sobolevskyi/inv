import { Locale } from '@/types';

export const LOCALES: Locale[] = ['en', 'uk'] as const;
export const INTL_LOCALE: Record<Locale, string> = { uk: 'uk-UA', en: 'en-GB' };
