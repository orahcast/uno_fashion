import Hero from '@/components/storefront/Hero';
import PopularCollection from '@/components/storefront/PopularCollection';
import HowItWorks from '@/components/storefront/HowItWorks';
import WeddingServices from '@/components/storefront/WeddingServices';
import CelebrityAccolades from '@/components/storefront/CelebrityAccolades';
import BookFittingSection from '@/components/storefront/BookFittingSection';
import { getHeroConfig, getStorefrontItems, getAccolades } from '@/lib/server/catalog';

export const revalidate = 60; // ISR cache revalidation every 60 seconds

export default async function HomePage() {
  const [heroConfig, items, accolades] = await Promise.all([
    Promise.resolve(getHeroConfig()),
    getStorefrontItems(),
    getAccolades(),
  ]);

  return (
    <>
      <Hero initialConfig={heroConfig} />
      <PopularCollection items={items} />
      <CelebrityAccolades initialAccolades={accolades} />
      <WeddingServices />
      <HowItWorks />
      <BookFittingSection />
    </>
  );
}
