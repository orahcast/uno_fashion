'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { RentalItem } from '@/lib/types';
import { formatRWF } from '@/lib/utils';

interface PopularCollectionProps {
  items?: RentalItem[];
}

export default function PopularCollection({}: PopularCollectionProps) {
  // 10 Curated Tailored Suits ordered exactly like the reference catalog
  const popularSuits = [
    {
      id: 'suit-1',
      slug: 'asymmetry-tuxedo',
      name: 'Asymmetry Tuxedo',
      rentalPrice: 45000,
      badge: 'Rental',
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'suit-2',
      slug: 'wide-lapel-striped-suit',
      name: 'Wide lapel striped Suit',
      rentalPrice: 40000,
      badge: 'Rental',
      image: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'suit-3',
      slug: 'the-urban-slate',
      name: 'The Urban Slate',
      rentalPrice: 42000,
      badge: 'Rental',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'suit-4',
      slug: 'the-sterling-windowpane',
      name: 'The Sterling Windowpane',
      rentalPrice: 45000,
      badge: 'Rental',
      image: 'https://images.unsplash.com/photo-1598808503746-f34c53b9323e?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'suit-5',
      slug: 'the-flared-tailor-suit',
      name: 'The Flared Tailor Suit',
      rentalPrice: 38000,
      badge: 'Rental',
      image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'suit-6',
      slug: 'sage-double-breasted-suit',
      name: 'Sage Double-Breasted Suit',
      rentalPrice: 40000,
      badge: 'Rental',
      image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'suit-7',
      slug: 'champagne-shawl-tuxedo',
      name: 'Champagne Shawl Tuxedo',
      rentalPrice: 48000,
      badge: 'Rental',
      image: 'https://images.unsplash.com/photo-1521341057461-6eb5f40b07ab?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'suit-8',
      slug: 'charcoal-peak-lapel-tuxedo',
      name: 'Charcoal Peak Lapel Tuxedo',
      rentalPrice: 42000,
      badge: 'Rental',
      image: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'suit-9',
      slug: 'classic-ivory-peak-tuxedo',
      name: 'Classic Ivory Peak Tuxedo',
      rentalPrice: 45000,
      badge: 'Rental',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'suit-10',
      slug: 'the-emerald-velvet-suit',
      name: 'The Emerald Velvet Suit',
      rentalPrice: 50000,
      badge: 'Rental',
      image: 'https://images.unsplash.com/photo-1555069519-127aadedf1ee?auto=format&fit=crop&q=80&w=800',
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-[#EAE5DC]">
          <div>
            <span className="text-[10px] uppercase tracking-[0.22em] font-semibold text-[#9E7B4F]">
              Popular Rentals
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-normal text-[#191C1A] mt-1">
              Popular suits and dresses.
            </h2>
          </div>

          <Link
            href="/collection"
            className="group mt-3 sm:mt-0 inline-flex items-center space-x-1.5 border border-[#191C1A] px-4 py-2 text-[11px] font-medium uppercase tracking-widest text-[#191C1A] hover:bg-[#191C1A] hover:text-[#FAF8F5] transition-all"
          >
            <span>See all collection</span>
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* 5-Column Grid with Exact Ordering and Structure from Reference */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-7">
          {popularSuits.map((suit) => (
            <div key={suit.id} className="group flex flex-col">
              {/* Studio Mannequin Image Container with Curved Edges */}
              <Link
                href={`/collection/${suit.slug}`}
                className="relative aspect-[3/4] w-full bg-[#EAE8E4] overflow-hidden block rounded-xl shadow-2xs hover:shadow-xs transition-shadow"
              >
                <Image
                  src={suit.image}
                  alt={suit.name}
                  fill
                  className="object-cover object-top group-hover:scale-104 transition-transform duration-500 ease-out"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />

                {/* Top-Right Pill Badge matching reference */}
                <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[9px] font-semibold text-[#191C1A] shadow-xs">
                  {suit.badge}
                </div>
              </Link>

              {/* Details Directly Below Image */}
              <div className="pt-2.5 flex flex-col space-y-1">
                {/* Suit Title */}
                <Link
                  href={`/collection/${suit.slug}`}
                  className="font-medium text-xs sm:text-[13px] text-[#191C1A] hover:text-[#9E7B4F] transition-colors leading-tight line-clamp-1"
                  title={suit.name}
                >
                  {suit.name}
                </Link>

                {/* Price Line + Small 'Choose' Button */}
                <div className="flex items-center justify-between pt-0.5">
                  <div>
                    <span className="font-semibold text-xs text-[#191C1A]">
                      {formatRWF(suit.rentalPrice)}/day
                    </span>
                  </div>

                  {/* Small "Choose" Button with matching curved edges */}
                  <Link
                    href={`/collection/${suit.slug}`}
                    className="inline-flex items-center justify-center px-3 py-1 bg-[#191C1A] hover:bg-[#9E7B4F] text-white text-[10px] font-medium uppercase tracking-wider rounded-full transition-colors shadow-2xs"
                  >
                    Choose
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reassurance text */}
        <p className="text-[11px] text-[#7B8079] mt-8 text-center sm:text-left">
          All rental suits include full 4-day reservation, complimentary private atelier fitting, and eco dry cleaning.
        </p>
      </div>
    </section>
  );
}
