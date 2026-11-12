// SDL lives in a TS module (not a .graphql file read through fs) so it is bundled together with
// the code and works in the Next.js standalone / Docker output without extra file tracing.
export const typeDefs = /* GraphQL */ `
  scalar DateTime

  enum Currency {
    USD
    UAH
  }

  type User {
    id: ID!
    email: String!
    displayName: String!
  }

  type Guarantee {
    id: ID!
    productId: ID!
    orderId: ID!
    start: DateTime
    end: DateTime
  }

  type Price {
    id: ID!
    value: Float!
    symbol: Currency!
    isDefault: Boolean!
  }

  type Money {
    value: Float!
    symbol: Currency!
  }

  type Product {
    id: ID!
    serialNumber: String!
    isNew: Boolean!
    photo: String
    title: String!
    type: String!
    specification: String
    date: DateTime!
    guarantee: Guarantee
    prices: [Price!]!
    defaultPrice: Price
    order: Order
  }

  type Order {
    id: ID!
    title: String!
    description: String
    address: String
    latitude: Float
    longitude: Float
    date: DateTime!
    products: [Product!]!
    guarantees: [Guarantee!]!
    productsCount: Int!
    totals: [Money!]!
  }

  input OrderFilter {
    search: String
  }

  input ProductFilter {
    type: String
    orderId: ID
    isNew: Boolean
    search: String
  }

  type Query {
    me: User
    orders(filter: OrderFilter, limit: Int = 50, offset: Int = 0): [Order!]!
    ordersCount(filter: OrderFilter): Int!
    order(id: ID!): Order
    products(filter: ProductFilter, limit: Int = 50, offset: Int = 0): [Product!]!
    productsCount(filter: ProductFilter): Int!
    product(id: ID!): Product
    productTypes: [String!]!
  }

  type Mutation {
    deleteOrder(id: ID!): Boolean!
  }
`;
