import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Uno Fashion Agency - Atelier Manager & Rentals',
    short_name: 'Uno Fashion',
    description: 'Bespoke Luxury Rental & Inventory Management Atelier in Kigali',
    start_url: '/',
    display: 'standalone',
    background_color: '#14100E',
    theme_color: '#14100E',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
