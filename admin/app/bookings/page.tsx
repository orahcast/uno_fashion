'use client';

import { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Calendar,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Shield,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { INITIAL_BOOKINGS } from '@/lib/data/mock-catalog';
import { Booking, BookingStatus } from '@/lib/types';
import { formatRWF } from '@/lib/utils';

export default function BookingsManagementPage() {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [activeTab, setActiveTab] = useState<'all' | 'online' | 'walk-in' | 'review'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNewBookingModal, setShowNewBookingModal] = useState(false);

  // New Booking Form State
  const [newCustomer, setNewCustomer] = useState('');
  const [newItem, setNewItem] = useState('Windsor Tuxedo');
  const [newSize, setNewSize] = useState('UK 40');
  const [newPickup, setNewPickup] = useState('2026-11-14');
  const [newReturn, setNewReturn] = useState('2026-11-18');
  const [newStatus, setNewStatus] = useState<BookingStatus>('Confirmed');

  // Status badge style helper matching screenshot
  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'Confirmed':
      case 'Ready':
        return 'bg-[#EAF3EC] text-[#2D5A38]';
      case 'Request':
        return 'bg-[#FEF6E7] text-[#935D15]';
      case 'Due today':
        return 'bg-[#FEF6E7] text-[#935D15]';
      case 'Out on rent':
        return 'bg-[#FBF0EA] text-[#8C4624]';
      default:
        return 'bg-[#EEF2F6] text-[#3B5269]';
    }
  };

  const handleStatusChange = (bookingId: string, nextStatus: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: nextStatus } : b))
    );
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Tab filter
      if (activeTab === 'online' && b.type !== 'Online') return false;
      if (activeTab === 'walk-in' && b.type !== 'Walk-in') return false;
      if (activeTab === 'review' && b.status !== 'Request') return false;

      // Status filter
      if (statusFilter !== 'all' && b.status !== statusFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = b.customerName.toLowerCase().includes(query);
        const matchesItem = b.itemName.toLowerCase().includes(query);
        const matchesBookingNum = b.bookingNumber.toLowerCase().includes(query);
        if (!matchesName && !matchesItem && !matchesBookingNum) return false;
      }

      return true;
    });
  }, [bookings, activeTab, statusFilter, searchQuery]);

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const newBookingObj: Booking = {
      id: `bk-${Date.now()}`,
      bookingNumber: `BK-${Math.floor(1050 + Math.random() * 500)}`,
      customerName: newCustomer,
      customerEmail: `${newCustomer.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      customerPhone: '+250 78 123 4567',
      type: 'Walk-in',
      itemId: 'item-1',
      itemName: newItem,
      itemSku: 'SU-001',
      size: newSize,
      pickupDate: newPickup,
      returnDate: newReturn,
      rentalFee: 185000,
      depositFee: 150000,
      totalAmount: 335000,
      paymentStatus: 'Paid',
      status: newStatus,
      createdAt: '2026-11-04',
    };

    setBookings([newBookingObj, ...bookings]);
    setShowNewBookingModal(false);
    setNewCustomer('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-normal text-[#191C1A]">
            Bookings
          </h1>
          <p className="text-xs text-[#6B726A] mt-1">Online and walk-in rentals.</p>
        </div>

        <button
          onClick={() => setShowNewBookingModal(true)}
          className="inline-flex items-center space-x-2 bg-[#1A2421] text-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors self-start sm:self-auto shadow-sm"
        >
          <span>New booking</span>
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-8 border-b border-[#E8E4DC] overflow-x-auto no-scrollbar">
        {[
          { key: 'all', label: `All bookings ${bookings.length}` },
          { key: 'online', label: 'Online 32' },
          { key: 'walk-in', label: 'Walk-in 14' },
          { key: 'review', label: 'Needs review 2' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`pb-3 text-xs font-medium transition-colors relative whitespace-nowrap ${
              activeTab === tab.key
                ? 'text-[#191C1A] font-semibold'
                : 'text-[#6B726A] hover:text-[#191C1A]'
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#191C1A]" />
            )}
          </button>
        ))}
      </div>

      {/* Search & Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#8C938B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customer or item..."
            className="w-full bg-white border border-[#D5CFCE] pl-10 pr-4 py-2.5 text-xs text-[#191C1A] placeholder-[#8C938B] focus:outline-none focus:border-[#191C1A]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 bg-white border border-[#D5CFCE] px-3.5 py-2 text-xs text-[#191C1A]">
            <span>Nov 2026</span>
            <Calendar className="w-3.5 h-3.5 text-[#8C938B]" />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-[#D5CFCE] px-3.5 py-2 text-xs text-[#191C1A] focus:outline-none"
          >
            <option value="all">Status: All</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Ready">Ready</option>
            <option value="Request">Request</option>
            <option value="Out on rent">Out on rent</option>
            <option value="Due today">Due today</option>
          </select>

          {(searchQuery || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="text-xs text-[#9E7B4F] hover:underline"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white border border-[#E8E4DC] shadow-sm rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-[#848B82] uppercase tracking-wider text-[10px] border-b border-[#E8E4DC]">
              <tr>
                <th className="py-3 px-5 font-semibold">Customer / Booking</th>
                <th className="py-3 px-5 font-semibold">Item / Size</th>
                <th className="py-3 px-5 font-semibold">Pickup</th>
                <th className="py-3 px-5 font-semibold">Return</th>
                <th className="py-3 px-5 font-semibold">Charges</th>
                <th className="py-3 px-5 font-semibold">Payment</th>
                <th className="py-3 px-5 font-semibold">Status</th>
                <th className="py-3 px-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EDE6]">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                  {/* Customer / Booking */}
                  <td className="py-4 px-5">
                    <div className="font-semibold text-sm text-[#191C1A]">
                      {b.customerName}
                    </div>
                    <div className="text-[11px] text-[#6B726A] mt-0.5">
                      {b.bookingNumber} · {b.type}
                    </div>
                  </td>

                  {/* Item / Size */}
                  <td className="py-4 px-5">
                    <div className="font-semibold text-[#191C1A]">
                      {b.itemName}
                    </div>
                    <div className="text-[11px] text-[#6B726A]">
                      {b.size} · 4 days
                    </div>
                  </td>

                  {/* Pickup */}
                  <td className="py-4 px-5">
                    <div className="font-medium text-[#191C1A]">
                      {b.pickupDate.slice(8)} Nov
                    </div>
                    <div className="text-[11px] text-[#6B726A]">2026</div>
                  </td>

                  {/* Return */}
                  <td className="py-4 px-5">
                    <div className="font-medium text-[#191C1A]">
                      {b.returnDate.slice(8)} Nov
                    </div>
                    <div className="text-[11px] text-[#6B726A]">2026</div>
                  </td>

                  {/* Charges */}
                  <td className="py-4 px-5">
                    <div className="font-medium text-[#191C1A]">
                      {formatRWF(b.rentalFee)} rental
                    </div>
                    <div className="text-[11px] text-[#6B726A]">
                      + {formatRWF(b.depositFee)} deposit
                    </div>
                  </td>

                  {/* Payment */}
                  <td className="py-4 px-5">
                    <div
                      className={`font-semibold ${
                        b.paymentStatus === 'Paid'
                          ? 'text-[#2D5A38]'
                          : 'text-[#935D15]'
                      }`}
                    >
                      {b.paymentStatus}
                    </div>
                    <div className="text-[11px] text-[#6B726A]">
                      {formatRWF(b.totalAmount)}
                    </div>
                  </td>

                  {/* Status Pill with Toggle */}
                  <td className="py-4 px-5">
                    <select
                      value={b.status}
                      onChange={(e) =>
                        handleStatusChange(b.id, e.target.value as BookingStatus)
                      }
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-sm border-0 focus:outline-none cursor-pointer ${getStatusBadge(
                        b.status
                      )}`}
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Ready">Ready</option>
                      <option value="Request">Request</option>
                      <option value="Out on rent">Out on rent</option>
                      <option value="Due today">Due today</option>
                      <option value="Returned">Returned</option>
                    </select>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-5 text-right">
                    <button
                      type="button"
                      onClick={() => alert(`Details for ${b.bookingNumber}\nCustomer: ${b.customerName}\nPhone: ${b.customerPhone}\nEmail: ${b.customerEmail}`)}
                      className="text-[#8C938B] hover:text-[#191C1A]"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination matching screenshot */}
        <div className="px-5 py-4 border-t border-[#E8E4DC] flex items-center justify-between text-xs text-[#6B726A]">
          <span>Showing 1–{filteredBookings.length} of 46 bookings</span>
          <div className="flex items-center space-x-2">
            <button className="border border-[#D5CFCE] px-3 py-1.5 hover:bg-neutral-50 rounded-xs">
              Previous
            </button>
            <span className="font-medium text-[#191C1A] px-2">1 of 6</span>
            <button className="border border-[#D5CFCE] px-3 py-1.5 hover:bg-neutral-50 rounded-xs flex items-center space-x-1">
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Annotations matching screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#6B726A]">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-[#9E7B4F]" />
          <span>Deposits are refundable after return inspection.</span>
        </div>
        <div className="flex items-center space-x-2">
          <Info className="w-4 h-4 text-[#9E7B4F]" />
          <span>Confirm requests to reserve stock.</span>
        </div>
      </div>

      {/* Modal: New Booking */}
      {showNewBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] max-w-lg w-full p-6 border border-[#E8E4DC] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-3">
              <h3 className="font-serif-luxury text-2xl text-[#191C1A]">
                Create New Booking
              </h3>
              <button
                onClick={() => setShowNewBookingModal(false)}
                className="text-xs text-[#6B726A] hover:text-black"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#6B726A] mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jean-Luc Habimana"
                  value={newCustomer}
                  onChange={(e) => setNewCustomer(e.target.value)}
                  className="w-full bg-white border border-[#D5CFCE] p-2.5 text-[#191C1A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#6B726A] mb-1">Item</label>
                  <select
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    className="w-full bg-white border border-[#D5CFCE] p-2.5 text-[#191C1A]"
                  >
                    <option value="Windsor Tuxedo">Windsor Tuxedo</option>
                    <option value="Céleste Gown">Céleste Gown</option>
                    <option value="Oxford Suit">Oxford Suit</option>
                    <option value="Amélie Gown">Amélie Gown</option>
                    <option value="Riviera Suit">Riviera Suit</option>
                    <option value="Cathedral Veil">Cathedral Veil</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#6B726A] mb-1">Size</label>
                  <input
                    type="text"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    className="w-full bg-white border border-[#D5CFCE] p-2.5 text-[#191C1A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#6B726A] mb-1">Pickup Date</label>
                  <input
                    type="date"
                    value={newPickup}
                    onChange={(e) => setNewPickup(e.target.value)}
                    className="w-full bg-white border border-[#D5CFCE] p-2.5 text-[#191C1A]"
                  />
                </div>
                <div>
                  <label className="block text-[#6B726A] mb-1">Return Date</label>
                  <input
                    type="date"
                    value={newReturn}
                    onChange={(e) => setNewReturn(e.target.value)}
                    className="w-full bg-white border border-[#D5CFCE] p-2.5 text-[#191C1A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#6B726A] mb-1">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as BookingStatus)}
                  className="w-full bg-white border border-[#D5CFCE] p-2.5 text-[#191C1A]"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Ready">Ready</option>
                  <option value="Request">Request</option>
                  <option value="Out on rent">Out on rent</option>
                </select>
              </div>

              <div className="pt-2 flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#1A2421] text-white py-2.5 font-semibold uppercase tracking-wider"
                >
                  Confirm & Reserve
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewBookingModal(false)}
                  className="bg-white border border-[#D5CFCE] px-4 py-2.5"
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

