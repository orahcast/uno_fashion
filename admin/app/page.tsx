'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Calendar,
  Shirt,
  Shield,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { INITIAL_METRICS, INITIAL_BOOKINGS, ATELIER_TIMELINE } from '@/lib/data/mock-catalog';
import { formatRWF } from '@/lib/utils';

export default function AdminOverviewPage() {
  const [showAddBooking, setShowAddBooking] = useState(false);
  const [newCustomer, setNewCustomer] = useState('');
  const [newItem, setNewItem] = useState('Windsor Tuxedo');
  const [newDate, setNewDate] = useState('2026-11-15');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const upcomingPickups = INITIAL_BOOKINGS.filter(
    (b) => b.status === 'Ready' || b.status === 'Confirmed'
  ).slice(0, 4);

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setShowAddBooking(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-normal text-[#191C1A]">
            Today at the atelier.
          </h1>
          <p className="text-xs text-[#6B726A] mt-0.5">Manage today&apos;s bookings and fitting appointments.</p>
        </div>

        <button
          onClick={() => setShowAddBooking(true)}
          className="inline-flex items-center space-x-1.5 bg-[#14100E] text-white px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors self-start sm:self-auto shadow-xs rounded-xs"
        >
          <span>Add booking</span>
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Daily Digest Alert Banner */}
      <div className="bg-[#F2ECE1] border border-[#E5DFD4] p-3 flex items-center space-x-2.5 text-xs text-[#4A4E47] rounded-xs">
        <Calendar className="w-4 h-4 text-[#9E7B4F] flex-shrink-0" />
        <span>
          <strong>Today:</strong> 1 pickup, 1 return and 3 fittings. 2 online requests need review.
        </span>
      </div>

      {/* 4 Metric KPI Cards with balanced heights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Dark Revenue Card */}
        <div className="bg-[#1E1916] text-[#FAF8F5] p-5 shadow-xs rounded-xs flex flex-col justify-between">
          <div className="text-[11px] text-[#A69C91]">
            <span>Rental revenue · November</span>
          </div>
          <div className="my-2.5">
            <span className="font-serif-luxury text-2xl sm:text-3xl font-normal tracking-tight block">
              8,420,000 Frw
            </span>
          </div>
          <span className="text-[10px] text-[#7A7067]">
            Rental only · excludes deposits
          </span>
        </div>

        {/* Bookings Card */}
        <div className="bg-white border border-[#E8E4DC] p-5 shadow-xs rounded-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#6B726A]">
            <span>Bookings · November</span>
            <Calendar className="w-3.5 h-3.5 text-[#9E7B4F]" />
          </div>
          <div className="my-2.5">
            <span className="font-serif-luxury text-2xl sm:text-3xl font-normal text-[#191C1A] block">
              {INITIAL_METRICS.monthlyBookings}
            </span>
          </div>
          <span className="text-[10px] text-[#6B726A]">
            {INITIAL_METRICS.onlineBookingsCount} online · {INITIAL_METRICS.walkInBookingsCount} walk-in
          </span>
        </div>

        {/* Currently Rented Card */}
        <div className="bg-white border border-[#E8E4DC] p-5 shadow-xs rounded-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#6B726A]">
            <span>Currently out on rent</span>
            <Shirt className="w-3.5 h-3.5 text-[#9E7B4F]" />
          </div>
          <div className="my-2.5">
            <span className="font-serif-luxury text-2xl sm:text-3xl font-normal text-[#191C1A] block">
              {INITIAL_METRICS.currentlyRentedCount}
            </span>
          </div>
          <span className="text-[10px] text-[#6B726A]">
            1 due today · none overdue
          </span>
        </div>

        {/* Refundable Deposits Card */}
        <div className="bg-white border border-[#E8E4DC] p-5 shadow-xs rounded-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#6B726A]">
            <span>Refundable deposits held</span>
            <Shield className="w-3.5 h-3.5 text-[#9E7B4F]" />
          </div>
          <div className="my-2.5">
            <span className="font-serif-luxury text-2xl sm:text-3xl font-normal text-[#191C1A] block">
              3,150,000 Frw
            </span>
          </div>
          <span className="text-[10px] text-[#6B726A]">
            Separate from rental revenue
          </span>
        </div>
      </div>

      {/* Main Two-Column Workflow Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Upcoming Pickups Table */}
        <div className="lg:col-span-8 bg-white border border-[#E8E4DC] shadow-xs rounded-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-3">
            <div>
              <h2 className="font-serif-luxury text-xl font-normal text-[#191C1A]">
                Upcoming pickups
              </h2>
              <p className="text-[11px] text-[#6B726A]">
                Next 7 days · Confirmed bookings
              </p>
            </div>
            <Link
              href="/bookings"
              className="text-xs font-semibold text-[#9E7B4F] hover:text-[#191C1A] flex items-center space-x-1"
            >
              <span>All bookings</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[#848B82] uppercase tracking-wider text-[10px] border-b border-[#E8E4DC] pb-2">
                  <th className="pb-2.5 font-semibold">Customer / Booking</th>
                  <th className="pb-2.5 font-semibold">Rental Piece</th>
                  <th className="pb-2.5 font-semibold">Pickup</th>
                  <th className="pb-2.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EDE6]">
                {upcomingPickups.map((booking) => (
                  <tr key={booking.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="py-3">
                      <div className="font-semibold text-[#191C1A]">
                        {booking.customerName}
                      </div>
                      <div className="text-[10px] text-[#6B726A]">
                        {booking.bookingNumber} · {booking.type}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="font-medium text-[#191C1A]">
                        {booking.itemName}
                      </div>
                      <div className="text-[10px] text-[#6B726A]">
                        {booking.size} · {formatRWF(booking.rentalFee)} rental
                      </div>
                    </td>
                    <td className="py-3 text-[#191C1A] font-medium">
                      {booking.pickupDate.slice(8)} Nov
                    </td>
                    <td className="py-3">
                      <span className="inline-block px-2 py-0.5 rounded-xs text-[10px] font-semibold bg-[#EAF3EC] text-[#2D5A38]">
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Today at the Atelier Timeline */}
        <div className="lg:col-span-4 bg-white border border-[#E8E4DC] shadow-xs rounded-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-3">
            <div>
              <h2 className="font-serif-luxury text-xl font-normal text-[#191C1A]">
                Today at the atelier
              </h2>
              <p className="text-[11px] text-[#6B726A]">Tuesday, 10 November</p>
            </div>
            <span className="text-xs font-semibold text-[#9E7B4F] cursor-pointer hover:underline">
              Calendar →
            </span>
          </div>

          <div className="space-y-4">
            {ATELIER_TIMELINE.map((event, idx) => (
              <div key={idx} className="flex items-start space-x-3">
                <span className="text-[11px] font-mono font-medium text-[#6B726A] w-11 pt-0.5">
                  {event.time}
                </span>
                <div className="space-y-0.5 border-l-2 border-[#E8E4DC] pl-2.5">
                  <div className="text-xs font-semibold text-[#191C1A]">
                    {event.title}
                  </div>
                  <div className="text-[10px] text-[#7B8079]">
                    {event.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Booking Modal */}
      {showAddBooking && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] max-w-md w-full p-6 border border-[#E8E4DC] shadow-2xl space-y-4 rounded-xs">
            <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-3">
              <h3 className="font-serif-luxury text-xl text-[#191C1A]">
                Create Walk-In / Phone Booking
              </h3>
              <button
                onClick={() => setShowAddBooking(false)}
                className="text-xs text-[#6B726A] hover:text-black"
              >
                ✕
              </button>
            </div>

            {bookingSuccess ? (
              <div className="p-3 bg-[#EAF3EC] text-[#2D5A38] text-xs flex items-center space-x-2 rounded-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Booking created successfully!</span>
              </div>
            ) : (
              <form onSubmit={handleCreateBooking} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[#6B726A] mb-1">Customer Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Patrick Mugabo"
                    value={newCustomer}
                    onChange={(e) => setNewCustomer(e.target.value)}
                    className="w-full bg-white border border-[#D5CFCE] p-2 text-[#191C1A]"
                  />
                </div>

                <div>
                  <label className="block text-[#6B726A] mb-1">Select Garment</label>
                  <select
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    className="w-full bg-white border border-[#D5CFCE] p-2 text-[#191C1A]"
                  >
                    <option value="Windsor Tuxedo">Windsor Tuxedo (SU-001)</option>
                    <option value="Céleste Gown">Céleste Gown (BR-001)</option>
                    <option value="Oxford Suit">Oxford Suit (SU-002)</option>
                    <option value="Amélie Gown">Amélie Gown (BR-002)</option>
                    <option value="Riviera Suit">Riviera Suit (SU-003)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#6B726A] mb-1">Pickup Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-white border border-[#D5CFCE] p-2 text-[#191C1A]"
                  />
                </div>

                <div className="pt-2 flex space-x-2">
                  <button
                    type="submit"
                    className="flex-1 bg-[#14100E] text-white py-2 font-semibold uppercase tracking-wider"
                  >
                    Save Booking
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddBooking(false)}
                    className="bg-white border border-[#D5CFCE] px-3 py-2"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
