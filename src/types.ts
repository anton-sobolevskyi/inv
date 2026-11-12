export type Locale = 'en' | 'uk';

export interface SessionUser {
  id: number;
  email: string;
  displayName: string;
}

export type ServerError = 'invalidCredentials' | 'invalidInput' | 'network';

export interface GqlRequest {
  document: string;
  variables?: Record<string, unknown>;
}
export interface GqlError {
  message: string;
  code?: string;
  status?: number;
}

export interface GqlResponse {
  data?: unknown;
  errors?: { message: string; extensions?: { code?: string } }[];
}

export type Currency = 'USD' | 'UAH';

export interface Money {
  symbol: Currency;
  value: number;
}

export interface OrderListItem {
  id: string;
  title: string;
  date: string;
  productsCount: number;
  totals: Money[];
}

export interface OrdersPage {
  orders: OrderListItem[];
  ordersCount: number;
}

export interface OrdersArgs {
  search?: string;
  page: number;
  pageSize: number;
}

export interface GuaranteeDTO {
  start: string | null;
  end: string | null;
}

export interface PriceDTO extends Money {
  isDefault: boolean;
}

export interface ProductItem {
  id: string;
  title: string;
  serialNumber: string;
  photo: string | null;
  isNew: boolean;
  type: string;
  specification: string | null;
  date: string;
  guarantee: GuaranteeDTO | null;
  prices: PriceDTO[];
  order: { id: string; title: string } | null;
}

export interface ProductsArgs {
  type?: string | null;
  search?: string;
  page: number;
  pageSize: number;
}

export interface OrderDetails {
  id: string;
  title: string;
  products: ProductItem[];
}

export interface ProductsPage {
  products: ProductItem[];
  productsCount: number;
  productTypes: string[];
}
