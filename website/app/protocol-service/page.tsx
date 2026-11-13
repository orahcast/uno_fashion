'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight, Phone, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const DEFAULT_PROTOCOL_PHOTOS = [
  {
    title: 'Wardrobe Alignment',
    caption: 'Synchronized tuxedos, cuts, and accessories for the bridal squad.',
    image: '/images/landing-page-1.jpeg',
  },
  {
    title: 'Entrance Etiquette',
    caption: 'Ceremonial walking cadence, aisle pacing, and stage presence.',
    image: '/images/landing-page-2.jpeg',
  },
  {
    title: 'Day-Of Suite Dressing',
    caption: 'On-site steaming, Windsor knotting, and boutonnière pinning.',
    image: '/images/hero-men.jpg',
  },
  {
    title: 'VIP & Gala Composure',
    caption: 'High-profile hosting protocol and stage reception etiquette.',
    image: '/images/landing-page-3.jpeg',
  },
];

const PROTOCOL_POINTS = [
  {
    num: '01',
    title: 'Wardrobe Harmonization',
    description: 'We align suit silhouettes, fabric shades, and accessories between groom, bride, and bridal party weeks in advance.',
  },
  {
    num: '02',
    title: 'Ceremony & Entrance Etiquette',
    description: 'Our protocol officers direct church walking order, altar symmetry, and grand reception entry pacing.',
  },
  {
    num: '03',
    title: 'On-Site Dressing Assistance',
    description: 'On your wedding morning, certified tailors arrive at your dressing suite with steamers and emergency alteration kits.',
  },
];

