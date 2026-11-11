import Link from 'next/link';

import { env } from '@/env';
import { cn } from '@/utils/cn';

import Clock from '../components/Clock';
import SessionCounter from '../components/SessionCounter';
import { ShieldCheck } from 'lucide-react';

export default function TopMenu() {
  return (
    <header className={cn('shadow-sm h-100')}>
      <div
        className={cn('container d-flex gap-4 justify-content-between align-items-center h-100')}
      >
        <Link
          href="/"
          className={cn(
            'd-inline-flex align-items-center gap-2 fs-4 text-decoration-none uppercase fg-primary'
          )}
        >
          <ShieldCheck size={32} aria-hidden />
          Inventory
        </Link>

        <input type="search" className={cn('form-control w-25 ml-auto')} placeholder="Search" />

        <div className={cn('d-flex gap-4 align-items-end fs-sm')}>
          <Clock />
          <SessionCounter url={env.SOCKET_URL} />
        </div>
      </div>
    </header>
  );
}
