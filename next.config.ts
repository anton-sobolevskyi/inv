import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { spawnSync } from 'node:child_process';
import withSerwistInit from '@serwist/next';

const revision =
  spawnSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf-8' }).stdout ?? crypto.randomUUID();

const withSerwist = withSerwistInit({
  additionalPrecacheEntries: [{ url: '/~offline', revision }],
  // Note: This is only an example. If you use Pages Router,
  // use something else that works, such as "service-worker/index.ts".
  swSrc: 'src/sw.ts',
  swDest: 'public/sw.js',
});

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  sassOptions: {
    implementation: 'sass-embedded',
  },
};

const withNextIntl = createNextIntlPlugin();

export default withSerwist(withNextIntl(nextConfig));
