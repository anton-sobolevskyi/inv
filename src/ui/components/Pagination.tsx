'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Pagination({
  page,
  total,
  pageSize,
  onChange,
}: {
  page: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}) {
  const t = useTranslations('Common');
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;

  return (
    <nav className="d-flex align-items-center justify-content-center gap-4 mt-5 text-body-secondary small">
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm"
        disabled={page === 0}
        onClick={() => onChange(page - 1)}
      >
        <ChevronLeft size={16} /> {t('prev')}
      </button>
      <span>{t('page', { page: page + 1, pages })}</span>
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm"
        disabled={page >= pages - 1}
        onClick={() => onChange(page + 1)}
      >
        {t('next')} <ChevronRight size={16} />
      </button>
    </nav>
  );
}
