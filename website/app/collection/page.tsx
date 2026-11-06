'use client';

import { useState, useMemo, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { INITIAL_ITEMS } from '@/lib/data/mock-catalog';
import { formatRWF } from '@/lib/utils';
import RentItemModal, { RentModalSuit } from '@/components/storefront/RentItemModal';

export default function CollectionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const currentCategory = searchParams.get('category') || 'all';
  const [sortBy, setSortBy] = useState<string>('featured');
  const [selectedSuit, setSelectedSuit] = useState<RentModalSuit | null>(null);

  const handleCategoryChange = (category: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (category === 'all') {
        params.delete('category');
      } else {
        params.set('category', category);
      }
      router.push(`/collection?${params.toString()}`);
    });
  };

  const filteredItems = useMemo(() => {
    return INITIAL_ITEMS.filter((item) => {
      // Category filter
      if (currentCategory !== 'all') {
        if (currentCategory === 'suits' && item.categorySlug !== 'suits') return false;
        if (currentCategory === 'gowns' && item.categorySlug !== 'gowns') return false;
        if (currentCategory === 'veils' && item.categorySlug !== 'veils') return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.rentalPrice - b.rentalPrice;
      if (sortBy === 'price-high') return b.rentalPrice - a.rentalPrice;
      return 0;
    });
  }, [currentCategory, sortBy]);

  const categories = [
    { label: 'All Pieces', value: 'all' },
    { label: 'Tailored Suits', value: 'suits' },
    { label: 'Bridal Gowns', value: 'gowns' },
    { label: 'Accessories & Veils', value: 'veils' },
  ];

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-[11px] text-[#82887F] mb-4">
        <Link href="/" className="hover:text-[#191C1A]">
          Home
        </Link>
        <span>/</span>
        <span className="text-[#191C1A] font-medium">Rentals</span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E8E4DC] pb-6 mb-6 gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.22em] font-semibold text-[#9E7B4F] block">
            Uno Fashion Atelier
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#191C1A] mt-1">
            Rental Collection
          </h1>
          <p className="text-xs sm:text-sm text-[#6B726A] mt-1 font-light">
            Luxury tailored suits, evening tuxedos, and bridal couture available for rent in Kigali.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors cursor-pointer ${
                currentCategory === cat.value
                  ? 'bg-[#191C1A] text-white'
                  : 'bg-[#F2EFE9] text-[#6B726A] hover:bg-[#EAE4D9] hover:text-[#191C1A]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top Filter Bar: Count & Sort */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E8E4DC]">
        <span className="text-xs text-[#6B726A] font-medium">
          Showing {filteredItems.length} curated styles
        </span>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-[#6B726A]">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent font-medium text-[#191C1A] focus:outline-none cursor-pointer"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product Grid - Full Width 5-Column Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-16 text-center">
          <p className="font-serif-luxury text-xl text-[#191C1A]">
            No items in this category currently.
          </p>
          <button
            onClick={() => handleCategoryChange('all')}
            className="mt-3 text-xs uppercase tracking-wider text-[#9E7B4F] underline font-medium cursor-pointer"
          >
            View all collection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-7">
          {filteredItems.map((item) => {
            const dailyRate = Math.round(item.rentalPrice / (item.rentalPeriodDays || 4));

            return (
              <div key={item.id} className="group flex flex-col">
                {/* Studio Mannequin Image Container with Curved Edges */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() =>
                    setSelectedSuit({
                      id: item.id,
                      name: item.name,
                      rentalPrice: dailyRate,
                      image: item.images[0],
                      sizes: `SIZE ${item.sizes.join('—')}`,
                    })
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedSuit({
                        id: item.id,
                        name: item.name,
                        rentalPrice: dailyRate,
                        image: item.images[0],
                        sizes: `SIZE ${item.sizes.join('—')}`,
                      });
                    }
                  }}
                  className="relative aspect-[3/4] w-full bg-[#EAE8E4] overflow-hidden block rounded-xl shadow-2xs hover:shadow-xs transition-shadow cursor-pointer touch-manipulation focus:outline-none focus:ring-2 focus:ring-[#9E7B4F]"
                >
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    fill
                    className="object-cover object-top group-hover:scale-104 transition-transform duration-500 ease-out"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />

                  {/* Top-Right Pill Badge matching reference */}
                  <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[9px] font-semibold text-[#191C1A] shadow-xs pointer-events-none">
                    {item.badge || 'Rental'}
                  </div>
                </div>

                {/* Details Directly Below Image */}
                <div className="pt-2.5 flex flex-col space-y-1">
                  {/* Item Title */}
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedSuit({
                        id: item.id,
                        name: item.name,
                        rentalPrice: dailyRate,
                        image: item.images[0],
                        sizes: `SIZE ${item.sizes.join('—')}`,
                      })
                    }
                    className="font-medium text-xs sm:text-[13px] text-[#191C1A] hover:text-[#9E7B4F] active:text-[#9E7B4F] transition-colors leading-tight line-clamp-1 text-left cursor-pointer touch-manipulation"
                    title={item.name}
                  >
                    {item.name}
                  </button>

                  {/* Price Line + Touch-Optimized 'Choose' Button */}
                  <div className="flex items-center justify-between gap-1.5 pt-0.5">
                    <div className="min-w-0">
                      <span className="font-semibold text-xs text-[#191C1A] truncate block">
                        {formatRWF(dailyRate)}/day
                      </span>
                    </div>

                    {/* Touch-Friendly "Choose" Button - Opens Pop-up Modal */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSuit({
                          id: item.id,
                          name: item.name,
                          rentalPrice: dailyRate,
                          image: item.images[0],
                          sizes: `SIZE ${item.sizes.join('—')}`,
                        });
                      }}
                      className="shrink-0 min-h-[34px] px-3.5 py-1.5 bg-[#191C1A] hover:bg-[#9E7B4F] active:bg-[#9E7B4F] text-white text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider rounded-full transition-all shadow-2xs cursor-pointer touch-manipulation active:scale-95 flex items-center justify-center"
                      aria-label={`Choose ${item.name}`}
                    >
                      Choose
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="pt-10 text-center border-t border-[#E8E4DC] mt-12 text-xs text-[#7B8079]">
        Viewing the full Uno Fashion Agency Kigali edit. Need a custom fitting? Contact the atelier.
      </div>

      {/* Pop-up Form Modal */}
      <RentItemModal
        suit={selectedSuit}
        onClose={() => setSelectedSuit(null)}
      />
    </div>
  );
}
