'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Award, Star, Sparkles, CheckCircle2 } from 'lucide-react';
import { INITIAL_ACCOLADES } from '@/lib/data/mock-catalog';
import { AccoladeItem } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

export default function CelebrityAccolades() {
  const [accolades, setAccolades] = useState<AccoladeItem[]>(INITIAL_ACCOLADES);

  useEffect(() => {
    // 1. Fetch live from server API
    fetch('/api/accolades')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAccolades(data);
        }
      })
      .catch(() => {
        // Fallback to localStorage if offline/custom
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('uno_accolades');
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setAccolades(parsed);
              }
            } catch (e) {
              console.error('Failed to parse localStorage accolades', e);
            }
          }
        }
      });
    // 2. Supabase Realtime: instantly update VIP accolades when admin edits
    const supabase = createClient();
    const channel = supabase
      .channel('realtime:accolades')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'accolades' },
        () => {
          fetch('/api/accolades')
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
              if (Array.isArray(data) && data.length > 0) {
                setAccolades(data);
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

  // Double the list for seamless continuous infinite marquee
  const displayItems = [...accolades, ...accolades];

  return (
    <section className="py-12 sm:py-16 bg-[#FAF8F5] border-t border-[#E8E4DC] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EAE4D9] text-[#7A5B30] text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-2">
          <Award className="w-3 h-3" />
          Hall of Distinction
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif-luxury font-medium text-[#191C1A]">
          Celebrity Looks & Certifications
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[#6B726A] max-w-lg mx-auto font-sans-luxury">
          Red carpet moments, VIP events, and master tailoring credentials styled by our CEO.
        </p>
      </div>

      {/* Infinite Scrolling Marquee */}
      <div className="relative w-full overflow-hidden">
        {/* Soft edge blur gradients */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#FAF8F5] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#FAF8F5] to-transparent z-10" />

        <div className="animate-marquee flex gap-4 py-2">
          {displayItems.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="relative w-48 sm:w-52 h-[260px] sm:h-[285px] shrink-0 rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 group border border-[#E8E4DC] bg-[#14100E]"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 192px, 208px"
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out brightness-90 group-hover:brightness-95"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

              {/* Top Category Badge */}
              <div className="absolute top-2.5 left-2.5 z-10">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold tracking-wide bg-black/65 backdrop-blur-xs text-[#D5B895] border border-[#C4A47C]/40 shadow-xs">
                  {item.category === 'Celebrity' && <Star className="w-2.5 h-2.5 text-[#D5B895] fill-current" />}
                  {item.category === 'Certification' && <CheckCircle2 className="w-2.5 h-2.5 text-[#D5B895]" />}
                  {item.category === 'Award' && <Award className="w-2.5 h-2.5 text-[#D5B895]" />}
                  {item.category === 'Press' && <Sparkles className="w-2.5 h-2.5 text-[#D5B895]" />}
                  {item.badge || item.category}
                </span>
              </div>

              {/* Year Chip */}
              <div className="absolute top-2.5 right-2.5 z-10">
                <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-medium bg-white/20 backdrop-blur-xs text-white border border-white/20">
                  {item.year}
                </span>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-0 inset-x-0 p-3 sm:p-3.5 text-white z-10">
                {item.featuredPerson && (
                  <p className="text-[10px] uppercase tracking-wider text-[#C4A47C] font-semibold mb-0.5 line-clamp-1">
                    {item.featuredPerson}
                  </p>
                )}
                <h3 className="text-xs sm:text-[13px] font-medium leading-snug text-white group-hover:text-[#F3E7D3] transition-colors line-clamp-2">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subtle indicator hint */}
      <div className="mt-6 text-center">
        <p className="text-[11px] text-[#8A9089] tracking-wide">
          Hover to pause · All items curated and authenticated by Uno Fashion Agency Ltd
        </p>
      </div>
    </section>
  );
}
