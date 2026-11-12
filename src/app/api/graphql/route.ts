import { createYoga } from 'graphql-yoga';

import { schema } from '@/lib/graphql/shema';
import { createContext } from '@/lib/graphql/context';
import { getSessionUser } from '@/utils/session';

interface NextContext {
  params: Promise<Record<string, string>>;
}

const { handleRequest } = createYoga<NextContext>({
  schema,
  graphqlEndpoint: '/api/graphql',
  graphiql: process.env.NODE_ENV === 'development',
  context: async () => {
    const user = await getSessionUser();
    return createContext(user);
  },
});

export { handleRequest as GET, handleRequest as POST, handleRequest as OPTIONS };
