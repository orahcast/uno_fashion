import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';

export const metadata: Metadata = {
  title: 'UNO FASHION AGENCY | Tailoring With Quiet Authority · Kigali Rentals',
  description:
    'Uno Fashion Agency — Bespoke suit rentals, tuxedos, and bridal couture in Kigali, Rwanda. Book online, try on at our atelier, and return after your event.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen font-sans-luxury text-[#191C1A] antialiased bg-[#FAF8F5] selection:bg-[#14100E] selection:text-[#FAF8F5] flex flex-col">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
