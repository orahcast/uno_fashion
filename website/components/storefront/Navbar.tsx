'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X, Instagram, Phone, ArrowUpRight } from 'lucide-react';
import { TikTokIcon } from './Icons';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu automatically when window is resized to desktop viewport
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

          {/* 1. Left Side: Brand Logo */}
          <Link
            href="/"
            prefetch={true}
            className="flex items-center gap-3 group select-none shrink-0"
            aria-label="Uno Fashion Agency Home"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-white shrink-0 p-0.5 border border-[#C4A47C]/50 shadow-xs group-hover:border-[#C4A47C] transition-colors">
              <Image
                src="/logo.png"
                alt="Uno Fashion Agency Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.28em] text-[#C4A47C] font-semibold -mb-0.5">
                Kigali Atelier
              </span>
              <span className="font-serif-luxury text-base sm:text-xl lg:text-2xl tracking-[0.14em] font-medium text-white group-hover:text-[#E8DEC8] transition-colors whitespace-nowrap">
                UNO FASHION AGENCY
              </span>
            </div>
          </Link>

          {/* 2. Center/Right: Desktop Navigation Links (hidden on mobile/tablet resize) */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 text-xs uppercase tracking-widest font-medium text-[#D1C7BD]">
            <Link
              href="/collection"
              prefetch={true}
              className="hover:text-white transition-colors"
            >
              Collections
            </Link>

            <Link
              href="/protocol-service"
              prefetch={true}
              className="hover:text-[#C4A47C] text-[#E8DEC8] transition-colors flex items-center gap-1.5 font-semibold"
            >
              <span>Protocol Service</span>
              <span className="text-[9px] uppercase tracking-wider text-[#C4A47C] bg-[#2A221C] px-1.5 py-0.5 rounded-full border border-[#3E332A]">
                VIP
              </span>
            </Link>

            <Link
              href="/#how-it-works"
              className="hover:text-white transition-colors"
            >
              How It Works
            </Link>
          </nav>

          {/* 3. Right Side: Desktop Contact Us CTA + Mobile Hamburger Toggle */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Desktop Contact Us CTA button */}
            <Link
              href="/#contact"
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#C4A47C] hover:bg-[#B3936B] text-[#14100E] transition-all shadow-xs active:scale-95"
            >
              <span>Contact Us</span>
            </Link>

            {/* Mobile / Responsive Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden min-w-[44px] min-h-[44px] p-2.5 rounded-lg flex items-center justify-center text-[#D1C7BD] hover:text-white hover:bg-white/10 active:bg-white/15 transition-colors cursor-pointer touch-manipulation focus:outline-none"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-[#C4A47C]" />
              ) : (
                <Menu className="w-6 h-6 text-[#FAF8F5]" />
              )}
            </button>
          </div>
        </div>

        {/* 4. Responsive Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <div
              className="fixed inset-0 top-20 bg-black/70 backdrop-blur-xs z-40 transition-opacity md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu Drawer */}
            <div className="relative z-50 border-t border-[#2C2420] bg-[#14100E] px-6 py-8 shadow-2xl max-h-[calc(100vh-5rem)] overflow-y-auto md:hidden">
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
                    VIP
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
                  Contact Us
                </Link>
              </nav>

              {/* Mobile Actions: Contact Us & WhatsApp */}
              <div className="pt-6 mt-6 border-t border-[#26201B] space-y-3">
                <Link
                  href="/#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#C4A47C] hover:bg-[#B3936B] text-[#14100E] rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-sm active:scale-98"
                >
                  <span>Contact Us &amp; Book Fitting</span>
                </Link>
                <a
                  href="https://wa.me/250783036628?text=Hello%20Uno%20Fashion%20Atelier,%20I%20would%20like%20to%20inquire%20about%20suit%20rentals."
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#C4A47C] hover:bg-[#B3936B] text-[#14100E] rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-sm active:scale-98"
                >
                  <span>WhatsApp Concierge (+250 783 036 628)</span>
                </a>

                {/* Mobile Social Channels */}
                <div className="pt-4 mt-4 border-t border-[#26201B] space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#C4A47C] block">
                    Official Social Channels
                  </span>
                  <div className="grid grid-cols-1 gap-2 pt-1">
                    <a
                      href="https://www.instagram.com/uno_fashion_agency_ltd"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#1C1613] border border-[#2E251F] hover:border-[#C4A47C]/50 text-xs text-[#FAF8F5] transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Instagram className="w-4 h-4 text-[#C4A47C]" />
                        <div className="text-left">
                          <p className="font-medium text-white leading-tight">Suits &amp; Atelier IG</p>
                          <p className="text-[10px] text-[#9C9187]">@uno_fashion_agency_ltd</p>
                        </div>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#C4A47C]" />
                    </a>

                    <a
                      href="https://www.instagram.com/reel/DHQODhAt-Jt/?evlk=aDM2OGU1YThtNmt2"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#1C1613] border border-[#2E251F] hover:border-[#C4A47C]/50 text-xs text-[#FAF8F5] transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Instagram className="w-4 h-4 text-[#C4A47C]" />
                        <div className="text-left">
                          <p className="font-medium text-white leading-tight">Wedding Protocol IG</p>
                          <p className="text-[10px] text-[#9C9187]">Ceremonial VIP Service</p>
                        </div>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#C4A47C]" />
                    </a>

                    <a
                      href="https://vt.tiktok.com/ZSpncSG5R/"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#1C1613] border border-[#2E251F] hover:border-[#C4A47C]/50 text-xs text-[#FAF8F5] transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <TikTokIcon className="w-4 h-4 text-[#C4A47C]" />
                        <div className="text-left">
                          <p className="font-medium text-white leading-tight">Official TikTok</p>
                          <p className="text-[10px] text-[#9C9187]">Runway &amp; Fitting Looks</p>
                        </div>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#C4A47C]" />
                    </a>
                  </div>
                </div>

                <p className="text-[11px] text-[#7A7067] text-center font-light pt-2">
                  KN 74 St, Nyarugenge · Kigali, Rwanda
                </p>
              </div>
            </div>
          </>
        )}
      </header>
    </>
  );
}
