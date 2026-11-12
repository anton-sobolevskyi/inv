'use client';

import { useEffect } from 'react';
import { io } from 'socket.io-client';

import { setConnected, setSessions, useAppDispatch, useAppStore } from '@/lib/store';

export default function RealtimeBridge({ url }: { url: string }) {
  const dispatch = useAppDispatch();
  const store = useAppStore();

  useEffect(() => {
    if (!url) return;
    const socket = io(url, { transports: ['websocket', 'polling'] });

    socket.on('connect', () => dispatch(setConnected(true)));
    socket.on('disconnect', () => dispatch(setConnected(false)));
    socket.on('sessions', (count: number) => dispatch(setSessions(count)));

    return () => {
      socket.disconnect();
    };
  }, [url, dispatch, store]);

  return null;
}
