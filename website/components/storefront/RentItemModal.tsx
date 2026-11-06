'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Check } from 'lucide-react';
import { formatRWF } from '@/lib/utils';

export interface RentModalSuit {
  id: string;
  name: string;
  rentalPrice: number;
  image: string;
  sizes?: string;
}

interface RentItemModalProps {
  suit: RentModalSuit | null;
  onClose: () => void;
}

export default function RentItemModal({ suit, onClose }: RentItemModalProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [rentalDays, setRentalDays] = useState(1);
  const [submitted, setSubmitted] = useState(false);

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

  const totalAmount = suit.rentalPrice * (rentalDays > 0 ? rentalDays : 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
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
              From {formatRWF(suit.rentalPrice)}/Day
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

            <div className="p-3 bg-[#FAF7F2] rounded-xl text-xs text-[#59524A] max-w-sm mx-auto border border-[#EFEAE2]">
              Estimated Total for {rentalDays} day{rentalDays > 1 ? 's' : ''}:{' '}
              <span className="font-bold text-[#191C1A]">{formatRWF(totalAmount)}</span>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="w-full min-h-[44px] bg-[#191C1A] hover:bg-[#9E7B4F] text-white py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors touch-manipulation cursor-pointer"
            >
              Done
            </button>
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
                placeholder="e.g. Jean-Pierre Uwimana"
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
                  max="14"
                  required
                  value={rentalDays}
                  onChange={(e) => setRentalDays(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-white border border-[#DDD6CB] rounded-lg px-3 py-2 text-xs sm:text-sm text-[#191C1A] focus:outline-none focus:border-[#191C1A] focus:ring-1 focus:ring-[#191C1A] transition-all touch-manipulation"
                />
              </div>
            </div>

            {/* Estimated Total Calculation */}
            <div className="bg-[#FAF7F2] border border-[#EFEAE2] p-3.5 rounded-xl flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8C8278]">
                Estimated Total
              </span>
              <span className="text-base sm:text-lg font-bold text-[#191C1A]">
                {formatRWF(totalAmount)}
              </span>
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
                className="flex-1 min-h-[44px] py-2.5 bg-[#191C1A] hover:bg-[#9E7B4F] active:bg-[#14100E] text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs text-center touch-manipulation cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
