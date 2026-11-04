import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

export default function CategoryShowcase() {
  return (
    <section className="py-14 sm:py-16 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-[10px] uppercase tracking-[0.22em] font-semibold text-[#9E7B4F]">
              Suits & Dresses
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-normal text-[#191C1A] mt-1">
              Suits and dresses for rent.
            </h2>
          </div>

          <Link
            href="/collection"
            className="group mt-3 sm:mt-0 inline-flex items-center space-x-1.5 text-xs uppercase tracking-widest font-medium text-[#191C1A] hover:text-[#9E7B4F] transition-colors"
          >
            <span>See all rentals</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* 2-Column Balanced Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Suits Column */}
          <Link
            href="/collection?category=suits"
            className="group block relative overflow-hidden"
          >
            <div className="relative aspect-[4/5] max-h-[460px] w-full overflow-hidden bg-[#ECE8E1] rounded-xs">
              <Image
                src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1000"
                alt="Bespoke Suits for rent in Kigali"
                fill
                className="object-cover object-top group-hover:scale-104 transition-transform duration-500 ease-out"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="pt-3.5 flex items-baseline justify-between">
              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#9E7B4F] font-semibold">
                  Suits
                </span>
                <h3 className="font-serif-luxury text-xl sm:text-2xl font-normal text-[#191C1A] mt-0.5 group-hover:text-[#9E7B4F] transition-colors">
                  Suits & Tuxedos
                </h3>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#191C1A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <p className="text-[11px] text-[#6B726A] mt-0.5">Modern tailored cuts from 145,000 Frw.</p>
          </Link>

          {/* Wedding Dresses Column */}
          <Link
            href="/collection?category=gowns"
            className="group block relative overflow-hidden"
          >
            <div className="relative aspect-[4/5] max-h-[460px] w-full overflow-hidden bg-[#ECE8E1] rounded-xs">
              <Image
                src="https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&q=80&w=1000"
                alt="Luxury Wedding Dresses for rent in Kigali"
                fill
                className="object-cover object-top group-hover:scale-104 transition-transform duration-500 ease-out"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="pt-3.5 flex items-baseline justify-between">
              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#9E7B4F] font-semibold">
                  Wedding Dresses
                </span>
                <h3 className="font-serif-luxury text-xl sm:text-2xl font-normal text-[#191C1A] mt-0.5 group-hover:text-[#9E7B4F] transition-colors">
                  Bridal Gowns
                </h3>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#191C1A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <p className="text-[11px] text-[#6B726A] mt-0.5">Bespoke bridal dresses from 285,000 Frw.</p>
          </Link>
        </div>
      </div>
    </section>
  );
}
