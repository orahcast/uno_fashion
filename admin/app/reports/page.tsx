'use client';

import { BarChart3, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { formatRWF } from '@/lib/utils';

export default function ReportsPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="font-serif-luxury text-4xl sm:text-5xl font-normal text-[#191C1A]">
          Performance & Analytics
        </h1>
        <p className="text-xs text-[#6B726A] mt-1">Revenue, turnaround time, and rental utilization in Kigali.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-[#E8E4DC] p-6 shadow-sm rounded-sm">
          <span className="text-xs text-[#6B726A]">Average Rental Value</span>
          <div className="font-serif-luxury text-3xl text-[#191C1A] mt-2">183,043 Frw</div>
          <span className="text-[11px] text-[#2D5A38] mt-1 block">+12% vs last month</span>
        </div>

        <div className="bg-white border border-[#E8E4DC] p-6 shadow-sm rounded-sm">
          <span className="text-xs text-[#6B726A]">Average Turnaround / Cleaning</span>
          <div className="font-serif-luxury text-3xl text-[#191C1A] mt-2">1.2 Days</div>
          <span className="text-[11px] text-[#2D5A38] mt-1 block">99.4% on-schedule return</span>
        </div>

        <div className="bg-white border border-[#E8E4DC] p-6 shadow-sm rounded-sm">
          <span className="text-xs text-[#6B726A]">Highest Utilization Piece</span>
          <div className="font-serif-luxury text-3xl text-[#191C1A] mt-2">The Windsor Tuxedo</div>
          <span className="text-[11px] text-[#6B726A] mt-1 block">88% booked through Dec</span>
        </div>
      </div>
    </div>
  );
}

