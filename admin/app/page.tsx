'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  TrendingUp,
  Package,
  Shirt,
  Clock,
  CheckCircle2,
  ChevronRight,
  Plus,
  BookOpen,
  Calendar,
  Award,
  ArrowUpRight,
  ShieldCheck,
  X,
  Upload,
  Sparkles,
} from 'lucide-react';
import {
  INITIAL_ITEMS,
  INITIAL_BOOKINGS,
  INITIAL_CLIENT_BOOK,
  ATELIER_TIMELINE,
  INITIAL_METRICS,
} from '@/lib/data/mock-catalog';
import { RentalItem, InventorySimpleStatus, ItemCategory } from '@/lib/types';
import { formatRWF } from '@/lib/utils';

export default function AdminOverviewPage() {
  const [items, setItems] = useState<RentalItem[]>(INITIAL_ITEMS);
  const [showItemModal, setShowItemModal] = useState(false);

  // Modal Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<ItemCategory>('Suits');
  const [formSizeRange, setFormSizeRange] = useState('38–44');
  const [formPrice, setFormPrice] = useState('150000');
  const [formStatus, setFormStatus] = useState<InventorySimpleStatus>('Available');
  const [formImage, setFormImage] = useState<string>('');
  const [protocolBookings, setProtocolBookings] = useState<any[]>([]);

  // Sync with persisted items in localStorage & API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('uno_inventory_items');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setItems(parsed);
          }
        } catch (err) {
          console.error('Failed to parse saved inventory:', err);
        }
      }

      const savedProto = localStorage.getItem('uno_protocol_bookings');
      if (savedProto) {
        try {
          const parsed = JSON.parse(savedProto);
          if (Array.isArray(parsed)) setProtocolBookings(parsed);
        } catch (e) {
          console.error(e);
        }
      }
    }

    fetch('/api/protocol-bookings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data)) setProtocolBookings(data);
      })
      .catch(console.error);
  }, []);

  // Operational Counts
  const availableCount = items.filter(
    (i) => (i.simpleStatus || 'Available') === 'Available'
  ).length;
  const rentedCount = items.filter((i) => i.simpleStatus === 'Rented').length;
  const cleaningCount = items.filter((i) => i.simpleStatus === 'Dry cleaning').length;

  const confirmedRevenue = INITIAL_BOOKINGS.filter(
    (b) =>
      b.status === 'Confirmed' ||
      b.status === 'Delivered' ||
      b.status === 'Completed' ||
      b.status === 'Ready'
  ).reduce((sum, b) => sum + b.rentalFee, 0);

  // Image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    const finalImage =
      formImage.trim() ||
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1200';

    const newItem: RentalItem = {
      id: `item-${Date.now()}`,
      slug: formName.toLowerCase().replace(/\s+/g, '-'),
      name: formName,
      sku: `UF-${Math.floor(100 + Math.random() * 900)}`,
      category: formCategory,
      categorySlug:
        formCategory === 'Bridal gowns'
          ? 'gowns'
          : formCategory === 'Accessories'
          ? 'accessories'
          : 'suits',
      color: 'Classic',
      fabric: 'Atelier Wool',
      fit: 'Tailored fit',
      description: formName,
      rentalPrice: Number(formPrice) || 0,
      refundableDeposit: 100000,
      rentalPeriodDays: 4,
      images: [finalImage],
      sizes: [formSizeRange],
      sizeRange: formSizeRange,
      simpleStatus: formStatus,
      stockBySize: [],
      totalStock: 1,
      readyStock: formStatus === 'Available' ? 1 : 0,
      rentedStock: formStatus === 'Rented' ? 1 : 0,
      inCareStock: formStatus === 'Dry cleaning' ? 1 : 0,
      status: 'Published',
      allowOnlineBooking: true,
      cleaningTurnaroundDays: 1,
    };
    const updated = [newItem, ...items];
    setItems(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('uno_inventory_items', JSON.stringify(updated));
    }
    setShowItemModal(false);
    setFormName('');
    setFormImage('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header & Direct Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <span className="text-xs text-[#8C7B6E] font-medium block">
            Friday, 6 November 2026 · Kigali Atelier
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#2A1810] tracking-tight">
            Atelier Operations &amp; Rentals
          </h1>
          <p className="text-xs text-[#8C7B6E] mt-0.5">
            Real-time overview of suit rentals, walk-in client fittings, and garment turnaround.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <Link
            href="/customers"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#4A2311] bg-white border border-[#E8E0D5] hover:bg-[#FAF6F0] rounded-full transition-colors shadow-2xs"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#E66826]" />
            <span>Client Book</span>
          </Link>

          <Link
            href="/accolades"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#4A2311] bg-white border border-[#E8E0D5] hover:bg-[#FAF6F0] rounded-full transition-colors shadow-2xs"
          >
            <Award className="w-3.5 h-3.5 text-[#E66826]" />
            <span>Celebrity Marquee</span>
          </Link>

          <button
            type="button"
            onClick={() => setShowItemModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#4A2311] hover:bg-[#34180A] rounded-full transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#E66826]" />
            <span>+ Add Garment</span>
          </button>
        </div>
      </div>

      {/* 2. Key Operational Metric Cards (2x2 on Mobile, 4 Columns on Large Screens) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total Pieces (Warm Champagne Gold) */}
        <Link
          href="/inventory"
          className="bg-[#FAF4EB] rounded-2xl p-3.5 sm:p-4 shadow-xs border border-[#ECDCCB] flex flex-col justify-between space-y-3 hover:border-[#9E7B4F] hover:shadow-sm transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#F2E5D4] text-[#9E7B4F] flex items-center justify-center">
              <Package className="w-4 h-4 text-[#9E7B4F]" />
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#9E7B4F]/50 group-hover:text-[#9E7B4F] transition-colors" />
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-xs font-semibold text-[#66462C]">Total Pieces</span>
            <span className="text-base sm:text-lg font-bold text-[#8C542E] font-mono">
              {items.length}
            </span>
          </div>
        </Link>

        {/* Card 2: Available (Fresh Sage Green) */}
        <Link
          href="/inventory"
          className="bg-[#EEF6F0] rounded-2xl p-3.5 sm:p-4 shadow-xs border border-[#D4E8DA] flex flex-col justify-between space-y-3 hover:border-[#2D6A4F] hover:shadow-sm transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#DBEFE1] text-[#2D6A4F] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-[#2D6A4F]" />
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#2D6A4F]/50 group-hover:text-[#2D6A4F] transition-colors" />
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-xs font-semibold text-[#1E4D38]">Available</span>
            <span className="text-base sm:text-lg font-bold text-[#2D6A4F] font-mono">
              {availableCount}
            </span>
          </div>
        </Link>

        {/* Card 3: Currently Out (Refined Navy / Slate Blue) */}
        <Link
          href="/bookings"
          className="bg-[#F0F4FA] rounded-2xl p-3.5 sm:p-4 shadow-xs border border-[#D6E3F2] flex flex-col justify-between space-y-3 hover:border-[#2C5282] hover:shadow-sm transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#DEE9F7] text-[#2C5282] flex items-center justify-center">
              <Shirt className="w-4 h-4 text-[#2C5282]" />
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#2C5282]/50 group-hover:text-[#2C5282] transition-colors" />
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-xs font-semibold text-[#1E3A5F]">Currently Out</span>
            <span className="text-base sm:text-lg font-bold text-[#2C5282] font-mono">
              {rentedCount}
            </span>
          </div>
        </Link>

        {/* Card 4: At Cleaning (Warm Amber / Cognac) */}
        <Link
          href="/inventory"
          className="bg-[#FDF6EB] rounded-2xl p-3.5 sm:p-4 shadow-xs border border-[#F4DEC3] flex flex-col justify-between space-y-3 hover:border-[#A66212] hover:shadow-sm transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#FCECD1] text-[#A66212] flex items-center justify-center">
              <Clock className="w-4 h-4 text-[#A66212]" />
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#A66212]/50 group-hover:text-[#A66212] transition-colors" />
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-xs font-semibold text-[#7A4409]">At Cleaning</span>
            <span className="text-base sm:text-lg font-bold text-[#A66212] font-mono">
              {cleaningCount}
            </span>
          </div>
        </Link>
      </div>

      {/* 3. Two Balanced Operational Lists: Recent Rentals & Walk-In Clients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Recent Web Rentals & Orders */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(42,24,16,0.03)] border border-[#EFEAE4] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE4]">
            <div>
              <h2 className="text-base font-bold text-[#2A1810]">Recent Web Bookings</h2>
              <p className="text-[11px] text-[#8C7B6E]">Online rental reservations &amp; chosen outfits</p>
            </div>
            <Link
              href="/bookings"
              className="text-xs font-semibold text-[#E66826] hover:underline inline-flex items-center gap-1"
            >
              <span>View all ({INITIAL_BOOKINGS.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3.5">
            {/* Protocol Service Inquiries (Highlighted with Gold Accent) */}
            {protocolBookings.slice(0, 2).map((proto: any) => (
              <Link
                key={proto.id}
                href="/bookings"
                className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF4EB]/60 hover:bg-[#FAF4EB] border border-[#ECDCCB] transition-colors gap-3 group"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#F2E5D4] border border-[#ECDCCB] flex items-center justify-center font-bold text-xs text-[#9E7B4F] shrink-0">
                    <Sparkles className="w-4 h-4 text-[#9E7B4F]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs font-semibold text-[#2A1810] truncate">
                        {proto.customerName}
                      </h3>
                      <span className="text-[9px] font-bold text-[#9E7B4F] bg-white px-1.5 py-0.5 rounded border border-[#ECDCCB]">
                        PROTOCOL
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8C7B6E] truncate">
                      {proto.serviceType} · {proto.eventDate || 'Date TBD'}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-[#9E7B4F] block">
                    Inquiry
                  </span>
                  <span
                    className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-0.5 ${
                      proto.status === 'Confirmed'
                        ? 'bg-[#EAF3EC] text-[#2D5A38]'
                        : 'bg-[#FEF6E7] text-[#935D15]'
                    }`}
                  >
                    {proto.status}
                  </span>
                </div>
              </Link>
            ))}

            {INITIAL_BOOKINGS.slice(0, 3).map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF7F2] hover:bg-[#F5EFEB] transition-colors gap-3"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E0D5] flex items-center justify-center font-bold text-xs text-[#8C542E] shrink-0">
                    UF
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-semibold text-[#2A1810] truncate">
                      {booking.itemName}
                    </h3>
                    <p className="text-[11px] text-[#8C7B6E] truncate">
                      {booking.customerName} · {booking.size}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-[#2A1810] block">
                    {formatRWF(booking.rentalFee)}
                  </span>
                  <span
                    className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-0.5 ${
                      booking.status === 'Confirmed'
                        ? 'bg-[#EAF3EC] text-[#2D5A38]'
                        : booking.status === 'Ready'
                        ? 'bg-[#FDF1E8] text-[#E66826]'
                        : 'bg-[#EEF2F6] text-[#3B5269]'
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Walk-In Client Book */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(42,24,16,0.03)] border border-[#EFEAE4] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE4]">
            <div>
              <h2 className="text-base font-bold text-[#2A1810]">Walk-In Client Register</h2>
              <p className="text-[11px] text-[#8C7B6E]">In-person fittings &amp; garment returns</p>
            </div>
            <Link
              href="/customers"
              className="text-xs font-semibold text-[#E66826] hover:underline inline-flex items-center gap-1"
            >
              <span>Client book ({INITIAL_CLIENT_BOOK.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3.5">
            {INITIAL_CLIENT_BOOK.slice(0, 4).map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF7F2] hover:bg-[#F5EFEB] transition-colors gap-3"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-white border border-[#E8E0D5] flex items-center justify-center font-bold text-xs text-[#4A2311] shrink-0">
                    {entry.clientName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-semibold text-[#2A1810] truncate">
                      {entry.clientName}
                    </h3>
                    <p className="text-[11px] text-[#8C7B6E] truncate">
                      {entry.outfitTaken}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-mono text-[#8C7B6E] block">
                    Due: {entry.returnDue}
                  </span>
                  <span
                    className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-0.5 ${
                      entry.status === 'OUT'
                        ? 'bg-[#FDF1E8] text-[#E66826]'
                        : entry.status === 'RETURNED'
                        ? 'bg-[#EAF3EC] text-[#2D5A38]'
                        : 'bg-[#F7F2EB] text-[#8C542E]'
                    }`}
                  >
                    {entry.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Garment Modal */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E8E4DC] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-3">
              <h3 className="font-serif-luxury text-xl font-bold text-[#2A1810]">
                Add New Garment
              </h3>
              <button
                type="button"
                onClick={() => setShowItemModal(false)}
                className="text-xs text-[#8C7B6E] hover:text-[#2A1810] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#8C7B6E] mb-1 font-semibold uppercase text-[10px]">
                  Garment Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asymmetry Shawl Tuxedo"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D5CFCE] rounded-xl p-2.5 text-[#2A1810] focus:outline-none focus:border-[#E66826]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8C7B6E] mb-1 font-semibold uppercase text-[10px]">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ItemCategory)}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFCE] rounded-xl p-2.5 text-[#2A1810] focus:outline-none focus:border-[#E66826]"
                  >
                    <option value="Suits">Suits</option>
                    <option value="Bridal gowns">Bridal gowns</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#8C7B6E] mb-1 font-semibold uppercase text-[10px]">
                    Size Range
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 38–44"
                    value={formSizeRange}
                    onChange={(e) => setFormSizeRange(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFCE] rounded-xl p-2.5 text-[#2A1810] focus:outline-none focus:border-[#E66826]"
                  />
                </div>
              </div>

              {/* Garment Image Upload */}
              <div>
                <label className="block text-[#8C7B6E] mb-1 font-semibold uppercase text-[10px]">
                  Garment Photo / Image
                </label>
                {formImage ? (
                  <div className="relative flex items-center gap-3 p-2.5 bg-[#FAF8F5] border border-[#ECDCCB] rounded-2xl">
                    <div className="relative w-14 h-16 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-[#E8E0D5]">
                      <img
                        src={formImage}
                        alt="Garment preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#2A1810] flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2D6A4F]" />
                        Photo Ready
                      </p>
                      <p className="text-[10px] text-[#8C7B6E] truncate mt-0.5">
                        Will be displayed in client rentals &amp; catalog
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <label className="text-[11px] font-semibold text-[#9E7B4F] hover:underline cursor-pointer">
                          Change photo
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                        <span className="text-[#D5CFCE]">·</span>
                        <button
                          type="button"
                          onClick={() => setFormImage('')}
                          className="text-[11px] font-semibold text-rose-600 hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-3.5 border-2 border-dashed border-[#D5CFCE] hover:border-[#9E7B4F] rounded-2xl bg-[#FAF8F5] hover:bg-[#FAF4EB]/60 transition-colors cursor-pointer group">
                    <div className="w-9 h-9 rounded-full bg-white shadow-2xs flex items-center justify-center text-[#9E7B4F] group-hover:scale-105 transition-transform">
                      <Upload className="w-4 h-4" />
                    </div>
                    <span className="mt-1.5 text-xs font-semibold text-[#2A1810]">
                      Upload garment photo
                    </span>
                    <span className="text-[10px] text-[#8C7B6E]">
                      JPG, PNG, or WebP from your device
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8C7B6E] mb-1 font-semibold uppercase text-[10px]">
                    4-Day Rental Price (Frw)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="150000"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFCE] rounded-xl p-2.5 text-[#2A1810] focus:outline-none focus:border-[#E66826]"
                  />
                </div>

                <div>
                  <label className="block text-[#8C7B6E] mb-1 font-semibold uppercase text-[10px]">
                    Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as InventorySimpleStatus)}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFCE] rounded-xl p-2.5 text-[#2A1810] focus:outline-none focus:border-[#E66826]"
                  >
                    <option value="Available">Available</option>
                    <option value="Rented">On Rental</option>
                    <option value="Dry cleaning">Eco Cleaning</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex space-x-2.5">
                <button
                  type="submit"
                  className="flex-1 bg-[#4A2311] hover:bg-[#34180A] text-white py-2.5 rounded-full font-semibold uppercase tracking-wider text-[11px] transition-colors"
                >
                  Add to Collection
                </button>
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="bg-[#FAF8F5] border border-[#D5CFCE] px-5 py-2.5 rounded-full text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
