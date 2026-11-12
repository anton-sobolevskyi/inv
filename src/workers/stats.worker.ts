/// <reference lib="webworker" />
import { computeStats } from '@/stats';
import { DashboardOrder } from '@/types';

// The project's tsconfig loads both the DOM and the WebWorker libs, so `self` is typed as Window.
const worker = self as unknown as DedicatedWorkerGlobalScope;

worker.onmessage = (event: MessageEvent<{ orders: DashboardOrder[]; productsCount: number }>) => {
  const { orders, productsCount } = event.data;
  worker.postMessage(computeStats(orders, productsCount));
};
