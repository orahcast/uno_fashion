'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Search, Heart, Instagram } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#161210]/95 backdrop-blur-md border-b border-[#2C2420]/80 text-[#FAF8F5] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left Links */}
        <div className="flex items-center space-x-6 text-xs uppercase tracking-widest font-medium text-[#D1C7BD]">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center space-x-2 hover:text-white transition-colors"
          >
            <Menu className="w-4 h-4" />
            <span className="hidden sm:inline">Menu</span>
          </button>

          <Link
            href="/collection"
            className="hover:text-white transition-colors hidden sm:inline-block"
          >
            Collections
          </Link>

          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="flex items-center space-x-1.5 hover:text-white transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>

        {/* Center Brand Identity */}
        <Link href="/" className="flex flex-col items-center group text-center">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C4A47C] font-semibold -mb-0.5">
            Kigali Atelier
          </span>
          <span className="font-serif-luxury text-xl sm:text-2xl tracking-[0.16em] font-medium text-white group-hover:opacity-90 transition-opacity">
            UNO FASHION AGENCY
          </span>
        </Link>

        {/* Right Links & Icons (NO Atelier Portal) */}
        <div className="flex items-center space-x-5 text-xs uppercase tracking-widest font-medium text-[#D1C7BD]">
          <a
            href="#contact"
            className="hover:text-white transition-colors hidden md:inline-block"
          >
            Contact Us
          </a>

          <div className="hidden sm:flex items-center space-x-1 text-[11px] text-[#A69C91] border-l border-[#2C2420] pl-4">
            <span className="text-white font-semibold">RWF</span>
          </div>

          <Link
            href="/collection"
            className="p-1 hover:text-white transition-colors"
            aria-label="Wishlist"
          >
            <Heart className="w-4 h-4" />
          </Link>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="p-1 hover:text-white transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Quick Search Popdown */}
      {searchOpen && (
        <div className="border-t border-[#2C2420] bg-[#1C1613] px-6 py-4 animate-in slide-in-from-top-2">
          <div className="max-w-xl mx-auto flex items-center space-x-3">
            <Search className="w-4 h-4 text-[#A69C91]" />
            <input
              type="text"
              placeholder="Search suits, tuxedos, gowns, fabrics..."
              className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-[#7A7067]"
              autoFocus
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="text-xs text-[#A69C91] hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-[#2C2420] bg-[#161210] px-6 py-8 space-y-6 shadow-2xl animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-4 text-sm font-medium tracking-wider uppercase text-[#E2D8CF]">
            <Link
              href="/collection"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#C4A47C]"
            >
              Collections Catalog
            </Link>
            <Link
              href="/collection?category=suits"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#C4A47C]"
            >
              Tailored Suits & Tuxedos
            </Link>
            <Link
              href="/collection?category=gowns"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#C4A47C]"
            >
              Bespoke Bridal Gowns
            </Link>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#C4A47C]"
            >
              Rental Process
            </a>
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#C4A47C]"
            >
              Suits & Protocol Services
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#C4A47C]"
            >
              Contact Atelier
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
