'use client';

import { useTranslations } from 'next-intl';

import { setSearch, useAppDispatch, useAppSelector } from '@/lib/store';

export default function SearchBox() {
  const t = useTranslations('TopMenu');
  const dispatch = useAppDispatch();
  const value = useAppSelector((s) => s.ui.search);

  return (
    <label className="w-25">
      <input
        className="form-control border-0 bg-body-secondary fw-semibold"
        type="search"
        placeholder={t('search')}
        value={value}
        onChange={(e) => dispatch(setSearch(e.target.value))}
      />
    </label>
  );
}
