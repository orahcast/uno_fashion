'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});
import {
  LayoutDashboard,
  ShoppingBag,
  BookOpen,
  Package,
  Award,
  Sparkles,
  BarChart3,
  Settings,
  Bell,
  Search,
  RefreshCw,
  ChevronRight,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { INITIAL_ITEMS, INITIAL_CLIENT_BOOK, INITIAL_BOOKINGS } from '@/lib/data/mock-catalog';
import './globals.css';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [globalSearch, setGlobalSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [protocolCount, setProtocolCount] = useState(2);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('uno_protocol_bookings');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setProtocolCount(parsed.length);
        } catch (e) {
          console.error(e);
        }
      }
    }
    fetch('/api/protocol-bookings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data)) setProtocolCount(data.length);
      })
      .catch(console.error);
  }, []);

  const totalPieces = INITIAL_ITEMS.reduce((sum, item) => sum + item.totalStock, 0);
  const clientBookCount = INITIAL_CLIENT_BOOK.length;
  const webOrdersCount = INITIAL_BOOKINGS.length;

  const navLinks = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Landing Hero', href: '/hero', icon: Sparkles },
    { label: 'Web Orders', href: '/bookings', icon: ShoppingBag, badge: String(webOrdersCount + protocolCount) },
    { label: 'Client Book', href: '/customers', icon: BookOpen, badge: String(clientBookCount) },
    { label: 'Inventory', href: '/inventory', icon: Package, badge: String(totalPieces) },
    { label: 'Accolades & VIP', href: '/accolades', icon: Award },
    { label: 'Reports', href: '/reports', icon: BarChart3 },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  const getHeaderMeta = () => {
    if (pathname === '/') {
      return {
        title: 'Dashboard',
        subtitle: "Welcome back — here's your boutique overview at a glance.",
      };
    }
    if (pathname.startsWith('/hero')) {
      return {
        title: 'Landing Hero & Storefront Media',
        subtitle: 'Select or upload the main photoshoot image for the Uno Fashion homepage.',
      };
    }
    if (pathname.startsWith('/bookings')) {
      return {
        title: 'Web Orders',
        subtitle: 'Manage online rental orders, chosen outfits and delivery statuses.',
      };
    }
    if (pathname.startsWith('/customers')) {
      return {
        title: 'Client Book',
        subtitle: 'Digital on-site register for walk-in boutique clients and fittings.',
      };
    }
    if (pathname.startsWith('/inventory')) {
      return {
        title: 'Inventory',
        subtitle: 'Manage your full rental catalog in real time.',
      };
    }
    if (pathname.startsWith('/accolades')) {
      return {
        title: 'Celebrity Looks & Certifications',
        subtitle: 'Manage storefront marquee honors, red carpets, and bespoke credentials.',
      };
    }
    if (pathname.startsWith('/settings')) {
      return {
        title: 'Settings',
        subtitle: 'Configure boutique preferences, showroom details, and integrations.',
      };
    }
    return {
      title: 'Atelier Manager',
      subtitle: 'Uno Fashion rental & inventory central.',
    };
  };

  const headerMeta = getHeaderMeta();

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalSearch.trim()) return;
    router.push(`/inventory?q=${encodeURIComponent(globalSearch.trim())}`);
  };

  return (
    <html lang="en" className={`${cormorant.variable} ${plusJakarta.variable}`}>
      <head>
        <title>Uno Fashion · Inventory Central</title>
      </head>
      <body className="min-h-screen bg-[#FAF8F5] flex flex-col lg:flex-row font-sans-luxury text-[#191C1A] antialiased">
        {/* Desktop Atelier Dark Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-[#14100E] text-[#FAF8F5] p-5 justify-between flex-shrink-0 border-r border-[#26201B]">
          <div className="space-y-7">
            {/* Atelier Brand */}
            <Link href="/" prefetch={true} className="flex items-center space-x-3 px-2 pt-1">
              <div className="w-9 h-9 rounded-md bg-[#C4A47C] text-[#14100E] flex items-center justify-center font-serif-luxury font-bold text-lg shadow-xs">
                U
              </div>
              <div>
                <span className="font-serif-luxury text-lg tracking-[0.1em] font-semibold block text-white leading-tight">
                  Uno Fashion
                </span>
                <span className="text-[9px] uppercase tracking-[0.22em] text-[#C4A47C] font-semibold block">
                  INVENTORY CENTRAL
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="space-y-1">
              <span className="text-[10px] uppercase tracking-[0.18em] text-[#7A7067] font-semibold block px-3 pb-2">
                MAIN MENU
              </span>

              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={true}
                    className={`flex items-center justify-between px-3.5 py-2.5 text-xs font-medium rounded-md transition-all ${
                      isActive
                        ? 'bg-[#26201C] text-white font-semibold border border-[#3A312A] shadow-2xs'
                        : 'text-[#B8ADA2] hover:text-white hover:bg-[#1E1916]'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#C4A47C]' : ''}`} />
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {item.badge && (
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-[#C4A47C] text-[#14100E]'
                              : 'bg-[#26201C] text-[#C4A47C]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#C4A47C]" />}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom User Profile & Quick Links */}
          <div className="space-y-3 pt-5 border-t border-[#26201B]">
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2 text-xs text-[#B8ADA2] hover:text-white px-2.5 py-1.5 rounded-md hover:bg-[#1E1916] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#C4A47C]" />
              <span>View Storefront</span>
            </a>

            <div className="flex items-center space-x-3 px-2.5 py-1.5">
              <div className="w-8 h-8 rounded-full bg-[#C4A47C] text-[#14100E] text-xs font-bold flex items-center justify-center flex-shrink-0">
                O
              </div>
              <div className="text-left min-w-0">
                <span className="text-xs font-semibold text-white block truncate">
                  Boutique Owner
                </span>
                <span className="text-[10px] text-[#8C8075] block truncate">
                  owner@unofashion.rw
                </span>
              </div>
            </div>

            <Link
              href="/login"
              className="flex items-center space-x-2 text-xs text-[#B8ADA2] hover:text-white px-2.5 py-1.5 rounded-md hover:bg-[#1E1916] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </Link>
          </div>
        </aside>

        {/* Mobile & Tablet Slide-Out Drawer Navigation */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop Overlay */}
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
              onClick={() => setSidebarOpen(false)}
            />

            {/* Drawer Panel */}
            <aside className="relative w-72 max-w-[85vw] h-full bg-[#14100E] text-[#FAF8F5] p-5 flex flex-col justify-between shadow-2xl z-50 animate-in slide-in-from-left duration-200">
              <div className="space-y-6">
                {/* Brand Header with Close Button */}
                <div className="flex items-center justify-between pt-1">
                  <Link
                    href="/"
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-9 h-9 rounded-md bg-[#C4A47C] text-[#14100E] flex items-center justify-center font-serif-luxury font-bold text-lg shadow-xs">
                      U
                    </div>
                    <div>
                      <span className="font-serif-luxury text-lg tracking-[0.1em] font-semibold block text-white leading-tight">
                        Uno Fashion
                      </span>
                      <span className="text-[9px] uppercase tracking-[0.22em] text-[#C4A47C] font-semibold block">
                        INVENTORY CENTRAL
                      </span>
                    </div>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 -mr-2 rounded-lg text-[#B8ADA2] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label="Close navigation menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-14rem)]">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-[#7A7067] font-semibold block px-3 pb-1">
                    MAIN MENU
                  </span>

                  {navLinks.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      item.href === '/'
                        ? pathname === '/'
                        : pathname.startsWith(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        prefetch={true}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-3 text-xs font-medium rounded-lg transition-all touch-manipulation ${
                          isActive
                            ? 'bg-[#26201C] text-white font-semibold border border-[#3A312A] shadow-2xs'
                            : 'text-[#B8ADA2] hover:text-white hover:bg-[#1E1916]'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-[#C4A47C]' : ''}`} />
                          <span>{item.label}</span>
                        </div>

                        {item.badge && (
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              isActive
                                ? 'bg-[#C4A47C] text-[#14100E]'
                                : 'bg-[#26201C] text-[#C4A47C]'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom User Profile & View Storefront */}
              <div className="space-y-3 pt-5 border-t border-[#26201B]">
                <a
                  href="http://localhost:3000"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-2 text-xs text-[#B8ADA2] hover:text-white px-2.5 py-2 rounded-md hover:bg-[#1E1916] transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#C4A47C]" />
                  <span>View Storefront</span>
                </a>

                <div className="flex items-center space-x-3 px-2.5 py-1.5">
                  <div className="w-8 h-8 rounded-full bg-[#C4A47C] text-[#14100E] text-xs font-bold flex items-center justify-center flex-shrink-0">
                    O
                  </div>
                  <div className="text-left min-w-0">
                    <span className="text-xs font-semibold text-white block truncate">
                      Boutique Owner
                    </span>
                    <span className="text-[10px] text-[#8C8075] block truncate">
                      owner@unofashion.rw
                    </span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 pb-8">
          {/* Top Header Bar */}
          <header className="bg-[#FAF8F5] border-b border-[#E8E4DC] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              {/* Mobile & Tablet Hamburger Button */}
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 rounded-lg text-[#191C1A] hover:bg-[#EAE4D9] active:bg-[#DDD5C7] transition-colors touch-manipulation cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div>
                <h2 className="font-serif-luxury text-base sm:text-lg font-medium text-[#191C1A] leading-tight">
                  {headerMeta.title}
                </h2>
                <p className="text-[11px] text-[#6B726A] hidden sm:block">{headerMeta.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              <form onSubmit={handleGlobalSearch} className="relative w-36 sm:w-64 md:w-72">
                <Search className="w-3.5 h-3.5 text-[#8C8075] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full bg-[#F2ECE1] border border-[#E5DFD4] rounded-md pl-8 pr-3 py-1.5 text-xs text-[#191C1A] placeholder-[#8C8075] focus:outline-none focus:bg-white focus:border-[#9E7B4F] transition-colors"
                />
              </form>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="p-2 rounded-md bg-[#F2ECE1] border border-[#E5DFD4] text-[#6B726A] hover:text-[#191C1A] transition-colors hidden sm:inline-flex"
                title="Refresh"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                className="p-2 rounded-md bg-[#F2ECE1] border border-[#E5DFD4] text-[#6B726A] hover:text-[#191C1A] relative transition-colors"
                title="Notifications"
              >
                <Bell className="w-3.5 h-3.5" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#9E7B4F]" />
              </button>

              <div className="w-7 h-7 rounded-full bg-[#9E7B4F] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                O
              </div>
            </div>
          </header>

          {/* Page Children */}
          <main className="p-4 sm:p-8 flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
