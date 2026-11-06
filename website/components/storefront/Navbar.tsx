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
              className="hover:text-white transition-colors hidden sm:inline-block"
            >
              Collections
            </Link>
          </div>

          {/* Center Brand Identity */}
          <Link href="/" className="flex flex-col items-center group text-center select-none">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[#C4A47C] font-semibold -mb-0.5">
              Kigali Atelier
            </span>
            <span className="font-serif-luxury text-lg sm:text-2xl tracking-[0.14em] sm:tracking-[0.16em] font-medium text-white group-hover:opacity-90 transition-opacity">
              UNO FASHION AGENCY
            </span>
          </Link>

          {/* Right Links */}
          <div className="flex items-center space-x-3 sm:space-x-5 text-xs uppercase tracking-widest font-medium text-[#D1C7BD]">
            <a
              href="#contact"
              className="hover:text-white transition-colors hidden md:inline-block"
            >
              Contact Us
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="min-w-[44px] min-h-[44px] -mr-2.5 p-2.5 flex items-center justify-center hover:text-white transition-colors cursor-pointer touch-manipulation"
              aria-label="Instagram profile"
            >
              <Instagram className="w-4 h-4 sm:w-4 sm:h-4" />
            </a>
          </div>
        </div>

        {/* Mobile Full-Screen Dropdown Menu */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <div
              className="fixed inset-0 top-20 bg-black/70 backdrop-blur-xs z-40"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu Drawer */}
            <div className="relative z-50 border-t border-[#2C2420] bg-[#161210] px-6 py-6 shadow-2xl max-h-[calc(100vh-5rem)] overflow-y-auto">
              <nav className="flex flex-col divide-y divide-[#2C2420]/60 text-sm font-medium tracking-wider uppercase text-[#E2D8CF]">
                <Link
                  href="/collection"
                  onClick={() => setMobileMenuOpen(false)}
                  className="min-h-[48px] flex items-center hover:text-[#C4A47C] active:text-[#C4A47C] transition-colors touch-manipulation"
                >
                  Collections Catalog
                </Link>
                <Link
                  href="/collection?category=suits"
                  onClick={() => setMobileMenuOpen(false)}
                  className="min-h-[48px] flex items-center hover:text-[#C4A47C] active:text-[#C4A47C] transition-colors touch-manipulation"
                >
                  Tailored Suits & Tuxedos
                </Link>
                <Link
                  href="/collection?category=gowns"
                  onClick={() => setMobileMenuOpen(false)}
                  className="min-h-[48px] flex items-center hover:text-[#C4A47C] active:text-[#C4A47C] transition-colors touch-manipulation"
                >
                  Bespoke Bridal Gowns
                </Link>
                <a
                  href="#how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="min-h-[48px] flex items-center hover:text-[#C4A47C] active:text-[#C4A47C] transition-colors touch-manipulation"
                >
                  Rental Process
                </a>
                <a
                  href="#services"
                  onClick={() => setMobileMenuOpen(false)}
                  className="min-h-[48px] flex items-center hover:text-[#C4A47C] active:text-[#C4A47C] transition-colors touch-manipulation"
                >
                  Suits & Protocol Services
                </a>
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="min-h-[48px] flex items-center hover:text-[#C4A47C] active:text-[#C4A47C] transition-colors touch-manipulation"
                >
                  Contact Atelier
                </a>
              </nav>

              {/* Mobile Quick Action Buttons inside drawer */}
              <div className="pt-6 mt-4 border-t border-[#2C2420] space-y-3">
                <a
                  href="https://wa.me/250783036628?text=Hello%20Uno%20Fashion%20Atelier,%20I%20would%20like%20to%20inquire%20about%20suit%20rentals."
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#C4A47C] text-[#14100E] rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm active:scale-98 transition-all touch-manipulation"
                >
                  WhatsApp Concierge (+250 783 036 628)
                </a>

                <a
                  href="tel:+250783036628"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 border border-[#3D332D] text-white rounded-full text-xs font-medium uppercase tracking-wider active:bg-white/5 transition-all touch-manipulation"
                >
                  <Phone className="w-3.5 h-3.5 text-[#C4A47C]" />
                  <span>Call Direct</span>
                </a>
              </div>
            </div>
          </>
        )}
      </header>
    </>
  );
}
