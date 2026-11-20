import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import WhatsAppFloat from '@/components/storefront/WhatsAppFloat';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.unofashionagency.com'),
  title: {
    default: 'UNO FASHION AGENCY | Tailoring With Quiet Authority · Kigali Rentals',
    template: '%s | UNO FASHION AGENCY',
  },
  alternates: {
    canonical: 'https://www.unofashionagency.com',
  },
  description:
    'Uno Fashion Agency — Bespoke suit rentals, tuxedos, and wedding protocol services in Kigali, Rwanda. Book online, try on at our atelier, and make an indelible impression.',
  keywords: [
    'Suit rental Kigali',
    'Tuxedo rental Rwanda',
    'Uno Fashion Agency',
    'Wedding protocol Kigali',
    'Bridal party wardrobe Kigali',
    'Luxury suiting Rwanda',
    'Tailored tuxedos Kigali',
  ],
  authors: [{ name: 'Uno Fashion Agency Ltd' }],
  creator: 'Uno Fashion Agency Ltd',
  openGraph: {
    type: 'website',
    locale: 'en_RW',
    url: 'https://www.unofashionagency.com',
    siteName: 'Uno Fashion Agency',
    title: 'UNO FASHION AGENCY | Tailoring With Quiet Authority · Kigali Rentals',
    description:
      'Bespoke suit rentals, tuxedos, and wedding protocol services in Kigali, Rwanda. Exceptional tailoring for distinguished events.',
    images: [
      {
        url: '/images/landing-page-3.jpeg',
        width: 1200,
        height: 630,
        alt: 'Uno Fashion Agency - Kigali Atelier Suiting and Protocol',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UNO FASHION AGENCY | Tailoring With Quiet Authority · Kigali Rentals',
    description:
      'Bespoke suit rentals, tuxedos, and wedding protocol services in Kigali, Rwanda.',
    images: ['/images/landing-page-3.jpeg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
      { url: '/icons/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icons/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://www.unofashionagency.com/#website',
      url: 'https://www.unofashionagency.com',
      name: 'Uno Fashion Agency',
      description:
        'Bespoke suit rentals, tuxedos, and wedding protocol services in Kigali, Rwanda.',
      publisher: {
        '@id': 'https://www.unofashionagency.com/#organization',
      },
    },
    {
      '@type': 'ClothingStore',
      '@id': 'https://www.unofashionagency.com/#organization',
      name: 'Uno Fashion Agency Ltd',
      url: 'https://www.unofashionagency.com',
      logo: 'https://www.unofashionagency.com/icons/icon-512.png',
      image: 'https://oyauupqqhprwynkqyuzr.supabase.co/storage/v1/object/public/inventory-photos/hero-1795165499923.jpg',
      description:
        'Uno Fashion Agency — Bespoke suit rentals, tuxedos, and wedding protocol services in Kigali, Rwanda.',
      telephone: '+250783036628',
      email: 'unofashionagencyltd@gmail.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'KN 74 St Kigali, Nyarugenge market',
        addressLocality: 'Kigali',
        addressCountry: 'RW',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -1.9536,
        longitude: 30.0605,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
          opens: '08:00',
          closes: '20:00',
        },
      ],
      sameAs: [
        'https://www.instagram.com/uno_fashion_agency_ltd',
        'https://www.tiktok.com/@unofashionagency',
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen font-sans-luxury text-[#191C1A] antialiased bg-[#FAF8F5] selection:bg-[#14100E] selection:text-[#FAF8F5] flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
