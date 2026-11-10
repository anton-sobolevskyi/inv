import { createSchema, createYoga } from 'graphql-yoga';
import { readFileSync } from 'fs';
import { join } from 'path';
import { resolvers } from '@/graphql/resolvers';

const typeDefs = readFileSync(join(process.cwd(), 'src/graphql/schema.graphql'), 'utf-8');

interface NextContext {
  params: Promise<Record<string, string>>;
}

const { handleRequest } = createYoga<NextContext>({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  graphqlEndpoint: '/api/graphql',
  graphiql: process.env.NODE_ENV === 'development',
});

export { handleRequest as GET, handleRequest as POST, handleRequest as OPTIONS };
