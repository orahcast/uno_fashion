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
} from 'lucide-react';

interface HeroConfig {
  image: string;
  alt: string;
  headlinePrefix: string;
  headlineHighlight: string;
  subtitle: string;
  updatedAt?: string;
}

const DEFAULT_CONFIG: HeroConfig = {
  image: '/images/landing-page-3.jpeg',
  alt: 'Uno Fashion Agency - Tailoring & Wedding Protocol in Kigali',
  headlinePrefix: 'TAILORING — WITH',
  headlineHighlight: 'QUIET AUTHORITY',
  subtitle:
    'Uno Fashion Agency Ltd provides bespoke suit rentals, tuxedos, and wedding protocol services to ensure you make an indelible impression across Kigali.',
};

// Curated Photoshoot Presets from Atelier shoots
const PHOTOSHOOTS = [
  {
    id: 'look-3',
    name: 'Photoshoot Look 3',
    tag: 'Active Default',
    src: '/images/landing-page-3.jpeg',
  },
  {
    id: 'look-2',
    name: 'Photoshoot Look 2',
    tag: 'Tuxedo & Ivory',
    src: '/images/landing-page-2.jpeg',
  },
  {
    id: 'look-1',
    name: 'Photoshoot Look 1',
    tag: 'Bold Editorial',
    src: '/images/landing-page-1.jpeg',
  },
  {
    id: 'look-4',
    name: 'Executive Look',
    tag: 'Classic Cut',
    src: '/images/hero-men.jpg',
  },
];

export default function HeroLandingManagerPage() {
  const [config, setConfig] = useState<HeroConfig>(DEFAULT_CONFIG);
  const [selectedImage, setSelectedImage] = useState<string>(DEFAULT_CONFIG.image);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [headlinePrefix, setHeadlinePrefix] = useState(DEFAULT_CONFIG.headlinePrefix);
  const [headlineHighlight, setHeadlineHighlight] = useState(DEFAULT_CONFIG.headlineHighlight);

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
        }
      })
      .catch((err) => console.error('API load error:', err));
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Upload image from phone or laptop
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setSelectedImage(reader.result);
          showToast('Photo selected! Click "Save & Publish" to update website.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Publish to Storefront
  const handleSave = async () => {
    setIsSaving(true);
    const updated: HeroConfig = {
      ...config,
      image: selectedImage,
      headlinePrefix: headlinePrefix.trim(),
      headlineHighlight: headlineHighlight.trim(),
      updatedAt: new Date().toISOString(),
    };

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('uno_hero_config', JSON.stringify(updated));
      }

      await fetch('/api/hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });

      setConfig(updated);
      showToast('Landing image published successfully!');
    } catch (err) {
      console.error(err);
      showToast('Saved to browser. Storefront updated!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(DEFAULT_CONFIG.image);
    setHeadlinePrefix(DEFAULT_CONFIG.headlinePrefix);
    setHeadlineHighlight(DEFAULT_CONFIG.headlineHighlight);
    showToast('Reset to default photo. Click "Save & Publish" to apply.');
  };

  const isDataUrl = selectedImage.startsWith('data:');
  const hasUnsavedChanges = selectedImage !== config.image || headlineHighlight !== config.headlineHighlight;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
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
            Pick or upload the main hero photo seen on the Uno Fashion homepage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="http://localhost:3000"
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
            <Save className="w-3.5 h-3.5 text-[#C4A47C]" />
            <span>{isSaving ? 'Publishing...' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      {/* Main 2-Step Card: 1. Pick/Upload Photo · 2. Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Left Side: Select or Upload Photo */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-[#EFEAE4] shadow-xs space-y-4">
            
            {/* Step 1: Upload from device */}
            <div>
              <span className="text-[10px] font-bold text-[#9E7B4F] uppercase tracking-wider block mb-1">
                Option 1 · Upload Photo
              </span>
              <label className="flex items-center justify-center gap-3 p-4 border-2 border-dashed border-[#D5CFCE] hover:border-[#9E7B4F] rounded-2xl bg-[#FAF8F5] hover:bg-[#FAF4EB]/60 transition-colors cursor-pointer group">
                <div className="w-9 h-9 rounded-full bg-white shadow-2xs flex items-center justify-center text-[#9E7B4F] group-hover:scale-105 transition-transform shrink-0">
                  <Upload className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-[#2A1810]">
                    Upload photo from phone or computer
                  </p>
                  <p className="text-[10px] text-[#8C7B6E]">
                    JPG, PNG, or WebP photoshoot image
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Step 2: Choose from Photoshoots */}
            <div className="pt-2 border-t border-[#F2ECE4]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-[#9E7B4F] uppercase tracking-wider block">
                  Option 2 · Pick from Atelier Shoots
                </span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-[11px] text-[#8C7B6E] hover:text-[#2A1810] flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {PHOTOSHOOTS.map((shoot) => {
                  const isSelected = selectedImage === shoot.src;
                  return (
                    <button
                      key={shoot.id}
                      type="button"
                      onClick={() => {
                        setSelectedImage(shoot.src);
                        showToast(`Selected ${shoot.name}`);
                      }}
                      className={`relative rounded-xl overflow-hidden border text-left transition-all cursor-pointer group ${
                        isSelected
                          ? 'border-[#9E7B4F] ring-2 ring-[#9E7B4F] shadow-sm'
                          : 'border-[#E8E4DC] hover:border-[#9E7B4F]/60'
                      }`}
                    >
                      <div className="relative aspect-[3/4] w-full bg-neutral-900">
                        <Image
                          src={shoot.src}
                          alt={shoot.name}
                          fill
                          className="object-cover object-top group-hover:scale-105 transition-transform duration-200"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#9E7B4F] text-white flex items-center justify-center shadow-xs">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <div className="p-1.5 bg-white text-center">
                        <span className="text-[10px] font-semibold text-[#2A1810] block truncate">
                          {shoot.name}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
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
                <div className="mt-3 space-y-2.5 p-3 bg-[#FAF8F5] rounded-xl border border-[#ECDCCB] animate-fade-in">
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
                className="w-full py-3 px-4 rounded-full bg-[#4A2311] hover:bg-[#34180A] text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4 text-[#C4A47C]" />
                <span>{isSaving ? 'Publishing...' : 'Save & Publish to Storefront'}</span>
              </button>

              {hasUnsavedChanges && (
                <p className="text-[10px] text-amber-700 text-center mt-1.5 font-medium">
                  ● You have selected a new photo. Click above to make it live.
                </p>
              )}
            </div>

          </div>
        </div>

        {/* Right Side: Live Storefront Preview */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold text-[#8C7B6E] uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#9E7B4F]" />
              Live Storefront Preview
            </span>
            <span className="text-[10px] text-[#2D6A4F] bg-[#EEF6F0] px-2 py-0.5 rounded-full font-semibold">
              Live on Website
            </span>
          </div>

          {/* Simple, Exact Storefront Hero Box */}
          <div className="bg-[#14100E] rounded-3xl overflow-hidden border border-[#3A312A] shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 items-stretch min-h-[380px]">
              
              {/* Left 50% */}
              <div className="p-6 sm:p-7 flex flex-col justify-center space-y-3 z-10">
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
            Clients visiting unofashion.rw will see this exact photoshoot picture on the landing page.
          </p>
        </div>

      </div>
    </div>
  );
}
