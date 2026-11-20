'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  Phone,
  MessageCircle,
  ArrowRight,
  Maximize2,
  X,
  MapPin,
  Clock,
  CheckCircle2,
} from 'lucide-react';

const DECOR_GALLERY = [
  {
    id: 1,
    title: 'Ceremonial Stage & Floral Canopy',
    category: 'Wedding Stage',
    image: '/images/decor/decor-1.jpeg',
    description: 'Tiered floral arches, bespoke staging, and soft ambient illumination creating an unforgettable altar.',
  },
  {
    id: 2,
    title: 'Grand Reception Tablescape',
    category: 'Banquet & Tables',
    image: '/images/decor/decor-2.jpeg',
    description: 'Synchronized table settings, crystal candelabras, tailored linens, and curated floral centerpieces.',
  },
  {
    id: 3,
    title: 'VIP Lounge & Entrance Scenography',
    category: 'VIP Hospitality',
    image: '/images/decor/decor-3.jpeg',
    description: 'Immersive welcome zones, bespoke photo backdrops, and plush architectural lounge configurations.',
  },
  {
    id: 4,
    title: 'Atmospheric Ceiling & Lighting Design',
    category: 'Illumination',
    image: '/images/decor/decor-4.jpeg',
    description: 'Warm mood wash lighting, overhead greenery installations, and customized crystal chandeliers.',
  },
  {
    id: 5,
    title: 'Luxury Aisle & Hallway Pacing',
    category: 'Ceremony Walkway',
    image: '/images/decor/decor-5.jpeg',
    description: 'Mirrored walkways, cascading botanical accents, and candlelit lanterns guiding the grand entry.',
  },
];

