'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('owner@maisonelan.rw');
  const [password, setPassword] = useState('••••••••');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push('/');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-[#E8E4DC] p-8 shadow-xl rounded-sm space-y-6">
        <div className="text-center space-y-1">
          <span className="font-serif-luxury text-3xl tracking-[0.16em] block text-[#191C1A]">
            MAISON ÉLAN
          </span>
          <span className="text-[10px] uppercase tracking-[0.22em] text-[#9E7B4F] font-semibold block">
            ATELIER MANAGER ACCESS
          </span>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#6B726A] mb-1 font-medium">Boutique Owner Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#D5CFCE] p-3 text-[#191C1A] focus:outline-none focus:border-[#191C1A]"
            />
          </div>

          <div>
            <label className="block text-[#6B726A] mb-1 font-medium">Master Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#D5CFCE] p-3 text-[#191C1A] focus:outline-none focus:border-[#191C1A]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1A2421] text-white py-3.5 uppercase tracking-widest font-semibold flex items-center justify-center space-x-2 hover:bg-black transition-colors"
          >
            <span>{loading ? 'Entering Atelier...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <Link href="/" className="text-xs text-[#9E7B4F] hover:underline">
            ← Return to storefront
          </Link>
        </div>
      </div>
    </div>
  );
}