export default function ProtocolServicePage() {
  const [photos, setPhotos] = useState(DEFAULT_PROTOCOL_PHOTOS);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [details, setDetails] = useState('');
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    fetch('/api/protocol-photos')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPhotos(data);
        }
      })
      .catch((err) => console.error('Failed to load protocol photos:', err));

    // Supabase Realtime: instantly update marquee when protocol photos change
    const supabase = createClient();
    const channel = supabase
      .channel('realtime:protocol_marquee')
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
            setPhotos(payload.new.value);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const cleanPhone = '250783036628';

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      customerName: name.trim(),
      customerPhone: phone.trim(),
      eventDate: date,
      partySize: details,
      serviceType: 'Wedding & Ceremonial Protocol',
      notes: details,
    };

    // Save to server API
    fetch('/api/protocol-bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(console.error);

    // Save to localStorage
    if (typeof window !== 'undefined') {
      try {
        const existing = JSON.parse(localStorage.getItem('uno_protocol_bookings') || '[]');
        localStorage.setItem(
          'uno_protocol_bookings',
          JSON.stringify([
            {
              id: `proto-${Date.now()}`,
              bookingNumber: `PR-${Math.floor(100 + Math.random() * 900)}`,
              ...payload,
              status: 'Pending',
              createdAt: new Date().toISOString(),
            },
            ...existing,
          ])
        );
      } catch (err) {
        console.error(err);
      }
    }

    const message = `*Protocol Service Booking*
• Name: ${name}
• Phone: ${phone}
• Event Date: ${date || 'TBD'}
• Details: ${details || 'None'}`;

    setIsSent(true);
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="bg-[#FAF8F5] text-[#191C1A] min-h-screen">
      {/* 1. Minimal Header */}
      <section className="pt-12 pb-10 sm:pt-16 sm:pb-12 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#9E7B4F] block mb-2">
          Kigali Atelier · Wedding &amp; VIP
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-normal text-[#191C1A] tracking-tight">
          Protocol Service.
        </h1>
        <p className="text-xs sm:text-sm text-[#736E67] font-light max-w-xl mx-auto mt-2 leading-relaxed">
          Ceremonial coordination, bridal party wardrobe alignment, and day-of suite dressing for weddings and distinguished events in Kigali.
        </p>
      </section>

      {/* 2. Slowly Sliding Protocol Photos Marquee */}
      <section className="pb-12 sm:pb-16 overflow-hidden relative">
        {/* Soft edge blur gradients */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 sm:w-28 bg-gradient-to-r from-[#FAF8F5] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 sm:w-28 bg-gradient-to-l from-[#FAF8F5] to-transparent z-10" />

        <div
          className="flex animate-marquee gap-4 sm:gap-5 py-2 hover:[animation-play-state:paused]"
          style={{ animationDuration: '40s' }}
        >
          {[...photos, ...photos].map((item, idx) => (
            <div
              key={idx}
              className="w-60 sm:w-72 shrink-0 group bg-white rounded-2xl overflow-hidden border border-[#EAE5DC] shadow-2xs hover:border-[#9E7B4F] transition-all"
            >
              <div className="relative aspect-[3/4] w-full bg-neutral-900 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover object-top group-hover:scale-103 transition-transform duration-500 ease-out"
                  sizes="(max-width: 640px) 240px, 288px"
                />
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-serif-luxury text-base font-semibold text-[#191C1A]">
                  {item.title}
                </h3>
                <p className="text-[11px] text-[#736E67] mt-0.5 leading-relaxed">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Simple 3-Pillar Explanation */}
      <section className="py-12 bg-white border-y border-[#EAE5DC]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {PROTOCOL_POINTS.map((pt) => (
              <div key={pt.num} className="space-y-2">
                <span className="font-serif-luxury text-xl font-bold text-[#9E7B4F]">
                  {pt.num}.
                </span>
                <h3 className="font-serif-luxury text-lg font-bold text-[#191C1A]">
                  {pt.title}
                </h3>
                <p className="text-xs text-[#736E67] leading-relaxed font-light">
                  {pt.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Minimal Booking Form (Essential Fields Only) */}
      <section className="py-14 sm:py-16 max-w-xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE5DC] shadow-xs space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#9E7B4F] block">
              Inquire or Reserve
            </span>
            <h2 className="font-serif-luxury text-2xl font-bold text-[#191C1A]">
              Book Protocol
            </h2>
            <p className="text-xs text-[#736E67] font-light">
              Leave your details and our Kigali coordinator will confirm availability.
            </p>
          </div>

          {isSent ? (
            <div className="p-6 bg-[#EEF6F0] border border-[#D4E8DA] rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#2D6A4F] mx-auto" />
              <h3 className="font-serif-luxury text-lg font-bold text-[#1E4D38]">
                Request Sent via WhatsApp
              </h3>
              <p className="text-xs text-[#2D6A4F]">
                Thank you! We will reply promptly to finalize your date and requirements.
              </p>
            </div>
          ) : (
            <form onSubmit={handleBook} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#191C1A] font-semibold uppercase text-[10px] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Patrick Mugabo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D5CFCE] rounded-xl px-3.5 py-2.5 text-[#191C1A] focus:outline-none focus:border-[#9E7B4F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#191C1A] font-semibold uppercase text-[10px] mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+250 780 000 000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFCE] rounded-xl px-3.5 py-2.5 text-[#191C1A] focus:outline-none focus:border-[#9E7B4F]"
                  />
                </div>

                <div>
                  <label className="block text-[#191C1A] font-semibold uppercase text-[10px] mb-1">
                    Wedding / Event Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFCE] rounded-xl px-3.5 py-2.5 text-[#191C1A] focus:outline-none focus:border-[#9E7B4F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#191C1A] font-semibold uppercase text-[10px] mb-1">
                  Party Size &amp; Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Groom & 6 Groomsmen · Kigali Serena"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D5CFCE] rounded-xl px-3.5 py-2.5 text-[#191C1A] focus:outline-none focus:border-[#9E7B4F]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-5 rounded-full bg-[#14100E] hover:bg-[#26201C] text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Book Protocol on WhatsApp</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C4A47C]" />
                </button>
              </div>

              <div className="pt-2 text-center">
                <a
                  href={`tel:+${cleanPhone}`}
                  className="inline-flex items-center gap-1.5 text-xs text-[#736E67] hover:text-[#191C1A]"
                >
                  <Phone className="w-3 h-3 text-[#9E7B4F]" />
                  <span>Or call concierge: +250 783 036 628</span>
                </a>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
