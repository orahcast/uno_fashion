'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit, Trash2, CheckCircle2, X, Upload, Sparkles, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { convertHeicToJpeg } from '@/lib/heic-converter';

export interface ProtocolPhoto {
  id: string;
  title: string;
  caption: string;
  image: string;
}

const DEFAULT_PHOTOS: ProtocolPhoto[] = [
  {
    id: 'proto-photo-1',
    title: 'Wardrobe Alignment',
    caption: 'Synchronized tuxedos, cuts, and accessories for the bridal squad.',
    image: '/images/landing-page-1.jpeg',
  },
  {
    id: 'proto-photo-2',
    title: 'Entrance Etiquette',
    caption: 'Ceremonial walking cadence, aisle pacing, and stage presence.',
    image: '/images/landing-page-2.jpeg',
  },
  {
    id: 'proto-photo-3',
    title: 'Day-Of Suite Dressing',
    caption: 'On-site steaming, Windsor knotting, and boutonnière pinning.',
    image: '/images/hero-men.jpg',
  },
  {
    id: 'proto-photo-4',
    title: 'VIP & Gala Composure',
    caption: 'High-profile hosting protocol and stage reception etiquette.',
    image: '/images/landing-page-3.jpeg',
  },
];

export default function ProtocolServiceAdminPage() {
  const [photos, setPhotos] = useState<ProtocolPhoto[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('uno_protocol_photos');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        } catch (e) {
          console.error(e);
        }
      }
    }
    return [];
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCaption, setFormCaption] = useState('');
  const [formImage, setFormImage] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/protocol-photos')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data)) {
          setPhotos(data);
          if (typeof window !== 'undefined') {
            localStorage.setItem('uno_protocol_photos', JSON.stringify(data));
          }
        }
      })
      .catch((err) => console.error('Error fetching protocol photos:', err))
      .finally(() => setLoading(false));

    // Supabase Realtime: sync protocol photos live across tabs
    const supabase = createClient();
    const channel = supabase
      .channel('realtime:admin_protocol_photos')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_settings',
          filter: 'key=eq.protocol_photos',
        },
        (payload: any) => {
          if (payload.new && Array.isArray(payload.new.value)) {
            setPhotos(payload.new.value);
            if (typeof window !== 'undefined') {
              localStorage.setItem('uno_protocol_photos', JSON.stringify(payload.new.value));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const syncPhotos = async (updated: ProtocolPhoto[]) => {
    setPhotos(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('uno_protocol_photos', JSON.stringify(updated));
    }

    try {
      // Direct Supabase upsert from client for instant Realtime sync
      const supabase = createClient();
      supabase
        .from('site_settings')
        .upsert({
          key: 'protocol_photos',
          value: updated,
          updated_at: new Date().toISOString(),
        })
        .then(({ error }) => {
          if (error) console.error('Client Supabase photos save error:', error);
        });

      await fetch('/api/protocol-photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      showToast('Protocol photos updated on website!');
    } catch (err) {
      console.error('Error syncing protocol photos:', err);
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    targetId?: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploading(true);

    const isHeic =
      file.name.toLowerCase().endsWith('.heic') ||
      file.name.toLowerCase().endsWith('.heif') ||
      file.type === 'image/heic' ||
      file.type === 'image/heif';

    let fileToUpload = file;

    if (isHeic) {
      setUploadStatus('Converting iPhone HEIC to JPEG...');
      try {
        fileToUpload = await convertHeicToJpeg(file);
      } catch (convErr: any) {
        setUploadError(convErr.message || 'HEIC conversion failed. Please use a JPG or PNG.');
        setIsUploading(false);
        setUploadStatus(null);
        return;
      }
    }

    setUploadStatus('Uploading & optimizing image...');

    try {
      const formData = new FormData();
      formData.append('file', fileToUpload);
      formData.append('folder', 'protocol');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();

      if (res.ok && json.url) {
        if (targetId) {
          const updated = photos.map((p) =>
            p.id === targetId ? { ...p, image: json.url } : p
          );
          syncPhotos(updated);
        } else {
          setFormImage(json.url);
        }
        showToast('Photo uploaded successfully!');
        setIsUploading(false);
        setUploadStatus(null);
        return;
      } else {
        throw new Error(json.error || 'Server upload failed');
      }
    } catch (apiErr: any) {
      console.warn('Server upload error, attempting direct client storage upload:', apiErr);

      // Try direct client upload
      try {
        const supabase = createClient();
        const fileExt = fileToUpload.name.split('.').pop()?.toLowerCase() || 'jpg';
        const fileName = `protocol-${Date.now()}.${fileExt}`;
        const { data, error } = await supabase.storage
          .from('inventory-photos')
          .upload(fileName, fileToUpload, { upsert: true });

        if (!error && data) {
          const {
            data: { publicUrl },
          } = supabase.storage.from('inventory-photos').getPublicUrl(fileName);

          if (targetId) {
            const updated = photos.map((p) =>
              p.id === targetId ? { ...p, image: publicUrl } : p
            );
            syncPhotos(updated);
          } else {
            setFormImage(publicUrl);
          }
          showToast('Photo uploaded to Supabase Storage!');
          setIsUploading(false);
          setUploadStatus(null);
          return;
        }
      } catch (clientErr) {
        console.error('Direct client storage error:', clientErr);
      }

      // Fallback to data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          if (targetId) {
            const updated = photos.map((p) =>
              p.id === targetId ? { ...p, image: reader.result as string } : p
            );
            syncPhotos(updated);
          } else {
            setFormImage(reader.result as string);
          }
          showToast('Photo loaded (local preview)!');
        }
        setIsUploading(false);
        setUploadStatus(null);
      };
      reader.readAsDataURL(fileToUpload);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormTitle('');
    setFormCaption('');
    setFormImage('');
    setShowUrlInput(false);
    setUploadError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (p: ProtocolPhoto) => {
    setEditingId(p.id);
    setFormTitle(p.title);
    setFormCaption(p.caption);
    setFormImage(p.image);
    setShowUrlInput(false);
    setUploadError(null);
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formImage.trim() || isUploading) return;

    let updated: ProtocolPhoto[];
    if (editingId) {
      updated = photos.map((p) =>
        p.id === editingId
          ? { ...p, title: formTitle.trim(), caption: formCaption.trim(), image: formImage }
          : p
      );
    } else {
      const newPhoto: ProtocolPhoto = {
        id: `proto-photo-${Date.now()}`,
        title: formTitle.trim(),
        caption: formCaption.trim(),
        image: formImage,
      };
      updated = [...photos, newPhoto];
    }

    syncPhotos(updated);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Delete protocol photo "${title}"?`)) {
      const updated = photos.filter((p) => p.id !== id);
      syncPhotos(updated);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#14100E] text-white px-5 py-3 rounded-lg shadow-2xl border border-[#C4A47C] flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#C4A47C]" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.24em] font-semibold text-[#9E7B4F] block">
            Storefront Media CMS
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#191C1A] mt-1">
            Protocol Service Pictures
          </h1>
          <p className="text-xs text-[#6B726A] mt-1 max-w-2xl leading-relaxed">
            Ceremonial coordination, bridal party wardrobe alignment, and day-of suite dressing for weddings and distinguished events in Kigali.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-[#1A2421] hover:bg-black text-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 rounded-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Picture</span>
        </button>
      </div>

      {/* Photo Cards Grid */}
      {loading ? (
        <div className="bg-white border border-[#E8E4DC] rounded-xl p-12 text-center text-xs text-[#8C8075]">
          Loading protocol pictures...
        </div>
      ) : photos.length === 0 ? (
        <div className="bg-white border border-[#E8E4DC] rounded-xl p-12 text-center space-y-3">
          <Sparkles className="w-8 h-8 text-[#9E7B4F] mx-auto opacity-60" />
          <h3 className="font-serif-luxury text-lg text-[#191C1A]">No Protocol Pictures</h3>
          <p className="text-xs text-[#6B726A] max-w-sm mx-auto">
            All protocol service showcase photos have been cleared. Click &quot;Add Picture&quot; above to add new high-resolution imagery.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {photos.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#E8E4DC] rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Image Preview */}
              <div className="relative aspect-[3/4] w-full bg-[#14100E] overflow-hidden group">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover object-top group-hover:scale-102 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  unoptimized
                />

                {/* Quick Image Upload Button overlay */}
                <label
                  className="absolute bottom-2 right-2 bg-black/75 hover:bg-black text-white p-2 rounded-full cursor-pointer shadow-md backdrop-blur-xs transition-colors"
                  title="Upload a new photo for this card"
                >
                  <Upload className="w-4 h-4 text-[#C4A47C]" />
                  <input
                    type="file"
                    accept="image/*,.heic,.HEIC,.heif,.HEIF"
                    onChange={(e) => handleFileUpload(e, item.id)}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Content Details */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-serif-luxury text-lg font-semibold text-[#191C1A] leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#6B726A] mt-1 leading-relaxed">
                    {item.caption}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F0ECE3] flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => openEditModal(item)}
                    className="text-[#9E7B4F] hover:text-[#191C1A] font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Details</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.title)}
                    className="text-red-500 hover:text-red-700 font-medium cursor-pointer"
                    title="Remove picture"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Picture Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-[#E8E4DC] space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F0ECE3] pb-3">
              <h3 className="text-lg font-serif-luxury font-semibold text-[#191C1A]">
                {editingId ? 'Edit Protocol Picture' : 'Add New Protocol Picture'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-[#736E67] hover:text-[#191C1A] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#6B726A] mb-1 font-medium">Moment Title *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Wardrobe Alignment"
                  className="w-full border border-[#D5CFCE] p-2.5 rounded-sm text-[#191C1A] focus:outline-none focus:border-[#191C1A]"
                />
              </div>

              <div>
                <label className="block text-[#6B726A] mb-1 font-medium">Caption / Description *</label>
                <textarea
                  rows={2}
                  required
                  value={formCaption}
                  onChange={(e) => setFormCaption(e.target.value)}
                  placeholder="e.g. Synchronized tuxedos, cuts, and accessories for the bridal squad."
                  className="w-full border border-[#D5CFCE] p-2.5 rounded-sm text-[#191C1A] focus:outline-none focus:border-[#191C1A]"
                />
              </div>

              {/* Photo Upload Section */}
              <div className="space-y-2">
                <label className="block text-[#6B726A] font-medium">Photo *</label>

                {uploadError && (
                  <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-sm text-[11px]">
                    {uploadError}
                  </div>
                )}

                {isUploading ? (
                  <div className="p-8 bg-[#FAF8F5] border border-[#C4A47C]/40 rounded-xl flex flex-col items-center justify-center gap-2 text-[#9E7B4F]">
                    <svg className="animate-spin w-6 h-6 text-[#9E7B4F]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-xs font-medium">{uploadStatus || 'Processing image...'}</span>
                  </div>
                ) : formImage ? (
                  /* Image Preview Card */
                  <div className="space-y-2">
                    <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-[#14100E] border border-[#C4A47C]/40 shadow-xs">
                      <Image
                        src={formImage}
                        alt="Photo Preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute top-2 right-2 flex items-center gap-1.5">
                        <label className="bg-black/80 hover:bg-black text-white px-2.5 py-1 rounded-full text-[10px] font-medium cursor-pointer shadow-md flex items-center gap-1 backdrop-blur-xs transition-colors">
                          <Upload className="w-3 h-3 text-[#C4A47C]" />
                          <span>Change</span>
                          <input
                            type="file"
                            accept="image/*,.heic,.HEIC,.heif,.HEIF"
                            onChange={(e) => handleFileUpload(e)}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => setFormImage('')}
                          className="bg-black/80 hover:bg-red-700 text-white p-1 rounded-full text-[10px] cursor-pointer shadow-md backdrop-blur-xs transition-colors"
                          title="Remove photo"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#2D6A4F] flex items-center gap-1 font-medium">
                      <Check className="w-3 h-3" /> Photo selected and ready to publish
                    </span>
                  </div>
                ) : (
                  /* Prominent Upload Dropzone */
                  <div className="space-y-3">
                    <label className="border-2 border-dashed border-[#D4CCBE] hover:border-[#9E7B4F] rounded-xl p-6 flex flex-col items-center justify-center text-center bg-[#FAF8F5] hover:bg-[#F5EFE6] transition-colors cursor-pointer group">
                      <div className="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center mb-2 group-hover:scale-105 transition-transform border border-[#EAE5DC]">
                        <Upload className="w-5 h-5 text-[#9E7B4F]" />
                      </div>
                      <span className="font-semibold text-[#191C1A] text-xs">
                        Click to upload photo from your device
                      </span>
                      <span className="text-[10px] text-[#736E67] mt-0.5">
                        Supports JPG, PNG, WebP or iPhone HEIC photos
                      </span>
                      <input
                        type="file"
                        accept="image/*,.heic,.HEIC,.heif,.HEIF"
                        onChange={(e) => handleFileUpload(e)}
                        className="hidden"
                      />
                    </label>

                    {/* Direct URL Toggle */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setShowUrlInput(!showUrlInput)}
                        className="text-[10px] text-[#9E7B4F] hover:underline"
                      >
                        {showUrlInput ? 'Hide image URL input' : '+ Or paste a direct image URL'}
                      </button>
                      {showUrlInput && (
                        <input
                          type="text"
                          value={formImage}
                          onChange={(e) => setFormImage(e.target.value)}
                          placeholder="https://... or /images/..."
                          className="w-full mt-1.5 border border-[#D5CFCE] p-2 rounded-sm text-[#191C1A] focus:outline-none focus:border-[#191C1A]"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-[#F0ECE3]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#D5CFCE] rounded-sm text-[#6B726A] hover:bg-[#F2EFE9] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !formTitle.trim() || !formImage.trim()}
                  className="px-5 py-2 bg-[#1A2421] text-white rounded-sm font-semibold hover:bg-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isUploading && (
                    <svg className="animate-spin w-3.5 h-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  <span>{editingId ? 'Save Changes' : 'Save & Publish'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
