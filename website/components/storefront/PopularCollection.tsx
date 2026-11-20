'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { RentalItem } from '@/lib/types';
import { INITIAL_ITEMS } from '@/lib/data/mock-catalog';
import { formatRWF } from '@/lib/utils';
import { formatUSD, DEFAULT_USD_RATE } from '@/lib/currency';
import RentItemModal, { RentModalSuit } from './RentItemModal';
import { createClient } from '@/lib/supabase/client';

interface PopularCollectionProps {
  items?: RentalItem[];
}

export default function PopularCollection({ items: initialPropItems }: PopularCollectionProps) {
  const router = useRouter();
  const [items, setItems] = useState<RentalItem[]>(initialPropItems || []);
  const [activeTab, setActiveTab] = useState<'all' | 'suits' | 'gowns'>('all');
  const [selectedSuit, setSelectedSuit] = useState<RentModalSuit | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number>(DEFAULT_USD_RATE);

  // Pre-load /collection route for instant 0ms navigation
  useEffect(() => {
    router.prefetch('/collection');
  }, [router]);

  // Fetch live items from the database/API & subscribe to real-time changes
  useEffect(() => {
    // Function to re-fetch items
    const reloadItems = () => {
      fetch('/api/items')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (Array.isArray(data)) {
            setItems(data);
            if (typeof window !== 'undefined') {
              try {
                localStorage.setItem('uno_inventory_items', JSON.stringify(data));
              } catch (e) {}
            }
          }
        })
        .catch(console.error);
    };

    // 1. Fetch catalog items immediately on mount
    reloadItems();

    // 2. Instant cross-tab sync via BroadcastChannel (0ms realtime from Admin)
    let bc: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        bc = new BroadcastChannel('uno_items_sync');
        bc.onmessage = (event) => {
          if (event.data?.action === 'upsert' && event.data.item) {
            const newItem = event.data.item;
            setItems((prev) => [newItem, ...prev.filter((i) => i.id !== newItem.id)]);
          } else if (event.data?.action === 'delete' && event.data.id) {
            setItems((prev) => prev.filter((i) => i.id !== event.data.id));
          } else {
            reloadItems();
          }
        };
      } catch (bcErr) {
        console.warn('BroadcastChannel error:', bcErr);
      }
    }

    // 3. Storage event listener (across browser windows)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'uno_items_updated_at' || e.key === 'uno_inventory_items') {
        reloadItems();
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorage);
      window.addEventListener('focus', reloadItems);
    }

    // 4. Supabase Realtime: instantly update collection when item is added/edited/deleted
    const supabase = createClient();
    const channel = supabase
      .channel('realtime:items_popular')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'items' },
        () => {
          reloadItems();
        }
      )
      .on('broadcast', { event: 'item_changed' }, (payload) => {
        if (payload?.payload) {
          const newItem = payload.payload;
          setItems((prev) => [newItem, ...prev.filter((i) => i.id !== newItem.id)]);
        } else {
          reloadItems();
        }
      })
      .subscribe();

    // Polling fallback every 8 seconds so other devices see additions without manual refresh
    const pollTimer = setInterval(reloadItems, 8000);

    // 5. Fetch USD currency exchange rate
    fetch('/api/currency')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.rate === 'number' && data.rate > 0) {
          setExchangeRate(data.rate);
        }
      })
      .catch((err) => console.error('Error fetching currency rate:', err));

    // Supabase Realtime: currency rate changes
    const currencyChannel = supabase
      .channel('realtime:currency_rate_popular')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_settings', filter: 'key=eq.usd_exchange_rate' },
        (payload: any) => {
          if (payload.new && payload.new.value) {
            const r = typeof payload.new.value === 'number' ? payload.new.value : payload.new.value.rate;
            if (typeof r === 'number' && r > 0) {
              setExchangeRate(r);
            }
          }
        }
      )
      .subscribe();

    return () => {
      if (bc) bc.close();
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorage);
        window.removeEventListener('focus', reloadItems);
      }
      clearInterval(pollTimer);
      supabase.removeChannel(channel);
      supabase.removeChannel(currencyChannel);
    };
  }, []);

  // Filter items based on active tab and limit to 8 items for the homepage showcase
  const displayItems = useMemo(() => {
    const filtered = items.filter((item) => {
      if (item.status === 'Archived' || item.isArchived) return false;
      if (activeTab === 'suits')
        return (
          item.categorySlug === 'suits' ||
          item.category === 'Suits' ||
          item.category === 'Tuxedo'
        );
      if (activeTab === 'gowns')
        return (
          item.categorySlug === 'gowns' ||
          item.category === 'Bridal gowns' ||
          item.category === 'Bridal Gowns'
        );
      return true;
    });
    return filtered.slice(0, 8);
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
              prefetch={true}
              onMouseEnter={() => router.prefetch('/collection')}
              className="group inline-flex items-center space-x-1.5 border border-[#191C1A] px-4 py-1.5 rounded-full text-[11px] font-medium uppercase tracking-widest text-[#191C1A] hover:bg-[#191C1A] hover:text-[#FAF8F5] transition-all"
            >
              <span>See all</span>
              <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Dynamic Items Grid */}
        {displayItems.length === 0 ? (
          <div className="py-12 text-center text-[#8C8075] border border-dashed border-[#EAE5DC] rounded-xl bg-white/50">
            <p className="text-sm font-medium text-[#191C1A]">New Collection Arriving Soon</p>
            <p className="text-xs text-[#8C8075] mt-1">Our atelier is currently curating the upcoming suiting and couture line.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-x-5 gap-y-8">
            {displayItems.map((item) => {
            const cardModalSuit: RentModalSuit = {
              id: item.id,
              name: item.name,
              rentalPrice: item.rentalPrice,
              image: item.images[0] || '/images/hero-men.jpg',
              sizes: (item.sizes && item.sizes.length > 0) ? item.sizes.join(' · ') : 'Tailored to measure',
              category: item.category,
            };

            return (
              <div key={item.id} className="group flex flex-col">
                {/* Image Container with Modal Trigger */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedSuit(cardModalSuit)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedSuit(cardModalSuit);
                    }
                  }}
                  className="relative aspect-[3/4] w-full bg-[#EAE8E4] overflow-hidden rounded-xl shadow-2xs hover:shadow-md transition-all group-hover:-translate-y-0.5 cursor-pointer touch-manipulation focus:outline-none focus:ring-2 focus:ring-[#9E7B4F]"
                >
                  <Image
                    src={item.images[0] || '/images/hero-men.jpg'}
                    alt={item.name}
                    fill
                    className="object-cover object-top group-hover:scale-104 transition-transform duration-500 ease-out"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />

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
                  <button
                    type="button"
                    onClick={() => setSelectedSuit(cardModalSuit)}
                    className="font-medium text-sm text-[#191C1A] hover:text-[#9E7B4F] transition-colors leading-tight line-clamp-1 text-left cursor-pointer"
                    title={item.name}
                  >
                    {item.name}
                  </button>

                  <div className="flex items-baseline justify-between pt-0.5">
                    <div>
                      <span className="font-semibold text-xs sm:text-sm text-[#191C1A]">
                        {formatRWF(item.rentalPrice)}
                        <span className="text-[10px] text-[#7B8079] font-normal ml-0.5">/ day</span>
                      </span>
                      <span className="text-[10px] text-[#8C8075] font-medium block">
                        ~${formatUSD(item.rentalPrice, exchangeRate)} USD
                      </span>
                    </div>

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
      )}

        {/* View All Button */}
        <div className="mt-10 sm:mt-12 flex justify-center">
          <Link
            href="/collection"
            prefetch={true}
            onMouseEnter={() => router.prefetch('/collection')}
            onTouchStart={() => router.prefetch('/collection')}
            className="group inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#191C1A] hover:bg-[#9E7B4F] text-[#FAF8F5] text-xs font-semibold uppercase tracking-widest transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 text-[#C4A47C] group-hover:translate-x-1 transition-transform" />
          </Link>
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
        exchangeRate={exchangeRate}
      />
    </section>
  );
}
