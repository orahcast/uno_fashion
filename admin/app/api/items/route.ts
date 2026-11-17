import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@/lib/supabase/server';
import { INITIAL_ITEMS } from '@/lib/data/mock-catalog';

function getItemsFilePath() {
  const possiblePaths = [
    path.join(process.cwd(), '..', 'website', 'lib', 'data', 'items.json'),
    path.join(process.cwd(), 'website', 'lib', 'data', 'items.json'),
    path.join(process.cwd(), 'lib', 'data', 'items.json'),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return possiblePaths[0];
}

function getDeletedFilePath() {
  const possiblePaths = [
    path.join(process.cwd(), '..', 'website', 'lib', 'data', 'deleted-items.json'),
    path.join(process.cwd(), 'website', 'lib', 'data', 'deleted-items.json'),
    path.join(process.cwd(), 'lib', 'data', 'deleted-items.json'),
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

function removeDeletedItemId(id: string) {
  try {
    const f = getDeletedFilePath();
    const current = getDeletedItemIds().filter((d) => d !== id);
    fs.writeFileSync(f, JSON.stringify(current, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error removing deleted item id:', err);
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const deletedIds = getDeletedItemIds();

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      let query = supabase.from('items').select('*');

      if (id) {
        query = query.eq('id', id);
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
            isArchived: item.is_archived,
          }));
        return NextResponse.json(mapped);
      }
    } catch (err) {
      console.error('Admin Supabase fetch items error:', err);
    }
  }

  let items = getLocalItems();
  if (id) {
    items = items.filter((i: any) => i.id === id);
  }
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || !body.name) {
      return NextResponse.json({ error: 'Item name is required' }, { status: 400 });
    }

    const slug =
      body.slug ||
      body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const itemId = body.id || `item-${Date.now().toString().slice(-6)}`;
    removeDeletedItemId(itemId);

    const record = {
      id: itemId,
      slug,
      name: body.name,
      sku: body.sku || `SU-${Math.floor(100 + Math.random() * 900)}`,
      category: body.category || 'Suits',
      category_slug: body.categorySlug || 'suits',
      color: body.color || '',
      fabric: body.fabric || '',
      fit: body.fit || '',
      description: body.description || '',
      rental_price: Number(body.rentalPrice || 0),
      refundable_deposit: Number(body.refundableDeposit || 0),
      rental_period_days: Number(body.rentalPeriodDays || 1),
      images: Array.isArray(body.images) ? body.images : body.image ? [body.image] : [],
      sizes: Array.isArray(body.sizes) ? body.sizes : ['38', '40', '42', '44'],
      size_range: body.sizeRange || '',
      simple_status: body.simpleStatus || 'Available',
      condition: body.condition || 'Excellent',
      stock_by_size: body.stockBySize || [],
      total_stock: Number(body.totalStock || 1),
      ready_stock: Number(body.readyStock || 1),
      rented_stock: Number(body.rentedStock || 0),
      in_care_stock: Number(body.inCareStock || 0),
      status: body.status || 'Published',
      allow_online_booking: body.allowOnlineBooking !== false,
      cleaning_turnaround_days: Number(body.cleaningTurnaroundDays || 1),
      badge: body.badge || null,
      is_archived: Boolean(body.isArchived),
      updated_at: new Date().toISOString(),
    };

    // Update local items file
    try {
      const current = getLocalItems();
      const existingIdx = current.findIndex((i: any) => i.id === itemId);
      const camelItem = {
        ...record,
        rentalPrice: record.rental_price,
        refundableDeposit: record.refundable_deposit,
        rentalPeriodDays: record.rental_period_days,
        categorySlug: record.category_slug,
        sizeRange: record.size_range,
        simpleStatus: record.simple_status,
        stockBySize: record.stock_by_size,
        totalStock: record.total_stock,
        readyStock: record.ready_stock,
        rentedStock: record.rented_stock,
        inCareStock: record.in_care_stock,
        allowOnlineBooking: record.allow_online_booking,
        cleaningTurnaroundDays: record.cleaning_turnaround_days,
        isArchived: record.is_archived,
      };

      if (existingIdx >= 0) {
        current[existingIdx] = { ...current[existingIdx], ...camelItem };
      } else {
        current.unshift(camelItem);
      }
      saveLocalItems(current);
    } catch (e) {
      console.error('Error updating local items cache:', e);
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        const { data, error } = await supabase
          .from('items')
          .upsert(record, { onConflict: 'id' })
          .select()
          .single();

        if (error) {
          console.error('Admin Supabase item upsert error:', error);
          // Still return success since local storage saved it
        } else if (data) {
          return NextResponse.json({ success: true, item: data });
        }
      } catch (err) {
        console.error('Admin Supabase error saving item:', err);
      }
    }

    return NextResponse.json({ success: true, item: record });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Invalid request' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Item id is required' }, { status: 400 });
    }

    // 1. Permanently track in deleted items
    addDeletedItemId(id);

    // 2. Remove from local items.json
    try {
      const current = getLocalItems().filter((item: any) => item.id !== id);
      saveLocalItems(current);
    } catch (e) {
      console.error(e);
    }

    // 3. Delete from Supabase
    if (isSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        const { error } = await supabase.from('items').delete().eq('id', id);

        if (error) {
          console.warn('Admin Supabase item delete error, falling back to archive:', error);
          await supabase.from('items').update({ is_archived: true }).eq('id', id);
        }
      } catch (err) {
        console.error('Admin Supabase error deleting item:', err);
      }
    }

    return NextResponse.json({ success: true, id });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Invalid request' },
      { status: 500 }
    );
  }
}
