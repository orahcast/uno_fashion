'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Search, Upload, CheckCircle2, X } from 'lucide-react';
import { INITIAL_ITEMS } from '@/lib/data/mock-catalog';
import { RentalItem, InventorySimpleStatus, ItemCategory } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { convertHeicToJpeg } from '@/lib/heic-converter';

export default function InventoryCentralPage() {
  const [items, setItems] = useState<RentalItem[]>(INITIAL_ITEMS);
  const [statusFilter, setStatusFilter] = useState<'All' | InventorySimpleStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<RentalItem | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<ItemCategory>('Suits');
  const [formSizeRange, setFormSizeRange] = useState('38–44');
  const [formPrice, setFormPrice] = useState('150000');
  const [formStatus, setFormStatus] = useState<InventorySimpleStatus>('Available');
  const [formCondition, setFormCondition] = useState('—');
  const [formImage, setFormImage] = useState<string>('');

  // Sync with live database and fallback to localStorage
  useEffect(() => {
    // 1. Fetch live from API
    fetch('/api/items')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
          if (typeof window !== 'undefined') {
            localStorage.setItem('uno_inventory_items', JSON.stringify(data));
          }
        }
      })
      .catch((err) => console.error('Error fetching inventory items:', err));

    // 2. Initial load from local storage
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
    }
  }, []);

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

      fetch(`/api/items?id=${id}`, {
        method: 'DELETE',
      }).catch(console.error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isHeic =
        file.name.toLowerCase().endsWith('.heic') ||
        file.name.toLowerCase().endsWith('.heif') ||
        file.type === 'image/heic' ||
        file.type === 'image/heif';

      let fileToUpload = file;
      if (isHeic) {
        try {
          fileToUpload = await convertHeicToJpeg(file);
        } catch (convErr: any) {
          alert(convErr.message || 'HEIC conversion failed. Please use a JPG or PNG.');
          return;
        }
      }

      try {
        const formData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('folder', 'inventory');

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const json = await res.json();
        if (res.ok && json.url) {
          setFormImage(json.url);
          return;
        } else {
          throw new Error(json.error || 'Server upload failed');
        }
      } catch (apiErr: any) {
        console.warn('Server upload error, attempting direct storage upload:', apiErr);

        try {
          const supabase = createClient();
          const fileExt = fileToUpload.name.split('.').pop()?.toLowerCase() || 'jpg';
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          const { data, error } = await supabase.storage
            .from('inventory-photos')
            .upload(fileName, fileToUpload, { upsert: true });

          if (!error && data) {
            const {
              data: { publicUrl },
            } = supabase.storage.from('inventory-photos').getPublicUrl(fileName);
            setFormImage(publicUrl);
            return;
          }
        } catch (uploadErr) {
          console.warn('Storage upload fallback:', uploadErr);
        }

        // Fallback to data URL
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setFormImage(reader.result);
          }
        };
        reader.readAsDataURL(fileToUpload);
      }
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormName('');
    setFormImage('');
    setFormCategory('Suits');
    setFormSizeRange('38–44');
    setFormPrice('150000');
    setFormStatus('Available');
    setFormCondition('—');
    setShowItemModal(true);
  };

  const openEditModal = (item: RentalItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormImage(item.images?.[0] || '');
    setFormCategory(item.category);
    setFormSizeRange(item.sizeRange || item.sizes.join('–'));
    setFormPrice(String(item.rentalPrice));
    setFormStatus(item.simpleStatus || 'Available');
    setFormCondition(item.condition || '—');
    setShowItemModal(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    const finalImage =
      formImage.trim() ||
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1200';

    if (editingItem) {
      const updatedItem: RentalItem = {
        ...editingItem,
        name: formName,
        images: [finalImage, ...(editingItem.images?.slice(1) || [])],
        category: formCategory,
        sizeRange: formSizeRange,
        rentalPrice: Number(formPrice) || 0,
        simpleStatus: formStatus,
        condition: formCondition,
      };
      const updated = items.map((item) =>
        item.id === editingItem.id ? updatedItem : item
      );
      persistItems(updated);

      fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem),
      }).catch(console.error);
    } else {
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
        condition: formCondition,
        stockBySize: [],
        totalStock: 1,
        readyStock: formStatus === 'Available' ? 1 : 0,
        rentedStock: formStatus === 'Rented' ? 1 : 0,
        inCareStock: formStatus === 'Dry cleaning' ? 1 : 0,
        status: 'Published',
        allowOnlineBooking: true,
        cleaningTurnaroundDays: 1,
      };
      persistItems([newItem, ...items]);

      fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      }).catch(console.error);
    }
    setShowItemModal(false);
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
                      RWF {item.rentalPrice.toLocaleString('en-US')}
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

      {/* Add / Edit Item Modal */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] max-w-md w-full p-6 border border-[#E8E4DC] shadow-2xl space-y-4 rounded-lg">
            <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-3">
              <h3 className="font-serif-luxury text-2xl text-[#191C1A]">
                {editingItem ? 'Edit Inventory Item' : 'Add New Item'}
              </h3>
              <button
                type="button"
                onClick={() => setShowItemModal(false)}
                className="text-xs text-[#6B726A] hover:text-black"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#6B726A] mb-1 font-medium">Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ivory Cream Suit"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-white border border-[#D5CFCE] rounded-md p-2.5 text-[#191C1A]"
                />
              </div>

              {/* Garment Image Upload */}
              <div>
                <label className="block text-[#6B726A] mb-1 font-medium">Garment Image</label>
                {formImage ? (
                  <div className="relative flex items-center gap-3 p-2.5 bg-white border border-[#ECDCCB] rounded-xl">
                    <div className="relative w-14 h-16 rounded-lg overflow-hidden bg-neutral-100 shrink-0 border border-[#E8E0D5]">
                      <img
                        src={formImage}
                        alt="Garment preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#191C1A] flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2D6A4F]" />
                        Photo Attached
                      </p>
                      <p className="text-[10px] text-[#6B726A] truncate mt-0.5">
                        Will be displayed across boutique &amp; online catalog
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <label className="text-[11px] font-semibold text-[#9E7B4F] hover:underline cursor-pointer">
                          Change photo
                          <input
                            type="file"
                            accept="image/*,.heic,.HEIC,.heif,.HEIF"
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
                  <label className="flex flex-col items-center justify-center p-3.5 border-2 border-dashed border-[#D5CFCE] hover:border-[#9E7B4F] rounded-xl bg-white hover:bg-[#FAF4EB]/40 transition-colors cursor-pointer group">
                    <div className="w-9 h-9 rounded-full bg-[#FAF8F5] shadow-2xs flex items-center justify-center text-[#9E7B4F] group-hover:scale-105 transition-transform">
                      <Upload className="w-4 h-4" />
                    </div>
                    <span className="mt-1.5 text-xs font-semibold text-[#191C1A]">
                      Upload garment photo
                    </span>
                    <span className="text-[10px] text-[#6B726A]">
                      JPG, PNG, WebP, or iPhone HEIC
                    </span>
                    <input
                      type="file"
                      accept="image/*,.heic,.HEIC,.heif,.HEIF"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#6B726A] mb-1 font-medium">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ItemCategory)}
                    className="w-full bg-white border border-[#D5CFCE] rounded-md p-2.5 text-[#191C1A]"
                  >
                    <option value="Suits">Suit</option>
                    <option value="Tuxedo">Tuxedo</option>
                    <option value="Bridal gowns">Bridal Gown</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#6B726A] mb-1 font-medium">Size Range</label>
                  <input
                    type="text"
                    value={formSizeRange}
                    onChange={(e) => setFormSizeRange(e.target.value)}
                    placeholder="e.g. 44–52"
                    className="w-full bg-white border border-[#D5CFCE] rounded-md p-2.5 text-[#191C1A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#6B726A] mb-1 font-medium">Price (RWF)</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full bg-white border border-[#D5CFCE] rounded-md p-2.5 text-[#191C1A]"
                  />
                </div>

                <div>
                  <label className="block text-[#6B726A] mb-1 font-medium">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) =>
                      setFormStatus(e.target.value as InventorySimpleStatus)
                    }
                    className="w-full bg-white border border-[#D5CFCE] rounded-md p-2.5 text-[#191C1A]"
                  >
                    <option value="Available">Available</option>
                    <option value="Rented">Rented</option>
                    <option value="Dry cleaning">Dry cleaning</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#6B726A] mb-1 font-medium">Condition</label>
                <input
                  type="text"
                  value={formCondition}
                  onChange={(e) => setFormCondition(e.target.value)}
                  placeholder="e.g. Excellent or —"
                  className="w-full bg-white border border-[#D5CFCE] rounded-md p-2.5 text-[#191C1A]"
                />
              </div>

              <div className="pt-2 flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#9E7B4F] hover:bg-[#86663E] text-white py-2.5 rounded-md font-semibold uppercase tracking-wider transition-colors"
                >
                  {editingItem ? 'Save Changes' : 'Add Item'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
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
