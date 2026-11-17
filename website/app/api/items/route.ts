import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@/lib/supabase/server';
import { INITIAL_ITEMS } from '@/lib/data/mock-catalog';

function getItemsFilePath() {
  const possiblePaths = [
    path.join(process.cwd(), 'lib', 'data', 'items.json'),
    path.join(process.cwd(), 'website', 'lib', 'data', 'items.json'),
    path.join(process.cwd(), '..', 'website', 'lib', 'data', 'items.json'),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return possiblePaths[0];
}

function getDeletedFilePath() {
  const possiblePaths = [
    path.join(process.cwd(), 'lib', 'data', 'deleted-items.json'),
    path.join(process.cwd(), 'website', 'lib', 'data', 'deleted-items.json'),
    path.join(process.cwd(), '..', 'website', 'lib', 'data', 'deleted-items.json'),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return possiblePaths[0];
}

function getDeletedItemIds(): string[] {
  try {
    const f = getDeletedFilePath();
    if (fs.existsSync(f)) {
      const data = JSON.parse(fs.readFileSync(f, 'utf-8'));
      if (Array.isArray(data)) return data;
    }
  } catch (err) {
    console.error('Error reading deleted items file:', err);
  }
  return [];
}

function addDeletedItemId(id: string) {
  try {
    const f = getDeletedFilePath();
    const current = getDeletedItemIds();
    if (!current.includes(id)) {
      current.push(id);
      fs.writeFileSync(f, JSON.stringify(current, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Error writing deleted items file:', err);
  }
}

function getLocalItems() {
  const deletedIds = getDeletedItemIds();
  try {
    const f = getItemsFilePath();
    if (fs.existsSync(f)) {
      const content = fs.readFileSync(f, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed.filter((item: any) => !deletedIds.includes(item.id));
      }
    }
  } catch (err) {
    console.error('Error reading items.json:', err);
  }
  return INITIAL_ITEMS.filter((item) => !deletedIds.includes(item.id));
}

function saveLocalItems(items: any[]) {
  try {
    const f = getItemsFilePath();
    fs.writeFileSync(f, JSON.stringify(items, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving items.json:', err);
    return false;
  }
}

function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(url && !url.includes('placeholder-project'));
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const slug = searchParams.get('slug');
  const id = searchParams.get('id');
  const deletedIds = getDeletedItemIds();

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      let query = supabase.from('items').select('*').eq('is_archived', false);

      if (id) {
        query = query.eq('id', id);
      }
      if (slug) {
        query = query.eq('slug', slug);
      }
      if (category && category !== 'all') {
        query = query.eq('category_slug', category);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        const mapped = data
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
        return NextResponse.json(mapped, { headers: CORS_HEADERS });
      }
    } catch (err) {
      console.error('Supabase fetch items error:', err);
    }
  }

  // Fallback to local catalog
  let filtered = getLocalItems();
  if (id) {
    filtered = filtered.filter((i: any) => i.id === id);
  }
  if (slug) {
    filtered = filtered.filter((i: any) => i.slug === slug);
  }
  if (category && category !== 'all') {
    filtered = filtered.filter((i: any) => i.categorySlug === category);
  }

  return NextResponse.json(filtered, { headers: CORS_HEADERS });
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Item id is required' }, { status: 400, headers: CORS_HEADERS });
    }

    addDeletedItemId(id);

    try {
      const current = getLocalItems().filter((item: any) => item.id !== id);
      saveLocalItems(current);
    } catch (e) {
      console.error(e);
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        const { error } = await supabase.from('items').delete().eq('id', id);
        if (error) {
          console.warn('Supabase hard delete failed, marking is_archived:', error);
          await supabase.from('items').update({ is_archived: true }).eq('id', id);
        }
      } catch (err) {
        console.error('Supabase error deleting item:', err);
      }
    }

    return NextResponse.json({ success: true, id }, { headers: CORS_HEADERS });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Invalid request' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
