import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

import SessionCounter from '@/ui/components/SessionCounter';
import LanguageSwitcher from '@/ui/components/LanguageSwitcher';
import Clock from '@/ui/components/Clock';
import SearchBox from '@/ui/components/SearchBox';

import { env } from '@/env';

export default function TopMenu() {
  return (
    <header className="d-flex align-items-center gap-4 h-100 px-5 bg-body shadow-sm">
      <Link
        href="/"
        className="d-inline-flex align-items-center gap-3 fw-bold text-uppercase text-decoration-none text-primary"
      >
        <ShieldCheck size={28} />
        <span>Inventory</span>
      </Link>
      <SearchBox />
      <div className="d-flex align-items-center gap-4 ms-auto">
        <LanguageSwitcher />
        <Clock />
        <SessionCounter url={env.SOCKET_URL} />
      </div>
    </header>
  );
}
