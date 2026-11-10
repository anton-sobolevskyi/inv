import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    orientation: 'any',
    display: 'standalone',
    dir: 'auto',
    lang: 'en-GB',
    name: 'Inventory',
    short_name: 'Inventory',
    start_url: '/',
    scope: '/',
    description: 'Inventory description',
    theme_color: '#8936FF',
    background_color: '#2EC6FE',
    icons: [
      { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
