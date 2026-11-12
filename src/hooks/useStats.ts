import { useEffect, useState } from 'react';

import { computeStats, StatsResult } from '@/stats';
import { DashboardOrder } from '@/types';

interface State {
  stats: StatsResult | null;
  source: 'worker' | 'main' | null;
}

export function useStats(orders: DashboardOrder[] | undefined, productsCount = 0): State {
  const [state, setState] = useState<State>({ stats: null, source: null });

  useEffect(() => {
    if (!orders) return;
    let cancelled = false;
    const onMainThread = () => {
      if (!cancelled) setState({ stats: computeStats(orders, productsCount), source: 'main' });
    };

    if (typeof Worker === 'undefined') {
      queueMicrotask(onMainThread);
      return () => {
        cancelled = true;
      };
    }

    const worker = new Worker(new URL('../workers/stats.worker.ts', import.meta.url));
    worker.onmessage = (event: MessageEvent<StatsResult>) => {
      if (!cancelled) setState({ stats: event.data, source: 'worker' });
    };
    worker.onerror = onMainThread;
    worker.postMessage({ orders, productsCount });

    return () => {
      cancelled = true;
      worker.terminate();
    };
  }, [orders, productsCount]);

  return state;
}
