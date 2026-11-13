'use client';

import { useState, use, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  Clock,
  Check,
  Lock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { INITIAL_ITEMS } from '@/lib/data/mock-catalog';
import { RentalItem } from '@/lib/types';
import { formatRWF, formatLuxuryDate } from '@/lib/utils';

export default function ItemDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const [item, setItem] = useState<RentalItem>(() => {
    return (
      INITIAL_ITEMS.find((i) => i.slug === resolvedParams.slug) ||
      INITIAL_ITEMS[0]
    );
  });

  useEffect(() => {
    fetch(`/api/items?slug=${resolvedParams.slug}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setItem(data[0]);
          if (data[0].sizes?.length > 0) {
            setSelectedSize(data[0].sizes[0]);
          }
        }
      })
      .catch((err) => console.error('Error fetching live item details:', err));
  }, [resolvedParams.slug]);

  if (!item) {
    notFound();
  }

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(item.sizes[0] || '40');
  const [pickupDate, setPickupDate] = useState('2026-11-13');
  const [returnDate, setReturnDate] = useState('2026-11-17');
  const [fittingDate, setFittingDate] = useState('Wed, 11 Nov 2026 · 2:30pm');
  const [fittingEnabled, setFittingEnabled] = useState(true);

  // Customer form details
  const [firstName, setFirstName] = useState('Amelia');
  const [lastName, setLastName] = useState('Bennett');
  const [email, setEmail] = useState('amelia.bennett@email.com');
  const [phone, setPhone] = useState('+250 783 036 628');
  const [agreedTerms, setAgreedTerms] = useState(true);

  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [generatedBookingId, setGeneratedBookingId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalToPay = item.rentalPrice + item.refundableDeposit;

  const handleBookNow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedTerms) return;
    setIsSubmitting(true);

    const randomId = `BK-${Math.floor(1050 + Math.random() * 900)}`;
    setGeneratedBookingId(randomId);

    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingNumber: `#UF-${Math.floor(1050 + Math.random() * 900)}`,
          customerName: `${firstName} ${lastName}`.trim(),
          customerEmail: email.trim(),
          customerPhone: phone.trim(),
          itemId: item.id,
          itemName: item.name,
          itemSku: item.sku,
          itemImage: item.images[0] || '',
          size: selectedSize,
          pickupDate,
          returnDate,
          rentalFee: item.rentalPrice,
          depositFee: item.refundableDeposit,
          totalAmount: totalToPay,
          fittingDate: fittingEnabled ? fittingDate : null,
          type: 'Online',
          status: 'Request',
          notes: `Reserved via product detail page. Fitting: ${fittingEnabled ? fittingDate : 'None'}`,
        }),
      });
    } catch (err) {
      console.error('Failed to submit booking:', err);
    } finally {
      setIsSubmitting(false);
      setBookingConfirmed(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-[11px] text-[#82887F] mb-6">
        <Link href="/" className="hover:text-[#191C1A]">
          Home
        </Link>
        <span>/</span>
        <Link href="/collection" className="hover:text-[#191C1A]">
          Collection
        </Link>
        <span>/</span>
        <span className="capitalize">{item.category}</span>
        <span>/</span>
        <span className="text-[#191C1A] font-medium">{item.name}</span>
      </nav>

      {/* 2-Column Split: Gallery Left, Details & Reservation Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Photo Gallery with constrained max-height */}
        <div className="lg:col-span-6 space-y-6">
          <div className="relative aspect-[4/5] max-h-[500px] w-full overflow-hidden bg-[#ECE8E1] rounded-xs shadow-md">
            <Image
              src={item.images[activeImageIndex] || item.images[0]}
              alt={item.name}
              fill
              priority
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />

            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-0.5 text-[10px] font-semibold text-[#191C1A] tracking-wider uppercase">
              THE TAILORING EDIT
            </div>

            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 text-[11px] font-mono text-[#191C1A]">
              {String(activeImageIndex + 1).padStart(2, '0')} / {String(item.images.length).padStart(2, '0')}
            </div>
          </div>

          {/* Thumbnail Strip */}
          {item.images.length > 1 && (
            <div className="grid grid-cols-3 gap-3">
              {item.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative aspect-[4/3] max-h-[100px] w-full overflow-hidden bg-[#ECE8E1] border-2 transition-all rounded-xs ${
                    activeImageIndex === idx ? 'border-[#191C1A]' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${item.name} preview ${idx + 1}`}
                    fill
                    className="object-cover object-top"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Fabric & Fit Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-y border-[#E8E4DC] py-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#9E7B4F] block">
                The Fabric
              </span>
              <p className="text-xs text-[#4A4E48] mt-1.5 font-normal leading-relaxed">
                {item.fabric}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#9E7B4F] block">
                The Fit
              </span>
              <p className="text-xs text-[#4A4E48] mt-1.5 font-normal leading-relaxed">
                {item.fit}
              </p>
            </div>
          </div>

          {/* Atelier Guarantees */}
          <div className="space-y-2.5">
            <h3 className="font-serif-luxury text-xl text-[#191C1A]">
              Every detail, taken care of.
            </h3>
            <ul className="space-y-2 text-xs text-[#52574F]">
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-[#2D5A38]" />
                <span>Fitting and cleaning included</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-[#2D5A38]" />
                <span>Cleaned and pressed before pickup</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-[#2D5A38]" />
                <span>Return by 6pm on your return date</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Fitting & Reservation Drawer */}
        <div className="lg:col-span-6 space-y-6 lg:pl-2">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#9E7B4F]">
              {item.sku} · {item.color.toUpperCase()}
            </span>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#191C1A] mt-1">
              {item.name}
            </h1>

            <div className="flex items-baseline space-x-2.5 mt-2">
              <span className="font-serif-luxury text-2xl font-semibold text-[#191C1A]">
                {formatRWF(item.rentalPrice)}
              </span>
              <span className="text-xs text-[#6B726A]">
                / per day · fitting & cleaning included
              </span>
            </div>

            <p className="text-xs text-[#5C615A] mt-3 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Size Selector */}
          <div className="space-y-2.5 border-t border-[#E8E4DC] pt-5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#191C1A]">
                Choose your size
              </span>
              <span className="text-[11px] text-[#9E7B4F] cursor-pointer hover:underline">
                Size guide
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {item.sizes.map((sz) => {
                const isSelected = selectedSize === sz;
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`h-9 px-4 text-xs font-semibold tracking-wider transition-colors border rounded-xs ${
                      isSelected
                        ? 'bg-[#191C1A] text-white border-[#191C1A]'
                        : 'bg-white text-[#191C1A] border-[#D5CFCE] hover:border-[#191C1A]'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Pickers */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#6B726A] font-medium mb-1">
                  Pickup
                </label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full bg-white border border-[#D5CFCE] px-3 py-2 text-xs text-[#191C1A] focus:outline-none focus:border-[#191C1A]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#6B726A] font-medium mb-1">
                  Return
                </label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full bg-white border border-[#D5CFCE] px-3 py-2 text-xs text-[#191C1A] focus:outline-none focus:border-[#191C1A]"
                />
              </div>
            </div>

            {/* Dynamic Availability Indicator Pill */}
            <div className="p-2.5 bg-[#EAF3EC] border border-[#2D5A38]/20 text-[#2D5A38] text-[11px] flex items-center space-x-2 rounded-xs">
              <Check className="w-3.5 h-3.5 flex-shrink-0" />
              <span>
                Size {selectedSize} is available for {formatLuxuryDate(pickupDate)}–{formatLuxuryDate(returnDate)}
              </span>
            </div>
          </div>

          {/* Optional Fitting Consultation */}
          <div className="space-y-2 border-t border-[#E8E4DC] pt-5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#191C1A]">
                Fitting (optional)
              </span>
              <button
                type="button"
                onClick={() => setFittingEnabled(!fittingEnabled)}
                className="text-xs text-[#9E7B4F] hover:underline"
              >
                {fittingEnabled ? 'Remove' : '+ Add session'}
              </button>
            </div>

            {fittingEnabled && (
              <div className="bg-white border border-[#D5CFCE] p-3 flex items-center justify-between rounded-xs">
                <div className="flex items-center space-x-2 text-xs text-[#191C1A]">
                  <Clock className="w-3.5 h-3.5 text-[#9E7B4F]" />
                  <span>{fittingDate}</span>
                </div>
                <span className="text-[10px] text-[#6B726A]">
                  Kigali Atelier
                </span>
              </div>
            )}
          </div>

          {/* Customer Details Form */}
          <form onSubmit={handleBookNow} className="space-y-4 border-t border-[#E8E4DC] pt-5">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#191C1A] block">
              Your details
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-[#6B726A] mb-1">First name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-white border border-[#D5CFCE] px-3 py-2 text-xs text-[#191C1A] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#6B726A] mb-1">Last name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-white border border-[#D5CFCE] px-3 py-2 text-xs text-[#191C1A] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-[#6B726A] mb-1">Email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-[#D5CFCE] px-3 py-2 text-xs text-[#191C1A] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#6B726A] mb-1">Phone number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white border border-[#D5CFCE] px-3 py-2 text-xs text-[#191C1A] focus:outline-none"
                />
              </div>
            </div>

            {/* Booking Summary Box */}
            <div className="bg-white border border-[#E8E4DC] p-4 space-y-3 shadow-xs rounded-xs">
              <h3 className="font-serif-luxury text-xl font-normal text-[#191C1A]">
                Booking summary
              </h3>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#555A52]">
                    {item.name} · Size {selectedSize} · {item.rentalPeriodDays} days
                  </span>
                  <span className="font-medium text-[#191C1A]">
                    {formatRWF(item.rentalPrice)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#555A52]">Fitting and cleaning</span>
                  <span className="text-[#2D5A38] font-medium">Included</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#555A52]">Refundable deposit</span>
                  <span className="font-medium text-[#191C1A]">
                    {formatRWF(item.refundableDeposit)}
                  </span>
                </div>
              </div>

              <div className="border-t border-[#E8E4DC] pt-3 flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#191C1A]">
                  Total to pay now
                </span>
                <span className="font-serif-luxury text-2xl font-semibold text-[#191C1A]">
                  {formatRWF(totalToPay)}
                </span>
              </div>

              <p className="text-[10px] text-[#7B8079]">
                Rental: {formatRWF(item.rentalPrice)}. Deposit: {formatRWF(item.refundableDeposit)}. Deposit is refunded after return and inspection.
              </p>
            </div>

            {/* Agreement Checkbox */}
            <label className="flex items-start space-x-2 text-xs text-[#4A4E48] cursor-pointer">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="w-3.5 h-3.5 text-[#191C1A] accent-[#191C1A] mt-0.5"
              />
              <span>I agree to the rental terms and return date.</span>
            </label>

            {/* Submit CTA */}
            <div>
              <button
                type="submit"
                disabled={!agreedTerms}
                className="w-full bg-[#191C1A] text-[#FAF8F5] py-3.5 px-6 text-xs font-semibold uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-black disabled:opacity-50 transition-all shadow-sm rounded-xs"
              >
                <Lock className="w-3 h-3" />
                <span>Reserve now · {formatRWF(totalToPay)}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {bookingConfirmed && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] max-w-md w-full p-6 border border-[#E8E4DC] shadow-2xl space-y-4 rounded-xs">
            <div className="w-10 h-10 rounded-full bg-[#EAF3EC] text-[#2D5A38] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-5 h-5" />
            </div>

            <div className="text-center space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#9E7B4F] font-semibold">
                Reservation Confirmed
              </span>
              <h3 className="font-serif-luxury text-2xl text-[#191C1A]">
                Thank you, {firstName}!
              </h3>
              <p className="text-xs text-[#6B726A]">
                Booking Reference: <strong className="text-[#191C1A] font-mono">{generatedBookingId}</strong>
              </p>
            </div>

            <div className="bg-white p-3.5 border border-[#E8E4DC] text-xs space-y-1.5 rounded-xs">
              <div className="flex justify-between">
                <span className="text-[#6B726A]">Item:</span>
                <span className="font-medium text-[#191C1A]">{item.name} ({selectedSize})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B726A]">Rental Period:</span>
                <span className="font-medium text-[#191C1A]">{pickupDate} to {returnDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B726A]">Total Paid:</span>
                <span className="font-semibold text-[#191C1A]">{formatRWF(totalToPay)}</span>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setBookingConfirmed(false)}
                className="flex-1 bg-[#191C1A] text-white py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-black"
              >
                Close
              </button>
              <Link
                href="/admin"
                className="flex-1 bg-white border border-[#191C1A] text-[#191C1A] py-2.5 text-xs uppercase tracking-widest font-semibold text-center hover:bg-neutral-50"
              >
                View in Admin
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
