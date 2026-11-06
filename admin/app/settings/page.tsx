'use client';

import Link from 'next/link';
import { Sparkles, ChevronRight, Award, ShieldCheck } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#2A1810]">
          Atelier Settings
        </h1>
        <p className="text-xs text-[#8C7B6E] mt-1">
          Configure boutique parameters, storefront presentation, and live catalog media.
        </p>
      </div>

      {/* Featured: Landing Hero Banner Manager */}
      <div className="bg-[#FAF4EB] border border-[#ECDCCB] rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F2E5D4] text-[#9E7B4F] flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#9E7B4F] uppercase tracking-wider block">
              Storefront Customization
            </span>
            <h2 className="text-lg font-bold text-[#2A1810] mt-0.5">
              Landing Page Hero Manager
            </h2>
            <p className="text-xs text-[#8C7B6E] mt-1 max-w-md">
              Change the main hero photoshoot image on the Uno Fashion landing page, choose from curated shoots, or upload a new photo from your device.
            </p>
          </div>
        </div>

        <Link
          href="/hero"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#4A2311] hover:bg-[#34180A] rounded-full transition-all shadow-sm active:scale-95 shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <span>Manage Hero Image</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="bg-white border border-[#EFEAE4] p-6 rounded-3xl shadow-xs space-y-6 text-xs">
        <div>
          <h3 className="font-serif-luxury text-xl font-bold text-[#2A1810]">Boutique Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
            <div>
              <label className="block text-[#8C7B6E] mb-1 font-semibold uppercase text-[10px]">Showroom Name</label>
              <input
                type="text"
                defaultValue="Uno Fashion Agency Ltd"
                className="w-full bg-[#FAF8F5] border border-[#D5CFCE] rounded-xl p-2.5 text-[#2A1810]"
              />
            </div>
            <div>
              <label className="block text-[#8C7B6E] mb-1 font-semibold uppercase text-[10px]">Currency Code</label>
              <input
                type="text"
                defaultValue="RWF (Frw)"
                disabled
                className="w-full bg-[#FAF8F5] border border-[#D5CFCE] rounded-xl p-2.5 text-[#8C7B6E]"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-[#F2ECE4] pt-4">
          <h3 className="font-serif-luxury text-xl font-bold text-[#2A1810]">Boutique Location &amp; Contact</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
            <div>
              <label className="block text-[#8C7B6E] mb-1 font-semibold uppercase text-[10px]">Phone / WhatsApp</label>
              <input
                type="text"
                defaultValue="+250 783 036 628"
                className="w-full bg-[#FAF8F5] border border-[#D5CFCE] rounded-xl p-2.5 text-[#2A1810]"
              />
            </div>
            <div>
              <label className="block text-[#8C7B6E] mb-1 font-semibold uppercase text-[10px]">City / Country</label>
              <input
                type="text"
                defaultValue="Kigali, Rwanda"
                disabled
                className="w-full bg-[#FAF8F5] border border-[#D5CFCE] rounded-xl p-2.5 text-[#8C7B6E]"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-[#F2ECE4] pt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#2D6A4F] text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-semibold">Local &amp; API Dual-Sync Enabled</span>
          </div>
          <button
            type="button"
            onClick={() => alert('Settings saved successfully.')}
            className="bg-[#4A2311] hover:bg-[#34180A] text-white px-6 py-2.5 rounded-full uppercase tracking-wider font-semibold text-[11px] transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

