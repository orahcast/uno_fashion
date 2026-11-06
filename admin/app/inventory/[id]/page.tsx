'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Check,
  Upload,
  Trash2,
  Calendar,
  X,
  Plus,
} from 'lucide-react';
import { INITIAL_ITEMS } from '@/lib/data/mock-catalog';
import { RentalItem, SizeStock } from '@/lib/types';
import { formatRWF } from '@/lib/utils';

export default function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  const isNew = resolvedParams.id === 'new';
  const existingItem =
    INITIAL_ITEMS.find((i) => i.id === resolvedParams.id) || INITIAL_ITEMS[0];

  const [name, setName] = useState(isNew ? '' : existingItem.name);
  const [sku, setSku] = useState(isNew ? 'SU-004' : existingItem.sku);
  const [category, setCategory] = useState(isNew ? 'Suits' : existingItem.category);
  const [color, setColor] = useState(isNew ? 'Black' : existingItem.color);
  const [fabric, setFabric] = useState(isNew ? 'Italian wool' : existingItem.fabric);
  const [description, setDescription] = useState(
    isNew
      ? ''
      : existingItem.description
  );

  const [rentalPrice, setRentalPrice] = useState(
    isNew ? 185000 : existingItem.rentalPrice
  );
  const [refundableDeposit, setRefundableDeposit] = useState(
    isNew ? 150000 : existingItem.refundableDeposit
  );
  const [rentalPeriod, setRentalPeriod] = useState(
    isNew ? '4 days' : `${existingItem.rentalPeriodDays} days`
  );
  const [taxOption, setTaxOption] = useState('VAT included');

  const [status, setStatus] = useState<'Published' | 'Draft' | 'Archived'>(
    isNew ? 'Published' : existingItem.status
  );
  const [onlineBooking, setOnlineBooking] = useState(
    isNew ? true : existingItem.allowOnlineBooking
  );
  const [cleaningDays, setCleaningDays] = useState(
    isNew ? '1 day' : `${existingItem.cleaningTurnaroundDays} day`
  );
  const [blockedDates, setBlockedDates] = useState('None');

  const [images, setImages] = useState<string[]>(
    isNew
      ? ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1200']
      : existingItem.images
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const [stockMatrix, setStockMatrix] = useState<SizeStock[]>(
    isNew
      ? [
          { size: 'UK 36', total: 1, rented: 0, care: 0, ready: 1, reserved: 0 },
          { size: 'UK 38', total: 2, rented: 0, care: 0, ready: 2, reserved: 0 },
          { size: 'UK 40', total: 3, rented: 1, care: 0, ready: 2, reserved: 0 },
          { size: 'UK 42', total: 2, rented: 0, care: 0, ready: 2, reserved: 0 },
          { size: 'UK 44', total: 1, rented: 0, care: 0, ready: 1, reserved: 0 },
        ]
      : existingItem.stockBySize
  );

  const totalCalculated = stockMatrix.reduce((acc, s) => acc + s.total, 0);
  const readyCalculated = stockMatrix.reduce((acc, s) => acc + s.ready, 0);
  const totalDue = Number(rentalPrice) + Number(refundableDeposit);

  const handleStockChange = (index: number, newTotal: number) => {
    const updated = [...stockMatrix];
    const prev = updated[index];
    const diff = newTotal - prev.total;
    updated[index] = {
      ...prev,
      total: Math.max(0, newTotal),
      ready: Math.max(0, prev.ready + diff),
    };
    setStockMatrix(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Item updated successfully! Changes published to storefront.');
    router.push('/admin/inventory');
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Breadcrumb & Save Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E4DC] pb-4">
        <div>
          <Link
            href="/admin/inventory"
            className="inline-flex items-center space-x-1.5 text-xs text-[#6B726A] hover:text-[#191C1A]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to the collection</span>
          </Link>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#191C1A] mt-1">
            {isNew ? 'Add new item' : 'Edit item'}
          </h1>
          <p className="text-xs text-[#6B726A]">{sku} · {color} {name}</p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/inventory"
            className="bg-white border border-[#D5CFCE] px-5 py-2.5 text-xs font-semibold text-[#191C1A] hover:bg-neutral-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="inline-flex items-center space-x-2 bg-[#1A2421] text-white px-6 py-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors shadow-sm"
          >
            <span>Save</span>
            <Check className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Form Left, Side Panels Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Details, Pricing, Stock) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Item Details */}
          <div className="bg-white border border-[#E8E4DC] p-6 rounded-sm shadow-sm space-y-5">
            <h2 className="font-serif-luxury text-2xl text-[#191C1A]">Item details</h2>

            <div>
              <label className="block text-xs font-medium text-[#191C1A] mb-1.5">
                Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="The Windsor Tuxedo"
                className="w-full bg-white border border-[#D5CFCE] px-3.5 py-2.5 text-xs text-[#191C1A] focus:outline-none focus:border-[#191C1A]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#191C1A] mb-1.5">
                  SKU
                </label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full bg-white border border-[#D5CFCE] px-3.5 py-2.5 text-xs text-[#191C1A] focus:outline-none focus:border-[#191C1A]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#191C1A] mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-white border border-[#D5CFCE] px-3.5 py-2.5 text-xs text-[#191C1A] focus:outline-none focus:border-[#191C1A]"
                >
                  <option value="Suits">Suits</option>
                  <option value="Bridal gowns">Bridal gowns</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#191C1A] mb-1.5">
                  Colour
                </label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full bg-white border border-[#D5CFCE] px-3.5 py-2.5 text-xs text-[#191C1A] focus:outline-none focus:border-[#191C1A]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#191C1A] mb-1.5">
                  Fabric
                </label>
                <input
                  type="text"
                  value={fabric}
                  onChange={(e) => setFabric(e.target.value)}
                  className="w-full bg-white border border-[#D5CFCE] px-3.5 py-2.5 text-xs text-[#191C1A] focus:outline-none focus:border-[#191C1A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#191C1A] mb-1.5">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white border border-[#D5CFCE] px-3.5 py-2.5 text-xs text-[#191C1A] focus:outline-none focus:border-[#191C1A]"
              />
            </div>
          </div>

          {/* Card 2: Rental Pricing */}
          <div className="bg-white border border-[#E8E4DC] p-6 rounded-sm shadow-sm space-y-5">
            <h2 className="font-serif-luxury text-2xl text-[#191C1A]">Rental pricing</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#191C1A] mb-1.5">
                  Rental (Frw)
                </label>
                <input
                  type="number"
                  value={rentalPrice}
                  onChange={(e) => setRentalPrice(Number(e.target.value))}
                  className="w-full bg-white border border-[#D5CFCE] px-3.5 py-2.5 text-xs text-[#191C1A] focus:outline-none focus:border-[#191C1A]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#191C1A] mb-1.5">
                  Refundable deposit (Frw)
                </label>
                <input
                  type="number"
                  value={refundableDeposit}
                  onChange={(e) => setRefundableDeposit(Number(e.target.value))}
                  className="w-full bg-white border border-[#D5CFCE] px-3.5 py-2.5 text-xs text-[#191C1A] focus:outline-none focus:border-[#191C1A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#191C1A] mb-1.5">
                  Rental period
                </label>
                <select
                  value={rentalPeriod}
                  onChange={(e) => setRentalPeriod(e.target.value)}
                  className="w-full bg-white border border-[#D5CFCE] px-3.5 py-2.5 text-xs text-[#191C1A] focus:outline-none focus:border-[#191C1A]"
                >
                  <option value="4 days">4 days</option>
                  <option value="7 days">7 days</option>
                  <option value="10 days">10 days</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#191C1A] mb-1.5">
                  Tax
                </label>
                <select
                  value={taxOption}
                  onChange={(e) => setTaxOption(e.target.value)}
                  className="w-full bg-white border border-[#D5CFCE] px-3.5 py-2.5 text-xs text-[#191C1A] focus:outline-none focus:border-[#191C1A]"
                >
                  <option value="VAT included">VAT included</option>
                  <option value="VAT exempt">VAT exempt</option>
                </select>
              </div>
            </div>

            <div className="bg-[#FAF8F5] border border-[#E8E4DC] p-3 text-xs text-[#555A52]">
              Total: <strong>{formatRWF(totalDue)}</strong>. Deposit refunded after return.
            </div>
          </div>

          {/* Card 3: Sizes & Stock Matrix */}
          <div className="bg-white border border-[#E8E4DC] p-6 rounded-sm shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-4">
              <div>
                <h2 className="font-serif-luxury text-2xl text-[#191C1A]">Sizes & stock</h2>
                <p className="text-xs text-[#6B726A]">Stock by size</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="bg-[#EAF3EC] text-[#2D5A38] text-xs font-semibold px-2.5 py-1 rounded-sm">
                  {totalCalculated} total · {readyCalculated} ready
                </span>
                <span className="text-xs text-[#6B726A]">UK sizes</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[#848B82] uppercase tracking-wider text-[10px] border-b border-[#E8E4DC] pb-2">
                    <th className="pb-3 font-semibold">Size</th>
                    <th className="pb-3 font-semibold">Total</th>
                    <th className="pb-3 font-semibold">Rented</th>
                    <th className="pb-3 font-semibold">Care</th>
                    <th className="pb-3 font-semibold">Ready</th>
                    <th className="pb-3 font-semibold">Reserved</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EDE6]">
                  {stockMatrix.map((row, idx) => (
                    <tr key={row.size}>
                      <td className="py-3 font-semibold text-[#191C1A]">{row.size}</td>
                      <td className="py-3">
                        <input
                          type="number"
                          min={0}
                          value={row.total}
                          onChange={(e) => handleStockChange(idx, Number(e.target.value))}
                          className="w-16 bg-[#FAF8F5] border border-[#D5CFCE] px-2 py-1 text-center font-medium"
                        />
                      </td>
                      <td className="py-3 text-[#6B726A]">{row.rented}</td>
                      <td className="py-3 text-[#6B726A]">{row.care}</td>
                      <td className="py-3 font-semibold text-[#2D5A38]">{row.ready}</td>
                      <td className="py-3 text-[#6B726A]">{row.reserved}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (Photography, Visibility, Archive/Delete) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card 1: Item Photography */}
          <div className="bg-white border border-[#E8E4DC] p-6 rounded-sm shadow-sm space-y-4">
            <h2 className="font-serif-luxury text-xl text-[#191C1A]">Item photography</h2>
            <p className="text-[11px] text-[#6B726A]">Cover image</p>

            <div className="relative aspect-[4/5] w-full bg-[#ECE8E1] rounded-xs overflow-hidden">
              <Image
                src={images[0]}
                alt="Item cover"
                fill
                className="object-cover object-top"
              />
              <span className="absolute top-2 left-2 bg-white/95 px-2 py-0.5 text-[10px] font-semibold">
                Cover
              </span>
              <button
                type="button"
                onClick={() => setImages((prev) => prev.slice(1))}
                className="absolute top-2 right-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center text-xs hover:bg-white"
              >
                ✕
              </button>
            </div>

            {/* Thumbnail Row */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-[4/3] bg-[#ECE8E1] rounded-xs overflow-hidden group">
                  <Image src={img} alt="thumb" fill className="object-cover" />
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 bg-black/60 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
              <label className="aspect-[4/3] border-2 border-dashed border-[#D5CFCE] flex flex-col items-center justify-center text-[#8C938B] hover:text-[#191C1A] hover:border-[#191C1A] cursor-pointer transition-colors">
                <Plus className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            <label className="w-full flex items-center justify-center space-x-2 border border-[#D5CFCE] bg-white py-2.5 text-xs font-semibold text-[#191C1A] hover:bg-neutral-50 rounded-sm cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload image from device</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            <p className="text-[10px] text-[#8C938B] text-center">
              JPG, PNG or WebP · Up to 10MB each.
            </p>
          </div>

          {/* Card 2: Visibility & Availability */}
          <div className="bg-white border border-[#E8E4DC] p-6 rounded-sm shadow-sm space-y-4 text-xs">
            <h2 className="font-serif-luxury text-xl text-[#191C1A]">Visibility & availability</h2>

            <div>
              <label className="block font-medium text-[#191C1A] mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-white border border-[#D5CFCE] p-2.5 text-[#191C1A]"
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            <div className="pt-2">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-medium text-[#191C1A] block">Online booking</span>
                  <span className="text-[11px] text-[#6B726A]">Show on the public collection.</span>
                </div>
                <input
                  type="checkbox"
                  checked={onlineBooking}
                  onChange={(e) => setOnlineBooking(e.target.checked)}
                  className="w-5 h-5 accent-[#191C1A]"
                />
              </label>
            </div>

            <div className="pt-2">
              <label className="block font-medium text-[#191C1A] mb-1">Cleaning turnaround</label>
              <select
                value={cleaningDays}
                onChange={(e) => setCleaningDays(e.target.value)}
                className="w-full bg-white border border-[#D5CFCE] p-2.5 text-[#191C1A]"
              >
                <option value="1 day">1 day</option>
                <option value="2 days">2 days</option>
                <option value="3 days">3 days</option>
              </select>
            </div>

            <div className="pt-2">
              <label className="block font-medium text-[#191C1A] mb-1">Blocked dates</label>
              <div className="relative">
                <input
                  type="text"
                  value={blockedDates}
                  onChange={(e) => setBlockedDates(e.target.value)}
                  placeholder="None"
                  className="w-full bg-white border border-[#D5CFCE] p-2.5 text-[#191C1A]"
                />
                <Calendar className="w-3.5 h-3.5 text-[#8C938B] absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[10px] text-[#8C938B] mt-1">Confirmed rentals and cleaning block the size.</p>
            </div>
          </div>

          {/* Card 3: Archive or Delete */}
          <div className="bg-white border border-[#E8E4DC] p-6 rounded-sm shadow-sm space-y-3 text-xs">
            <h2 className="font-serif-luxury text-xl text-[#191C1A]">Archive or delete</h2>
            <p className="text-[11px] text-[#6B726A]">
              Archive keeps history. Delete only works when no bookings are linked.
            </p>
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setStatus('Archived');
                  alert('Item archived.');
                }}
                className="text-[#9E7B4F] font-semibold hover:underline"
              >
                Archive
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Delete item?')) {
                    router.push('/admin/inventory');
                  }
                }}
                className="inline-flex items-center space-x-1.5 text-red-600 hover:text-red-800 font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

