import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';

import MainLayout from '@/ui/layout/MainLayout';
import { getSessionUser } from '@/utils/session';

export default async function MainGroupLayout({ children }: { children: ReactNode }) {
  if (!(await getSessionUser())) {
    redirect('/login');
  }

  return <MainLayout>{children}</MainLayout>;
}
