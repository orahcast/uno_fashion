import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Uno Fashion Agency - Bespoke Rentals & Protocol',
    short_name: 'Uno Fashion',
    description: 'Bespoke suit rentals, tuxedos, and wedding protocol services in Kigali, Rwanda',
    start_url: '/',
    display: 'standalone',
    background_color: '#161210',
    theme_color: '#161210',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
