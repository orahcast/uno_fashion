'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Instagram, Phone } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lock body scroll on iOS / mobile when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#161210]/95 backdrop-blur-md border-b border-[#2C2420]/80 text-[#FAF8F5] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Left Links & Touch-Friendly Hamburger Button */}
          <div className="flex items-center space-x-4 sm:space-x-6 text-xs uppercase tracking-widest font-medium text-[#D1C7BD]">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="min-w-[44px] min-h-[44px] -ml-2.5 p-2.5 rounded-lg flex items-center justify-center text-[#D1C7BD] hover:text-white active:bg-white/10 transition-colors cursor-pointer touch-manipulation focus:outline-none"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 sm:w-4 sm:h-4 text-[#C4A47C]" />
              ) : (
                <Menu className="w-5 h-5 sm:w-4 sm:h-4 text-[#FAF8F5]" />
              )}
              <span className="hidden sm:inline ml-2 text-xs font-semibold">
                {mobileMenuOpen ? 'Close' : 'Menu'}
              </span>
            </button>

            <Link
              href="/collection"
              prefetch={true}
              className="hover:text-white transition-colors hidden sm:inline-block"
            >
              Collections
            </Link>

            <Link
              href="/protocol-service"
              prefetch={true}
              className="hover:text-[#C4A47C] text-[#E8DEC8] transition-colors hidden sm:inline-block font-semibold"
            >
              Protocol Service
            </Link>
          </div>

          {/* Center Brand Identity */}
          <Link href="/" prefetch={true} className="flex flex-col items-center group text-center select-none">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[#C4A47C] font-semibold -mb-0.5">
              Kigali Atelier
            </span>
            <span className="font-serif-luxury text-lg sm:text-2xl tracking-[0.14em] sm:tracking-[0.16em] font-medium text-white group-hover:opacity-90 transition-opacity">
              UNO FASHION AGENCY
            </span>
          </Link>

          {/* Right Links */}
          <div className="flex items-center space-x-3 sm:space-x-5 text-xs uppercase tracking-widest font-medium text-[#D1C7BD]">
            <Link
              href="/#contact"
              className="hover:text-white transition-colors hidden md:inline-block"
            >
              Contact Us
            </Link>

            <a
              href="https://www.instagram.com/uno_fashion_agency_ltd"
              target="_blank"
              rel="noreferrer"
              className="min-w-[44px] min-h-[44px] -mr-2.5 p-2.5 flex items-center justify-center hover:text-white transition-colors cursor-pointer touch-manipulation"
              aria-label="Instagram profile"
            >
              <Instagram className="w-4 h-4 sm:w-4 sm:h-4" />
            </a>
          </div>
        </div>

        {/* Clean, Minimal Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <div
              className="fixed inset-0 top-20 bg-black/60 backdrop-blur-xs z-40 transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu Drawer */}
            <div className="relative z-50 border-t border-[#2C2420] bg-[#14100E] px-6 py-8 shadow-2xl max-h-[calc(100vh-5rem)] overflow-y-auto">
              <nav className="flex flex-col space-y-5">
                <Link
                  href="/collection"
                  prefetch={true}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-serif-luxury text-2xl text-[#FAF8F5] hover:text-[#C4A47C] active:text-[#C4A47C] transition-colors"
                >
                  Collections
                </Link>

                <Link
                  href="/protocol-service"
                  prefetch={true}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-serif-luxury text-2xl text-[#FAF8F5] hover:text-[#C4A47C] active:text-[#C4A47C] transition-colors flex items-center justify-between"
                >
                  <span>Protocol Service</span>
                  <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-[#C4A47C] bg-[#26201C] px-2 py-0.5 rounded-full border border-[#3A312A]">
                    New
                  </span>
                </Link>

                <Link
                  href="/#how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-serif-luxury text-2xl text-[#FAF8F5] hover:text-[#C4A47C] active:text-[#C4A47C] transition-colors"
                >
                  How It Works
                </Link>

                <Link
                  href="/#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-serif-luxury text-2xl text-[#FAF8F5] hover:text-[#C4A47C] active:text-[#C4A47C] transition-colors"
                >
                  Contact Atelier
                </Link>
              </nav>

              {/* Minimal Bottom Action */}
              <div className="pt-8 mt-8 border-t border-[#26201B] space-y-4">
                <a
                  href="https://wa.me/250783036628?text=Hello%20Uno%20Fashion%20Atelier,%20I%20would%20like%20to%20inquire%20about%20suit%20rentals."
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#C4A47C] hover:bg-[#B3936B] text-[#14100E] rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-sm active:scale-98"
                >
                  <span>WhatsApp Concierge (+250 783 036 628)</span>
                </a>

                <p className="text-[11px] text-[#7A7067] text-center font-light">
                  KG 14 Ave, Nyarutarama · Kigali, Rwanda
                </p>
              </div>
            </div>
          </>
        )}
      </header>
    </>
  );
}
