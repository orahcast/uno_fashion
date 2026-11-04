import Image from 'next/image';
import { Phone, Star, ChevronRight, MessageCircle } from 'lucide-react';

export default function Hero() {
  const phoneNumber = '+250 780 791 292';
  const cleanPhone = '250780791292';

  return (
    <section className="relative w-full min-h-[600px] md:h-[88vh] md:min-h-[640px] md:max-h-[820px] bg-[#14100E] text-white flex items-center overflow-hidden">
      {/* Exact 50/50 Split Layout matching reference inspiration */}
      <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 items-stretch">
        
        {/* Left Column: Exactly Half Width (50%) */}
        <div className="w-full z-10 flex flex-col justify-center px-6 sm:px-10 lg:pl-16 lg:pr-10 py-16 md:py-12">
          <div className="space-y-6 max-w-xl">
            
            {/* Top Review & Rating Pill Badge */}
            <div className="inline-flex items-center space-x-2 bg-[#221C18]/80 border border-[#3D332D] backdrop-blur-xs px-3.5 py-1.5 rounded-full text-xs self-start shadow-xs">
              <span className="font-semibold text-white">4.9</span>
              <div className="flex items-center space-x-0.5 text-[#C4A47C]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-current" />
                ))}
              </div>
              <span className="text-[#8C8075]">·</span>
              <span className="text-[#B8ADA2] text-[11px] font-medium">
                500+ Atelier Reviews
              </span>
            </div>

            {/* Headline with Em-dash and Highlighted Word */}
            <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-normal uppercase tracking-tight leading-[1.08] text-white">
              TAILORING — WITH <br />
              QUIET <span className="text-[#D5B895]">AUTHORITY</span>
            </h1>

            {/* Subtitle Paragraph */}
            <p className="text-xs sm:text-sm text-[#B8ADA2] font-light max-w-md leading-relaxed">
              We provide bespoke suit rentals, tuxedos, and wedding protocol services to ensure you make an indelible impression across Kigali.
            </p>

            {/* Dual CTAs: Pill Button + Call Us Group */}
            <div className="pt-2 flex flex-wrap items-center gap-5 sm:gap-7">
              {/* Primary Pill Button */}
              <a
                href="#contact"
                className="inline-flex items-center space-x-2.5 bg-[#C4A47C] hover:bg-[#B3936B] text-[#14100E] pl-6 pr-3 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <span>Book Appointment</span>
                <span className="w-6 h-6 rounded-full bg-[#14100E]/15 flex items-center justify-center">
                  <ChevronRight className="w-3.5 h-3.5 text-[#14100E]" />
                </span>
              </a>

              {/* Call Us Link with Circular Phone Icon */}
              <a
                href={`tel:${cleanPhone}`}
                className="inline-flex items-center space-x-3 text-white hover:text-[#D5B895] transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-[#261F1A] border border-[#3D322B] flex items-center justify-center text-[#C4A47C] group-hover:bg-[#C4A47C] group-hover:text-[#14100E] transition-colors flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-[#8C8075] block font-semibold">
                    Call Us
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-white tracking-wide block">
                    {phoneNumber}
                  </span>
                </div>
              </a>
            </div>

          </div>
        </div>

        {/* Right Column: Exactly Half Width (50%) with "landing page 3" Image */}
        <div className="w-full relative min-h-[440px] md:min-h-full h-full overflow-hidden">
          <Image
            src="/images/landing-page-3.jpeg"
            alt="Uno Fashion Agency - Tailoring & Wedding Protocol in Kigali"
            fill
            priority
            className="object-cover object-top md:object-[center_15%]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />

          {/* Smooth seamless blend between left dark half and right image */}
          <div className="hidden md:block absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-[#14100E] via-[#14100E]/60 to-transparent z-0 pointer-events-none" />
          
          {/* Subtle mobile top/bottom gradients */}
          <div className="block md:hidden absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#14100E] to-transparent z-0 pointer-events-none" />
          <div className="block md:hidden absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#14100E] to-transparent z-0 pointer-events-none" />
        </div>

      </div>

      {/* Floating WhatsApp Quick Concierge Badge */}
      <div className="fixed bottom-6 right-6 z-40">
        <a
          href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
            'Hello Uno Fashion Atelier, I would like to inquire about suit rental and fitting services.'
          )}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center w-11 h-11 rounded-full bg-[#1A1614] border border-[#3D332D] text-white shadow-xl hover:scale-105 transition-all"
          title="Chat with Atelier Concierge on WhatsApp"
        >
          <MessageCircle className="w-5 h-5 text-[#25D366]" />
        </a>
      </div>
    </section>
  );
}
