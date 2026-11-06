'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Shirt,
  Users,
  Sparkles,
  Award,
  BarChart3,
  ExternalLink,
  Settings,
  Bell,
  Search,
  ScanLine,
} from 'lucide-react';
import './globals.css';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navLinks = [
    { label: 'Overview', href: '/', icon: LayoutDashboard },
    { label: 'Bookings', href: '/bookings', icon: Calendar, badge: '2' },
    { label: 'Inventory', href: '/inventory', icon: Shirt },
    { label: 'Accolades & VIP', href: '/accolades', icon: Award },
    { label: 'Customers', href: '/customers', icon: Users },
    { label: 'Services', href: '/services', icon: Sparkles },
    { label: 'Reports', href: '/reports', icon: BarChart3 },
  ];

  return (
    <html lang="en">
      <head>
        <title>Uno Fashion Atelier Manager · Admin PWA</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#FAF8F5] flex flex-col md:flex-row font-sans-luxury text-[#191C1A] antialiased">
        {/* Desktop Atelier Dark Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-[#14100E] text-[#FAF8F5] p-6 justify-between flex-shrink-0 border-r border-[#26201B]">
          <div className="space-y-8">
            {/* Atelier Brand */}
            <Link href="/" className="block">
              <span className="font-serif-luxury text-xl tracking-[0.14em] font-medium block text-white">
                UNO FASHION
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#C4A47C] font-semibold block mt-0.5">
                ATELIER MANAGER
              </span>
            </Link>

            {/* Navigation Links */}
            <nav className="space-y-1.5">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#7A7067] font-semibold block px-3 py-1">
                Workspace
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
                    className={`flex items-center justify-between px-3 py-2.5 text-xs font-medium rounded-sm transition-colors ${
                      isActive
                        ? 'bg-[#26201C] text-white font-semibold'
                        : 'text-[#B8ADA2] hover:text-white hover:bg-[#1E1916]'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="bg-[#C4A47C] text-[#14100E] text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Actions */}
          <div className="space-y-4 pt-6 border-t border-[#26201B]">
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2 text-xs text-[#B8ADA2] hover:text-white px-3 py-1 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View storefront (3000)</span>
            </a>

            <Link
              href="/settings"
              className="flex items-center space-x-2 text-xs text-[#B8ADA2] hover:text-white px-3 py-1 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </Link>

            <div className="flex items-center space-x-3 px-3 pt-2">
              <div className="w-8 h-8 rounded-full bg-[#C4A47C] text-[#14100E] text-xs font-bold flex items-center justify-center">
                UF
              </div>
              <div className="text-left">
                <span className="text-xs font-medium text-white block">
                  Uno Fashion
                </span>
                <span className="text-[10px] text-[#8C8075] block">
                  Atelier Director
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
          {/* Top Navbar */}
          <header className="h-16 bg-[#FAF8F5] border-b border-[#E8E4DC] px-4 sm:px-8 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-[#6B726A]">
              <span>Workspace</span>
              <span>/</span>
              <span className="text-[#191C1A] font-medium capitalize">
                {pathname === '/'
                  ? 'Overview'
                  : pathname.replace('/', '').split('/')[0]}
              </span>
            </div>

            <div className="flex items-center space-x-6 text-xs text-[#6B726A]">
              <span className="hidden sm:inline">Tuesday, 10 November 2026</span>
              <button className="hover:text-[#191C1A]" aria-label="Search">
                <Search className="w-4 h-4" />
              </button>
              <button className="hover:text-[#191C1A] relative" aria-label="Notifications">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#C4A47C]" />
              </button>
              <div className="flex items-center space-x-1.5 text-xs text-[#2D5A38] bg-[#EAF3EC] px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2D5A38]" />
                <span className="font-medium">Showroom open</span>
              </div>
            </div>
          </header>

          {/* Page Children */}
          <main className="p-4 sm:p-8 flex-1">{children}</main>
        </div>

        {/* Mobile-First PWA Bottom Navigation Bar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#14100E] border-t border-[#26201B] text-[#B8ADA2] px-4 py-2 flex items-center justify-around shadow-2xl">
          <Link
            href="/"
            className={`flex flex-col items-center py-1 ${
              pathname === '/' ? 'text-white' : ''
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] mt-1">Overview</span>
          </Link>

          <Link
            href="/bookings"
            className={`flex flex-col items-center py-1 relative ${
              pathname.startsWith('/bookings') ? 'text-white' : ''
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] mt-1">Bookings</span>
            <span className="absolute top-0 right-2 w-2 h-2 bg-[#C4A47C] rounded-full" />
          </Link>

          <Link
            href="/inventory"
            className={`flex flex-col items-center py-1 ${
              pathname.startsWith('/inventory') ? 'text-white' : ''
            }`}
          >
            <Shirt className="w-5 h-5" />
            <span className="text-[10px] mt-1">Inventory</span>
          </Link>

          <Link
            href="/inventory?scan=true"
            className="flex flex-col items-center py-1 text-[#C4A47C]"
          >
            <ScanLine className="w-5 h-5" />
            <span className="text-[10px] mt-1">Scan SKU</span>
          </Link>
        </nav>
      </body>
    </html>
  );
}
