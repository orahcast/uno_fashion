'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Upload,
  CheckCircle2,
  ExternalLink,
  Save,
  RotateCcw,
  Check,
  ChevronRight,
  Eye,
  Trash2,
  Zap,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { convertHeicToJpeg } from '@/lib/heic-converter';

export interface PhotoshootItem {
  id: string;
  name: string;
  tag?: string;
  src: string;
  isDefault?: boolean;
}

interface HeroConfig {
  image: string;
  alt: string;
  headlinePrefix: string;
  headlineHighlight: string;
  subtitle: string;
  gallery?: PhotoshootItem[];
  updatedAt?: string;
}

// Curated Photoshoot Presets from Atelier shoots (Clean slate for user uploads)
const DEFAULT_PHOTOSHOOTS: PhotoshootItem[] = [];

const DEFAULT_CONFIG: HeroConfig = {
  image: '/images/hero-men.jpg',
  alt: 'Uno Fashion Agency - Tailoring & Wedding Protocol in Kigali',
  headlinePrefix: 'TAILORING — WITH',
  headlineHighlight: 'QUIET AUTHORITY',
  subtitle:
    'Uno Fashion Agency Ltd provides bespoke suit rentals, tuxedos, and wedding protocol services to ensure you make an indelible impression across Kigali.',
  gallery: [],
};

