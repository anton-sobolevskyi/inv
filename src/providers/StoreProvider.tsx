'use client';

import { useState, type ReactNode } from 'react';
import { Provider } from 'react-redux';

import { makeStore, AppStore } from '@/lib/store';
import { SessionUser } from '@/types';

export default function StoreProvider({
  children,
  user,
}: {
  children: ReactNode;
  user: SessionUser | null;
}) {
  const [store] = useState<AppStore>(() =>
    makeStore({ user, status: user ? 'authenticated' : 'guest' })
  );

  return <Provider store={store}>{children}</Provider>;
}
