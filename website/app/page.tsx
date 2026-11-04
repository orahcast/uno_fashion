import Hero from '@/components/storefront/Hero';
import PopularCollection from '@/components/storefront/PopularCollection';
import HowItWorks from '@/components/storefront/HowItWorks';
import WeddingServices from '@/components/storefront/WeddingServices';
import BookFittingSection from '@/components/storefront/BookFittingSection';
import { INITIAL_ITEMS } from '@/lib/data/mock-catalog';

export default function HomePage() {
  return (
    <>
      <Hero />
      <PopularCollection items={INITIAL_ITEMS} />
      <HowItWorks />
      <WeddingServices />
      <BookFittingSection />
    </>
  );
}
