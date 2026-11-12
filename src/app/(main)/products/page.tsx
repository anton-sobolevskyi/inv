import { getTranslations } from 'next-intl/server';

import { runQuery } from '@/lib/graphql/execute';
import { ProductsPage } from '@/types';
import { PRODUCTS_QUERY } from '@/lib/graphql/queries';
import { productsVariables } from '@/utils/api';
import { getSessionUser } from '@/utils/session';
import Products from '@/features/products/Products';

export async function generateMetadata() {
  return { title: (await getTranslations('Products'))('title') };
}

export default async function ProductsRoute() {
  const initial = await runQuery<ProductsPage>(
    PRODUCTS_QUERY,
    productsVariables({ page: 0, pageSize: 10 }),
    await getSessionUser()
  );
  return <Products initial={initial} />;
}
