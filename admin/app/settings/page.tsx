'use client';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="font-serif-luxury text-4xl sm:text-5xl font-normal text-[#191C1A]">
          Atelier Settings
        </h1>
        <p className="text-xs text-[#6B726A] mt-1">Configure boutique parameters, currency, and Supabase integration.</p>
      </div>

      <div className="bg-white border border-[#E8E4DC] p-6 rounded-sm shadow-sm space-y-6 text-xs">
        <div>
          <h3 className="font-serif-luxury text-xl text-[#191C1A]">Showroom Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
            <div>
              <label className="block text-[#6B726A] mb-1">Showroom Name</label>
              <input type="text" defaultValue="Maison Élan Kigali" className="w-full border border-[#D5CFCE] p-2.5" />
            </div>
            <div>
              <label className="block text-[#6B726A] mb-1">Currency Code</label>
              <input type="text" defaultValue="RWF (Frw)" disabled className="w-full bg-[#FAF8F5] border border-[#D5CFCE] p-2.5 text-[#6B726A]" />
            </div>
          </div>
        </div>

        <div className="border-t border-[#E8E4DC] pt-4">
          <h3 className="font-serif-luxury text-xl text-[#191C1A]">Supabase Backend Sync</h3>
          <p className="text-[11px] text-[#6B726A] mt-1">
            Connected to <code>NEXT_PUBLIC_SUPABASE_URL</code> and storage bucket <code>inventory-photos</code>.
          </p>
          <div className="mt-3 flex items-center space-x-2 text-[#2D5A38]">
            <span className="w-2 h-2 rounded-full bg-[#2D5A38]" />
            <span className="font-medium">Hybrid Live/Mock Mode Active</span>
          </div>
        </div>

        <div className="border-t border-[#E8E4DC] pt-4">
          <button
            type="button"
            onClick={() => alert('Settings saved successfully.')}
            className="bg-[#1A2421] text-white px-6 py-2.5 uppercase tracking-wider font-semibold"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

