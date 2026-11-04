import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#14100E] text-[#FAF8F5] pt-16 pb-12 border-t border-[#2A221D]">
      {/* Upper reassurance banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-[#2A221D]">
        <div className="flex flex-wrap items-center justify-between gap-6 text-xs text-[#B2A89F] uppercase tracking-wider">
          <span className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C4A47C]" />
            <span>Fitting included</span>
          </span>
          <span className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C4A47C]" />
            <span>Eco dry cleaning included</span>
          </span>
          <span className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C4A47C]" />
            <span>4-day rental standard</span>
          </span>
          <span className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C4A47C]" />
            <span>Transparent refundable deposits</span>
          </span>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-serif-luxury text-3xl tracking-[0.16em] block text-white">
              UNO FASHION AGENCY
            </span>
            <p className="text-sm text-[#9C9187] max-w-sm font-light leading-relaxed">
              Tailoring with quiet authority. Bespoke suit rentals, tuxedos, and bridal couture in Kigali, Rwanda.
            </p>
          </div>

          {/* Visit */}
          <div className="space-y-3">
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#C4A47C] block">
              Visit Atelier
            </span>
            <div className="text-xs text-[#B8ADA2] space-y-1.5 leading-relaxed">
              <p className="font-medium text-white">Kigali, Rwanda</p>
              <p>KG 14 Ave, Nyarutarama</p>
              <p>Tue–Sat · 10am–6pm</p>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#C4A47C] block">
              Direct Contact
            </span>
            <div className="text-xs text-[#B8ADA2] space-y-2">
              <p>concierge@unofashion.rw</p>
              <p>+250 78 830 0000</p>
              <div className="flex items-center space-x-4 pt-1">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1 hover:text-white transition-colors"
                >
                  <span>Instagram</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
                <a
                  href="https://wa.me/250788300000"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1 hover:text-white transition-colors"
                >
                  <span>WhatsApp</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
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
