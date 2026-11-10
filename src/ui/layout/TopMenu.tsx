import Link from 'next/link';

import { env } from '@/app/env';
import { cn } from '@/utils/cn';

import Clock from '../components/Clock';
import SocketCounter from '../components/SocketCounter';
import { ShieldCheck } from 'lucide-react';

export default function TopMenu() {
  return (
    <header className={cn('bg-white shadow-sm py-4')}>
      <div className={cn('container')}>
        <div className={cn('d-flex align-items-center justify-content-between')}>
          <Link
            href="/"
            className={cn(
              'text-decoration-none uppercase fg-primary d-flex align-items-center gap-2'
            )}
          >
            <ShieldCheck size={28} aria-hidden />
            Inventory
          </Link>
          <div className={cn('d-flex flex-column fs-sm')}>
            <Clock />
            <SocketCounter url={env.SOCKET_URL} />
          </div>
        </div>
      </div>
    </header>
  );
}
