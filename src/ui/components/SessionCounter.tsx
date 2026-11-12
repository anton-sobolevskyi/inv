'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { cn } from '@/utils/cn';
import { setSessions, useAppSelector } from '@/lib/store';

export default function SessionCounter({ url }: { url: string }) {
  const t = useTranslations('SessionCounter');
  const sessions = useAppSelector((s) => s.realtime.sessions);
  const connected = useAppSelector((s) => s.realtime.connected);

  useEffect(() => {
    const socket = io(url);
    socket.on('sessions', setSessions);
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <span className={cn('badge bg-primary')}>
      {t('title')}: {connected ? sessions : '—'}
    </span>
  );
}
