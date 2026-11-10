'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function SocketCounter({ url }: { url: string }) {
  const [sessions, setSessions] = useState(0);
  const t = useTranslations('SocketCounter');

  useEffect(() => {
    const socket = io(url);
    socket.on('sessions', setSessions);
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <span>
      {t('title')}: {sessions}
    </span>
  );
}
