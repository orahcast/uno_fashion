import Image from 'next/image';
import { Phone, ChevronRight } from 'lucide-react';

export default function Hero() {
  const phoneNumber = '+250 783 036 628';
  const cleanPhone = '250783036628';

  return (
    <section className="relative w-full min-h-[600px] md:h-[88vh] md:min-h-[640px] md:max-h-[820px] bg-[#14100E] text-white flex items-center overflow-hidden">
      {/* Exact 50/50 Split Layout matching reference inspiration */}
      <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 items-stretch">
        
        {/* Left Column: Exactly Half Width (50%) */}
        <div className="w-full z-10 flex flex-col justify-center px-6 sm:px-10 lg:pl-16 lg:pr-10 py-12 md:py-8">
          <div className="space-y-6 max-w-xl -translate-y-3 md:-translate-y-8">
            {/* Headline with Em-dash and Highlighted Word */}
            <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-normal uppercase tracking-tight leading-[1.08] text-white">
              TAILORING — WITH <br />
              QUIET <span className="text-[#D5B895]">AUTHORITY</span>
            </h1>

            {/* Subtitle Paragraph */}
            <p className="text-xs sm:text-sm text-[#B8ADA2] font-light max-w-md leading-relaxed">
              Uno Fashion Agency Ltd provides bespoke suit rentals, tuxedos, and wedding protocol services to ensure you make an indelible impression across Kigali.
            </p>

            {/* Dual CTAs: Pill Button + Call Us Group */}
            <div className="pt-2 flex flex-wrap items-center gap-5 sm:gap-7">
              {/* Primary WhatsApp Pill Button */}
              <a
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                  'Hello Uno Fashion Atelier, I would like to inquire about suit rentals and styling services.'
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2.5 bg-[#C4A47C] hover:bg-[#B3936B] text-[#14100E] pl-5 pr-3 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-5.805 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <span>WhatsApp Us</span>
                <span className="w-5 h-5 rounded-full bg-[#14100E]/15 flex items-center justify-center">
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
    </section>
  );
}
