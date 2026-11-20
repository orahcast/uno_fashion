import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bespoke Wedding & Event Decor Services | UNO FASHION AGENCY',
  description:
    'Luxury wedding stage design, grand tablescapes, ceremonial floral artistry, and atmospheric venue styling in Kigali, Rwanda by Uno Fashion Agency.',
  openGraph: {
    title: 'Bespoke Wedding & Event Decor Services | UNO FASHION AGENCY',
    description:
      'Transforming celebrations, weddings, and high-profile galas across Kigali with bespoke ceremonial decor, floral architecture, and luxury lighting.',
    url: 'https://www.unofashionagency.com/decor-services',
    siteName: 'Uno Fashion Agency',
    locale: 'en_RW',
    type: 'website',
    images: [
      {
        url: '/images/decor/decor-1.jpeg',
        width: 1200,
        height: 800,
        alt: 'Uno Fashion Agency Decor Services Kigali',
      },
    ],
  },
};

export default function DecorServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
