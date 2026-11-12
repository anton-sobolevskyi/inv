import { createYoga } from 'graphql-yoga';
import { schema } from './config/shema';

interface NextContext {
  params: Promise<Record<string, string>>;
}

const { handleRequest } = createYoga<NextContext>({
  schema,
  graphqlEndpoint: '/api/graphql',
  graphiql: process.env.NODE_ENV === 'development',
});

export { handleRequest as GET, handleRequest as POST, handleRequest as OPTIONS };
