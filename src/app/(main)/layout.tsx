import type { ReactNode } from 'react';

import MainLayout from '@/ui/layout/MainLayout';

export default async function MainGroupLayout({ children }: { children: ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}
