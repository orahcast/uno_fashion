import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Suits & Tuxedos Rental Collection',
  description:
    'Explore the bespoke suit rental, tuxedo, and evening gown collection at Uno Fashion Agency in Kigali, Rwanda. Book your fitting or view available pieces online.',
  alternates: {
    canonical: 'https://www.unofashionagency.com/collection',
  },
  openGraph: {
    title: 'Suits & Tuxedos Rental Collection | UNO FASHION AGENCY',
    description:
      'Explore bespoke suit rentals, tuxedos, and evening wear at Uno Fashion Agency in Kigali, Rwanda.',
    url: 'https://www.unofashionagency.com/collection',
    siteName: 'Uno Fashion Agency',
    locale: 'en_RW',
    type: 'website',
  },
};

export default function CollectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
