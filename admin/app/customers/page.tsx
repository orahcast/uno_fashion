'use client';

import { Users, Mail, Phone, Calendar, ArrowRight } from 'lucide-react';

export default function CustomersPage() {
  const clients = [
    { name: 'Amelia Bennett', email: 'amelia.bennett@email.com', phone: '+250 78 000 0001', bookings: 3, spent: '780,000 Frw', lastActive: '3 Nov 2026' },
    { name: 'Sofia Williams', email: 'sofia.williams@email.com', phone: '+250 78 000 0002', bookings: 2, spent: '570,000 Frw', lastActive: '2 Nov 2026' },
    { name: 'James Clarke', email: 'james.clarke@email.com', phone: '+250 78 000 0003', bookings: 4, spent: '620,000 Frw', lastActive: '1 Nov 2026' },
    { name: 'Noah Thompson', email: 'noah.thompson@email.com', phone: '+250 78 000 0004', bookings: 1, spent: '335,000 Frw', lastActive: '4 Nov 2026' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="font-serif-luxury text-4xl sm:text-5xl font-normal text-[#191C1A]">
          Client Directory
        </h1>
        <p className="text-xs text-[#6B726A] mt-1">Atelier clients and VIP rental history.</p>
      </div>

      <div className="bg-white border border-[#E8E4DC] shadow-sm rounded-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF8F5] text-[#848B82] uppercase tracking-wider text-[10px] border-b border-[#E8E4DC]">
            <tr>
              <th className="py-3 px-5 font-semibold">Client Name</th>
              <th className="py-3 px-5 font-semibold">Contact</th>
              <th className="py-3 px-5 font-semibold">Total Bookings</th>
              <th className="py-3 px-5 font-semibold">Total Spent</th>
              <th className="py-3 px-5 font-semibold">Last Active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0EDE6]">
            {clients.map((c, idx) => (
              <tr key={idx} className="hover:bg-[#FAF8F5]/80 transition-colors">
                <td className="py-4 px-5 font-semibold text-[#191C1A]">{c.name}</td>
                <td className="py-4 px-5 text-[#555A52]">
                  <div>{c.email}</div>
                  <div className="text-[11px] text-[#6B726A]">{c.phone}</div>
                </td>
                <td className="py-4 px-5 text-[#191C1A]">{c.bookings} rentals</td>
                <td className="py-4 px-5 font-semibold text-[#191C1A]">{c.spent}</td>
                <td className="py-4 px-5 text-[#6B726A]">{c.lastActive}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

