import { createSchema, createYoga } from 'graphql-yoga';

interface NextContext {
  params: Promise<Record<string, string>>;
}

const { handleRequest } = createYoga<NextContext>({
  schema: createSchema({
    typeDefs: /* GraphQL */ `
      type Query {
        hello: String
        greetings: String
      }
    `,
    resolvers: {
      Query: {
        hello: () => 'Hello from Next.js + GraphQL Yoga!',
        greetings: () => 'This is the greetings field',
      },
    },
  }),

  // Important: tell Yoga the correct endpoint path
  graphqlEndpoint: '/api/graphql',

  // Enable GraphiQL playground in development
  graphiql: process.env.NODE_ENV === 'development',
});

export { handleRequest as GET, handleRequest as POST, handleRequest as OPTIONS };
