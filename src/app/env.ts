import { loadEnvConfig } from '@next/env';

const { combinedEnv } = await loadEnvConfig(process.cwd());

type Env = {
  SOCKET_URL: string;
};

export const env: Env = {
  SOCKET_URL: combinedEnv.SOCKET_URL || '',
};
