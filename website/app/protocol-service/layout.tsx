import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wedding Protocol & Ceremony Services',
  description:
    'Premier wedding protocol management, bridal party wardrobe synchronization, and day-of ceremonial coordination in Kigali, Rwanda by Uno Fashion Agency.',
  alternates: {
    canonical: 'https://www.unofashionagency.com/protocol-service',
  },
  openGraph: {
    title: 'Wedding Protocol & Ceremony Services | UNO FASHION AGENCY',
    description:
      'Premier wedding protocol management, bridal party wardrobe synchronization, and day-of ceremonial coordination in Kigali, Rwanda.',
    url: 'https://www.unofashionagency.com/protocol-service',
    siteName: 'Uno Fashion Agency',
    locale: 'en_RW',
    type: 'website',
  },
};

export default function ProtocolServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
