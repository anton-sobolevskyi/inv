import type { GraphQLSchema } from 'graphql';
import { createSchema } from 'graphql-yoga';

import { resolvers } from './resolvers';
import { typeDefs } from './typeDefs';

// Typed as a plain GraphQLSchema: the per-request context is provided in the route handler.
export const schema: GraphQLSchema = createSchema({ typeDefs, resolvers });
