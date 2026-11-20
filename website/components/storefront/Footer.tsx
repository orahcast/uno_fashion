import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Instagram } from 'lucide-react';
import { TikTokIcon } from './Icons';

export default function Footer() {
  return (
    <footer className="bg-[#14100E] text-[#FAF8F5] py-16 border-t border-[#2A221D]">
      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white shrink-0 p-0.5 border border-[#C4A47C]/50 shadow-xs">
                <Image
                  src="/logo.png"
                  alt="Uno Fashion Agency"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.24em] text-[#C4A47C] font-semibold block">
                  Kigali Atelier
                </span>
                <span className="font-serif-luxury text-2xl tracking-[0.14em] block text-white leading-tight">
                  UNO FASHION AGENCY
                </span>
              </div>
            </div>
            <p className="text-sm text-[#9C9187] max-w-sm font-light leading-relaxed">
              Tailoring with quiet authority. Bespoke suit rentals, tuxedos, and bridal protocol in Kigali, Rwanda.
            </p>

            {/* Quick Social Badges */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://www.instagram.com/uno_fashion_agency_ltd"
                target="_blank"
                rel="noreferrer"
                title="Uno Suits & Atelier Instagram"
                aria-label="Uno Suits Instagram"
                className="w-8 h-8 rounded-full bg-[#1F1916] border border-[#2E251F] hover:border-[#C4A47C] hover:text-[#C4A47C] flex items-center justify-center text-[#B8ADA2] transition-colors"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://www.instagram.com/reel/DHQODhAt-Jt/?evlk=aDM2OGU1YThtNmt2"
                target="_blank"
                rel="noreferrer"
                title="Uno Wedding Protocol Instagram"
                aria-label="Uno Protocol Instagram"
                className="px-2.5 h-8 rounded-full bg-[#1F1916] border border-[#2E251F] hover:border-[#C4A47C] hover:text-[#C4A47C] flex items-center gap-1.5 text-[10px] text-[#B8ADA2] transition-colors"
              >
                <Instagram className="w-3 h-3 text-[#C4A47C]" />
                <span>Protocol IG</span>
              </a>
              <a
                href="https://vt.tiktok.com/ZSpncSG5R/"
                target="_blank"
                rel="noreferrer"
                title="Uno Fashion Official TikTok"
                aria-label="Uno TikTok"
                className="w-8 h-8 rounded-full bg-[#1F1916] border border-[#2E251F] hover:border-[#C4A47C] hover:text-[#C4A47C] flex items-center justify-center text-[#B8ADA2] transition-colors"
              >
                <TikTokIcon className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Visit */}
          <div className="space-y-3">
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#C4A47C] block">
              Visit Atelier
            </span>
            <div className="text-xs text-[#B8ADA2] space-y-1.5 leading-relaxed">
              <p className="font-medium text-white">KN 74 St Kigali, Nyarugenge market</p>
              <p>Mon–Sun · 8am–8pm</p>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#C4A47C] block">
              Direct Contact
            </span>
            <div className="text-xs text-[#B8ADA2] space-y-2">
              <p>
                <a href="mailto:unofashionagencyltd@gmail.com" className="hover:text-white transition-colors">
                  unofashionagencyltd@gmail.com
                </a>
              </p>
              <p>+250 783 036 628</p>
              
              <div className="pt-2 border-t border-[#2A221D] space-y-1.5">
                <span className="text-[10px] uppercase tracking-[0.16em] text-[#C4A47C] font-semibold block">
                  Official Channels
                </span>
                <div>
                  <a
                    href="https://www.instagram.com/uno_fashion_agency_ltd"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 hover:text-white transition-colors text-[11px]"
                  >
                    <span>Suits &amp; Atelier IG</span>
                    <ArrowUpRight className="w-3 h-3 text-[#C4A47C]" />
                  </a>
                </div>
                <div>
                  <a
                    href="https://www.instagram.com/reel/DHQODhAt-Jt/?evlk=aDM2OGU1YThtNmt2"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 hover:text-white transition-colors text-[11px]"
                  >
                    <span>Wedding Protocol IG</span>
                    <ArrowUpRight className="w-3 h-3 text-[#C4A47C]" />
                  </a>
                </div>
                <div>
                  <a
                    href="https://vt.tiktok.com/ZSpncSG5R/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 hover:text-white transition-colors text-[11px]"
                  >
                    <span>Uno Agency TikTok</span>
                    <ArrowUpRight className="w-3 h-3 text-[#C4A47C]" />
                  </a>
                </div>
                <div className="pt-0.5">
                  <a
                    href="https://wa.me/250783036628"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 hover:text-white text-[#25D366] transition-colors text-[11px]"
                  >
                    <span>WhatsApp Concierge</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#C4A47C] block">
              Navigation
            </span>
            <ul className="text-xs text-[#B8ADA2] space-y-2">
              <li>
                <Link href="/collection" className="hover:text-white transition-colors">
                  Rental Collections
                </Link>
              </li>
              <li>
                <Link href="/protocol-service" className="hover:text-[#C4A47C] transition-colors text-white font-medium">
                  Protocol Service
                </Link>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  Rental Process & Care
                </a>
              </li>
              <li>
                <a href="#fitting" className="hover:text-white transition-colors">
                  Book Fitting Session
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Suits & Protocol Services
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#2A221D] flex flex-col sm:flex-row items-center justify-between text-xs text-[#7A7067]">
        <p>© 2026 Uno Fashion Agency. All moments welcome.</p>
        <span className="text-[10px] tracking-widest uppercase mt-2 sm:mt-0 font-medium text-[#A69C91]">
          KIGALI, RWANDA
        </span>
      </div>
    </footer>
  );
}
