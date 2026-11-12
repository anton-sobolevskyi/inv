import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';

import { LOCALE_COOKIE, LOCALES } from '@/constants';
import type { Locale } from '@/types';

const isLocale = (value: string | undefined | null): value is Locale =>
  !!value && (LOCALES as readonly string[]).includes(value);

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const raw = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale: Locale = isLocale(raw) ? raw : 'en';

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
