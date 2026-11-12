'use server';

import { LOCALE_COOKIE, LOCALES } from '@/constants';
import { Locale } from 'next-intl';
import { cookies } from 'next/headers';

const isLocale = (value: string | undefined | null): value is Locale =>
  !!value && (LOCALES as readonly string[]).includes(value);

export async function setLocale(locale: string) {
  console.log('setLocale', locale, isLocale(locale));
  if (!isLocale(locale)) return;

  (await cookies()).set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });
}
