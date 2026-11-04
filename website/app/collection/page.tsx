'use client';

import { useState, useMemo, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { Heart, SlidersHorizontal } from 'lucide-react';
import { INITIAL_ITEMS } from '@/lib/data/mock-catalog';
import { formatRWF } from '@/lib/utils';

export default function CollectionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const currentCategory = searchParams.get('category') || 'all';
  const [selectedDates, setSelectedDates] = useState<string>('');
  const [selectedSuitSize, setSelectedSuitSize] = useState<string | null>(null);
  const [selectedGownSize, setSelectedGownSize] = useState<string | null>(null);
  const [priceTier, setPriceTier] = useState<string | null>(null);
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

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

      // Suit size filter
      if (selectedSuitSize && item.categorySlug === 'suits') {
        if (!item.sizes.includes(selectedSuitSize)) return false;
      }

      // Gown size filter
      if (selectedGownSize && item.categorySlug === 'gowns') {
        if (!item.sizes.includes(selectedGownSize)) return false;
      }

      // Price Tier filter
      if (priceTier === 'under-150' && item.rentalPrice >= 150000) return false;
      if (priceTier === '150-250' && (item.rentalPrice < 150000 || item.rentalPrice > 250000)) return false;
      if (priceTier === '250-plus' && item.rentalPrice <= 250000) return false;

      // Availability filter
      if (onlyAvailable && item.readyStock <= 0) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.rentalPrice - b.rentalPrice;
      if (sortBy === 'price-high') return b.rentalPrice - a.rentalPrice;
      return 0;
    });
  }, [currentCategory, selectedSuitSize, selectedGownSize, priceTier, onlyAvailable, sortBy]);

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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E8E4DC] pb-6 mb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.22em] font-semibold text-[#9E7B4F]">
            Uno Fashion Catalog
          </span>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-normal text-[#191C1A] mt-1">
            Rent for your occasion.
          </h1>
          <p className="text-xs text-[#5C615A] mt-1">
            Filter by occasion dates, tailored sizes, and clear deposit amounts.
          </p>
        </div>
        <span className="text-[10px] tracking-widest uppercase text-[#82887F] mt-3 sm:mt-0 font-medium">
          KIGALI, RWANDA
        </span>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center space-x-6 border-b border-[#E8E4DC] mb-8 overflow-x-auto no-scrollbar">
        {categories.map((cat) => {
          const isActive = currentCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={`pb-2.5 text-xs font-medium transition-colors relative whitespace-nowrap ${
                isActive
                  ? 'text-[#191C1A] font-semibold'
                  : 'text-[#6B726A] hover:text-[#191C1A]'
              }`}
            >
              {cat.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#191C1A]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden flex items-center justify-between pb-4 mb-4 border-b border-[#E8E4DC]">
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="inline-flex items-center space-x-2 text-[11px] uppercase tracking-wider font-semibold text-[#191C1A] bg-white border border-[#D5CFCE] px-3.5 py-1.5 rounded-xs"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
        </button>
        <span className="text-xs text-[#6B726A]">{filteredItems.length} styles</span>
      </div>

      {/* Main Grid: Filters + Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Filters Sidebar */}
        <aside
          className={`lg:col-span-3 space-y-6 ${
            mobileFilterOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-widest font-semibold text-[#191C1A] flex items-center space-x-2">
              <SlidersHorizontal className="w-3 h-3" />
              <span>Filters</span>
            </span>
            {(selectedSuitSize || selectedGownSize || priceTier || onlyAvailable || selectedDates) && (
              <button
                onClick={() => {
                  setSelectedSuitSize(null);
                  setSelectedGownSize(null);
                  setPriceTier(null);
                  setOnlyAvailable(false);
                  setSelectedDates('');
                }}
                className="text-[11px] text-[#9E7B4F] hover:underline"
              >
                Reset all
              </button>
            )}
          </div>

          {/* Dates Filter */}
          <div className="space-y-1.5 border-b border-[#E8E4DC] pb-4">
            <label className="text-[11px] uppercase tracking-wider font-medium text-[#191C1A] block">
              Rental Dates
            </label>
            <input
              type="date"
              value={selectedDates}
              onChange={(e) => setSelectedDates(e.target.value)}
              className="w-full bg-white border border-[#D5CFCE] px-3 py-2 text-xs text-[#191C1A] focus:outline-none focus:border-[#191C1A]"
            />
            <p className="text-[10px] text-[#7B8079]">
              Select dates to see real-time availability.
            </p>
          </div>

          {/* Sizes Filter */}
          <div className="space-y-4 border-b border-[#E8E4DC] pb-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-medium text-[#191C1A] block mb-1.5">
                Size
              </span>
              <span className="text-[10px] text-[#7B8079] block mb-1.5">
                Suits · Chest size
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['36', '38', '40', '42', '44'].map((size) => (
                  <button
                    key={size}
                    onClick={() =>
                      setSelectedSuitSize(selectedSuitSize === size ? null : size)
                    }
                    className={`w-8 h-8 text-[11px] font-medium border transition-colors flex items-center justify-center rounded-xs ${
                      selectedSuitSize === size
                        ? 'bg-[#191C1A] text-white border-[#191C1A]'
                        : 'bg-white text-[#191C1A] border-[#D5CFCE] hover:border-[#191C1A]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] text-[#7B8079] block mb-1.5">
                Gowns · Dress size
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['6', '8', '10', '12', '14'].map((size) => (
                  <button
                    key={size}
                    onClick={() =>
                      setSelectedGownSize(selectedGownSize === size ? null : size)
                    }
                    className={`w-8 h-8 text-[11px] font-medium border transition-colors flex items-center justify-center rounded-xs ${
                      selectedGownSize === size
                        ? 'bg-[#191C1A] text-white border-[#191C1A]'
                        : 'bg-white text-[#191C1A] border-[#D5CFCE] hover:border-[#191C1A]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Price Filter */}
          <div className="space-y-2 border-b border-[#E8E4DC] pb-4">
            <span className="text-[11px] uppercase tracking-wider font-medium text-[#191C1A] block">
              Price Tier
            </span>
            <div className="space-y-1.5 text-xs text-[#4A4E48]">
              {[
                { label: 'Under 150,000 Frw', id: 'under-150' },
                { label: '150,000 – 250,000 Frw', id: '150-250' },
                { label: '250,000+ Frw', id: '250-plus' },
              ].map((tier) => (
                <label
                  key={tier.id}
                  className="flex items-center space-x-2 cursor-pointer hover:text-[#191C1A]"
                >
                  <input
                    type="radio"
                    name="priceTier"
                    checked={priceTier === tier.id}
                    onChange={() =>
                      setPriceTier(priceTier === tier.id ? null : tier.id)
                    }
                    className="w-3.5 h-3.5 text-[#191C1A] accent-[#191C1A]"
                  />
                  <span>{tier.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-wider font-medium text-[#191C1A] block">
              Stock Status
            </span>
            <label className="flex items-center space-x-2 text-xs text-[#4A4E48] cursor-pointer">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="w-3.5 h-3.5 text-[#191C1A] accent-[#191C1A]"
              />
              <span>Ready for pickup</span>
            </label>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="lg:col-span-9">
          <div className="hidden lg:flex items-center justify-between pb-4 mb-4 border-b border-[#E8E4DC]">
            <span className="text-xs text-[#6B726A] font-medium">
              {filteredItems.length} styles available
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

          {filteredItems.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-serif-luxury text-xl text-[#191C1A]">
                No items match your selected filter criteria.
              </p>
              <button
                onClick={() => {
                  setSelectedSuitSize(null);
                  setSelectedGownSize(null);
                  setPriceTier(null);
                  setOnlyAvailable(false);
                }}
                className="mt-3 text-xs uppercase tracking-wider text-[#9E7B4F] underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => {
                const isWishlisted = wishlist.includes(item.id);

                return (
                  <div key={item.id} className="group flex flex-col">
                    <Link
                      href={`/collection/${item.slug}`}
                      className="relative aspect-[3/4] max-h-[360px] w-full overflow-hidden bg-[#ECE8E1] mb-3 block rounded-xs"
                    >
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        className="object-cover object-top group-hover:scale-104 transition-transform duration-500 ease-out"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 30vw"
                      />

                      {item.badge && (
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-medium text-[#191C1A] shadow-xs">
                          {item.badge}
                        </div>
                      )}

                      <button
                        onClick={(e) => toggleWishlist(item.id, e)}
                        className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#191C1A] hover:bg-white transition-colors shadow-xs"
                        aria-label="Wishlist"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            isWishlisted ? 'fill-[#191C1A] text-[#191C1A]' : 'text-[#191C1A]'
                          }`}
                        />
                      </button>
                    </Link>

                    <div className="flex items-baseline justify-between">
                      <Link
                        href={`/collection/${item.slug}`}
                        className="font-serif-luxury text-lg text-[#191C1A] group-hover:text-[#9E7B4F] transition-colors"
                      >
                        {item.name}
                      </Link>
                      <span className="text-xs font-semibold text-[#191C1A]">
                        {formatRWF(item.rentalPrice)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#6B726A] mt-1">
                      <span>{item.color} · {item.fabric}</span>
                      <span>+ {formatRWF(item.refundableDeposit)} dep.</span>
                    </div>

                    <div className="flex items-center space-x-1.5 mt-2 text-[11px] text-[#2D5A38]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2D5A38]" />
                      <span>Available in sizes</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="pt-10 text-center border-t border-[#E8E4DC] mt-12 text-xs text-[#7B8079]">
            Viewing the full Uno Fashion Agency Kigali edit. Need a custom fitting? Contact the atelier.
          </div>
        </div>
      </div>
    </div>
  );
}
