'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const DEFAULT_SLIDES = [
  { src: '/images/landing-page-1.jpeg', title: 'Wardrobe Alignment' },
  { src: '/images/landing-page-2.jpeg', title: 'Entrance Etiquette' },
  { src: '/images/landing-page-3.jpeg', title: 'VIP Stage Presence' },
  { src: '/images/hero-men.jpg', title: 'Day-Of Suite Dressing' },
];

export default function WeddingServices() {
  const [slides, setSlides] = useState(DEFAULT_SLIDES);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    fetch('/api/protocol-photos')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSlides(
            data.map((item: { image?: string; src?: string; title: string }) => ({
              src: item.image || item.src || '/images/landing-page-1.jpeg',
              title: item.title,
            }))
          );
        }
      })
      .catch((err) => console.error('Failed to load protocol photos:', err));

    // Supabase Realtime: instantly update Protocol slides when admin edits pictures
    const supabase = createClient();
    const channel = supabase
      .channel('realtime:protocol_slides')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_settings',
          filter: 'key=eq.protocol_photos',
        },
        (payload: any) => {
          if (payload.new && Array.isArray(payload.new.value)) {
            setSlides(
              payload.new.value.map((item: { image?: string; src?: string; title: string }) => ({
                src: item.image || item.src || '/images/landing-page-1.jpeg',
                title: item.title,
              }))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Slowly cycle slides every 5 seconds
  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const services = [
    {
      title: 'Suits Rental & Precision Fitting',
      tag: 'Tailoring & Rentals',
      description:
        'Luxury bespoke tuxedos and tailored suits curated for grooms, executives, and formal ceremonies. Every rental includes private styling and precision adjustments for a sharp, confident silhouette.',
      points: ['Groom & groomsmen suits', 'Private fitting & alterations', 'Accessories included'],
    },
    {
      title: 'Wedding Protocol Services',
      tag: 'Ceremony & Bridal Protocol',
      description:
        'Complete ceremonial protocol management and party coordination in Kigali. We oversee bridal party wardrobe alignment, groom entrance etiquette, and on-site dressing on your wedding day.',
      points: ['Bridal party uniform coordination', 'Protocol & etiquette direction', 'Day-of ceremony dressing support'],
    },
  ];

  return (
    <section id="services" className="py-12 sm:py-16 bg-[#F8F6F2] border-t border-[#EAE5DC] scroll-mt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Side: Slowly Sliding Carousel Stack */}
          <div className="lg:col-span-5 relative w-full max-w-sm mx-auto lg:max-w-none">
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-md border-3 border-white bg-[#14100E]">
              {/* Sliding Track */}
              <div
                className="flex h-full w-full transition-transform duration-1000 ease-in-out"
                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
              >
                {slides.map((slide, idx) => (
                  <div key={idx} className="relative min-w-full h-full">
                    <Image
                      src={slide.src}
                      alt={slide.title}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="text-[9px] uppercase tracking-wider text-[#D5B895] font-semibold bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full inline-block mb-1">
                        Protocol in Action
                      </span>
                      <p className="font-serif-luxury text-base font-medium">
                        {slide.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Slide Indicators */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10 bg-black/40 backdrop-blur-xs px-2 py-1 rounded-full">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveSlide(i)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      activeSlide === i ? 'w-4 bg-[#C4A47C]' : 'w-1.5 bg-white/40'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Scaled Down Clean Editorial Content */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <span className="text-[10px] uppercase tracking-[0.22em] font-semibold text-[#9E7B4F] block">
                Atelier Services
              </span>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-normal text-[#191C1A] mt-1 leading-snug">
                Suits &amp; Wedding Protocol Services.
              </h2>
              <p className="text-xs text-[#6B655E] mt-2 leading-relaxed max-w-lg font-light">
                Two dedicated offerings in Kigali: custom-fitted luxury suit rentals for your big day, and end-to-end wedding protocol management to keep your ceremony dignified and seamless.
              </p>
            </div>

            {/* 2 Clean Service Blocks with Reduced Padding & Typography */}
            <div className="space-y-3">
              {services.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-4.5 bg-white border border-[#EAE4D9] rounded-lg space-y-1.5 shadow-2xs hover:border-[#9E7B4F]/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif-luxury text-base sm:text-lg font-medium text-[#191C1A]">
                      {item.title}
                    </h3>
                    <span className="text-[9px] uppercase tracking-wider font-semibold text-[#9E7B4F] bg-[#FAF8F5] border border-[#EFEAE2] px-2 py-0.5 rounded-full">
                      {item.tag}
                    </span>
                  </div>

                  <p className="text-[11px] sm:text-xs text-[#736E67] leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-x-3.5 gap-y-1 pt-0.5">
                    {item.points.map((pt, i) => (
                      <span key={i} className="inline-flex items-center space-x-1.5 text-[10px] sm:text-[11px] text-[#191C1A]">
                        <Check className="w-3 h-3 text-[#9E7B4F] flex-shrink-0" />
                        <span>{pt}</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Action */}
            <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <Link
                href="/protocol-service"
                className="inline-flex items-center justify-center space-x-2 bg-[#191C1A] hover:bg-[#9E7B4F] text-white px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-150 shadow-xs self-start cursor-pointer"
              >
                <span>Explore Protocol Service &amp; Book</span>
                <ArrowRight className="w-3 h-3" />
              </Link>

              <span className="text-[10px] text-[#8C8278]">
                Nyarugenge Showroom · Protocol across Kigali
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
