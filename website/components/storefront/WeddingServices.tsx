import Image from 'next/image';
import { ArrowRight, Check } from 'lucide-react';

export default function WeddingServices() {
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
          
          {/* Left Side: Scaled Overlapping Dual-Image Stack */}
          <div className="lg:col-span-5 relative w-full max-w-sm mx-auto lg:max-w-none">
            <div className="relative w-full h-[360px] sm:h-[400px]">
              {/* Back Image (Landing Page 1) - Shifted Up and Right */}
              <div className="absolute top-0 right-1 sm:right-4 w-[68%] aspect-[3/4] rounded-xl overflow-hidden shadow-sm border-3 border-white bg-[#EFECE6]">
                <Image
                  src="/images/landing-page-1.jpeg"
                  alt="Uno Fashion Agency - Wedding Protocol and Styling"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 65vw, 30vw"
                />
              </div>

              {/* Front Image (Landing Page 2) - Shifted Down and Left overlapping */}
              <div className="absolute bottom-0 left-1 sm:left-4 w-[68%] aspect-[3/4] rounded-xl overflow-hidden shadow-md border-3 border-white bg-[#EAE7E1] z-10">
                <Image
                  src="/images/landing-page-2.jpeg"
                  alt="Uno Fashion Agency - Bespoke Suits & Tailoring"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 65vw, 30vw"
                />
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
                Suits & Wedding Protocol Services.
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
              <a
                href="#contact"
                className="inline-flex items-center justify-center space-x-2 bg-[#191C1A] hover:bg-[#9E7B4F] text-white px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-150 shadow-xs self-start"
              >
                <span>Book Consultation & Fitting</span>
                <ArrowRight className="w-3 h-3" />
              </a>

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