export default function HeroLandingManagerPage() {
  const [config, setConfig] = useState<HeroConfig>(DEFAULT_CONFIG);
  const [gallery, setGallery] = useState<PhotoshootItem[]>(DEFAULT_PHOTOSHOOTS);
  const [selectedImage, setSelectedImage] = useState<string>(DEFAULT_CONFIG.image);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [headlinePrefix, setHeadlinePrefix] = useState(DEFAULT_CONFIG.headlinePrefix);
  const [headlineHighlight, setHeadlineHighlight] = useState(DEFAULT_CONFIG.headlineHighlight);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const mergeGallery = (loadedList?: PhotoshootItem[]): PhotoshootItem[] => {
    if (!Array.isArray(loadedList) || loadedList.length === 0) return [];
    // Filter out previous sample images so Option 2 is strictly the user's uploaded shoots
    const sampleUrls = new Set([
      '/images/hero-men.jpg',
      '/images/landing-page-1.jpeg',
      '/images/landing-page-2.jpeg',
      '/images/landing-page-3.jpeg',
      '/images/landing-ref.jpg',
    ]);
    return loadedList.filter((item) => item && item.src && !sampleUrls.has(item.src));
  };

  // Load active config on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('uno_hero_config');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed?.image) {
            setConfig(parsed);
            setSelectedImage(parsed.image);
            if (parsed.headlinePrefix) setHeadlinePrefix(parsed.headlinePrefix);
            if (parsed.headlineHighlight) setHeadlineHighlight(parsed.headlineHighlight);
            if (Array.isArray(parsed.gallery)) {
              setGallery(mergeGallery(parsed.gallery));
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
    }

    fetch('/api/hero')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.image) {
          setConfig(data);
          setSelectedImage(data.image);
          if (data.headlinePrefix) setHeadlinePrefix(data.headlinePrefix);
          if (data.headlineHighlight) setHeadlineHighlight(data.headlineHighlight);
          if (Array.isArray(data.gallery)) {
            setGallery(mergeGallery(data.gallery));
          }
        }
      })
      .catch((err) => console.error('API load error:', err));
  }, []);

  // Helper to add photo to persistent gallery
  const addPhotoToGallery = (url: string, rawFileName?: string) => {
    const baseName = rawFileName
      ? rawFileName.replace(/\.[^/.]+$/, '').slice(0, 20)
      : `Studio Shoot ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`;

    const newShoot: PhotoshootItem = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: baseName,
      tag: 'Studio Upload',
      src: url,
      isDefault: false,
    };

    setGallery((prev) => {
      const filtered = prev.filter((item) => item.src !== url);
      return [newShoot, ...filtered];
    });
    setSelectedImage(url);
  };

  // Upload image from phone or laptop
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isHeic =
        file.name.toLowerCase().endsWith('.heic') ||
        file.name.toLowerCase().endsWith('.heif') ||
        file.type === 'image/heic' ||
        file.type === 'image/heif';

      let fileToUpload = file;
      if (isHeic) {
        showToast('Converting iPhone HEIC to JPEG...');
        try {
          fileToUpload = await convertHeicToJpeg(file);
        } catch (convErr: any) {
          showToast(convErr.message || 'HEIC conversion failed. Please use a JPG or PNG.');
          return;
        }
      } else {
        showToast('Uploading hero photo...');
      }

      try {
        const formData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('folder', 'hero');

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const json = await res.json();
        if (res.ok && json.url) {
          addPhotoToGallery(json.url, fileToUpload.name);
          showToast(
            isHeic
              ? 'HEIC converted & added to Atelier Shoots! Click "Save & Publish" to update website.'
              : 'Photo uploaded & added to Atelier Shoots! Click "Save & Publish" to update website.'
          );
          return;
        } else {
          throw new Error(json.error || 'Server upload failed');
        }
      } catch (apiErr: any) {
        console.warn('Server upload error, attempting direct client storage upload:', apiErr);

        try {
          const supabase = createClient();
          const fileExt = fileToUpload.name.split('.').pop()?.toLowerCase() || 'jpg';
          const fileName = `hero-${Date.now()}.${fileExt}`;
          const { data, error } = await supabase.storage
            .from('inventory-photos')
            .upload(fileName, fileToUpload, { upsert: true });

          if (!error && data) {
            const {
              data: { publicUrl },
            } = supabase.storage.from('inventory-photos').getPublicUrl(fileName);
            addPhotoToGallery(publicUrl, fileToUpload.name);
            showToast('Photo uploaded & added to Atelier Shoots! Click "Save & Publish" to update website.');
            return;
          }
        } catch (clientErr) {
          console.warn('Storage upload fallback:', clientErr);
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            addPhotoToGallery(reader.result, fileToUpload.name);
            showToast('Photo added to Atelier Shoots! Click "Save & Publish" to update website.');
          }
        };
        reader.readAsDataURL(fileToUpload);
      }
    }
  };

  // Delete a custom uploaded shoot
  const handleDeleteCustomShoot = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setGallery((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      return updated;
    });
    showToast('Removed shoot from atelier gallery.');
  };

  // Publish in Real-Time to Storefront
  const publishNow = async (imageToPublish: string) => {
    setIsSaving(true);
    const updated: HeroConfig = {
      ...config,
      image: imageToPublish,
      headlinePrefix: headlinePrefix.trim(),
      headlineHighlight: headlineHighlight.trim(),
      gallery,
      updatedAt: new Date().toISOString(),
    };

    // 1. Instant local storage persistence
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('uno_hero_config', JSON.stringify(updated));
      } catch (e) {}
    }

    // 2. Instant 0ms cross-tab broadcast to website storefront
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const bc = new BroadcastChannel('uno_hero_sync');
        bc.postMessage(updated);
        bc.close();
      } catch (bcErr) {
        console.warn('BroadcastChannel error:', bcErr);
      }
    }

    // 3. Update active React state immediately
    setConfig(updated);
    setSelectedImage(imageToPublish);

    // 4. Persist to API & Supabase database in background
    try {
      await fetch('/api/hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });

      showToast('Landing hero updated live in real time!');
    } catch (err) {
      console.error(err);
      showToast('Published locally! Website updated.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = () => {
    publishNow(selectedImage);
  };

  const handleReset = () => {
    setSelectedImage(DEFAULT_CONFIG.image);
    setHeadlinePrefix(DEFAULT_CONFIG.headlinePrefix);
    setHeadlineHighlight(DEFAULT_CONFIG.headlineHighlight);
    showToast('Reset to default photo. Click "Save & Publish" to apply.');
  };

  const isDataUrl = selectedImage?.startsWith('data:') || false;
  const isCurrentlyLive = selectedImage === config.image;
  const hasUnsavedChanges = selectedImage !== config.image || headlineHighlight !== config.headlineHighlight;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#14100E] text-white px-5 py-3 rounded-full shadow-2xl border border-[#C4A47C] flex items-center gap-2.5 text-xs animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#C4A47C]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8E4DC]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#2A1810]">
            Landing Page Image
          </h1>
          <p className="text-xs text-[#8C7B6E] mt-0.5">
            Pick from previous photoshoot images or upload new ones. Changes sync to the live website in real time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={process.env.NEXT_PUBLIC_STOREFRONT_URL || "http://localhost:3000"}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#4A2311] bg-white border border-[#E8E4DC] hover:bg-[#FAF8F5] rounded-full transition-colors shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#C4A47C]" />
            <span>View Website</span>
          </a>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-[#4A2311] hover:bg-[#34180A] rounded-full transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Zap className="w-3.5 h-3.5 text-[#C4A47C]" />
            <span>{isSaving ? 'Publishing...' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      {/* Main 2-Step Card: 1. Pick/Upload Photo · 2. Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Select or Upload Photo (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EFEAE4] shadow-xs space-y-5">
            
            {/* Step 1: Upload from device */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-[#9E7B4F] uppercase tracking-wider block">
                  Option 1 · Upload New Photoshoot Image
                </span>
                <span className="text-[10px] text-[#8C7B6E]">
                  Automatically added to your gallery
                </span>
              </div>
              <label className="flex items-center justify-center gap-3 p-4 border-2 border-dashed border-[#D5CFCE] hover:border-[#9E7B4F] rounded-2xl bg-[#FAF8F5] hover:bg-[#FAF4EB]/60 transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-white shadow-2xs flex items-center justify-center text-[#9E7B4F] group-hover:scale-105 transition-transform shrink-0">
                  <Upload className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-[#2A1810]">
                    Upload photo from phone or computer
                  </p>
                  <p className="text-[10px] text-[#8C7B6E]">
                    JPG, PNG, WebP, or iPhone HEIC photoshoot image (saved permanently)
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*,.heic,.HEIC,.heif,.HEIF"
                  onChange={handleUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Step 2: Choose from Photoshoots */}
            <div className="pt-3 border-t border-[#F2ECE4]">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-[10px] font-bold text-[#9E7B4F] uppercase tracking-wider block">
                    Option 2 · Pick from Atelier Shoots
                  </span>
                  <span className="text-[11px] text-[#8C7B6E]">
                    Your uploaded shoots will remain saved here for future use.
                  </span>
                </div>
                {gallery.length > 0 && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-[11px] text-[#8C7B6E] hover:text-[#2A1810] flex items-center gap-1 hover:underline cursor-pointer shrink-0"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                )}
              </div>

              {/* Gallery Grid or Clean Empty State */}
              {gallery.length === 0 ? (
                <div className="p-7 rounded-2xl border border-dashed border-[#D5CFCE] bg-[#FAF8F5] text-center flex flex-col items-center justify-center space-y-2.5">
                  <div className="w-11 h-11 rounded-full bg-white shadow-2xs flex items-center justify-center text-[#9E7B4F]">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#2A1810]">
                      No custom photoshoot images uploaded yet
                    </p>
                    <p className="text-[11px] text-[#8C7B6E] max-w-sm mt-0.5 leading-relaxed">
                      Use Option 1 above to upload your own photos. Every photoshoot you upload will stay permanently saved in this section so you can switch between them anytime.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {gallery.map((shoot) => {
                    const isSelected = selectedImage === shoot.src;
                    const isLiveOnWebsite = config.image === shoot.src;

                    return (
                      <div
                        key={shoot.id}
                        onClick={() => {
                          setSelectedImage(shoot.src);
                          showToast(`Selected "${shoot.name}" for preview.`);
                        }}
                        className={`group relative rounded-2xl overflow-hidden border text-left transition-all cursor-pointer flex flex-col ${
                          isSelected
                            ? 'border-[#9E7B4F] ring-2 ring-[#9E7B4F] shadow-md bg-[#FAF6F0]'
                            : 'border-[#E8E4DC] hover:border-[#9E7B4F]/60 bg-white'
                        }`}
                      >
                        {/* Image Thumbnail */}
                        <div className="relative aspect-[3/4] w-full bg-neutral-900 overflow-hidden">
                          <Image
                            src={shoot.src}
                            alt={shoot.name}
                            fill
                            unoptimized
                            className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 50vw, 33vw"
                          />

                          {/* Live on Website Badge */}
                          {isLiveOnWebsite && (
                            <div className="absolute top-2 left-2 z-10 bg-[#2D6A4F] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                              <span>LIVE</span>
                            </div>
                          )}

                          {/* Selected Checkmark */}
                          {isSelected && !isLiveOnWebsite && (
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#9E7B4F] text-white flex items-center justify-center shadow-xs z-10">
                              <Check className="w-3 h-3" />
                            </div>
                          )}

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={(e) => handleDeleteCustomShoot(shoot.id, e)}
                            className="absolute bottom-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            title="Remove photo from gallery"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Card Footer Details */}
                        <div className="p-2.5 flex flex-col justify-between flex-1">
                          <div>
                            <span className="text-[9px] font-semibold text-[#9E7B4F] uppercase tracking-wider block truncate">
                              {shoot.tag || 'Atelier Shoot'}
                            </span>
                            <span className="text-[11px] font-bold text-[#2A1810] block truncate">
                              {shoot.name}
                            </span>
                          </div>

                          {/* Instant 1-Click Make Live Button */}
                          <div className="mt-2 pt-1 border-t border-[#F2ECE4]">
                            {isLiveOnWebsite ? (
                              <span className="text-[9px] text-[#2D6A4F] font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-[#2D6A4F]" />
                                Active on Website
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  publishNow(shoot.src);
                                }}
                                className="w-full py-1 px-2 rounded-full bg-[#FAF4EB] hover:bg-[#4A2311] text-[#4A2311] hover:text-white text-[10px] font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <Zap className="w-2.5 h-2.5 text-[#C4A47C]" />
                                <span>Make Live Now</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Optional Headline Toggle */}
            <div className="pt-2 border-t border-[#F2ECE4]">
              <button
                type="button"
                onClick={() => setShowTextEditor(!showTextEditor)}
                className="text-[11px] font-semibold text-[#8C7B6E] hover:text-[#2A1810] flex items-center gap-1.5 cursor-pointer"
              >
                <span>{showTextEditor ? '− Hide text options' : '+ Edit headline text (optional)'}</span>
              </button>

              {showTextEditor && (
                <div className="mt-3 space-y-2.5 p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#ECDCCB] animate-fade-in">
                  <div>
                    <label className="block text-[10px] font-semibold text-[#8C7B6E] uppercase mb-1">
                      Headline
                    </label>
                    <input
                      type="text"
                      value={headlinePrefix}
                      onChange={(e) => setHeadlinePrefix(e.target.value)}
                      className="w-full bg-white border border-[#D5CFCE] rounded-lg p-2 text-xs text-[#2A1810]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[#8C7B6E] uppercase mb-1">
                      Gold Highlighted Word
                    </label>
                    <input
                      type="text"
                      value={headlineHighlight}
                      onChange={(e) => setHeadlineHighlight(e.target.value)}
                      className="w-full bg-white border border-[#D5CFCE] rounded-lg p-2 text-xs text-[#2A1810]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="w-full py-3.5 px-4 rounded-full bg-[#4A2311] hover:bg-[#34180A] text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-[#C4A47C]" />
                <span>{isSaving ? 'Publishing in Realtime...' : 'Save & Publish to Storefront'}</span>
              </button>

              {hasUnsavedChanges && (
                <p className="text-[10px] text-amber-700 text-center mt-2 font-medium">
                  ● You selected a new photo. Click "Save & Publish" or "Make Live Now" on the card.
                </p>
              )}
            </div>

          </div>
        </div>

        {/* Right Side: Live Storefront Preview (5 Cols, Sticky) */}
        <div className="lg:col-span-5 space-y-2.5 lg:sticky lg:top-6">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold text-[#8C7B6E] uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#9E7B4F]" />
              Live Storefront Preview
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
              isCurrentlyLive
                ? 'text-[#2D6A4F] bg-[#EEF6F0]'
                : 'text-amber-800 bg-amber-50'
            }`}>
              {isCurrentlyLive ? 'Currently Live' : 'Previewing Selection'}
            </span>
          </div>

          {/* Exact Storefront Hero Box */}
          <div className="bg-[#14100E] rounded-3xl overflow-hidden border border-[#3A312A] shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 items-stretch min-h-[380px]">
              
              {/* Left 50% */}
              <div className="p-6 sm:p-7 flex flex-col justify-center space-y-3 z-10">
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#C4A47C] font-semibold">
                  Uno Fashion · Kigali
                </span>
                <h2 className="font-serif-luxury text-xl sm:text-2xl font-normal uppercase text-white leading-tight">
                  {headlinePrefix} <br />
                  <span className="text-[#D5B895]">{headlineHighlight}</span>
                </h2>
                <p className="text-[11px] text-[#B8ADA2] font-light leading-relaxed line-clamp-3">
                  {config.subtitle}
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <div className="inline-flex items-center space-x-1.5 bg-[#C4A47C] text-[#14100E] px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase">
                    <span>WhatsApp Us</span>
                    <ChevronRight className="w-3 h-3 text-[#14100E]" />
                  </div>
                </div>
              </div>

              {/* Right 50% Photo Preview */}
              <div className="relative min-h-[220px] sm:min-h-full w-full overflow-hidden bg-[#14100E]">
                {isDataUrl ? (
                  <img
                    src={selectedImage}
                    alt="Hero Preview"
                    className="w-full h-full object-cover object-top sm:object-[center_15%]"
                  />
                ) : (
                  <Image
                    src={selectedImage}
                    alt="Hero Preview"
                    fill
                    priority
                    unoptimized
                    className="object-cover object-top sm:object-[center_15%]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                )}
                <div className="hidden sm:block absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#14100E] via-[#14100E]/70 to-transparent pointer-events-none" />
                <div className="block sm:hidden absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[#14100E] to-transparent pointer-events-none" />
              </div>

            </div>
          </div>

          <p className="text-[10px] text-[#8C7B6E] text-center">
            Clients visiting unofashion.rw see this exact photoshoot picture on the landing page.
          </p>
        </div>

      </div>
    </div>
  );
}
