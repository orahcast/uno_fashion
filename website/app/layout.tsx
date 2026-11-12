import type { Metadata } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import WhatsAppFloat from '@/components/storefront/WhatsAppFloat';

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://unofashion.rw'),
  title: {
    default: 'UNO FASHION AGENCY | Tailoring With Quiet Authority · Kigali Rentals',
    template: '%s | UNO FASHION AGENCY',
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
    url: 'https://unofashion.rw',
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen font-sans-luxury text-[#191C1A] antialiased bg-[#FAF8F5] selection:bg-[#14100E] selection:text-[#FAF8F5] flex flex-col">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
