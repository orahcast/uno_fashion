export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-[#FAF8F5]">
      <div className="relative flex items-center justify-center">
        {/* Subtle spinning luxury ring */}
        <div className="w-12 h-12 rounded-full border border-[#D5CFCE] border-t-[#9E7B4F] animate-spin" />
        <span className="absolute font-serif-luxury text-xs text-[#9E7B4F] font-semibold tracking-widest">
          UF
        </span>
      </div>
      <p className="mt-4 text-[11px] uppercase tracking-[0.22em] text-[#8C8278] font-medium animate-pulse">
        Atelier Curating...
      </p>
    </div>
  );
}

