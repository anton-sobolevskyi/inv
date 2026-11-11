'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { cn } from '@/utils/cn';

export default function SessionCounter({ url }: { url: string }) {
  const [sessions, setSessions] = useState(0);
  const t = useTranslations('SessionCounter');

  useEffect(() => {
    const socket = io(url);
    socket.on('sessions', setSessions);
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <span className={cn('badge bg-primary')}>
      {t('title')}: {sessions}
    </span>
  );
}
