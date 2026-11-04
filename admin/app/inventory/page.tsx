'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Search,
  SlidersHorizontal,
  LayoutList,
  LayoutGrid,
  Trash2,
  Edit,
  ScanLine,
  Info,
} from 'lucide-react';
import { INITIAL_ITEMS } from '@/lib/data/mock-catalog';
import { RentalItem } from '@/lib/types';
import { formatRWF } from '@/lib/utils';

export default function InventoryCentralPage() {
  const [items, setItems] = useState<RentalItem[]>(INITIAL_ITEMS);
  const [activeTab, setActiveTab] = useState<'all' | 'suits' | 'gowns' | 'accessories' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Deletion handler
  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Tab filter
      if (activeTab === 'suits' && item.categorySlug !== 'suits') return false;
      if (activeTab === 'gowns' && item.categorySlug !== 'gowns') return false;
      if (activeTab === 'accessories' && item.categorySlug !== 'accessories' && item.categorySlug !== 'veils') return false;
      if (activeTab === 'archived' && !item.isArchived) return false;
      if (activeTab !== 'archived' && item.isArchived) return false;

      // Search query (Item name or SKU)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesSku = item.sku.toLowerCase().includes(query);
        const matchesColor = item.color.toLowerCase().includes(query);
        if (!matchesName && !matchesSku && !matchesColor) return false;
      }

      // Availability filter
      if (availabilityFilter === 'ready' && item.readyStock <= 0) return false;
      if (availabilityFilter === 'rented' && item.rentedStock <= 0) return false;
      if (availabilityFilter === 'care' && item.inCareStock <= 0) return false;

      // Size filter
      if (sizeFilter !== 'all' && !item.sizes.includes(sizeFilter)) return false;

      return true;
    });
  }, [items, activeTab, searchQuery, availabilityFilter, sizeFilter]);

  const suitsCount = items.filter((i) => i.categorySlug === 'suits' && !i.isArchived).length;
  const gownsCount = items.filter((i) => i.categorySlug === 'gowns' && !i.isArchived).length;
  const accessoriesCount = items.filter((i) => (i.categorySlug === 'accessories' || i.categorySlug === 'veils') && !i.isArchived).length;
  const archivedCount = items.filter((i) => i.isArchived).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-normal text-[#191C1A]">
            Inventory
          </h1>
          <p className="text-xs text-[#6B726A] mt-1">Manage items and stock.</p>
        </div>

        <Link
          href="/inventory/new"
          className="inline-flex items-center space-x-2 bg-[#1A2421] text-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors self-start sm:self-auto shadow-sm"
        >
          <span>Add item</span>
          <Plus className="w-4 h-4" />
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-8 border-b border-[#E8E4DC] overflow-x-auto no-scrollbar">
        {[
          { key: 'all', label: `All items ${items.length}` },
          { key: 'suits', label: `Suits ${suitsCount}` },
          { key: 'gowns', label: `Bridal gowns ${gownsCount}` },
          { key: 'accessories', label: `Accessories ${accessoriesCount}` },
          { key: 'archived', label: `Archived ${archivedCount || 2}` },
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

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-transparent">
        {/* Quick-Scan SKU Lookup Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#8C938B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search item name or SKU..."
            className="w-full bg-white border border-[#D5CFCE] pl-10 pr-10 py-2.5 text-xs text-[#191C1A] placeholder-[#8C938B] focus:outline-none focus:border-[#191C1A] rounded-sm"
          />
          <button
            type="button"
            onClick={() => setSearchQuery(prompt('Scan barcode or enter SKU:') || searchQuery)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C938B] hover:text-[#191C1A]"
            title="Scan SKU barcode"
          >
            <ScanLine className="w-4 h-4" />
          </button>
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Availability */}
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="bg-white border border-[#D5CFCE] px-3 py-2 text-xs text-[#191C1A] focus:outline-none rounded-sm"
          >
            <option value="all">Availability: All</option>
            <option value="ready">Ready for rental</option>
            <option value="rented">Currently rented</option>
            <option value="care">In care / cleaning</option>
          </select>

          {/* Sizes */}
          <select
            value={sizeFilter}
            onChange={(e) => setSizeFilter(e.target.value)}
            className="bg-white border border-[#D5CFCE] px-3 py-2 text-xs text-[#191C1A] focus:outline-none rounded-sm"
          >
            <option value="all">All sizes</option>
            <option value="36">Size 36</option>
            <option value="38">Size 38</option>
            <option value="40">Size 40</option>
            <option value="42">Size 42</option>
            <option value="44">Size 44</option>
          </select>

          {/* View Toggles */}
          <div className="flex items-center space-x-1 border border-[#D5CFCE] bg-white p-1 rounded-sm">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-xs transition-colors ${
                viewMode === 'list'
                  ? 'bg-[#191C1A] text-white'
                  : 'text-[#6B726A] hover:text-black'
              }`}
              title="List View"
            >
              <LayoutList className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-xs transition-colors ${
                viewMode === 'grid'
                  ? 'bg-[#191C1A] text-white'
                  : 'text-[#6B726A] hover:text-black'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Table (or Grid) */}
      {viewMode === 'list' ? (
        <div className="bg-white border border-[#E8E4DC] shadow-sm rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-[#848B82] uppercase tracking-wider text-[10px] border-b border-[#E8E4DC]">
                <tr>
                  <th className="py-3 px-5 font-semibold">Item / SKU</th>
                  <th className="py-3 px-5 font-semibold">Category</th>
                  <th className="py-3 px-5 font-semibold">Rental / Deposit</th>
                  <th className="py-3 px-5 font-semibold">Sizes</th>
                  <th className="py-3 px-5 font-semibold">Stock Today</th>
                  <th className="py-3 px-5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EDE6]">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    {/* Item / SKU */}
                    <td className="py-4 px-5">
                      <div className="flex items-center space-x-3.5">
                        <div className="relative w-12 h-16 bg-[#ECE8E1] rounded-xs overflow-hidden flex-shrink-0">
                          <Image
                            src={item.images[0]}
                            alt={item.name}
                            fill
                            className="object-cover object-top"
                          />
                        </div>
                        <div>
                          <Link
                            href={`/inventory/${item.id}`}
                            className="font-semibold text-sm text-[#191C1A] hover:text-[#9E7B4F] transition-colors"
                          >
                            {item.name}
                          </Link>
                          <div className="text-[11px] text-[#6B726A] mt-0.5">
                            {item.sku} · {item.color}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-5 text-[#52574F]">
                      {item.category}
                    </td>

                    {/* Rental / Deposit */}
                    <td className="py-4 px-5">
                      <div className="font-semibold text-[#191C1A]">
                        {formatRWF(item.rentalPrice)} / {item.rentalPeriodDays} days
                      </div>
                      <div className="text-[11px] text-[#6B726A]">
                        {formatRWF(item.refundableDeposit)} refundable
                      </div>
                    </td>

                    {/* Sizes */}
                    <td className="py-4 px-5">
                      <div className="font-medium text-[#191C1A]">
                        {item.sizes.join(' · ')}
                      </div>
                      <div className="text-[11px] text-[#6B726A]">UK sizing</div>
                    </td>

                    {/* Stock Today Turnaround */}
                    <td className="py-4 px-5">
                      <div className="font-semibold text-[#2D5A38]">
                        {item.readyStock} of {item.totalStock} ready
                      </div>
                      <div className="text-[11px] text-[#6B726A] mt-0.5">
                        {item.rentedStock} rented · {item.inCareStock} in care
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end space-x-3">
                        <Link
                          href={`/inventory/${item.id}`}
                          className="text-xs font-semibold text-[#191C1A] hover:text-[#9E7B4F]"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          className="text-[#969D95] hover:text-red-700 transition-colors"
                          title="Delete item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white border border-[#E8E4DC] p-4 rounded-sm shadow-sm space-y-3">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#ECE8E1] rounded-xs">
                <Image src={item.images[0]} alt={item.name} fill className="object-cover object-top" />
              </div>
              <div className="flex items-baseline justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-[#191C1A]">{item.name}</h3>
                  <span className="text-xs text-[#6B726A]">{item.sku} · {item.color}</span>
                </div>
                <span className="text-xs font-semibold text-[#191C1A]">{formatRWF(item.rentalPrice)}</span>
              </div>
              <div className="text-xs text-[#2D5A38] font-semibold">
                {item.readyStock} of {item.totalStock} ready
              </div>
              <div className="pt-2 flex justify-between border-t border-[#E8E4DC] text-xs">
                <Link href={`/inventory/${item.id}`} className="font-semibold text-[#9E7B4F]">Edit Details</Link>
                <button onClick={() => handleDelete(item.id, item.name)} className="text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Info Box */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#6B726A] pt-4">
        <span>6 active styles · 38 individual pieces</span>
        <span className="mt-1 sm:mt-0">Date-specific reservations are shown in each item.</span>
      </div>

      <div className="bg-[#FAF8F5] border border-[#E8E4DC] p-3 flex items-start space-x-2 text-[11px] text-[#6B726A]">
        <Info className="w-4 h-4 text-[#9E7B4F] flex-shrink-0 mt-0.5" />
        <span>
          Stock is tracked by size. Editing a style updates its website listing; existing confirmed bookings retain their agreed rental price.
        </span>
      </div>
    </div>
  );
}

