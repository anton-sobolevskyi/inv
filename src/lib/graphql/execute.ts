import 'server-only';

import { graphql } from 'graphql';

import { SessionUser } from '@/types';
import { schema } from './shema';
import { createContext } from './context';

export async function runQuery<T>(
  source: string,
  variables: Record<string, unknown>,
  user: SessionUser | null
): Promise<T | null> {
  const result = await graphql({
    schema,
    source,
    variableValues: variables,
    contextValue: createContext(user),
  });

  if (result.errors?.length) {
    console.error('[graphql:ssr]', result.errors.map((e) => e.message).join('; '));
    return null;
  }

  return result.data ? (JSON.parse(JSON.stringify(result.data)) as T) : null;
}
