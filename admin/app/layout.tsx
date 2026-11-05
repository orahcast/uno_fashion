'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  BookOpen,
  Package,
  Settings,
  Bell,
  Search,
  RefreshCw,
  ChevronRight,
  ExternalLink,
  LogOut,
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

  const totalPieces = INITIAL_ITEMS.reduce((sum, item) => sum + item.totalStock, 0);
  const clientBookCount = INITIAL_CLIENT_BOOK.length;
  const webOrdersCount = INITIAL_BOOKINGS.length;

  const navLinks = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Web Orders', href: '/bookings', icon: ShoppingBag, badge: String(webOrdersCount) },
    { label: 'Client Book', href: '/customers', icon: BookOpen, badge: String(clientBookCount) },
    { label: 'Inventory', href: '/inventory', icon: Package, badge: String(totalPieces) },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  const getHeaderMeta = () => {
    if (pathname === '/') {
      return {
        title: 'Dashboard',
        subtitle: "Welcome back — here's your boutique overview at a glance.",
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
    <html lang="en">
      <head>
        <title>Uno Fashion · Inventory Central</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#FAF8F5] flex flex-col md:flex-row font-sans-luxury text-[#191C1A] antialiased">
        {/* Desktop Atelier Dark Sidebar (Retaining Uno Fashion Color Scheme) */}
        <aside className="hidden md:flex flex-col w-64 bg-[#14100E] text-[#FAF8F5] p-5 justify-between flex-shrink-0 border-r border-[#26201B]">
          <div className="space-y-7">
            {/* Atelier Brand */}
            <Link href="/" className="flex items-center space-x-3 px-2 pt-1">
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

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
          {/* Top Header Bar */}
          <header className="bg-[#FAF8F5] border-b border-[#E8E4DC] px-4 sm:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-serif-luxury text-lg font-medium text-[#191C1A] leading-tight">
                {headerMeta.title}
              </h2>
              <p className="text-[11px] text-[#6B726A]">{headerMeta.subtitle}</p>
            </div>

            <div className="flex items-center space-x-3">
              <form onSubmit={handleGlobalSearch} className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-[#8C8075] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  placeholder="Search inventory, clients, orders..."
                  className="w-full bg-[#F2ECE1] border border-[#E5DFD4] rounded-md pl-8 pr-3 py-1.5 text-xs text-[#191C1A] placeholder-[#8C8075] focus:outline-none focus:bg-white focus:border-[#9E7B4F] transition-colors"
                />
              </form>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="p-2 rounded-md bg-[#F2ECE1] border border-[#E5DFD4] text-[#6B726A] hover:text-[#191C1A] transition-colors"
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

        {/* Mobile Bottom Navigation Bar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#14100E] border-t border-[#26201B] text-[#B8ADA2] px-3 py-2 flex items-center justify-around shadow-2xl">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center py-1 ${
                  isActive ? 'text-[#C4A47C] font-semibold' : ''
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px] mt-1">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </body>
    </html>
  );
}
