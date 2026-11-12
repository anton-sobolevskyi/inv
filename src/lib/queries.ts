/** GraphQL documents. Kept in one place so SSR (server) and RTK Query (client) share them. */
const PRODUCT_FIELDS = /* GraphQL */ `
  id
  title
  serialNumber
  photo
  isNew
  type
  specification
  date
  guarantee {
    start
    end
  }
  prices {
    symbol
    value
    isDefault
  }
  order {
    id
    title
  }
`;

export const ORDERS_QUERY = /* GraphQL */ `
  query Orders($filter: OrderFilter, $limit: Int, $offset: Int) {
    orders(filter: $filter, limit: $limit, offset: $offset) {
      id
      title
      date
      productsCount
      totals {
        symbol
        value
      }
    }
    ordersCount(filter: $filter)
  }
`;

export const ORDER_DETAILS_QUERY = /* GraphQL */ `
  query OrderDetails($id: ID!) {
    order(id: $id) {
      id
      title
      products {
        ${PRODUCT_FIELDS}
      }
    }
  }
`;

export const PRODUCTS_QUERY = /* GraphQL */ `
  query Products($filter: ProductFilter, $limit: Int, $offset: Int) {
    products(filter: $filter, limit: $limit, offset: $offset) {
      ${PRODUCT_FIELDS}
    }
    productsCount(filter: $filter)
    productTypes
  }
`;

export const DASHBOARD_QUERY = /* GraphQL */ `
  query Dashboard {
    orders(limit: 200) {
      id
      title
      date
      address
      latitude
      longitude
      productsCount
      totals {
        symbol
        value
      }
      products {
        id
        title
        type
      }
    }
    productsCount
  }
`;

export const DELETE_ORDER = /* GraphQL */ `
  mutation DeleteOrder($id: ID!) {
    deleteOrder(id: $id)
  }
`;
