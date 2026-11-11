'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { cn } from '@/utils/cn';

export default function NavLink({ href, text }: { href: string; text: string }) {
  const t = useTranslations('Nav');

  const pathname = usePathname();
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={cn('text-body', isActive(href) ? 'border-bottom border-2 border-primary' : '')}
    >
      <span className={cn('d-inline-block text-center py-2')}>{t(text)}</span>
    </Link>
  );
}
