export default function AdminLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center">
      <div className="relative flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border border-[#D5CFCE] border-t-[#C4A47C] animate-spin" />
      </div>
      <p className="mt-3 text-[11px] uppercase tracking-widest text-[#8C8278] font-medium animate-pulse">
        Loading Atelier Data...
      </p>
    </div>
  );
}

