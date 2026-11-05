'use client';

import { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  ShoppingBag,
  Clock,
  CheckCircle2,
  CreditCard,
  ChevronRight,
  Phone,
  Calendar,
  Eye,
  Trash2,
} from 'lucide-react';
import { INITIAL_BOOKINGS } from '@/lib/data/mock-catalog';
import { Booking, BookingStatus } from '@/lib/types';

export default function BookingsManagementPage() {
  const [orders, setOrders] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [statusFilter, setStatusFilter] = useState<
    'All' | 'Pending' | 'Confirmed' | 'Delivered' | 'Completed'
  >('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Booking | null>(null);

  // New Order Form State
  const [newCustomer, setNewCustomer] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newItem, setNewItem] = useState('The Windsor Tuxedo');
  const [newSize, setNewSize] = useState('UK 40');
  const [newPickup, setNewPickup] = useState('2026-11-14');
  const [newReturn, setNewReturn] = useState('2026-11-18');
  const [newAmount, setNewAmount] = useState('185000');

  const pendingCount = orders.filter(
    (o) => o.status === 'Pending' || o.status === 'Request'
  ).length;
  const confirmedCount = orders.filter(
    (o) => o.status === 'Confirmed' || o.status === 'Ready'
  ).length;
  const confirmedRevenue = orders
    .filter(
      (o) =>
        o.status === 'Confirmed' ||
        o.status === 'Ready' ||
        o.status === 'Delivered' ||
        o.status === 'Completed'
    )
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter === 'Pending' && o.status !== 'Pending' && o.status !== 'Request') {
        return false;
      }
      if (statusFilter === 'Confirmed' && o.status !== 'Confirmed' && o.status !== 'Ready') {
        return false;
      }
      if (statusFilter === 'Delivered' && o.status !== 'Delivered') {
        return false;
      }
      if (statusFilter === 'Completed' && o.status !== 'Completed' && o.status !== 'Returned') {
        return false;
      }

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

  const handleAdvanceStatus = (id: string, nextStatus: BookingStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: nextStatus } : o))
    );
  };

  const handleDeleteOrder = (id: string, orderNum: string) => {
    if (confirm(`Delete order ${orderNum}?`)) {
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
      createdAt: 'Nov 5',
      createdTime: '05:30 PM',
    };
    setOrders([newOrder, ...orders]);
    setShowNewOrderModal(false);
    setNewCustomer('');
    setNewPhone('');
  };

  const getStatusBadge = (status: BookingStatus) => {
    if (status === 'Confirmed' || status === 'Ready') {
      return {
        label: 'CONFIRMED',
        classes: 'bg-[#E8F0FE] text-[#1E40AF] border-[#BFDBFE]',
      };
    }
    if (status === 'Delivered') {
      return {
        label: 'DELIVERED',
        classes: 'bg-[#EAF3EC] text-[#2D5A38] border-[#C5DFCD]',
      };
    }
    if (status === 'Pending' || status === 'Request') {
      return {
        label: 'PENDING',
        classes: 'bg-[#FEF6E7] text-[#935D15] border-[#F3D9B1]',
      };
    }
    return {
      label: 'COMPLETED',
      classes: 'bg-[#F2ECE1] text-[#52574F] border-[#E5DFD4]',
    };
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="w-6 h-0.5 bg-[#9E7B4F] mb-2" />
          <div className="flex items-center space-x-2.5">
            <ShoppingBag className="w-6 h-6 text-[#9E7B4F]" />
            <h1 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#191C1A]">
              Online Web Orders
            </h1>
          </div>
          <p className="text-xs text-[#6B726A] mt-1">
            Manage customer online rental orders, chosen outfits, delivery requests &amp; payments
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowNewOrderModal(true)}
          className="inline-flex items-center space-x-2 bg-[#9E7B4F] hover:bg-[#86663E] text-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors self-start sm:self-auto shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Record New Web Order</span>
        </button>
      </div>

      {/* 4 Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={() => setStatusFilter('All')}
          className={`bg-white border rounded-lg p-4 text-left transition-all ${
            statusFilter === 'All'
              ? 'border-[#9E7B4F] ring-1 ring-[#9E7B4F]/20'
              : 'border-[#E8E4DC] hover:border-[#9E7B4F]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <ShoppingBag className="w-4 h-4 text-[#9E7B4F]" />
            <ChevronRight className="w-3.5 h-3.5 text-[#B8ADA2]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-semibold text-[#191C1A]">Web Orders</span>
            <span className="text-sm font-bold text-[#9E7B4F]">{orders.length}</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('Pending')}
          className={`bg-white border rounded-lg p-4 text-left transition-all ${
            statusFilter === 'Pending'
              ? 'border-[#935D15] ring-1 ring-[#935D15]/20'
              : 'border-[#E8E4DC] hover:border-[#935D15]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-4 h-4 text-[#935D15]" />
            <ChevronRight className="w-3.5 h-3.5 text-[#B8ADA2]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-semibold text-[#191C1A]">Pending</span>
            <span className="text-sm font-bold text-[#935D15]">{pendingCount}</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('Confirmed')}
          className={`bg-white border rounded-lg p-4 text-left transition-all ${
            statusFilter === 'Confirmed'
              ? 'border-[#1E40AF] ring-1 ring-[#1E40AF]/20'
              : 'border-[#E8E4DC] hover:border-[#1E40AF]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="w-4 h-4 text-[#1E40AF]" />
            <ChevronRight className="w-3.5 h-3.5 text-[#B8ADA2]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-semibold text-[#191C1A]">Confirmed</span>
            <span className="text-sm font-bold text-[#1E40AF]">{confirmedCount}</span>
          </div>
        </button>

        <div className="bg-white border border-[#E8E4DC] rounded-lg p-4 text-left">
          <div className="flex items-center justify-between mb-2">
            <CreditCard className="w-4 h-4 text-[#2D5A38]" />
            <ChevronRight className="w-3.5 h-3.5 text-[#B8ADA2]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-semibold text-[#191C1A]">Confirmed Revenue</span>
            <span className="text-xs font-bold text-[#2D5A38]">
              {confirmedRevenue.toLocaleString('en-US')} RWF
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filter Pill Bar */}
      <div className="bg-white border border-[#E8E4DC] rounded-lg p-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-[#8C8075] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, phone, address, piece or order #..."
            className="w-full bg-[#FAF8F5] border border-[#E5DFD4] rounded-md pl-9 pr-4 py-2 text-xs text-[#191C1A] placeholder-[#8C8075] focus:outline-none focus:border-[#9E7B4F]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { key: 'All', label: `All (${orders.length})` },
              { key: 'Pending', label: `Pending (${pendingCount})` },
              { key: 'Confirmed', label: 'Confirmed' },
              { key: 'Delivered', label: 'Delivered' },
              { key: 'Completed', label: 'Completed' },
            ] as const
          ).map((pill) => (
            <button
              key={pill.key}
              type="button"
              onClick={() => setStatusFilter(pill.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                statusFilter === pill.key
                  ? 'bg-[#9E7B4F] text-white font-semibold'
                  : 'bg-[#F2ECE1] text-[#52574F] hover:text-[#191C1A]'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Received Table */}
      <div className="bg-white border border-[#E8E4DC] rounded-lg shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E8E4DC] flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#191C1A]">
            Orders Received ({filteredOrders.length})
          </h2>
          <span className="text-[11px] text-[#8C8075]">Sorted by newest</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F2ECE1]/70 text-[#6B726A] uppercase tracking-wider text-[10px] border-b border-[#E8E4DC]">
              <tr>
                <th className="py-3 px-5 font-semibold">Order #</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Customer Details</th>
                <th className="py-3 px-4 font-semibold">Items Rented</th>
                <th className="py-3 px-4 font-semibold">Rental Window</th>
                <th className="py-3 px-4 font-semibold">Total (RWF)</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EDE6]">
              {filteredOrders.map((order) => {
                const badge = getStatusBadge(order.status);
                const isConfirmed =
                  order.status === 'Confirmed' || order.status === 'Ready';
                const isPending =
                  order.status === 'Pending' || order.status === 'Request';

                return (
                  <tr
                    key={order.id}
                    className="hover:bg-[#FAF8F5] transition-colors"
                  >
                    <td className="py-4 px-5 font-bold text-[#9E7B4F]">
                      {order.bookingNumber}
                    </td>

                    <td className="py-4 px-4">
                      <div className="text-[#191C1A] font-medium">{order.createdAt}</div>
                      <div className="text-[10px] text-[#8C8075]">
                        {order.createdTime || '10:00 AM'}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-semibold text-[#191C1A]">
                        {order.customerName}
                      </div>
                      <div className="text-[11px] text-[#6B726A] flex items-center space-x-1 mt-0.5">
                        <Phone className="w-3 h-3 text-[#9E7B4F]" />
                        <span>{order.customerPhone}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-semibold text-[#191C1A]">
                        {order.itemName} ({order.size})
                      </div>
                      <div className="text-[10px] text-[#8C8075]">1 piece</div>
                    </td>

                    <td className="py-4 px-4 text-[#52574F]">
                      <div className="inline-flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#9E7B4F]" />
                        <span>
                          {order.pickupDate} → {order.returnDate}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-bold text-[#191C1A]">
                      {order.totalAmount.toLocaleString('en-US')} RWF
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full border ${badge.classes}`}
                      >
                        {badge.label}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-right">
                      <div className="inline-flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 text-[#6B726A] hover:text-[#191C1A] transition-colors"
                          title="View order details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {isPending && (
                          <button
                            type="button"
                            onClick={() =>
                              handleAdvanceStatus(order.id, 'Confirmed')
                            }
                            className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white text-[11px] font-semibold px-2.5 py-1 rounded-md transition-colors"
                          >
                            Confirm
                          </button>
                        )}

                        {isConfirmed && (
                          <button
                            type="button"
                            onClick={() =>
                              handleAdvanceStatus(order.id, 'Delivered')
                            }
                            className="bg-[#15803D] hover:bg-[#166534] text-white text-[11px] font-semibold px-2.5 py-1 rounded-md transition-colors"
                          >
                            Delivered
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteOrder(order.id, order.bookingNumber)
                          }
                          className="p-1.5 text-[#8C8075] hover:text-red-700 transition-colors"
                          title="Delete order"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] max-w-md w-full p-6 border border-[#E8E4DC] shadow-2xl space-y-4 rounded-lg text-xs">
            <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E7B4F]">
                  {selectedOrder.bookingNumber}
                </span>
                <h3 className="font-serif-luxury text-2xl text-[#191C1A]">
                  {selectedOrder.customerName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="text-xs text-[#6B726A] hover:text-black"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-[#191C1A]">
              <div className="flex justify-between">
                <span className="text-[#6B726A]">Phone:</span>
                <span className="font-semibold">{selectedOrder.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B726A]">Item Rented:</span>
                <span className="font-semibold">
                  {selectedOrder.itemName} ({selectedOrder.size})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B726A]">Rental Window:</span>
                <span className="font-semibold">
                  {selectedOrder.pickupDate} → {selectedOrder.returnDate}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B726A]">Total Amount:</span>
                <span className="font-bold text-[#2D5A38]">
                  {selectedOrder.totalAmount.toLocaleString('en-US')} RWF
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="bg-[#14100E] text-white px-4 py-2 rounded-md font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Record New Web Order */}
      {showNewOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] max-w-md w-full p-6 border border-[#E8E4DC] shadow-2xl space-y-4 rounded-lg">
            <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-3">
              <h3 className="font-serif-luxury text-2xl text-[#191C1A]">
                Record New Web Order
              </h3>
              <button
                type="button"
                onClick={() => setShowNewOrderModal(false)}
                className="text-xs text-[#6B726A] hover:text-black"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#6B726A] mb-1 font-medium">
                  Customer Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jean-Luc Habimana"
                  value={newCustomer}
                  onChange={(e) => setNewCustomer(e.target.value)}
                  className="w-full bg-white border border-[#D5CFCE] rounded-md p-2.5 text-[#191C1A]"
                />
              </div>

              <div>
                <label className="block text-[#6B726A] mb-1 font-medium">
                  Telephone
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +250 788 123 456"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full bg-white border border-[#D5CFCE] rounded-md p-2.5 text-[#191C1A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#6B726A] mb-1 font-medium">
                    Outfit Chosen
                  </label>
                  <select
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    className="w-full bg-white border border-[#D5CFCE] rounded-md p-2.5 text-[#191C1A]"
                  >
                    <option value="The Windsor Tuxedo">The Windsor Tuxedo</option>
                    <option value="The Céleste Gown">The Céleste Gown</option>
                    <option value="The Oxford Suit">The Oxford Suit</option>
                    <option value="The Amélie Gown">The Amélie Gown</option>
                    <option value="The Riviera Suit">The Riviera Suit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#6B726A] mb-1 font-medium">Size</label>
                  <input
                    type="text"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    className="w-full bg-white border border-[#D5CFCE] rounded-md p-2.5 text-[#191C1A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#6B726A] mb-1 font-medium">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    value={newPickup}
                    onChange={(e) => setNewPickup(e.target.value)}
                    className="w-full bg-white border border-[#D5CFCE] rounded-md p-2.5 text-[#191C1A]"
                  />
                </div>
                <div>
                  <label className="block text-[#6B726A] mb-1 font-medium">
                    Return Date
                  </label>
                  <input
                    type="date"
                    value={newReturn}
                    onChange={(e) => setNewReturn(e.target.value)}
                    className="w-full bg-white border border-[#D5CFCE] rounded-md p-2.5 text-[#191C1A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#6B726A] mb-1 font-medium">
                  Total Amount (RWF)
                </label>
                <input
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full bg-white border border-[#D5CFCE] rounded-md p-2.5 text-[#191C1A]"
                />
              </div>

              <div className="pt-2 flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#9E7B4F] hover:bg-[#86663E] text-white py-2.5 rounded-md font-semibold uppercase tracking-wider transition-colors"
                >
                  Save Web Order
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewOrderModal(false)}
                  className="bg-white border border-[#D5CFCE] px-4 py-2.5 rounded-md"
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
