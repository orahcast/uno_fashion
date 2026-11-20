import fs from 'fs';
import path from 'path';
import { RentalItem, AccoladeItem } from '@/lib/types';
import { createClient } from '@/lib/supabase/server';

export interface HeroConfig {
  image: string;
  alt: string;
  headlinePrefix: string;
  headlineHighlight: string;
  subtitle: string;
  gallery?: Array<{ id: string; src: string; tag?: string; name?: string; isDefault?: boolean }>;
}

export const FALLBACK_HERO_CONFIG: HeroConfig = {
  image: 'https://oyauupqqhprwynkqyuzr.supabase.co/storage/v1/object/public/inventory-photos/hero-1795165499923.jpg',
  alt: 'Uno Fashion Agency - Tailoring & Wedding Protocol in Kigali',
  headlinePrefix: 'TAILORING — WITH',
  headlineHighlight: 'QUIET AUTHORITY',
  subtitle:
    'Uno Fashion Agency Ltd provides bespoke suit rentals, tuxedos, and wedding protocol services to ensure you make an indelible impression across Kigali.',
};

export function getHeroConfig(): HeroConfig {
  try {
    const dataFile = path.join(process.cwd(), 'lib', 'data', 'hero-config.json');
    if (fs.existsSync(dataFile)) {
      const content = fs.readFileSync(dataFile, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && parsed.image) {
        return { ...FALLBACK_HERO_CONFIG, ...parsed };
      }
    }
  } catch (err) {
    console.error('Error reading hero-config.json on server:', err);
  }
  return FALLBACK_HERO_CONFIG;
}

function getDeletedItemIds(): string[] {
  try {
    const dataFile = path.join(process.cwd(), 'lib', 'data', 'deleted-items.json');
    if (fs.existsSync(dataFile)) {
      const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
      if (Array.isArray(data)) return data;
    }
  } catch (err) { }
  return [];
}

export async function getStorefrontItems(): Promise<RentalItem[]> {
  const deletedIds = getDeletedItemIds();

  // 1. Query Supabase
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (url && !url.includes('placeholder-project')) {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('is_archived', false)
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        return data
          .filter((item) => !deletedIds.includes(item.id))
          .map((item) => ({
            id: item.id,
            slug: item.slug,
            name: item.name,
            sku: item.sku,
            category: item.category,
            categorySlug: item.category_slug,
            color: item.color,
            fabric: item.fabric,
            fit: item.fit,
            description: item.description,
            rentalPrice: item.rental_price,
            refundableDeposit: item.refundable_deposit,
            rentalPeriodDays: item.rental_period_days,
            images: item.images || [],
            sizes: item.sizes || [],
            sizeRange: item.size_range,
            simpleStatus: item.simple_status,
            condition: item.condition,
            stockBySize: item.stock_by_size || [],
            totalStock: item.total_stock,
            readyStock: item.ready_stock,
            rentedStock: item.rented_stock,
            inCareStock: item.in_care_stock,
            status: item.status,
            allowOnlineBooking: item.allow_online_booking,
            cleaningTurnaroundDays: item.cleaning_turnaround_days,
            badge: item.badge,
          }));
      }
    }
  } catch (err) {
    // If Supabase fetch fails on server, fall back quietly to items.json
  }

  // 2. Fallback to items.json
  try {
    const dataFile = path.join(process.cwd(), 'lib', 'data', 'items.json');
    if (fs.existsSync(dataFile)) {
      const content = fs.readFileSync(dataFile, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter((item: any) => !deletedIds.includes(item.id));
      }
    }
  } catch (err) { }

  return [];
}

function getDeletedAccoladeIds(): string[] {
  try {
    const f = path.join(process.cwd(), 'lib', 'data', 'deleted-accolades.json');
    if (fs.existsSync(f)) {
      const d = JSON.parse(fs.readFileSync(f, 'utf-8'));
      if (Array.isArray(d)) return d;
    }
  } catch (e) {}
  return [];
}

export async function getAccolades(): Promise<AccoladeItem[]> {
  const deleted = getDeletedAccoladeIds();
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (url && !url.includes('placeholder-project')) {
      const supabase = await createClient();
      const { data, error } = await supabase.from('accolades').select('*').order('sort_order', { ascending: true });
      if (!error && Array.isArray(data)) {
        return data
          .filter((i) => !deleted.includes(i.id))
          .map((i) => ({
            id: i.id,
            title: i.title,
            category: i.category,
            year: i.year,
            image: i.image,
            featuredPerson: i.featured_person,
            badge: i.badge,
          })) as AccoladeItem[];
      }
    }
  } catch (e) {}
  try {
    const f = path.join(process.cwd(), 'lib', 'data', 'accolades.json');
    if (fs.existsSync(f)) {
      const parsed = JSON.parse(fs.readFileSync(f, 'utf-8'));
      if (Array.isArray(parsed)) return parsed.filter((i) => !deleted.includes(i.id));
    }
  } catch (e) {}
  return [];
}
