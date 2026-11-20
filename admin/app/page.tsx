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
import { RentalItem, InventorySimpleStatus, ItemCategory } from '@/lib/types';
import { formatRWF } from '@/lib/utils';
import GarmentModal from '@/components/GarmentModal';

export default function AdminOverviewPage() {
  const [items, setItems] = useState<RentalItem[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [clientBook, setClientBook] = useState<any[]>([]);
  const [protocolBookings, setProtocolBookings] = useState<any[]>([]);
  const [showItemModal, setShowItemModal] = useState(false);

  // Sync with live database and persisted items
  useEffect(() => {
    // 1. Fetch live items
    fetch('/api/items')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data)) {
          const deleted = typeof window !== 'undefined'
            ? JSON.parse(localStorage.getItem('uno_deleted_item_ids') || '[]')
            : [];
          setItems(data.filter((item: any) => !deleted.includes(item.id)));
        }
      })
      .catch(console.error);

    // 2. Fetch live bookings
    fetch('/api/bookings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data)) {
          const deleted = typeof window !== 'undefined'
            ? JSON.parse(localStorage.getItem('uno_deleted_booking_ids') || '[]')
            : [];
          setBookings(data.filter((b: any) => !deleted.includes(b.id)));
        }
      })
      .catch(console.error);

    // 3. Fetch client book
    fetch('/api/client-book')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data)) {
          const deleted = typeof window !== 'undefined'
            ? JSON.parse(localStorage.getItem('uno_deleted_client_book_ids') || '[]')
            : [];
          setClientBook(data.filter((e: any) => !deleted.includes(e.id)));
        }
      })
      .catch(console.error);

    if (typeof window !== 'undefined') {
      const deletedItems = JSON.parse(localStorage.getItem('uno_deleted_item_ids') || '[]');
      const saved = localStorage.getItem('uno_inventory_items');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setItems(parsed.filter((item: any) => !deletedItems.includes(item.id)));
          }
        } catch (err) {
          console.error('Failed to parse saved inventory:', err);
        }
      }

      const deletedProto = JSON.parse(localStorage.getItem('uno_deleted_protocol_ids') || '[]');
      const savedProto = localStorage.getItem('uno_protocol_bookings');
      if (savedProto) {
        try {
          const parsed = JSON.parse(savedProto);
          if (Array.isArray(parsed)) {
            setProtocolBookings(parsed.filter((p: any) => !deletedProto.includes(p.id)));
          }
        } catch (e) {
          console.error(e);
        }
      }
    }

    fetch('/api/protocol-bookings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data)) {
          const deletedProto = typeof window !== 'undefined'
            ? JSON.parse(localStorage.getItem('uno_deleted_protocol_ids') || '[]')
            : [];
          setProtocolBookings(data.filter((p: any) => !deletedProto.includes(p.id)));
        }
      })
      .catch(console.error);
  }, []);

  // Operational Counts
  const availableCount = items.filter(
    (i) => (i.simpleStatus || 'Available') === 'Available'
  ).length;
  const rentedCount = items.filter((i) => i.simpleStatus === 'Rented').length;
  const cleaningCount = items.filter((i) => i.simpleStatus === 'Dry cleaning').length;

  const confirmedRevenue = bookings.filter(
    (b) =>
      b.status === 'Confirmed' ||
      b.status === 'Delivered' ||
      b.status === 'Completed' ||
      b.status === 'Ready'
  ).reduce((sum, b) => sum + (b.rentalFee || 0), 0);

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
              <span>View all ({bookings.length + protocolBookings.length})</span>
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

            {bookings.slice(0, 3).map((booking: any) => (
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
                      {booking.customerName} {booking.size ? `· ${booking.size}` : ''}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-[#2A1810] block">
                    {formatRWF(booking.totalAmount || booking.rentalFee || 0)}
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

            {bookings.length === 0 && protocolBookings.length === 0 && (
              <div className="p-6 text-center text-xs text-[#8C7B6E] bg-[#FAF7F2] rounded-2xl border border-[#EFEAE4]">
                No web orders recorded yet.
              </div>
            )}
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
              <span>Client book ({clientBook.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3.5">
            {clientBook.slice(0, 4).map((entry: any) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF7F2] hover:bg-[#F5EFEB] transition-colors gap-3"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-white border border-[#E8E0D5] flex items-center justify-center font-bold text-xs text-[#4A2311] shrink-0">
                    {(entry.clientName || 'C').charAt(0)}
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

            {clientBook.length === 0 && (
              <div className="p-6 text-center text-xs text-[#8C7B6E] bg-[#FAF7F2] rounded-2xl border border-[#EFEAE4]">
                No walk-in clients logged yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Unified Add Garment Modal */}
      <GarmentModal
        isOpen={showItemModal}
        onClose={() => setShowItemModal(false)}
        onSaved={(newItem) => {
          setItems((prev) => [newItem, ...prev.filter((i) => i.id !== newItem.id)]);
          if (typeof window !== 'undefined') {
            try {
              const current = [newItem, ...items.filter((i) => i.id !== newItem.id)];
              localStorage.setItem('uno_inventory_items', JSON.stringify(current));
            } catch (e) {}
          }
        }}
      />
    </div>
  );
}
