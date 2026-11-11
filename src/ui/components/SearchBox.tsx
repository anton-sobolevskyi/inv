'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function SearchBox() {
  const t = useTranslations('TopMenu');

  return (
    <>
      <span className="visually-hidden">{t('search')}</span>
      <label className="input-group w-25">
        <span className="input-group-text">
          <Search size={16} aria-hidden />
        </span>
        <input className="form-control" type="search" placeholder={t('search')} />
      </label>
    </>
  );
}
