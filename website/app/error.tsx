'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RotateCcw, ArrowLeft } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Storefront error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-[#FAF8F5] text-center">
      <span className="text-[10px] uppercase tracking-[0.24em] font-semibold text-[#9E7B4F] block mb-2">
        Atelier Notice
      </span>
      <h2 className="font-serif-luxury text-2xl sm:text-3xl text-[#191C1A] max-w-md">
        Unable to load the collection right now.
      </h2>
      <p className="text-xs text-[#736E67] mt-2 max-w-sm font-light leading-relaxed">
        We encountered a momentary connection issue. Please retry or contact our concierge directly on WhatsApp.
      </p>

      <div className="mt-6 flex items-center space-x-3">
        <button
          onClick={() => reset()}
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#191C1A] text-white rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>

        <Link
          href="/"
          className="inline-flex items-center space-x-1.5 px-4 py-2 border border-[#D5CFCE] text-[#191C1A] rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#F2EFE9] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
      </div>
    </div>
  );
}

