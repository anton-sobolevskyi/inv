import { SessionUser } from '@/types';

import { createLoaders, type Loaders } from './loaders';

export interface GraphQLContext {
  user: SessionUser | null;
  loaders: Loaders;
}

export const createContext = (user: SessionUser | null): GraphQLContext => ({
  user,
  loaders: createLoaders(),
});
