import Image from 'next/image';
import { Sparkles, ShieldCheck, Shirt } from 'lucide-react';

export default function ClientMoments() {
  const stories = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
      venue: 'Wedding Reception · Kigali Serena Hotel',
      suit: 'The Windsor Tuxedo',
      quote:
        'The fit was immaculate. Having the atelier protocol team assist our groomsmen on the wedding morning took away all the stress.',
      client: 'Yves & Diane M.',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
      venue: 'Annual Leadership Gala · KCC',
      suit: 'The Sterling Windowpane',
      quote:
        'The alteration team hemmed the jacket and trousers to perfection within 24 hours. It felt truly made for me.',
      client: 'Christian K.',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
      venue: 'Garden Wedding · Nyarutarama',
      suit: 'Bridal Protocol & Suiting',
      quote:
        'Uno Fashion coordinated all 6 groomsmen suits seamlessly. Every outfit arrived perfectly pressed in garment bags.',
      client: 'Marc & Alida B.',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800',
      venue: 'Diplomatic Gala · Kiyovu',
      suit: 'Asymmetry Shawl Tuxedo',
      quote:
        'Quiet authority at its finest. Premium Italian wool that held its shape and breathed comfortably all evening.',
      client: 'Patrick N.',
    },
  ];

  const guarantees = [
    {
      icon: Shirt,
      title: 'Precision Alterations',
      desc: 'Complimentary sleeve and hem adjustments tailored to your frame.',
    },
    {
      icon: Sparkles,
      title: 'Eco-Cleaned & Steamed',
      desc: 'Double-sanitized and delivered ready-to-wear in an atelier bag.',
    },
    {
      icon: ShieldCheck,
      title: 'Guaranteed Deposit Security',
      desc: 'Immediate, transparent deposit refund upon item return.',
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-[#FAF8F5] border-t border-[#EAE5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b border-[#EAE4D9]">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#9E7B4F] block">
              Real Moments · Kigali
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-normal text-[#191C1A] mt-1">
              Worn at Kigali&apos;s Defining Celebrations.
            </h2>
          </div>
          <p className="text-xs text-[#736E67] mt-2 sm:mt-0 font-light max-w-sm">
            From intimate ceremonies in Nyarutarama to grand galas at the Kigali Convention Centre.
          </p>
        </div>

        {/* 4 Story Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {stories.map((story) => (
            <div
              key={story.id}
              className="bg-white border border-[#E8E2D6] rounded-2xl overflow-hidden shadow-2xs hover:shadow-xs transition-all duration-200 flex flex-col justify-between"
            >
              {/* Photo */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EAE8E4]">
                <Image
                  src={story.image}
                  alt={story.venue}
                  fill
                  className="object-cover object-top hover:scale-103 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[9px] font-semibold text-[#191C1A] shadow-xs">
                  {story.suit}
                </div>
              </div>

              {/* Story Content */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-[#9E7B4F] font-semibold block">
                    {story.venue}
                  </span>
                  <p className="text-xs text-[#59524A] font-light leading-relaxed italic">
                    &ldquo;{story.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-2 border-t border-[#F3EFE8] flex items-center justify-between text-[11px]">
                  <span className="font-medium text-[#191C1A]">{story.client}</span>
                  <span className="text-[10px] text-[#8C8278]">Verified Client</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Minimal 3-Pillar Atelier Guarantee Banner */}
        <div className="bg-[#F4EFE7] border border-[#E5DEC4]/50 rounded-2xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-[#191C1A]">
          {guarantees.map((g, i) => {
            const Icon = g.icon;
            return (
              <div key={i} className="flex items-start space-x-3.5">
                <div className="w-9 h-9 rounded-xl bg-white border border-[#E2DAD0] flex items-center justify-center text-[#9E7B4F] flex-shrink-0 mt-0.5 shadow-2xs">
                  <Icon className="w-4 h-4 text-[#9E7B4F]" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-[#191C1A]">
                    {g.title}
                  </h4>
                  <p className="text-xs text-[#6B655E] font-light leading-relaxed">
                    {g.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

