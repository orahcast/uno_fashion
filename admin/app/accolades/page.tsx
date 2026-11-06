'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Award,
  Star,
  CheckCircle2,
  Sparkles,
  Plus,
  Trash2,
  ExternalLink,
  Save,
  RotateCcw,
  MoveUp,
  MoveDown,
  X,
  Upload,
} from 'lucide-react';
import { AccoladeItem } from '@/lib/types';
import { INITIAL_ACCOLADES } from '@/lib/data/mock-catalog';

export default function AccoladesAdminPage() {
  const [accolades, setAccolades] = useState<AccoladeItem[]>(INITIAL_ACCOLADES);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<'Celebrity' | 'Certification' | 'Award' | 'Press'>('Celebrity');
  const [formYear, setFormYear] = useState('2026');
  const [formImage, setFormImage] = useState('');
  const [formFeaturedPerson, setFormFeaturedPerson] = useState('');
  const [formBadge, setFormBadge] = useState('');

  // Fetch accolades from API
  useEffect(() => {
    fetch('/api/accolades')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAccolades(data);
        }
      })
      .catch((err) => {
        console.error('Failed to load accolades from API:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormTitle('');
    setFormCategory('Celebrity');
    setFormYear('2026');
    setFormImage('https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800');
    setFormFeaturedPerson('');
    setFormBadge('Celebrity Red Carpet');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AccoladeItem) => {
    setEditingId(item.id);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormYear(item.year);
    setFormImage(item.image);
    setFormFeaturedPerson(item.featuredPerson || '');
    setFormBadge(item.badge || '');
    setIsModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formImage.trim()) {
      alert('Please provide a title and an image URL.');
      return;
    }

    let updatedList: AccoladeItem[];

    if (editingId) {
      // Editing existing
      updatedList = accolades.map((acc) =>
        acc.id === editingId
          ? {
              ...acc,
              title: formTitle.trim(),
              category: formCategory,
              year: formYear.trim() || '2026',
              image: formImage.trim(),
              featuredPerson: formFeaturedPerson.trim() || undefined,
              badge: formBadge.trim() || undefined,
            }
          : acc
      );
    } else {
      // Adding new
      const newItem: AccoladeItem = {
        id: `acc-${Date.now()}`,
        title: formTitle.trim(),
        category: formCategory,
        year: formYear.trim() || '2026',
        image: formImage.trim(),
        featuredPerson: formFeaturedPerson.trim() || undefined,
        badge: formBadge.trim() || undefined,
      };
      updatedList = [newItem, ...accolades];
    }

    setAccolades(updatedList);
    setIsModalOpen(false);
    await syncToServer(updatedList, editingId ? 'Accolade updated successfully!' : 'New distinction added!');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this item from the sliding marquee?')) return;
    const updated = accolades.filter((a) => a.id !== id);
    setAccolades(updated);
    await syncToServer(updated, 'Item removed from storefront marquee.');
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= accolades.length) return;

    const copy = [...accolades];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    setAccolades(copy);
    await syncToServer(copy, 'Marquee display order updated.');
  };

  const handleResetDefaults = async () => {
    if (!confirm('Reset all items back to the default curated accolades?')) return;
    setAccolades(INITIAL_ACCOLADES);
    await syncToServer(INITIAL_ACCOLADES, 'Reset to curated defaults.');
  };

  const syncToServer = async (items: AccoladeItem[], successMsg: string) => {
    setSaving(true);
    try {
      // Save to local storage for instant browser persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('uno_accolades', JSON.stringify(items));
      }

      // Save via API
      const res = await fetch('/api/accolades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items),
      });

      if (res.ok) {
        showToast(successMsg);
      } else {
        showToast('Saved locally (API could not be reached).');
      }
    } catch (err) {
      console.error(err);
      showToast('Saved locally.');
    } finally {
      setSaving(false);
    }
  };

  // Image upload helper (reads local file as data url)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const celebrityCount = accolades.filter((a) => a.category === 'Celebrity').length;
  const certificationCount = accolades.filter((a) => a.category === 'Certification').length;
  const awardsCount = accolades.filter((a) => a.category === 'Award' || a.category === 'Press').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#14100E] text-white px-5 py-3 rounded-lg shadow-2xl border border-[#C4A47C] flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#C4A47C]" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E4DC]">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EAE4D9] text-[#7A5B30]">
              <Award className="w-3.5 h-3.5" />
              Storefront Hall of Distinction
            </span>
            {saving && (
              <span className="text-xs text-[#8C8075] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#C4A47C] animate-pulse" />
                Syncing changes...
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-medium text-[#191C1A] mt-2">
            Celebrity Looks & Certifications
          </h1>
          <p className="text-xs sm:text-sm text-[#6B726A] mt-1 max-w-2xl">
            Manage the continuous sliding marquee on the website landing page. Add red carpet celebrity photos, VIP gala fittings, master bespoke certifications, and industry accolades.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium border border-[#D4CCBE] text-[#4A443E] hover:bg-[#F2ECE1] rounded-sm transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Marquee on Site</span>
          </a>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-[#14100E] text-white hover:bg-[#26201C] rounded-sm transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 text-[#C4A47C]" />
            <span>Add Distinction</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-lg border border-[#E8E4DC] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#6B726A]">
            <span>Total on Marquee</span>
            <Award className="w-4 h-4 text-[#C4A47C]" />
          </div>
          <div className="text-2xl font-serif-luxury font-bold text-[#191C1A] mt-1">
            {accolades.length}
          </div>
          <span className="text-[11px] text-[#8C8075]">Looping continuously</span>
        </div>

        <div className="p-4 bg-white rounded-lg border border-[#E8E4DC] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#6B726A]">
            <span>Celebrity Stylings</span>
            <Star className="w-4 h-4 text-[#C4A47C] fill-current" />
          </div>
          <div className="text-2xl font-serif-luxury font-bold text-[#191C1A] mt-1">
            {celebrityCount}
          </div>
          <span className="text-[11px] text-[#8C8075]">Red carpet & VIP fittings</span>
        </div>

        <div className="p-4 bg-white rounded-lg border border-[#E8E4DC] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#6B726A]">
            <span>Certifications</span>
            <CheckCircle2 className="w-4 h-4 text-[#2D5A38]" />
          </div>
          <div className="text-2xl font-serif-luxury font-bold text-[#191C1A] mt-1">
            {certificationCount}
          </div>
          <span className="text-[11px] text-[#8C8075]">Master tailor credentials</span>
        </div>

        <div className="p-4 bg-white rounded-lg border border-[#E8E4DC] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#6B726A]">
            <span>Awards & Press</span>
            <Sparkles className="w-4 h-4 text-[#C4A47C]" />
          </div>
          <div className="text-2xl font-serif-luxury font-bold text-[#191C1A] mt-1">
            {awardsCount}
          </div>
          <span className="text-[11px] text-[#8C8075]">National & regional honors</span>
        </div>
      </div>

      {/* Main Accolades Manager List */}
      <div className="bg-white rounded-xl border border-[#E8E4DC] overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[#E8E4DC] flex items-center justify-between">
          <div>
            <h2 className="text-base font-serif-luxury font-semibold text-[#191C1A]">
              Current Marquee Items ({accolades.length})
            </h2>
            <p className="text-xs text-[#6B726A] mt-0.5">
              The order below corresponds to the sliding sequence seen by visitors on the landing page.
            </p>
          </div>

          <button
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#8C8075] hover:text-[#191C1A] border border-[#E8E4DC] rounded-sm hover:bg-[#FAF8F5]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-[#8C8075]">Loading accolades...</div>
        ) : accolades.length === 0 ? (
          <div className="p-12 text-center">
            <Award className="w-10 h-10 text-[#C4A47C] mx-auto mb-3 opacity-60" />
            <p className="text-sm font-medium text-[#191C1A]">No accolades or celebrity moments added yet.</p>
            <p className="text-xs text-[#8C8075] mt-1">Click &ldquo;Add Distinction&rdquo; above to display your first moment.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#E8E4DC]">
            {accolades.map((item, index) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF8F5]/80 transition-colors group"
              >
                {/* Left Item Details */}
                <div className="flex items-center gap-4">
                  {/* Photo thumbnail */}
                  <div className="relative w-16 h-20 rounded-lg overflow-hidden border border-[#D4CCBE] bg-[#14100E] shrink-0 shadow-xs">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>

                  {/* Title & Metadata */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide bg-[#FAF8F5] text-[#7A5B30] border border-[#E8E4DC]">
                        {item.category}
                      </span>
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide bg-[#14100E] text-[#D5B895]">
                          {item.badge}
                        </span>
                      )}
                      <span className="text-xs font-mono text-[#8C8075]">{item.year}</span>
                    </div>

                    <h3 className="text-sm font-medium text-[#191C1A]">{item.title}</h3>

                    {item.featuredPerson && (
                      <p className="text-xs text-[#6B726A]">
                        Featured: <span className="text-[#191C1A] font-medium">{item.featuredPerson}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  {/* Reorder Buttons */}
                  <div className="flex items-center border border-[#E8E4DC] rounded-sm overflow-hidden bg-white">
                    <button
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0}
                      title="Move earlier in marquee sequence"
                      className="p-1.5 hover:bg-[#FAF8F5] disabled:opacity-30 disabled:hover:bg-white text-[#6B726A]"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-[1px] h-4 bg-[#E8E4DC]" />
                    <button
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === accolades.length - 1}
                      title="Move later in marquee sequence"
                      className="p-1.5 hover:bg-[#FAF8F5] disabled:opacity-30 disabled:hover:bg-white text-[#6B726A]"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Edit button */}
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="px-3 py-1.5 text-xs font-medium text-[#4A443E] hover:text-[#191C1A] border border-[#D4CCBE] hover:bg-[#FAF8F5] rounded-sm transition-colors"
                  >
                    Edit
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(item.id)}
                    title="Remove from marquee"
                    className="p-1.5 text-[#A33B2E] hover:bg-[#FDF0EE] border border-[#F5C2BA] rounded-sm transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Distinction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#E8E4DC] flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#E8E4DC] flex items-center justify-between bg-[#FAF8F5]">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#C4A47C]" />
                <h3 className="font-serif-luxury text-lg font-medium text-[#191C1A]">
                  {editingId ? 'Edit Distinction' : 'Add New Distinction'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#8C8075] hover:text-[#191C1A] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveItem} className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-[#191C1A] uppercase tracking-wider mb-1.5">
                  Distinction Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Celebrity', 'Certification', 'Award', 'Press'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setFormCategory(cat);
                        if (!formBadge || formBadge === 'Celebrity Red Carpet' || formBadge === 'Certified Master Tailor' || formBadge === 'Official Recognition' || formBadge === 'Accreditation') {
                          if (cat === 'Celebrity') setFormBadge('Celebrity Red Carpet');
                          if (cat === 'Certification') setFormBadge('Certified Master Tailor');
                          if (cat === 'Award') setFormBadge('Official Recognition');
                          if (cat === 'Press') setFormBadge('Accreditation');
                        }
                      }}
                      className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                        formCategory === cat
                          ? 'border-[#C4A47C] bg-[#FAF8F5] text-[#14100E] font-semibold ring-1 ring-[#C4A47C]'
                          : 'border-[#E8E4DC] text-[#6B726A] hover:bg-[#FAF8F5]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-[#191C1A] uppercase tracking-wider mb-1">
                  Title / Event Name *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Kigali Fashion Week Gala or Bespoke Master Certificate"
                  className="w-full text-xs px-3 py-2.5 rounded-lg border border-[#D4CCBE] focus:outline-hidden focus:border-[#C4A47C] focus:ring-1 focus:ring-[#C4A47C]"
                />
              </div>

              {/* Featured Person / Honor & Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#191C1A] uppercase tracking-wider mb-1">
                    Featured VIP / Org
                  </label>
                  <input
                    type="text"
                    value={formFeaturedPerson}
                    onChange={(e) => setFormFeaturedPerson(e.target.value)}
                    placeholder="e.g. VIP Red Carpet Gala"
                    className="w-full text-xs px-3 py-2.5 rounded-lg border border-[#D4CCBE] focus:outline-hidden focus:border-[#C4A47C] focus:ring-1 focus:ring-[#C4A47C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#191C1A] uppercase tracking-wider mb-1">
                    Year
                  </label>
                  <input
                    type="text"
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value)}
                    placeholder="e.g. 2026"
                    className="w-full text-xs px-3 py-2.5 rounded-lg border border-[#D4CCBE] focus:outline-hidden focus:border-[#C4A47C] focus:ring-1 focus:ring-[#C4A47C]"
                  />
                </div>
              </div>

              {/* Badge Text */}
              <div>
                <label className="block text-xs font-semibold text-[#191C1A] uppercase tracking-wider mb-1">
                  Card Pill Badge
                </label>
                <input
                  type="text"
                  value={formBadge}
                  onChange={(e) => setFormBadge(e.target.value)}
                  placeholder="e.g. Celebrity Red Carpet, Master Tailor"
                  className="w-full text-xs px-3 py-2.5 rounded-lg border border-[#D4CCBE] focus:outline-hidden focus:border-[#C4A47C] focus:ring-1 focus:ring-[#C4A47C]"
                />
              </div>

              {/* Image URL or Local Upload */}
              <div>
                <label className="block text-xs font-semibold text-[#191C1A] uppercase tracking-wider mb-1">
                  Photo URL or Upload *
                </label>
                <input
                  type="url"
                  required
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="https://... or upload below"
                  className="w-full text-xs px-3 py-2.5 rounded-lg border border-[#D4CCBE] focus:outline-hidden focus:border-[#C4A47C] focus:ring-1 focus:ring-[#C4A47C] mb-2"
                />

                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#4A443E] bg-[#FAF8F5] border border-[#D4CCBE] rounded-md hover:bg-[#F2ECE1] transition-colors">
                    <Upload className="w-3.5 h-3.5 text-[#C4A47C]" />
                    <span>Upload photo from device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>

                  {formImage && (
                    <span className="text-[11px] text-[#2D5A38] font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Image loaded
                    </span>
                  )}
                </div>
              </div>

              {/* Live Preview of the Marquee Card (1:1 with Storefront) */}
              <div className="pt-2 text-center">
                <span className="block text-[11px] font-semibold text-[#8C8075] uppercase tracking-wider mb-2 text-left">
                  Live Marquee Card Preview (Storefront Scale)
                </span>
                <div className="relative w-48 sm:w-52 h-[260px] sm:h-[285px] mx-auto rounded-xl overflow-hidden border border-[#E8E4DC] bg-[#14100E] shadow-sm text-left">
                  {formImage ? (
                    <Image
                      src={formImage}
                      alt="Preview"
                      fill
                      sizes="220px"
                      className="object-cover brightness-90"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-white/50">
                      No image selected
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-black/65 text-[#D5B895] border border-[#C4A47C]/40">
                      {formBadge || formCategory}
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5 z-10">
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-mono bg-white/20 text-white">
                      {formYear || '2026'}
                    </span>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-3 text-white z-10">
                    {formFeaturedPerson && (
                      <p className="text-[10px] uppercase tracking-wider text-[#C4A47C] font-semibold mb-0.5 line-clamp-1">
                        {formFeaturedPerson}
                      </p>
                    )}
                    <p className="text-xs sm:text-[13px] font-medium leading-snug line-clamp-2">
                      {formTitle || 'Title will appear here'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-[#E8E4DC] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#6B726A] hover:text-[#191C1A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold bg-[#14100E] text-white hover:bg-[#26201C] rounded-lg transition-colors shadow-sm"
                >
                  <Save className="w-3.5 h-3.5 text-[#C4A47C]" />
                  <span>{editingId ? 'Save Changes' : 'Add to Marquee'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

