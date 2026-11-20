'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Check, MessageCircle } from 'lucide-react';
import { formatRWF } from '@/lib/utils';
import { formatUSD, DEFAULT_USD_RATE } from '@/lib/currency';

export interface RentModalSuit {
  id: string;
  name: string;
  rentalPrice: number;
  image: string;
  sizes?: string;
  category?: string;
}

interface RentItemModalProps {
  suit: RentModalSuit | null;
  onClose: () => void;
  exchangeRate?: number;
}

export default function RentItemModal({ suit, onClose, exchangeRate: propRate }: RentItemModalProps) {
  const [exchangeRate, setExchangeRate] = useState<number>(propRate || DEFAULT_USD_RATE);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [rentalDays, setRentalDays] = useState<number | string>(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (propRate) {
      setExchangeRate(propRate);
      return;
    }
    fetch('/api/currency')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.rate === 'number' && data.rate > 0) {
          setExchangeRate(data.rate);
        }
      })
      .catch((err) => console.error('Error fetching currency rate:', err));
  }, [propRate]);

  // Optional Measurements State (Pant Waist: 28-60, Pant Length: 36-43, Suit Size: 44-60)
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [waist, setWaist] = useState('');
  const [pantLength, setPantLength] = useState('');
  const [suitSize, setSuitSize] = useState('');
  const [measureError, setMeasureError] = useState<string | null>(null);

  // Prevent background scrolling on iOS / Android when modal is open
  useEffect(() => {
    if (suit) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [suit]);

  if (!suit) return null;

  const isTuxedo = Boolean(
    suit.category?.toLowerCase().includes('tuxedo') ||
    suit.name.toLowerCase().includes('tuxedo')
  );

  const minSuitSize = 44;
  const maxSuitSize = 60;
  const suitSizeLabel = isTuxedo ? 'Tuxedo Size' : 'Suit Size';

  const minWaist = 28;
  const maxWaist = 60;

  const minLength = 36;
  const maxLength = 43;

  const isWaistInvalid = Boolean(waist && (Number(waist) < minWaist || Number(waist) > maxWaist || isNaN(Number(waist))));
  const isLengthInvalid = Boolean(pantLength && (Number(pantLength) < minLength || Number(pantLength) > maxLength || isNaN(Number(pantLength))));
  const isSuitSizeInvalid = Boolean(suitSize && (Number(suitSize) < minSuitSize || Number(suitSize) > maxSuitSize || isNaN(Number(suitSize))));

  const numDays = Math.max(1, parseInt(String(rentalDays), 10) || 1);
  const totalAmount = suit.rentalPrice * numDays;

  const validateMeasurements = (): boolean => {
    setMeasureError(null);
    if (isWaistInvalid) {
      setMeasureError(`Waist measurement must be between ${minWaist}" and ${maxWaist}". For sizes outside this limit, visit our showroom or leave blank.`);
      return false;
    }
    if (isLengthInvalid) {
      setMeasureError(`Pant length must be between ${minLength}" and ${maxLength}". For custom hem length alterations, visit our showroom or leave blank.`);
      return false;
    }
    if (isSuitSizeInvalid) {
      setMeasureError(`${suitSizeLabel} must be between ${minSuitSize} and ${maxSuitSize}. For sizing outside this limit, our master tailors provide custom showroom fittings.`);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateMeasurements()) {
      setShowMeasurements(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const pickup = eventDate || new Date().toISOString().split('T')[0];
      const days = Math.max(1, parseInt(String(rentalDays), 10) || 1);
      const pickupTime = new Date(pickup + 'T00:00:00').getTime();
      const returnDate = new Date(pickupTime + days * 86400000).toISOString().split('T')[0];

      const measureParts: string[] = [];
      if (waist) measureParts.push(`Waist: ${waist}"`);
      if (pantLength) measureParts.push(`Pant Length: ${pantLength}"`);
      if (suitSize) measureParts.push(`Suit Size: ${suitSize}`);

      const measureNote = measureParts.length > 0 ? `[Measurements: ${measureParts.join(' | ')}]` : '';
      const fullNotes = [measureNote, `Suit rental for ${days} day(s). Size: ${suit.sizes || 'Tailored to measure'}`].filter(Boolean).join(' · ');

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: fullName.trim(),
          customerPhone: phone.trim(),
          customerEmail: email.trim(),
          itemId: suit.id,
          itemName: suit.name,
          itemImage: suit.image,
          size: suit.sizes || (suitSize ? `Size ${suitSize}` : 'Tailored to measure'),
          pickupDate: pickup,
          returnDate: returnDate,
          rentalFee: totalAmount,
          totalAmount: totalAmount,
          type: 'Online',
          status: 'Request',
          notes: fullNotes,
          measurements: measureParts.length > 0 ? { waist, pantLength, suitSize } : undefined,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error('Booking submission error from server:', errorData);
        alert(errorData.error || 'Failed to submit reservation. Please try again.');
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      alert('Network error submitting reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setWaist('');
    setPantLength('');
    setSuitSize('');
    setMeasureError(null);
    setShowMeasurements(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto touch-manipulation animate-in fade-in duration-200"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative my-auto border border-[#E8E4DC]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with 44px touch-target Close button */}
        <div className="p-4 sm:p-6 pb-3 sm:pb-4 flex items-center justify-between border-b border-[#F0ECE3] bg-[#FAF8F5] shrink-0">
          <div>
            <h3 className="text-lg sm:text-2xl font-serif-luxury font-semibold text-[#191C1A] tracking-tight">
              Rent this Item
            </h3>
            <p className="text-[11px] sm:text-xs text-[#736E67] mt-0.5">
              Fill in your details and we&apos;ll confirm sizing and fitting slot.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="min-w-[44px] min-h-[44px] -mr-2 rounded-full hover:bg-[#EAE4D9] active:bg-[#DDD5C7] flex items-center justify-center text-[#736E67] hover:text-[#191C1A] transition-colors touch-manipulation cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item Summary Banner */}
        <div className="bg-[#FAF7F2] p-3 sm:p-4 flex items-center space-x-3.5 border-b border-[#F0ECE3] shrink-0">
          <div className="relative w-12 h-16 sm:w-14 sm:h-18 rounded-md overflow-hidden bg-[#ECE8E1] shrink-0 border border-[#E8E2D6]">
            <Image
              src={suit.image}
              alt={suit.name}
              fill
              className="object-cover object-top"
              sizes="64px"
            />
          </div>

          <div className="space-y-0.5 min-w-0">
            <h4 className="text-sm sm:text-base font-medium text-[#191C1A] leading-snug truncate">
              {suit.name}
            </h4>
            <p className="text-xs font-semibold text-[#9E7B4F]">
              From {formatRWF(suit.rentalPrice)}/Day <span className="text-[11px] text-[#736E67] font-normal">(~${formatUSD(suit.rentalPrice, exchangeRate)} USD)</span>
            </p>
            <span className="text-[10px] uppercase tracking-wider text-[#8C8278] block">
              {suit.sizes || 'SIZE 44—52'}
            </span>
          </div>
        </div>

        {/* Scrollable Form Body */}
        {submitted ? (
          <div className="p-6 sm:p-8 text-center space-y-4 overflow-y-auto flex-1">
            <div className="w-12 h-12 rounded-full bg-[#EBF7EE] text-[#25D366] flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-semibold text-[#191C1A]">
                Reservation Request Received
              </h4>
              <p className="text-xs text-[#736E67] max-w-sm mx-auto leading-relaxed">
                Thank you, <span className="font-semibold text-[#191C1A]">{fullName}</span>. Our Kigali atelier concierge will message you on WhatsApp (<span className="font-semibold text-[#191C1A]">{phone}</span>) to confirm sizing and fitting slot.
              </p>
            </div>

            <div className="p-3 bg-[#FAF7F2] rounded-xl text-xs text-[#59524A] max-w-sm mx-auto border border-[#EFEAE2] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#8C8278]">Rental Duration ({numDays} day{numDays > 1 ? 's' : ''}):</span>
                <div className="text-right">
                  <span className="font-bold text-[#191C1A] block">{formatRWF(totalAmount)}</span>
                  <span className="text-[10px] text-[#8C8075]">~${formatUSD(totalAmount, exchangeRate)} USD</span>
                </div>
              </div>

              {(waist || pantLength || suitSize) && (
                <div className="pt-2 border-t border-[#E8E2D6] text-left">
                  <div className="text-[10px] uppercase font-semibold text-[#8C8278] tracking-wider mb-1">
                    Tailored Measurements Recorded:
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-[11px] font-medium text-[#191C1A]">
                    {waist && (
                      <span className="bg-white px-2 py-0.5 rounded border border-[#DDD6CB]">
                        Waist: {waist}&quot;
                      </span>
                    )}
                    {pantLength && (
                      <span className="bg-white px-2 py-0.5 rounded border border-[#DDD6CB]">
                        Length: {pantLength}&quot;
                      </span>
                    )}
                    {suitSize && (
                      <span className="bg-white px-2 py-0.5 rounded border border-[#DDD6CB]">
                        Suit Size: {suitSize}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2 max-w-sm mx-auto pt-1">
              <a
                href={`https://wa.me/250783036628?text=${encodeURIComponent(
                  `Hello Uno Fashion, I just reserved "${suit.name}" for ${numDays} day(s).\nName: ${fullName}\nPhone: ${phone}${
                    waist || pantLength || suitSize
                      ? `\nMeasurements: Waist ${waist || 'N/A'}", Length ${pantLength || 'N/A'}", Size ${suitSize || 'N/A'}`
                      : ''
                  }`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full min-h-[44px] bg-[#25D366] hover:bg-[#1EBE5D] text-white py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors touch-manipulation cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message Atelier on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={handleClose}
                className="w-full min-h-[44px] bg-[#191C1A] hover:bg-[#9E7B4F] text-white py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors touch-manipulation cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3.5 sm:space-y-4 overflow-y-auto flex-1 overscroll-contain">
            {/* Full Name */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#191C1A] mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-white border border-[#DDD6CB] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-[#191C1A] placeholder-[#A69E96] focus:outline-none focus:border-[#191C1A] focus:ring-1 focus:ring-[#191C1A] transition-all touch-manipulation"
              />
            </div>

            {/* Phone / WhatsApp */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#191C1A] mb-1">
                Phone / WhatsApp *
              </label>
              <input
                type="tel"
                required
                placeholder="+250 783 036 628"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white border border-[#DDD6CB] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-[#191C1A] placeholder-[#A69E96] focus:outline-none focus:border-[#191C1A] focus:ring-1 focus:ring-[#191C1A] transition-all touch-manipulation"
              />
            </div>

            {/* Email (Optional) */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#191C1A] mb-1">
                Email (Optional)
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-[#DDD6CB] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-[#191C1A] placeholder-[#A69E96] focus:outline-none focus:border-[#191C1A] focus:ring-1 focus:ring-[#191C1A] transition-all touch-manipulation"
              />
            </div>

            {/* Event Date & Rental Days */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#191C1A] mb-1">
                  Event Date *
                </label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-white border border-[#DDD6CB] rounded-lg px-3 py-2 text-xs sm:text-sm text-[#191C1A] focus:outline-none focus:border-[#191C1A] focus:ring-1 focus:ring-[#191C1A] transition-all touch-manipulation"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#191C1A] mb-1">
                  Rental Days
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  required
                  placeholder="1"
                  value={rentalDays}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '') {
                      setRentalDays('');
                    } else {
                      const parsed = parseInt(val, 10);
                      setRentalDays(isNaN(parsed) ? '' : Math.max(1, parsed));
                    }
                  }}
                  onBlur={() => {
                    if (rentalDays === '' || Number(rentalDays) < 1) {
                      setRentalDays(1);
                    }
                  }}
                  className="w-full bg-white border border-[#DDD6CB] rounded-lg px-3 py-2 text-xs sm:text-sm text-[#191C1A] focus:outline-none focus:border-[#191C1A] focus:ring-1 focus:ring-[#191C1A] transition-all touch-manipulation"
                />
              </div>
            </div>

            {/* Optional Tailoring Measurements (Pant Waist: 28-60, Pant Length: 36-43, Suit Size: 44-60) */}
            <div className="border border-[#E8E2D6] rounded-xl overflow-hidden bg-[#FAF8F5]/60 transition-all">
              <button
                type="button"
                onClick={() => {
                  setShowMeasurements(!showMeasurements);
                  setMeasureError(null);
                }}
                className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-[#FAF5ED] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#191C1A]">
                    Tailoring Measurements (Optional)
                  </span>
                  {(waist || pantLength || suitSize) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9E7B4F]" />
                  )}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#8C8075]">
                  <span>{showMeasurements ? 'Hide' : 'Add custom fit'}</span>
                  {showMeasurements ? (
                    <svg className="w-3.5 h-3.5 text-[#8C8075]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m18 15-6-6-6 6" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5 text-[#8C8075]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                    </svg>
                  )}
                </div>
              </button>

              {showMeasurements && (
                <div className="p-3.5 pt-2 border-t border-[#F0ECE3] space-y-3 bg-white">
                  <p className="text-[11px] text-[#736E67] leading-relaxed">
                    Provide your tailored measurements for an atelier-grade fit, or leave blank to fit at our showroom.
                  </p>

                  {measureError && (
                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 leading-normal">
                      {measureError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {/* Pant Waist */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#59524A]">
                          Waist (Inches)
                        </label>
                        <span className="text-[9px] text-[#8C8075] font-medium">
                          {minWaist}–{maxWaist}&quot;
                        </span>
                      </div>
                      <input
                        type="number"
                        min={minWaist}
                        max={maxWaist}
                        step="0.5"
                        value={waist}
                        onChange={(e) => {
                          setWaist(e.target.value);
                          setMeasureError(null);
                        }}
                        className={`w-full bg-white border rounded-lg px-2.5 py-2 text-xs sm:text-sm text-[#191C1A] placeholder-[#A69E96] focus:outline-none transition-all ${
                          isWaistInvalid
                            ? 'border-red-400 bg-red-50/20 text-red-900 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                            : 'border-[#DDD6CB] focus:border-[#191C1A] focus:ring-1 focus:ring-[#191C1A]'
                        }`}
                      />
                      {isWaistInvalid && (
                        <p className="text-[10px] text-red-600 mt-1 font-medium">
                          Limit exceeded ({minWaist}–{maxWaist}&quot;)
                        </p>
                      )}
                    </div>

                    {/* Pant Length */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#59524A]">
                          Pant Length
                        </label>
                        <span className="text-[9px] text-[#8C8075] font-medium">
                          {minLength}–{maxLength}&quot;
                        </span>
                      </div>
                      <input
                        type="number"
                        min={minLength}
                        max={maxLength}
                        step="0.5"
                        value={pantLength}
                        onChange={(e) => {
                          setPantLength(e.target.value);
                          setMeasureError(null);
                        }}
                        className={`w-full bg-white border rounded-lg px-2.5 py-2 text-xs sm:text-sm text-[#191C1A] placeholder-[#A69E96] focus:outline-none transition-all ${
                          isLengthInvalid
                            ? 'border-red-400 bg-red-50/20 text-red-900 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                            : 'border-[#DDD6CB] focus:border-[#191C1A] focus:ring-1 focus:ring-[#191C1A]'
                        }`}
                      />
                      {isLengthInvalid && (
                        <p className="text-[10px] text-red-600 mt-1 font-medium">
                          Limit exceeded ({minLength}–{maxLength}&quot;)
                        </p>
                      )}
                    </div>

                    {/* Suit or Tuxedo Size */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#59524A]">
                          {suitSizeLabel}
                        </label>
                        <span className="text-[9px] text-[#8C8075] font-medium">
                          {minSuitSize}–{maxSuitSize}
                        </span>
                      </div>
                      <input
                        type="number"
                        min={minSuitSize}
                        max={maxSuitSize}
                        value={suitSize}
                        onChange={(e) => {
                          setSuitSize(e.target.value);
                          setMeasureError(null);
                        }}
                        className={`w-full bg-white border rounded-lg px-2.5 py-2 text-xs sm:text-sm text-[#191C1A] placeholder-[#A69E96] focus:outline-none transition-all ${
                          isSuitSizeInvalid
                            ? 'border-red-400 bg-red-50/20 text-red-900 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                            : 'border-[#DDD6CB] focus:border-[#191C1A] focus:ring-1 focus:ring-[#191C1A]'
                        }`}
                      />
                      {isSuitSizeInvalid && (
                        <p className="text-[10px] text-red-600 mt-1 font-medium">
                          Limit exceeded ({minSuitSize}–{maxSuitSize})
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Estimated Total Calculation */}
            <div className="bg-[#FAF7F2] border border-[#EFEAE2] p-3.5 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8C8278] block">
                  Estimated Total
                </span>
                <span className="text-[10px] text-[#8C8075]">
                  1 USD = {exchangeRate.toLocaleString()} Frw · Settled in Frw
                </span>
              </div>
              <div className="text-right">
                <span className="text-base sm:text-lg font-bold text-[#191C1A] block">
                  {formatRWF(totalAmount)}
                </span>
                <span className="text-xs text-[#9E7B4F] font-semibold block">
                  ~${formatUSD(totalAmount, exchangeRate)} USD
                </span>
              </div>
            </div>

            {/* Actions: Cancel & Confirm Reservation */}
            <div className="pt-2 flex items-center space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="w-1/3 min-h-[44px] py-2.5 border border-[#DDD6CB] rounded-lg text-xs font-semibold uppercase tracking-wider text-[#6B655E] hover:bg-[#F5F2EC] active:bg-[#EAE4D9] transition-colors text-center touch-manipulation cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 min-h-[44px] py-2.5 bg-[#191C1A] hover:bg-[#9E7B4F] active:bg-[#14100E] text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs text-center touch-manipulation cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? 'Confirming...' : 'Confirm'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
