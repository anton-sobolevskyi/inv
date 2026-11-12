import { OrdersArgs, ProductsArgs } from '@/types';

export const ordersVariables = ({ search, page, pageSize }: OrdersArgs) => ({
  filter: search ? { search } : null,
  limit: pageSize,
  offset: page * pageSize,
});

export const productsVariables = ({ type, search, page, pageSize }: ProductsArgs) => ({
  filter: type || search ? { type: type || null, search: search || null } : null,
  limit: pageSize,
  offset: page * pageSize,
});
