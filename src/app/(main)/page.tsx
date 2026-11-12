import { getTranslations } from 'next-intl/server';

import DashboardView from '@/features/dashboard/DashboardView';

export async function generateMetadata() {
  return { title: (await getTranslations('Dashboard'))('title') };
}

export default function DashboardRoute() {
  return <DashboardView />;
}
