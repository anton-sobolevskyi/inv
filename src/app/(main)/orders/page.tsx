import { getTranslations } from 'next-intl/server';

import OrdersView from '@/features/orders/OrdersView';
import { runQuery } from '@/lib/graphql/execute';
import { ORDERS_QUERY } from '@/lib/graphql/queries';
import { OrdersPage } from '@/types';
import { ordersVariables } from '@/utils/api';
import { getSessionUser } from '@/utils/session';

export async function generateMetadata() {
  return { title: (await getTranslations('Orders'))('title') };
}

export default async function OrdersRoute() {
  const initial = await runQuery<OrdersPage>(
    ORDERS_QUERY,
    ordersVariables({ page: 0, pageSize: 10 }),
    await getSessionUser()
  );
  return <OrdersView initial={initial} />;
}
