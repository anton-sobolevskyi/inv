import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { withSerwist } from '@serwist/turbopack';

const nextConfig: NextConfig = {
  reactCompiler: true,
  sassOptions: {
    silenceDeprecations: ['import'],
    quietDeps: true,
    implementation: 'sass-embedded',
  },
};

const withNextIntl = createNextIntlPlugin();

export default withSerwist(withNextIntl(nextConfig));
