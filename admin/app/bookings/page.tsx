'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Plus,
  Search,
  MessageCircle,
  Trash2,
  Sparkles,
  Shirt,
  Calendar,
  Phone,
} from 'lucide-react';
import { INITIAL_BOOKINGS } from '@/lib/data/mock-catalog';
import { Booking, BookingStatus } from '@/lib/types';

export interface ProtocolBooking {
  id: string;
  bookingNumber: string;
  customerName: string;
  customerPhone: string;
  eventDate: string;
  serviceType: string;
  partySize?: string;
  venue?: string;
  notes?: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | string;
  createdAt: string;
}

export default function BookingsManagementPage() {
  const [orders, setOrders] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [protocolBookings, setProtocolBookings] = useState<ProtocolBooking[]>([]);

  // Distinct separated tabs: 'suits' vs 'protocol'
  const [activeTab, setActiveTab] = useState<'suits' | 'protocol'>('suits');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Confirmed' | 'Delivered' | 'Completed'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Details
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);

  // New Suit Order Form State
  const [newCustomer, setNewCustomer] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newItem, setNewItem] = useState('The Windsor Tuxedo');
  const [newSize, setNewSize] = useState('UK 40');
  const [newPickup, setNewPickup] = useState('2026-11-14');
  const [newReturn, setNewReturn] = useState('2026-11-18');
  const [newAmount, setNewAmount] = useState('185000');

  // Load Protocol Bookings on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('uno_protocol_bookings');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProtocolBookings(parsed);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }

    fetch('/api/protocol-bookings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProtocolBookings(data);
          if (typeof window !== 'undefined') {
            localStorage.setItem('uno_protocol_bookings', JSON.stringify(data));
          }
        }
      })
      .catch((err) => console.error('Error fetching protocol bookings:', err));
  }, []);

  // Filtered Suits Orders
  const filteredSuits = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter === 'Pending' && o.status !== 'Pending' && o.status !== 'Request') return false;
      if (statusFilter === 'Confirmed' && o.status !== 'Confirmed' && o.status !== 'Ready') return false;
      if (statusFilter === 'Delivered' && o.status !== 'Delivered') return false;
      if (statusFilter === 'Completed' && o.status !== 'Completed' && o.status !== 'Returned') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = o.customerName.toLowerCase().includes(q);
        const matchesPhone = o.customerPhone.toLowerCase().includes(q);
        const matchesItem = o.itemName.toLowerCase().includes(q);
        const matchesNum = o.bookingNumber.toLowerCase().includes(q);
        if (!matchesName && !matchesPhone && !matchesItem && !matchesNum) return false;
      }
      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  // Filtered Protocol Bookings
  const filteredProtocol = useMemo(() => {
    return protocolBookings.filter((p) => {
      if (statusFilter === 'Pending' && p.status !== 'Pending') return false;
      if (statusFilter === 'Confirmed' && p.status !== 'Confirmed') return false;
      if (statusFilter === 'Completed' && p.status !== 'Completed') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.customerName.toLowerCase().includes(q);
        const matchesPhone = p.customerPhone.toLowerCase().includes(q);
        const matchesService = p.serviceType.toLowerCase().includes(q);
        const matchesNum = p.bookingNumber.toLowerCase().includes(q);
        const matchesVenue = (p.venue || '').toLowerCase().includes(q);
        if (!matchesName && !matchesPhone && !matchesService && !matchesNum && !matchesVenue) return false;
      }
      return true;
    });
  }, [protocolBookings, statusFilter, searchQuery]);

  // Actions for Suits
  const handleAdvanceSuitStatus = (id: string, currentStatus: BookingStatus) => {
    let nextStatus: BookingStatus = 'Confirmed';
    if (currentStatus === 'Confirmed' || currentStatus === 'Ready') nextStatus = 'Delivered';
    else if (currentStatus === 'Delivered') nextStatus = 'Completed';

    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: nextStatus } : o))
    );
  };

  const handleDeleteSuit = (id: string, orderNum: string) => {
    if (confirm(`Delete suit order ${orderNum}?`)) {
      setOrders((prev) => prev.filter((o) => o.id !== id));
    }
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder: Booking = {
      id: `bk-${Date.now()}`,
      bookingNumber: `#UF-${Math.floor(1050 + Math.random() * 8900)}`,
      customerName: newCustomer,
      customerEmail: `${newCustomer.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      customerPhone: newPhone || '+250 788 000 000',
      type: 'Online',
      itemId: 'item-1',
      itemName: newItem,
      itemSku: 'SU-001',
      size: newSize,
      pickupDate: newPickup,
      returnDate: newReturn,
      rentalFee: Number(newAmount) || 185000,
      depositFee: 100000,
      totalAmount: Number(newAmount) || 185000,
      paymentStatus: 'Paid',
      status: 'Confirmed',
      createdAt: 'Nov 6',
      createdTime: '10:00 AM',
    };
    setOrders([newOrder, ...orders]);
    setShowNewOrderModal(false);
    setNewCustomer('');
    setNewPhone('');
  };

  // Actions for Protocol
  const handleAdvanceProtocolStatus = (id: string, currentStatus: string) => {
    let nextStatus = 'Confirmed';
    if (currentStatus === 'Confirmed') nextStatus = 'Completed';

    const updated = protocolBookings.map((p) =>
      p.id === id ? { ...p, status: nextStatus } : p
    );
    setProtocolBookings(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('uno_protocol_bookings', JSON.stringify(updated));
    }
    fetch('/api/protocol-bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: nextStatus }),
    }).catch(console.error);
  };

  const handleDeleteProtocol = (id: string, bookingNum: string) => {
    if (confirm(`Delete protocol booking ${bookingNum}?`)) {
      const updated = protocolBookings.filter((p) => p.id !== id);
      setProtocolBookings(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('uno_protocol_bookings', JSON.stringify(updated));
      }
      fetch(`/api/protocol-bookings?id=${id}`, { method: 'DELETE' }).catch(console.error);
    }
  };

  const getStatusDot = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'confirmed' || s === 'ready') {
      return {
        label: 'Confirmed',
        dotClass: 'bg-[#2D5A38]',
        textClass: 'text-[#2D5A38]',
      };
    }
    if (s === 'pending' || s === 'request') {
      return {
        label: 'Pending',
        dotClass: 'bg-[#C67D1E]',
        textClass: 'text-[#C67D1E]',
      };
    }
    if (s === 'delivered') {
      return {
        label: 'Delivered',
        dotClass: 'bg-[#1E40AF]',
        textClass: 'text-[#1E40AF]',
      };
    }
    return {
      label: 'Completed',
      dotClass: 'bg-[#6B726A]',
      textClass: 'text-[#6B726A]',
    };
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const currentCount = activeTab === 'suits' ? filteredSuits.length : filteredProtocol.length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl text-[#14100E]">
            {activeTab === 'suits' ? 'Suits Orders' : 'Protocol Bookings'}
          </h1>
          <p className="text-xs text-[#8C8075] mt-0.5">
            {currentCount} {currentCount === 1 ? 'order' : 'orders'} found
          </p>
        </div>

        {activeTab === 'suits' && (
          <button
            type="button"
            onClick={() => setShowNewOrderModal(true)}
            className="inline-flex items-center gap-1.5 bg-[#14100E] hover:bg-[#9E7B4F] text-white px-4 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer self-start sm:self-auto shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Order</span>
          </button>
        )}
      </div>

      {/* Main Category Tabs (Separates Suits and Protocol cleanly) */}
      <div className="flex items-center gap-6 border-b border-[#E8E4DC] text-xs font-semibold">
        <button
          type="button"
          onClick={() => {
            setActiveTab('suits');
            setStatusFilter('All');
          }}
          className={`pb-3 transition-colors cursor-pointer relative ${
            activeTab === 'suits'
              ? 'text-[#14100E]'
              : 'text-[#8C8075] hover:text-[#14100E]'
          }`}
        >
          <span className="flex items-center gap-2">
            <Shirt className="w-3.5 h-3.5" />
            <span>Suits &amp; Outfits</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                activeTab === 'suits' ? 'bg-[#14100E] text-white' : 'bg-[#E8E4DC] text-[#6B726A]'
              }`}
            >
              {orders.length}
            </span>
          </span>
          {activeTab === 'suits' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#14100E] rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('protocol');
            setStatusFilter('All');
          }}
          className={`pb-3 transition-colors cursor-pointer relative ${
            activeTab === 'protocol'
              ? 'text-[#9E7B4F]'
              : 'text-[#8C8075] hover:text-[#9E7B4F]'
          }`}
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#9E7B4F]" />
            <span>Protocol Service</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                activeTab === 'protocol' ? 'bg-[#9E7B4F] text-white' : 'bg-[#E8E4DC] text-[#6B726A]'
              }`}
            >
              {protocolBookings.length}
            </span>
          </span>
          {activeTab === 'protocol' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9E7B4F] rounded-full" />
          )}
        </button>
      </div>

      {/* Sub-Tabs (Status Filter) & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Underline status filters matching reference image */}
        <div className="flex items-center gap-4 text-xs overflow-x-auto pb-1 md:pb-0">
          {(activeTab === 'suits'
            ? ([
                { key: 'All', label: 'All orders' },
                { key: 'Pending', label: 'Pending' },
                { key: 'Confirmed', label: 'Confirmed' },
                { key: 'Delivered', label: 'Delivered' },
                { key: 'Completed', label: 'Completed' },
              ] as const)
            : ([
                { key: 'All', label: 'All bookings' },
                { key: 'Pending', label: 'Pending' },
                { key: 'Confirmed', label: 'Confirmed' },
                { key: 'Completed', label: 'Completed' },
              ] as const)
          ).map((st) => (
            <button
              key={st.key}
              type="button"
              onClick={() => setStatusFilter(st.key)}
              className={`pb-1 text-xs transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === st.key
                  ? 'text-[#14100E] font-bold border-b-2 border-[#14100E]'
                  : 'text-[#8C8075] hover:text-[#14100E] border-b-2 border-transparent'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Minimal Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-[#8C8075] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'suits'
                ? 'Search suit orders...'
                : 'Search protocol bookings...'
            }
            className="w-full bg-white border border-[#E8E4DC] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#191C1A] placeholder-[#8C8075] focus:outline-none focus:border-[#9E7B4F] shadow-2xs"
          />
        </div>
      </div>

      {/* Floating Card Rows Table (Using border-separate & border-spacing-y to guarantee 0 overlapping) */}
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-2.5 text-left text-xs min-w-[850px]">
          <thead>
            <tr className="text-[11px] font-semibold text-[#8C8075] uppercase tracking-wider">
              <th className="pb-1 px-4">Id</th>
              <th className="pb-1 px-4">Customer</th>
              <th className="pb-1 px-4">
                {activeTab === 'suits' ? 'Suit / Outfit' : 'Service Package'}
              </th>
              <th className="pb-1 px-4">Date</th>
              <th className="pb-1 px-4">
                {activeTab === 'suits' ? 'Price' : 'Venue'}
              </th>
              <th className="pb-1 px-4">Status</th>
              <th className="pb-1 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {/* SUITS ORDERS */}
            {activeTab === 'suits' &&
              (filteredSuits.length === 0 ? (
                <tr>
                  <td colSpan={7} className="bg-white rounded-xl border border-[#E8E4DC] p-12 text-center text-xs text-[#8C8075]">
                    No suit orders found matching your search.
                  </td>
                </tr>
              ) : (
                filteredSuits.map((order) => {
                  const statusInfo = getStatusDot(order.status);
                  const cleanPhone = order.customerPhone.replace(/[^0-9+]/g, '');
                  const isPending = order.status === 'Pending' || order.status === 'Request';
                  const isConfirmed = order.status === 'Confirmed' || order.status === 'Ready';

                  return (
                    <tr
                      key={order.id}
                      className="bg-white shadow-2xs hover:shadow-xs transition-shadow group"
                    >
                      {/* Id */}
                      <td className="py-3 px-4 rounded-l-xl border-y border-l border-[#E8E4DC] font-semibold text-[#14100E] whitespace-nowrap">
                        {order.bookingNumber}
                      </td>

                      {/* Customer with Avatar + Clickable Functional Phone */}
                      <td className="py-3 px-4 border-y border-[#E8E4DC] whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#FAF4EB] text-[#9E7B4F] flex items-center justify-center font-bold text-xs shrink-0 border border-[#ECDCCB]">
                            {getInitials(order.customerName)}
                          </div>
                          <div>
                            <div className="font-semibold text-[#191C1A] text-xs">
                              {order.customerName}
                            </div>
                            <a
                              href={`tel:${cleanPhone}`}
                              className="text-[11px] text-[#8C8075] hover:text-[#9E7B4F] flex items-center gap-1 font-mono transition-colors group/phone"
                              title="Click to call customer"
                            >
                              <Phone className="w-2.5 h-2.5 text-[#9E7B4F] group-hover/phone:scale-110 transition-transform" />
                              <span className="underline decoration-dotted decoration-[#D5CFCE] group-hover/phone:decoration-[#9E7B4F]">
                                {order.customerPhone}
                              </span>
                            </a>
                          </div>
                        </div>
                      </td>

                      {/* Suit / Outfit & Size */}
                      <td className="py-3 px-4 border-y border-[#E8E4DC] whitespace-nowrap">
                        <div className="font-medium text-[#191C1A] text-xs">
                          {order.itemName}
                        </div>
                        <span className="inline-block text-[10px] text-[#8C8075] bg-[#FAF8F5] px-1.5 py-0.2 rounded border border-[#E8E4DC] mt-0.5">
                          {order.size}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 border-y border-[#E8E4DC] whitespace-nowrap text-[11px] text-[#52574F]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-[#B8ADA2]" />
                          <span>{order.pickupDate} → {order.returnDate}</span>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 border-y border-[#E8E4DC] whitespace-nowrap font-bold text-[#14100E] text-xs">
                        {order.totalAmount.toLocaleString('en-US')} RWF
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 border-y border-[#E8E4DC] whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 font-medium text-xs ${statusInfo.textClass}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`} />
                          <span>{statusInfo.label}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 rounded-r-xl border-y border-r border-[#E8E4DC] whitespace-nowrap text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          {/* Call Icon */}
                          <a
                            href={`tel:${cleanPhone}`}
                            className="p-1.5 text-[#6B726A] hover:text-[#191C1A] hover:bg-[#FAF8F5] rounded-md transition-colors"
                            title="Call client"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>

                          {/* WhatsApp */}
                          <a
                            href={`https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(
                              `Hello ${order.customerName}, regarding your Uno Fashion suit rental order (${order.bookingNumber}):`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-[#2D6A4F] hover:bg-[#EEF6F0] rounded-md transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>

                          {/* Quick Advance Button */}
                          {isPending && (
                            <button
                              type="button"
                              onClick={() => handleAdvanceSuitStatus(order.id, order.status)}
                              className="bg-[#15803D] hover:bg-[#166534] text-white text-[11px] font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                            >
                              Confirm
                            </button>
                          )}

                          {isConfirmed && (
                            <button
                              type="button"
                              onClick={() => handleAdvanceSuitStatus(order.id, order.status)}
                              className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white text-[11px] font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                            >
                              Deliver
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDeleteSuit(order.id, order.bookingNumber)}
                            className="p-1.5 text-[#8C8075] hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                            title="Delete Order"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ))}

            {/* PROTOCOL BOOKINGS */}
            {activeTab === 'protocol' &&
              (filteredProtocol.length === 0 ? (
                <tr>
                  <td colSpan={7} className="bg-white rounded-xl border border-[#ECDCCB] p-12 text-center text-xs text-[#8C8075]">
                    No protocol bookings found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProtocol.map((proto) => {
                  const statusInfo = getStatusDot(proto.status);
                  const cleanPhone = proto.customerPhone.replace(/[^0-9+]/g, '');
                  const isPending = proto.status === 'Pending';
                  const isConfirmed = proto.status === 'Confirmed';

                  return (
                    <tr
                      key={proto.id}
                      className="bg-white shadow-2xs hover:shadow-xs transition-shadow group"
                    >
                      {/* Id */}
                      <td className="py-3 px-4 rounded-l-xl border-y border-l border-[#ECDCCB] font-semibold text-[#9E7B4F] whitespace-nowrap">
                        {proto.bookingNumber}
                      </td>

                      {/* Customer with Avatar + Clickable Functional Phone */}
                      <td className="py-3 px-4 border-y border-[#ECDCCB] whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#FAF4EB] text-[#9E7B4F] flex items-center justify-center font-bold text-xs shrink-0 border border-[#ECDCCB]">
                            {getInitials(proto.customerName)}
                          </div>
                          <div>
                            <div className="font-semibold text-[#191C1A] text-xs">
                              {proto.customerName}
                            </div>
                            <a
                              href={`tel:${cleanPhone}`}
                              className="text-[11px] text-[#8C8075] hover:text-[#9E7B4F] flex items-center gap-1 font-mono transition-colors group/phone"
                              title="Click to call client"
                            >
                              <Phone className="w-2.5 h-2.5 text-[#9E7B4F] group-hover/phone:scale-110 transition-transform" />
                              <span className="underline decoration-dotted decoration-[#D5CFCE] group-hover/phone:decoration-[#9E7B4F]">
                                {proto.customerPhone}
                              </span>
                            </a>
                          </div>
                        </div>
                      </td>

                      {/* Service Package & Squad */}
                      <td className="py-3 px-4 border-y border-[#ECDCCB] whitespace-nowrap">
                        <div className="font-medium text-[#191C1A] text-xs">
                          {proto.serviceType}
                        </div>
                        {proto.partySize && (
                          <span className="inline-block text-[10px] text-[#8C8075] bg-[#FAF8F5] px-1.5 py-0.2 rounded border border-[#E8E4DC] mt-0.5">
                            {proto.partySize}
                          </span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 border-y border-[#ECDCCB] whitespace-nowrap text-[11px] text-[#52574F]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-[#B8ADA2]" />
                          <span>{proto.eventDate}</span>
                        </div>
                      </td>

                      {/* Venue */}
                      <td className="py-3 px-4 border-y border-[#ECDCCB] whitespace-nowrap text-xs text-[#52574F]">
                        {proto.venue || '—'}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 border-y border-[#ECDCCB] whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 font-medium text-xs ${statusInfo.textClass}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`} />
                          <span>{statusInfo.label}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 rounded-r-xl border-y border-r border-[#ECDCCB] whitespace-nowrap text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          {/* Call Icon */}
                          <a
                            href={`tel:${cleanPhone}`}
                            className="p-1.5 text-[#6B726A] hover:text-[#191C1A] hover:bg-[#FAF8F5] rounded-md transition-colors"
                            title="Call client"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>

                          {/* WhatsApp */}
                          <a
                            href={`https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(
                              `Hello ${proto.customerName}, regarding your Uno Fashion Protocol Service booking (${proto.bookingNumber}):`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-[#2D6A4F] hover:bg-[#EEF6F0] rounded-md transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>

                          {/* Quick Status Advance */}
                          {isPending && (
                            <button
                              type="button"
                              onClick={() => handleAdvanceProtocolStatus(proto.id, proto.status)}
                              className="bg-[#15803D] hover:bg-[#166534] text-white text-[11px] font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                            >
                              Confirm
                            </button>
                          )}

                          {isConfirmed && (
                            <button
                              type="button"
                              onClick={() => handleAdvanceProtocolStatus(proto.id, proto.status)}
                              className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white text-[11px] font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                            >
                              Complete
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDeleteProtocol(proto.id, proto.bookingNumber)}
                            className="p-1.5 text-[#8C8075] hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                            title="Delete Booking"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ))}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-xs text-[#8C8075] pt-2 border-t border-[#E8E4DC]">
        <span>
          Showing {currentCount} of {currentCount} {activeTab === 'suits' ? 'orders' : 'bookings'}
        </span>
        <div className="flex items-center gap-1">
          <span className="px-2 py-0.5 bg-[#14100E] text-white rounded font-medium text-[11px]">1</span>
        </div>
      </div>

      {/* Modal: Record New Suit Order */}
      {showNewOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] max-w-md w-full p-6 border border-[#E8E4DC] shadow-xl rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-3">
              <h3 className="font-serif-luxury text-xl text-[#191C1A]">Record New Suit Order</h3>
              <button
                type="button"
                onClick={() => setShowNewOrderModal(false)}
                className="text-xs text-[#8C8075] hover:text-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#8C8075] mb-1 font-medium">Customer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jean-Luc Habimana"
                  value={newCustomer}
                  onChange={(e) => setNewCustomer(e.target.value)}
                  className="w-full bg-white border border-[#D5CFCE] rounded-md p-2 text-[#191C1A] focus:outline-none focus:border-[#9E7B4F]"
                />
              </div>

              <div>
                <label className="block text-[#8C8075] mb-1 font-medium">Telephone</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +250 788 123 456"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full bg-white border border-[#D5CFCE] rounded-md p-2 text-[#191C1A] focus:outline-none focus:border-[#9E7B4F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8C8075] mb-1 font-medium">Suit / Outfit</label>
                  <select
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    className="w-full bg-white border border-[#D5CFCE] rounded-md p-2 text-[#191C1A]"
                  >
                    <option value="The Windsor Tuxedo">The Windsor Tuxedo</option>
                    <option value="The Céleste Gown">The Céleste Gown</option>
                    <option value="The Oxford Suit">The Oxford Suit</option>
                    <option value="The Amélie Gown">The Amélie Gown</option>
                    <option value="The Riviera Suit">The Riviera Suit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#8C8075] mb-1 font-medium">Size</label>
                  <input
                    type="text"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    className="w-full bg-white border border-[#D5CFCE] rounded-md p-2 text-[#191C1A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8C8075] mb-1 font-medium">Pickup Date</label>
                  <input
                    type="date"
                    value={newPickup}
                    onChange={(e) => setNewPickup(e.target.value)}
                    className="w-full bg-white border border-[#D5CFCE] rounded-md p-2 text-[#191C1A]"
                  />
                </div>
                <div>
                  <label className="block text-[#8C8075] mb-1 font-medium">Return Date</label>
                  <input
                    type="date"
                    value={newReturn}
                    onChange={(e) => setNewReturn(e.target.value)}
                    className="w-full bg-white border border-[#D5CFCE] rounded-md p-2 text-[#191C1A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#8C8075] mb-1 font-medium">Total Amount (RWF)</label>
                <input
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full bg-white border border-[#D5CFCE] rounded-md p-2 text-[#191C1A]"
                />
              </div>

              <div className="pt-2 flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#14100E] hover:bg-[#9E7B4F] text-white py-2 rounded-md font-semibold tracking-wider transition-colors cursor-pointer"
                >
                  Save Suit Order
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewOrderModal(false)}
                  className="bg-white border border-[#D5CFCE] px-4 py-2 rounded-md hover:bg-[#F2ECE1] transition-colors cursor-pointer"
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
