import { isAxiosError } from 'axios';
import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react';

import { http } from './http';
import { SERVER_ERRORS } from '@/constants';
import {
  GqlError,
  GqlRequest,
  GqlResponse,
  OrderDetails,
  OrdersArgs,
  OrdersPage,
  ProductsArgs,
  ProductsPage,
  ServerError,
  SessionUser,
} from '@/types';
import { ordersVariables, productsVariables } from '@/utils/api';
import { DELETE_ORDER, ORDER_DETAILS_QUERY, ORDERS_QUERY, PRODUCTS_QUERY } from './graphql/queries';

const TAGS = ['Orders', 'Order', 'Products'] as const;

export async function login(data: { email: string; password: string }): Promise<SessionUser> {
  try {
    const {
      data: { user },
    } = await http.post<{ user: SessionUser }>('/api/auth/login', data);

    return user;
  } catch (error) {
    const code = isAxiosError(error) ? (error.response?.data?.error as ServerError) : undefined;
    throw code && SERVER_ERRORS.includes(code) ? code : 'network';
  }
}

export async function logout(): Promise<void> {
  try {
    await http.post('/api/auth/logout');
  } catch (error) {
    const code = isAxiosError(error) ? (error.response?.data?.error as ServerError) : undefined;
    throw code && SERVER_ERRORS.includes(code) ? code : 'network';
  }
}

function toResult(body: GqlResponse) {
  const first = body.errors?.[0];
  if (first) {
    const failure: GqlError = { message: first.message, code: first.extensions?.code };
    redirectIfUnauthenticated(failure);
    return { error: failure };
  }
  return { data: body.data };
}

function redirectIfUnauthenticated(error: GqlError) {
  if (typeof window === 'undefined') return;
  if (error.code === 'UNAUTHENTICATED' || error.status === 401) {
    if (window.location.pathname !== '/login') {
      const next = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.assign(`/login?next=${next}`);
    }
  }
}

export const graphqlBaseQuery =
  (): BaseQueryFn<GqlRequest, unknown, GqlError> =>
  async ({ document, variables }) => {
    try {
      const { data } = await http.post<GqlResponse>('/api/graphql', { query: document, variables });
      return toResult(data);
    } catch (error) {
      if (isAxiosError(error)) {
        const body = error.response?.data as GqlResponse | undefined;
        const first = body?.errors?.[0];
        const failure: GqlError = {
          message: first?.message ?? error.message,
          code: first?.extensions?.code,
          status: error.response?.status,
        };
        redirectIfUnauthenticated(failure);
        return { error: failure };
      }
      return { error: { message: (error as Error).message } };
    }
  };

export const api = createApi({
  reducerPath: 'api',
  baseQuery: graphqlBaseQuery(),
  tagTypes: [...TAGS],
  endpoints: (build) => ({
    getOrders: build.query<OrdersPage, OrdersArgs>({
      query: (args) => ({ document: ORDERS_QUERY, variables: ordersVariables(args) }),
      transformResponse: (data: OrdersPage) => data,
      providesTags: ['Orders'],
    }),

    getOrderDetails: build.query<OrderDetails | null, string>({
      query: (id) => ({ document: ORDER_DETAILS_QUERY, variables: { id } }),
      transformResponse: (data: { order: OrderDetails | null }) => data.order,
      providesTags: (_r, _e, id) => [{ type: 'Order', id }],
    }),

    getProducts: build.query<ProductsPage, ProductsArgs>({
      query: (args) => ({ document: PRODUCTS_QUERY, variables: productsVariables(args) }),
      transformResponse: (data: ProductsPage) => data,
      providesTags: ['Products'],
    }),

    deleteOrder: build.mutation<boolean, string>({
      query: (id) => ({ document: DELETE_ORDER, variables: { id } }),
      transformResponse: (data: { deleteOrder: boolean }) => data.deleteOrder,
      invalidatesTags: ['Orders', 'Order', 'Products'],
    }),
  }),
});
