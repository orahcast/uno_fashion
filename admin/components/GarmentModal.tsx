'use client';

import { useState, useEffect } from 'react';
import { X, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { RentalItem, ItemCategory, InventorySimpleStatus } from '@/lib/types';
import { convertHeicToJpeg } from '@/lib/heic-converter';
import { createClient } from '@/lib/supabase/client';
import { formatUSD, DEFAULT_USD_RATE } from '@/lib/currency';

interface GarmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (item: RentalItem) => void;
  editingItem?: RentalItem | null;
  exchangeRate?: number;
}

export default function GarmentModal({
  isOpen,
  onClose,
  onSaved,
  editingItem,
  exchangeRate = DEFAULT_USD_RATE,
}: GarmentModalProps) {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Suits');
  const [sizeRange, setSizeRange] = useState('38–44');
  const [price, setPrice] = useState('150000');
  const [status, setStatus] = useState<InventorySimpleStatus>('Available');
  const [condition, setCondition] = useState('Pristine');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync form state when modal opens or editingItem changes
  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name || '');
      setImage(editingItem.images?.[0] || '');
      setCategory(editingItem.category || 'Suits');
      setSizeRange(editingItem.sizeRange || editingItem.sizes?.join('–') || '38–44');
      setPrice(String(editingItem.rentalPrice || 150000));
      setStatus(editingItem.simpleStatus || 'Available');
      setCondition(editingItem.condition || 'Pristine');
    } else {
      setName('');
      setImage('');
      setCategory('Suits');
      setSizeRange('38–44');
      setPrice('150000');
      setStatus('Available');
      setCondition('Pristine');
    }
    setErrorMessage(null);
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  // Handle Photo Upload with iPhone HEIC Conversion & Server/Storage Fallback
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMessage(null);

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
        setErrorMessage('Failed to convert iPhone HEIC photo. Please export as JPG or PNG.');
        setIsUploading(false);
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
        setImage(json.url);
        setIsUploading(false);
        return;
      }
      throw new Error(json.error || 'Upload error');
    } catch (apiErr) {
      console.warn('API upload error, attempting direct client storage upload:', apiErr);

      try {
        const supabase = createClient();
        const fileExt = fileToUpload.name.split('.').pop()?.toLowerCase() || 'jpg';
        const fileName = `item-${Date.now()}.${fileExt}`;
        const { data, error } = await supabase.storage
          .from('inventory-photos')
          .upload(fileName, fileToUpload, { upsert: true });

        if (!error && data) {
          const {
            data: { publicUrl },
          } = supabase.storage.from('inventory-photos').getPublicUrl(fileName);
          setImage(publicUrl);
          setIsUploading(false);
          return;
        }
      } catch (storageErr) {
        console.warn('Storage upload fallback:', storageErr);
      }

      // Final fallback to Data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImage(reader.result);
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(fileToUpload);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Please enter a garment name.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const finalImage =
      image.trim() ||
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1200';

    // Map Category to URL slug
    let categorySlug: 'suits' | 'gowns' | 'accessories' | 'veils' = 'suits';
    const lowerCat = category.toLowerCase();
    if (lowerCat.includes('gown') || lowerCat.includes('bridal')) {
      categorySlug = 'gowns';
    } else if (lowerCat.includes('accessor')) {
      categorySlug = 'accessories';
    } else {
      categorySlug = 'suits';
    }

    const itemId = editingItem?.id || `item-${Date.now().toString().slice(-6)}`;
    const parsedPrice = Math.max(0, Number(price) || 0);

    const record: RentalItem = {
      id: itemId,
      slug: (editingItem?.slug || name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
      name: name.trim(),
      sku: editingItem?.sku || `UF-${Math.floor(100 + Math.random() * 900)}`,
      category,
      categorySlug,
      color: editingItem?.color || 'Classic',
      fabric: editingItem?.fabric || 'Luxury Wool & Silk Blend',
      fit: editingItem?.fit || 'Bespoke Atelier Fit',
      description: editingItem?.description || name.trim(),
      rentalPrice: parsedPrice,
      refundableDeposit: editingItem?.refundableDeposit || 0,
      rentalPeriodDays: 4,
      images: [finalImage, ...(editingItem?.images?.slice(1) || [])],
      sizes: sizeRange
        .split(/[,\–\-]+/)
        .map((s) => s.trim())
        .filter(Boolean),
      sizeRange: sizeRange.trim(),
      simpleStatus: status,
      condition: condition.trim() || 'Pristine',
      stockBySize: editingItem?.stockBySize || [],
      totalStock: 1,
      readyStock: status === 'Available' ? 1 : 0,
      rentedStock: status === 'Rented' ? 1 : 0,
      inCareStock: status === 'Dry cleaning' ? 1 : 0,
      status: 'Published',
      allowOnlineBooking: true,
      cleaningTurnaroundDays: 1,
      badge: editingItem?.badge || (categorySlug === 'gowns' ? 'Couture' : 'Rental'),
      isArchived: false,
    };

    try {
      // 1. Post to Server API (persists to Supabase and items.json)
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });

      if (!res.ok) {
        console.warn('API items save warning, proceeding with optimistic sync');
      }

      // 2. Instant cross-tab broadcast (0ms realtime to storefront)
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('uno_items_updated_at', String(Date.now()));
        } catch (e) {}

        if ('BroadcastChannel' in window) {
          try {
            const bc = new BroadcastChannel('uno_items_sync');
            bc.postMessage({ action: 'upsert', item: record });
            bc.close();
          } catch (bcErr) {}
        }
      }

      // 3. Supabase Realtime broadcast across all devices
      try {
        const supabase = createClient();
        const bChan = supabase.channel('realtime:items_broadcast');
        bChan.subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            bChan.send({
              type: 'broadcast',
              event: 'item_changed',
              payload: record,
            });
            setTimeout(() => supabase.removeChannel(bChan), 1500);
          }
        });
      } catch (sbErr) {}

      // 3. Callback to parent page to update local state immediately
      onSaved(record);
      onClose();
    } catch (err: any) {
      console.error('Failed to save item:', err);
      // Still update UI optimistically
      onSaved(record);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const numericPrice = Number(price) || 0;
  const approxUSD = formatUSD(numericPrice, exchangeRate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-[#E8E4DC] shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-3.5">
          <div>
            <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#2A1810]">
              {editingItem ? 'Edit Garment' : 'Add New Garment'}
            </h3>
            <p className="text-[11px] text-[#8C7B6E] mt-0.5">
              Available immediately in boutique inventory and on the live website.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#8C7B6E] hover:text-[#2A1810] p-1.5 rounded-full hover:bg-[#FAF8F5] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Garment Name */}
          <div>
            <label className="block text-[#8C7B6E] mb-1 font-semibold uppercase text-[10px] tracking-wider">
              Garment Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Asymmetry Shawl Tuxedo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#D5CFCE] rounded-xl p-3 text-[#2A1810] placeholder:text-[#B0A79E] focus:outline-none focus:border-[#9E7B4F] focus:bg-white transition-all text-xs"
            />
          </div>

          {/* Category & Size Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[#8C7B6E] mb-1 font-semibold uppercase text-[10px] tracking-wider">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="w-full bg-[#FAF8F5] border border-[#D5CFCE] rounded-xl p-3 text-[#2A1810] focus:outline-none focus:border-[#9E7B4F] focus:bg-white transition-all text-xs cursor-pointer"
              >
                <option value="Suits">Suits</option>
                <option value="Tuxedo">Tuxedo</option>
                <option value="Bridal gowns">Bridal Gowns</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            <div>
              <label className="block text-[#8C7B6E] mb-1 font-semibold uppercase text-[10px] tracking-wider">
                Size Range
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 38–44 or 44–56"
                value={sizeRange}
                onChange={(e) => setSizeRange(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D5CFCE] rounded-xl p-3 text-[#2A1810] placeholder:text-[#B0A79E] focus:outline-none focus:border-[#9E7B4F] focus:bg-white transition-all text-xs"
              />
            </div>
          </div>

          {/* Garment Photo Upload */}
          <div>
            <label className="block text-[#8C7B6E] mb-1 font-semibold uppercase text-[10px] tracking-wider">
              Garment Photo / Image
            </label>
            {image ? (
              <div className="relative flex items-center gap-3.5 p-3 bg-[#FAF8F5] border border-[#ECDCCB] rounded-2xl">
                <div className="relative w-14 h-18 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-[#E8E0D5]">
                  <img
                    src={image}
                    alt="Garment preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#2A1810] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#2D6A4F]" />
                    Photo Attached
                  </p>
                  <p className="text-[10px] text-[#8C7B6E] truncate mt-0.5">
                    Live on store catalog &amp; client booking
                  </p>
                  <div className="flex items-center gap-2 mt-2">
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
                      onClick={() => setImage('')}
                      className="text-[11px] font-semibold text-rose-600 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#D5CFCE] hover:border-[#9E7B4F] rounded-2xl bg-[#FAF8F5] hover:bg-[#FAF4EB]/60 transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-white shadow-2xs flex items-center justify-center text-[#9E7B4F] group-hover:scale-105 transition-transform">
                  <Upload className="w-4 h-4" />
                </div>
                <span className="mt-2 text-xs font-semibold text-[#2A1810]">
                  {isUploading ? 'Converting & uploading photo...' : 'Upload garment photo'}
                </span>
                <span className="text-[10px] text-[#8C7B6E]">
                  JPG, PNG, WebP, or iPhone HEIC from device
                </span>
                <input
                  type="file"
                  accept="image/*,.heic,.HEIC,.heif,.HEIF"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* 4-Day Rental Price & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[#8C7B6E] mb-1 font-semibold uppercase text-[10px] tracking-wider">
                4-Day Rental Price (RWF) *
              </label>
              <input
                type="number"
                required
                min={0}
                placeholder="150000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D5CFCE] rounded-xl p-3 text-[#2A1810] focus:outline-none focus:border-[#9E7B4F] focus:bg-white transition-all text-xs"
              />
              <span className="text-[10px] text-[#8C7B6E] mt-1 block">
                ≈ ${approxUSD} USD (1 USD = {exchangeRate.toLocaleString()} RWF)
              </span>
            </div>

            <div>
              <label className="block text-[#8C7B6E] mb-1 font-semibold uppercase text-[10px] tracking-wider">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as InventorySimpleStatus)}
                className="w-full bg-[#FAF8F5] border border-[#D5CFCE] rounded-xl p-3 text-[#2A1810] focus:outline-none focus:border-[#9E7B4F] focus:bg-white transition-all text-xs cursor-pointer"
              >
                <option value="Available">Available</option>
                <option value="Rented">On Rental</option>
                <option value="Dry cleaning">Eco Cleaning &amp; Care</option>
              </select>
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-[#8C7B6E] mb-1 font-semibold uppercase text-[10px] tracking-wider">
              Garment Condition
            </label>
            <input
              type="text"
              placeholder="e.g. Pristine, Atelier Grade"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#D5CFCE] rounded-xl p-3 text-[#2A1810] focus:outline-none focus:border-[#9E7B4F] focus:bg-white transition-all text-xs"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="flex-1 bg-[#4A2311] hover:bg-[#34180A] text-white py-3.5 rounded-full font-semibold uppercase tracking-wider text-[11px] transition-all shadow-sm active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting
                ? 'Saving to Website...'
                : editingItem
                ? 'Save Changes'
                : 'Add to Collection'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="bg-[#FAF8F5] hover:bg-[#F2EDE4] border border-[#D5CFCE] px-6 py-3.5 rounded-full text-xs font-semibold text-[#2A1810] transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
