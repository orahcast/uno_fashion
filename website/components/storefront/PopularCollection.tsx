'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { RentalItem } from '@/lib/types';
import { INITIAL_ITEMS } from '@/lib/data/mock-catalog';
import { formatRWF } from '@/lib/utils';
import RentItemModal, { RentModalSuit } from './RentItemModal';
import { createClient } from '@/lib/supabase/client';

interface PopularCollectionProps {
  items?: RentalItem[];
}

export default function PopularCollection({ items: initialPropItems }: PopularCollectionProps) {
  const [items, setItems] = useState<RentalItem[]>(initialPropItems || INITIAL_ITEMS);
  const [activeTab, setActiveTab] = useState<'all' | 'suits' | 'gowns'>('all');
  const [selectedSuit, setSelectedSuit] = useState<RentModalSuit | null>(null);

  // Fetch live items from the database/API & subscribe to real-time changes
  useEffect(() => {
    fetch('/api/items')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
        }
      })
      .catch((err) => console.error('Error loading popular collection:', err));

    // Supabase Realtime: instantly update collection when item is added/edited/deleted
    const supabase = createClient();
    const channel = supabase
      .channel('realtime:items_popular')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'items' },
        () => {
          fetch('/api/items')
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
              if (Array.isArray(data) && data.length > 0) {
                setItems(data);
              }
            })
            .catch(console.error);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filter items based on active tab
  const displayItems = useMemo(() => {
    return items.filter((item) => {
      if (item.status === 'Archived' || item.isArchived) return false;
      if (activeTab === 'suits') return item.categorySlug === 'suits' || item.category === 'Suits';
      if (activeTab === 'gowns') return item.categorySlug === 'gowns' || item.category === 'Bridal gowns';
      return true;
    });
  }, [items, activeTab]);

  return (
    <section className="py-12 sm:py-16 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-[#EAE5DC] gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.22em] font-semibold text-[#9E7B4F]">
              Popular Rentals
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-normal text-[#191C1A] mt-1">
              Popular suits and dresses.
            </h2>
          </div>

          {/* Category Tabs & See All Link */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-[#EFEAE2] p-1 rounded-full text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-[#191C1A] text-white shadow-xs'
                    : 'text-[#6B726A] hover:text-[#191C1A]'
                }`}
              >
                All Pieces
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('suits')}
                className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                  activeTab === 'suits'
                    ? 'bg-[#191C1A] text-white shadow-xs'
                    : 'text-[#6B726A] hover:text-[#191C1A]'
                }`}
              >
                Suits & Tuxedos
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('gowns')}
                className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                  activeTab === 'gowns'
                    ? 'bg-[#191C1A] text-white shadow-xs'
                    : 'text-[#6B726A] hover:text-[#191C1A]'
                }`}
              >
                Bridal Gowns & Dresses
              </button>
            </div>

            <Link
              href="/collection"
              className="group inline-flex items-center space-x-1.5 border border-[#191C1A] px-4 py-1.5 rounded-full text-[11px] font-medium uppercase tracking-widest text-[#191C1A] hover:bg-[#191C1A] hover:text-[#FAF8F5] transition-all"
            >
              <span>See all</span>
              <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Dynamic Items Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-x-5 gap-y-8">
          {displayItems.map((item) => {
            const cardModalSuit: RentModalSuit = {
              id: item.id,
              name: item.name,
              rentalPrice: item.rentalPrice,
              image: item.images[0] || '/images/hero-men.jpg',
              sizes: (item.sizes && item.sizes.length > 0) ? item.sizes.join(' · ') : 'Tailored to measure',
            };

            return (
              <div key={item.id} className="group flex flex-col">
                {/* Image Container with Link */}
                <div className="relative aspect-[3/4] w-full bg-[#EAE8E4] overflow-hidden rounded-xl shadow-2xs hover:shadow-md transition-all group-hover:-translate-y-0.5">
                  <Link href={`/collection/${item.slug}`} className="block w-full h-full">
                    <Image
                      src={item.images[0] || '/images/hero-men.jpg'}
                      alt={item.name}
                      fill
                      className="object-cover object-top group-hover:scale-104 transition-transform duration-500 ease-out"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </Link>

                  {/* Badge */}
                  <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[9px] font-semibold text-[#191C1A] shadow-xs pointer-events-none">
                    {item.badge || (item.categorySlug === 'gowns' ? 'Couture' : 'Rental')}
                  </div>

                  {item.category && (
                    <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded text-[9px] font-medium text-white pointer-events-none capitalize">
                      {item.category}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="pt-3 flex flex-col space-y-1">
                  <Link
                    href={`/collection/${item.slug}`}
                    className="font-medium text-sm text-[#191C1A] hover:text-[#9E7B4F] transition-colors leading-tight line-clamp-1"
                    title={item.name}
                  >
                    {item.name}
                  </Link>

                  <div className="flex items-baseline justify-between pt-0.5">
                    <span className="font-semibold text-xs sm:text-sm text-[#191C1A]">
                      {formatRWF(item.rentalPrice)}
                      <span className="text-[10px] text-[#7B8079] font-normal ml-0.5">/ day</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => setSelectedSuit(cardModalSuit)}
                      className="shrink-0 px-3.5 py-1 bg-[#191C1A] hover:bg-[#9E7B4F] text-white text-[10px] font-semibold uppercase tracking-wider rounded-full transition-all shadow-2xs cursor-pointer touch-manipulation active:scale-95"
                      aria-label={`Rent ${item.name}`}
                    >
                      Rent
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reassurance text */}
        <p className="text-[11px] text-[#7B8079] mt-8 text-center sm:text-left">
          All rental pieces include complimentary private atelier fitting, flexible daily rental options, and professional garment steaming.
        </p>
      </div>

      {/* Pop-up Rent Form Modal */}
      <RentItemModal
        suit={selectedSuit}
        onClose={() => setSelectedSuit(null)}
      />
    </section>
  );
}