export default function DecorServicesPage() {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventType, setEventType] = useState('Wedding Reception');
  const [guestCount, setGuestCount] = useState('100 - 300 Guests');
  const [venue, setVenue] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const cleanPhone = '250783036628';

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const waText = `Hello Uno Fashion Decor Atelier,

I would like to consult on Event Decor Services for my upcoming celebration:
• *Client Name:* ${name.trim()}
• *Phone:* ${phone.trim()}
• *Event Date:* ${eventDate || 'Not specified'}
• *Event Type:* ${eventType}
• *Guest Estimate:* ${guestCount}
• *Venue / Location:* ${venue.trim() || 'Kigali'}
• *Design Notes:* ${notes.trim() || 'Please share your decor catalogue and package options.'}

Looking forward to your guidance!`;

    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waText)}`;

    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name.trim(),
          customerPhone: phone.trim(),
          type: 'Online',
          status: 'Pending',
          occasion: `Decor Service: ${eventType}`,
          itemName: `Decor Inquiry (${guestCount})`,
          notes: `Date: ${eventDate || 'TBD'} | Venue: ${venue || 'TBD'} | Notes: ${notes || 'None'}`,
        }),
      });
    } catch (err) {
      console.warn('Booking API fallback:', err);
    } finally {
      setIsSubmitting(false);
      setIsSent(true);
      if (typeof window !== 'undefined') {
        window.open(waUrl, '_blank');
      }
    }
  };

  return (
    <div className="bg-[#FAF8F5] text-[#191C1A] min-h-screen">
      {/* 1. Light Luxury Hero Section */}
      <section className="relative pt-20 pb-16 sm:pt-28 sm:pb-24 overflow-hidden border-b border-[#E8E3DA] bg-gradient-to-b from-[#F7F3ED] via-[#FAF8F5] to-white">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF0E4] border border-[#E8D6BF] text-[#866336] text-xs uppercase tracking-[0.25em] font-semibold mb-6 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#9E7B4F]" />
            <span>Uno Atelier Event Styling</span>
          </div>

          <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl text-[#191C1A] font-normal leading-[1.18] max-w-4xl mx-auto">
            Bespoke Wedding &amp; Gala <br />
            <span className="italic font-normal text-[#9E7B4F]">Decor Services</span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-[#6E675F] max-w-2xl mx-auto font-light leading-relaxed">
            Elevating wedding ceremonies, reception stages, and high-profile celebrations across Kigali with signature floral architecture, luxury tablescapes, and atmospheric lighting.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#decor-consult"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#4A2311] hover:bg-[#34180B] text-white text-xs font-semibold uppercase tracking-widest transition-all shadow-md active:scale-95"
            >
              <span>Book Decor Consultation</span>
              <ArrowRight className="w-4 h-4 text-[#C4A47C]" />
            </a>

            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                'Hello Uno Fashion, I would like to inquire about your event and wedding decor services.'
              )}`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-white hover:bg-[#FAF8F5] border border-[#DCD3C7] text-[#191C1A] text-xs font-semibold uppercase tracking-widest transition-all shadow-2xs active:scale-95"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>WhatsApp Direct</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. Photo Gallery Showcase in Light Theme */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#9E7B4F] block">
            Atelier Portfolio
          </span>
          <h2 className="font-serif-luxury text-2xl sm:text-4xl text-[#191C1A] font-normal mt-2">
            Signature Decor Scenography
          </h2>
          <p className="text-xs sm:text-sm text-[#6E675F] mt-3">
            A glimpse into our recent wedding stages, ceremonial altars, and reception installations crafted in Kigali. Tap any image to view in high definition.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
          {/* Main Feature Image (decor-1) */}
          <div
            onClick={() => setSelectedPhoto('/images/decor/decor-1.jpeg')}
            className="md:col-span-7 group relative h-80 sm:h-96 md:h-[480px] rounded-2xl overflow-hidden border border-[#E5DFD4] bg-white cursor-pointer shadow-sm hover:shadow-md transition-shadow"
          >
            <Image
              src="/images/decor/decor-1.jpeg"
              alt={DECOR_GALLERY[0].title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />
            <div className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-4 h-4" />
            </div>
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="text-[10px] uppercase tracking-widest text-[#E8D6BF] font-semibold block mb-1">
                {DECOR_GALLERY[0].category}
              </span>
              <h3 className="font-serif-luxury text-xl sm:text-2xl font-medium">
                {DECOR_GALLERY[0].title}
              </h3>
              <p className="text-xs text-[#E0D8CC] mt-1 line-clamp-2">
                {DECOR_GALLERY[0].description}
              </p>
            </div>
          </div>

          {/* Secondary Feature Image (decor-2) */}
          <div
            onClick={() => setSelectedPhoto('/images/decor/decor-2.jpeg')}
            className="md:col-span-5 group relative h-80 sm:h-96 md:h-[480px] rounded-2xl overflow-hidden border border-[#E5DFD4] bg-white cursor-pointer shadow-sm hover:shadow-md transition-shadow"
          >
            <Image
              src="/images/decor/decor-2.jpeg"
              alt={DECOR_GALLERY[1].title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />
            <div className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-4 h-4" />
            </div>
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="text-[10px] uppercase tracking-widest text-[#E8D6BF] font-semibold block mb-1">
                {DECOR_GALLERY[1].category}
              </span>
              <h3 className="font-serif-luxury text-xl font-medium">
                {DECOR_GALLERY[1].title}
              </h3>
              <p className="text-xs text-[#E0D8CC] mt-1 line-clamp-2">
                {DECOR_GALLERY[1].description}
              </p>
            </div>
          </div>

          {/* Bottom 3 Grid Images */}
          {DECOR_GALLERY.slice(2).map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedPhoto(item.image)}
              className="md:col-span-4 group relative h-72 sm:h-80 rounded-2xl overflow-hidden border border-[#E5DFD4] bg-white cursor-pointer shadow-sm hover:shadow-md transition-shadow"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />
              <div className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4" />
              </div>
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-[10px] uppercase tracking-widest text-[#E8D6BF] font-semibold block mb-1">
                  {item.category}
                </span>
                <h3 className="font-serif-luxury text-lg font-medium">
                  {item.title}
                </h3>
                <p className="text-[11px] text-[#E0D8CC] mt-1 line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Lightbox Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
        >
          <button
            type="button"
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
            aria-label="Close photo preview"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full h-[75vh] rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
          >
            <Image
              src={selectedPhoto}
              alt="Decor Scenography Preview"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

      {/* Booking & Consultation Form Section (Light Card) */}
      <section id="decor-consult" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-12">
        <div className="bg-white border border-[#E8E3DA] rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#9E7B4F] block">
              Direct Inquiries
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-4xl text-[#191C1A] font-normal mt-2">
              Book a Decor Consultation
            </h2>
            <p className="text-xs sm:text-sm text-[#6E675F] mt-2">
              Tell us about your upcoming event. Our event styling directors will review your venue and connect with you directly via WhatsApp.
            </p>
          </div>

          {isSent ? (
            <div className="bg-[#FAF5EC] border border-[#D5C2A5] rounded-2xl p-8 text-center space-y-4 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-full bg-[#EBD8C1] border border-[#9E7B4F] flex items-center justify-center text-[#4A2311] mx-auto">
                <CheckCircle2 className="w-6 h-6 text-[#9E7B4F]" />
              </div>
              <h3 className="font-serif-luxury text-2xl text-[#191C1A]">Inquiry Received</h3>
              <p className="text-xs text-[#6E675F] leading-relaxed">
                Thank you! Your decor inquiry has been logged, and your WhatsApp concierge chat has been opened.
              </p>
              <button
                type="button"
                onClick={() => setIsSent(false)}
                className="text-xs uppercase tracking-wider text-[#9E7B4F] font-semibold underline underline-offset-4 hover:text-[#4A2311]"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleBooking} className="space-y-5 max-w-2xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#57524C] font-semibold mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vanessa & Dan"
                    className="w-full bg-[#FAF8F5] border border-[#D5CFCE] rounded-xl px-4 py-3 text-xs text-[#191C1A] placeholder-[#9E9790] focus:outline-none focus:border-[#9E7B4F] focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#57524C] font-semibold mb-2">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +250 788 000 000"
                    className="w-full bg-[#FAF8F5] border border-[#D5CFCE] rounded-xl px-4 py-3 text-xs text-[#191C1A] placeholder-[#9E9790] focus:outline-none focus:border-[#9E7B4F] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#57524C] font-semibold mb-2">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFCE] rounded-xl px-4 py-3 text-xs text-[#191C1A] placeholder-[#9E9790] focus:outline-none focus:border-[#9E7B4F] focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#57524C] font-semibold mb-2">
                    Event Type
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFCE] rounded-xl px-4 py-3 text-xs text-[#191C1A] focus:outline-none focus:border-[#9E7B4F] focus:bg-white transition-colors cursor-pointer"
                  >
                    <option value="Wedding Reception">Wedding Reception</option>
                    <option value="Church Ceremony & Altar">Church Ceremony & Altar</option>
                    <option value="Traditional Dowry (Gusaba)">Traditional Dowry (Gusaba)</option>
                    <option value="VIP Gala & Dinner">VIP Gala & Dinner</option>
                    <option value="Corporate Banquet">Corporate Banquet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#57524C] font-semibold mb-2">
                    Guest Count
                  </label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFCE] rounded-xl px-4 py-3 text-xs text-[#191C1A] focus:outline-none focus:border-[#9E7B4F] focus:bg-white transition-colors cursor-pointer"
                  >
                    <option value="Under 100 Guests">Under 100 Guests</option>
                    <option value="100 - 300 Guests">100 - 300 Guests</option>
                    <option value="300 - 600 Guests">300 - 600 Guests</option>
                    <option value="600+ Guests">600+ Guests</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#57524C] font-semibold mb-2">
                  Venue / Location in Kigali
                </label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g. Kigali Serena Hotel, Intare Conference Arena, Private Garden"
                  className="w-full bg-[#FAF8F5] border border-[#D5CFCE] rounded-xl px-4 py-3 text-xs text-[#191C1A] placeholder-[#9E9790] focus:outline-none focus:border-[#9E7B4F] focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#57524C] font-semibold mb-2">
                  Styling Notes / Desired Colors (Optional)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe your desired theme, color palette, or special floral preferences..."
                  className="w-full bg-[#FAF8F5] border border-[#D5CFCE] rounded-xl px-4 py-3 text-xs text-[#191C1A] placeholder-[#9E9790] focus:outline-none focus:border-[#9E7B4F] focus:bg-white transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#4A2311] hover:bg-[#34180B] text-white disabled:opacity-50 text-xs font-semibold uppercase tracking-widest transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <span>{isSubmitting ? 'Submitting...' : 'Send Inquiry via WhatsApp Concierge'}</span>
                <ArrowRight className="w-4 h-4 text-[#C4A47C]" />
              </button>
            </form>
          )}

          {/* Direct Address & Help Footer */}
          <div className="mt-10 pt-8 border-t border-[#E8E3DA] flex flex-col sm:flex-row items-center justify-between text-xs text-[#6E675F] gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#9E7B4F]" />
              <span>KN 74 St Kigali, Nyarugenge market</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#9E7B4F]" />
              <span>Mon – Sun: 8:00 AM – 8:00 PM</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#9E7B4F]" />
              <span>+250 783 036 628</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
