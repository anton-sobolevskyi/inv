'use client';

import { LOCALES } from '@/constants';
import { setLocale } from '@/i18n/actions';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export default function LanguageSwitcher() {
  const currentLocale = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const change = (next: string) => {
    if (next === currentLocale) return;
    startTransition(async () => {
      await setLocale(next);
      router.refresh();
    });
  };

  return (
    <div className="btn-group btn-group-sm" role="group">
      {LOCALES.map((locale) => (
        <button
          key={locale}
          type="button"
          className={`btn text-uppercase ${locale === currentLocale ? 'btn-primary' : 'btn-outline-primary'}`}
          disabled={pending}
          onClick={() => change(locale)}
        >
          {locale}
        </button>
      ))}
    </div>
  );
}
