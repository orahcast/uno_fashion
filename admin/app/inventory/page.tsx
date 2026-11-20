'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Search, Upload, CheckCircle2, X } from 'lucide-react';
import { INITIAL_ITEMS } from '@/lib/data/mock-catalog';
import { RentalItem, InventorySimpleStatus, ItemCategory } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { convertHeicToJpeg } from '@/lib/heic-converter';
import { formatUSD, DEFAULT_USD_RATE } from '@/lib/currency';
import GarmentModal from '@/components/GarmentModal';

export default function InventoryCentralPage() {
  const [items, setItems] = useState<RentalItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<'All' | InventorySimpleStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<RentalItem | null>(null);

  // USD Currency Exchange Rate state
  const [exchangeRate, setExchangeRate] = useState<number>(DEFAULT_USD_RATE);
  const [inputRate, setInputRate] = useState<string>(String(DEFAULT_USD_RATE));
  const [isSavingRate, setIsSavingRate] = useState(false);
  const [rateSavedNotice, setRateSavedNotice] = useState(false);

  // Sync with live database and fallback to localStorage
  useEffect(() => {
    // 1. Initial load from local storage
    if (typeof window !== 'undefined') {
      const deletedIds: string[] = JSON.parse(localStorage.getItem('uno_deleted_item_ids') || '[]');
      const saved = localStorage.getItem('uno_inventory_items');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setItems(parsed.filter((item: RentalItem) => !deletedIds.includes(item.id)));
          }
        } catch (err) {
          console.error('Failed to parse saved inventory:', err);
        }
      } else {
        setItems(INITIAL_ITEMS.filter((item) => !deletedIds.includes(item.id)));
      }
    }

    // 2. Fetch live from API
    fetch('/api/items')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data)) {
          const deletedIds: string[] = typeof window !== 'undefined'
            ? JSON.parse(localStorage.getItem('uno_deleted_item_ids') || '[]')
            : [];
          const filtered = data.filter((item: RentalItem) => !deletedIds.includes(item.id));
          setItems(filtered);
          if (typeof window !== 'undefined') {
            localStorage.setItem('uno_inventory_items', JSON.stringify(filtered));
          }
        }
      })
      .catch((err) => console.error('Error fetching inventory items:', err));

    // Supabase Realtime: sync inventory changes live across browser tabs and devices
    const supabase = createClient();
    const channel = supabase
      .channel('realtime:admin_inventory')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'items' },
        () => {
          fetch('/api/items')
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
              if (Array.isArray(data)) {
                const deletedIds: string[] = typeof window !== 'undefined'
                  ? JSON.parse(localStorage.getItem('uno_deleted_item_ids') || '[]')
                  : [];
                const filtered = data.filter((item: RentalItem) => !deletedIds.includes(item.id));
                setItems(filtered);
                if (typeof window !== 'undefined') {
                  localStorage.setItem('uno_inventory_items', JSON.stringify(filtered));
                }
              }
            })
            .catch(console.error);
        }
      )
      .subscribe();

    // 3. Fetch USD Currency Exchange Rate
    fetch('/api/currency')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.rate === 'number' && data.rate > 0) {
          setExchangeRate(data.rate);
          setInputRate(String(data.rate));
        }
      })
      .catch((err) => console.error('Error fetching currency rate:', err));

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSaveRate = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Number(inputRate);
    if (!parsed || parsed <= 0 || isNaN(parsed)) return;

    setIsSavingRate(true);
    try {
      const res = await fetch('/api/currency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rate: parsed }),
      });
      if (res.ok) {
        setExchangeRate(parsed);
        setRateSavedNotice(true);
        setTimeout(() => setRateSavedNotice(false), 3000);
      }
    } catch (err) {
      console.error('Error saving rate:', err);
    } finally {
      setIsSavingRate(false);
    }
  };

  const persistItems = (updated: RentalItem[]) => {
    setItems(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('uno_inventory_items', JSON.stringify(updated));
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const currentStatus = item.simpleStatus || 'Available';
      if (statusFilter !== 'All' && currentStatus !== statusFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesSku = item.sku.toLowerCase().includes(q);
        const matchesCat = item.category.toLowerCase().includes(q);
        if (!matchesName && !matchesSku && !matchesCat) return false;
      }

      return true;
    });
  }, [items, statusFilter, searchQuery]);

  const handleInlineStatusChange = (id: string, newStatus: InventorySimpleStatus) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, simpleStatus: newStatus } : item
    );
    persistItems(updated);

    const changedItem = updated.find((i) => i.id === id);
    if (changedItem) {
      fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changedItem),
      }).catch(console.error);
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      const updated = items.filter((i) => i.id !== id);
      persistItems(updated);

      if (typeof window !== 'undefined') {
        try {
          const deleted: string[] = JSON.parse(localStorage.getItem('uno_deleted_item_ids') || '[]');
          if (!deleted.includes(id)) {
            deleted.push(id);
            localStorage.setItem('uno_deleted_item_ids', JSON.stringify(deleted));
          }
        } catch (e) {
          console.error(e);
        }
      }

      // Direct Supabase delete from browser to trigger real-time updates on website
      try {
        const supabase = createClient();
        supabase
          .from('items')
          .delete()
          .eq('id', id)
          .then(({ error }) => {
            if (error) {
              supabase.from('items').update({ is_archived: true }).eq('id', id);
            }
          });
      } catch (e) {
        console.error('Supabase client delete error:', e);
      }

      fetch(`/api/items?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      }).catch(console.error);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setShowItemModal(true);
  };

  const openEditModal = (item: RentalItem) => {
    setEditingItem(item);
    setShowItemModal(true);
  };

  const getStatusSelectStyle = (status: InventorySimpleStatus = 'Available') => {
    if (status === 'Available') {
      return 'bg-[#EAF3EC] text-[#2D5A38] border-[#C5DFCD]';
    }
    if (status === 'Rented') {
      return 'bg-[#EEF2F6] text-[#3B5269] border-[#CBD5E1]';
    }
    return 'bg-[#FEF6E7] text-[#935D15] border-[#F3D9B1]';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="w-6 h-0.5 bg-[#9E7B4F] mb-2" />
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#191C1A]">
            Rental Inventory
          </h1>
          <p className="text-xs text-[#6B726A] mt-0.5">
            Full catalog management ({items.length} total items)
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center space-x-2 bg-[#9E7B4F] hover:bg-[#86663E] text-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors self-start sm:self-auto shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Item</span>
        </button>
      </div>

      {/* Global USD Currency Rate Bar */}
      <div className="bg-[#FAF8F5] border border-[#E8E4DC] rounded-lg p-3 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#9E7B4F]/15 border border-[#9E7B4F]/30 flex items-center justify-center text-[#9E7B4F] font-bold text-sm shrink-0">
            $
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#191C1A]">
              USD Currency Exchange Rate
            </h3>
            <p className="text-[11px] text-[#6B726A]">
              Currently active: 1 USD = <span className="font-semibold text-[#191C1A]">{Number(exchangeRate).toLocaleString()} Frw</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveRate} className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center bg-white border border-[#D5CFCE] rounded-md px-2.5 py-1 text-xs">
            <span className="text-[#8C8075] font-medium mr-1.5">$1 USD =</span>
            <input
              type="number"
              value={inputRate}
              onChange={(e) => setInputRate(e.target.value)}
              className="w-20 font-semibold text-[#191C1A] focus:outline-none"
              placeholder="1479"
            />
            <span className="text-[#8C8075] ml-1">Frw</span>
          </div>
          <button
            type="submit"
            disabled={isSavingRate}
            className="px-3.5 py-1.5 rounded-md bg-[#191C1A] hover:bg-[#9E7B4F] text-white text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-xs active:scale-95"
          >
            {isSavingRate ? 'Saving...' : 'Save Rate'}
          </button>
          {rateSavedNotice && (
            <span className="text-xs text-[#2D5A38] font-medium flex items-center gap-1 bg-[#EAF3EC] px-2 py-1 rounded">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Rate Saved!</span>
            </span>
          )}
        </form>
      </div>

      {/* Rental Inventory Card */}
      <div className="bg-white border border-[#E8E4DC] rounded-lg shadow-2xs overflow-hidden">
        {/* Card Header Bar */}
        <div className="p-4 sm:px-6 border-b border-[#E8E4DC] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-[#191C1A]">Rental Inventory</h2>
            <p className="text-[11px] text-[#6B726A]">
              {filteredItems.length} of {items.length} items shown
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Quick Search */}
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-[#8C8075] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by name or SKU..."
                className="w-full bg-[#FAF8F5] border border-[#E5DFD4] rounded-md pl-8 pr-3 py-1.5 text-xs text-[#191C1A] placeholder-[#8C8075] focus:outline-none focus:border-[#9E7B4F]"
              />
            </div>

            {/* Segmented Filter */}
            <div className="inline-flex items-center bg-[#F2ECE1] p-1 rounded-md border border-[#E5DFD4]">
              {(['All', 'Available', 'Rented', 'Dry cleaning'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors ${
                    statusFilter === tab
                      ? 'bg-white text-[#191C1A] font-semibold shadow-2xs'
                      : 'text-[#6B726A] hover:text-[#191C1A]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center space-x-1.5 bg-[#9E7B4F] hover:bg-[#86663E] text-white px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Item</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F2ECE1]/70 text-[#6B726A] uppercase tracking-wider text-[10px] border-b border-[#E8E4DC]">
              <tr>
                <th className="py-3 px-6 font-semibold">Item</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Size</th>
                <th className="py-3 px-4 font-semibold">Price / Day</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Condition</th>
                <th className="py-3 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EDE6]">
              {filteredItems.map((item) => {
                const currentStatus = item.simpleStatus || 'Available';
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-[#FAF8F5] transition-colors"
                  >
                    <td className="py-3.5 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-10 h-10 rounded-md overflow-hidden bg-[#ECE8E1] flex-shrink-0 border border-[#E8E4DC]">
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
                            className="font-semibold text-[#191C1A] hover:text-[#9E7B4F] transition-colors block"
                          >
                            {item.name}
                          </Link>
                          <span className="text-[10px] text-[#8C8075]">{item.sku}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-[#52574F]">{item.category}</td>

                    <td className="py-3.5 px-4">
                      <span className="inline-block bg-[#F2ECE1] text-[#191C1A] text-[11px] font-medium px-2.5 py-0.5 rounded-sm border border-[#E5DFD4]">
                        {item.sizeRange || item.sizes.join('–')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-[#191C1A]">
                      <div>RWF {item.rentalPrice.toLocaleString('en-US')}</div>
                      <div className="text-[10px] text-[#8C8075] font-normal">
                        ~${formatUSD(item.rentalPrice, exchangeRate)} USD
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={currentStatus}
                        onChange={(e) =>
                          handleInlineStatusChange(
                            item.id,
                            e.target.value as InventorySimpleStatus
                          )
                        }
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border focus:outline-none cursor-pointer ${getStatusSelectStyle(
                          currentStatus
                        )}`}
                      >
                        <option value="Available">● Available</option>
                        <option value="Rented">● Rented</option>
                        <option value="Dry cleaning">● Dry cleaning</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-[#6B726A]">
                      {item.condition || '—'}
                    </td>

                    <td className="py-3.5 px-6 text-right">
                      <div className="inline-flex items-center space-x-3 text-[#6B726A]">
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="hover:text-[#191C1A] transition-colors"
                          title="Quick edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id, item.name)}
                          className="hover:text-red-700 transition-colors"
                          title="Delete item"
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

      {/* Unified Add / Edit Garment Modal */}
      <GarmentModal
        isOpen={showItemModal}
        onClose={() => {
          setShowItemModal(false);
          setEditingItem(null);
        }}
        editingItem={editingItem}
        exchangeRate={exchangeRate}
        onSaved={(savedItem) => {
          const updated = editingItem
            ? items.map((i) => (i.id === savedItem.id ? savedItem : i))
            : [savedItem, ...items.filter((i) => i.id !== savedItem.id)];
          persistItems(updated);
        }}
      />
    </div>
  );
}
