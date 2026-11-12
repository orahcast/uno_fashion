'use client';

import { useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

export default function AdminErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-white border border-[#E8E4DC] rounded-sm m-4">
      <span className="text-[10px] uppercase tracking-[0.22em] font-semibold text-[#9E7B4F] block mb-2">
        Atelier Dashboard
      </span>
      <h2 className="font-serif-luxury text-2xl text-[#191C1A]">
        Something went wrong loading this view.
      </h2>
      <p className="text-xs text-[#736E67] mt-1.5 max-w-sm">
        {error.message || 'An unexpected error occurred while fetching data.'}
      </p>

      <button
        onClick={() => reset()}
        className="mt-5 inline-flex items-center space-x-1.5 px-4 py-2 bg-[#1A2421] text-white text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-black transition-colors cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reload View</span>
      </button>
    </div>
  );
}

