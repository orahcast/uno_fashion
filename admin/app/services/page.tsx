'use client';

import { Sparkles, Plus, Edit } from 'lucide-react';

export default function ServicesManagementPage() {
  const services = [
    { name: "Couple's package", includes: 'Dress + suit · Styling · 2 fittings', price: 'from 460,000 Frw', status: 'Active' },
    { name: 'Party package', includes: '4 suits · Group fitting · Accessories', price: 'from 580,000 Frw', status: 'Active' },
    { name: 'Styling add-on', includes: 'Accessories · Veil · Final styling', price: 'from 75,000 Frw', status: 'Active' },
    { name: 'Bespoke Atelier Consultation', includes: '60 minutes personalized fitting with head tailor', price: 'Free with rental', status: 'Active' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-normal text-[#191C1A]">
            Services & Packages
          </h1>
          <p className="text-xs text-[#6B726A] mt-1">Wedding packages and styling add-ons.</p>
        </div>
        <button
          onClick={() => alert('New wedding package modal')}
          className="bg-[#1A2421] text-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add package</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((svc, idx) => (
          <div key={idx} className="bg-white border border-[#E8E4DC] p-6 rounded-sm shadow-sm space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-serif-luxury text-2xl text-[#191C1A]">{svc.name}</h3>
                <p className="text-xs text-[#6B726A] mt-1">{svc.includes}</p>
              </div>
              <span className="text-xs font-semibold text-[#2D5A38] bg-[#EAF3EC] px-2 py-0.5 rounded-xs">
                {svc.status}
              </span>
            </div>
            <div className="pt-4 border-t border-[#E8E4DC] flex items-center justify-between text-xs">
              <span className="font-semibold text-[#191C1A]">{svc.price}</span>
              <button className="text-[#9E7B4F] hover:underline font-medium">Edit pricing</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

