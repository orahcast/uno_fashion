import Hero from '@/components/storefront/Hero';
import PopularCollection from '@/components/storefront/PopularCollection';
import HowItWorks from '@/components/storefront/HowItWorks';
import WeddingServices from '@/components/storefront/WeddingServices';
import CelebrityAccolades from '@/components/storefront/CelebrityAccolades';
import BookFittingSection from '@/components/storefront/BookFittingSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <PopularCollection />
      <CelebrityAccolades />
      <WeddingServices />
      <HowItWorks />
      <BookFittingSection />
    </>
  );
}
