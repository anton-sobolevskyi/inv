import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { withSerwist } from '@serwist/turbopack';

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
