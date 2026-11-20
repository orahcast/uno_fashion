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

  let dbItems: any[] = [];
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      let query = supabase.from('items').select('*');

      if (id) {
        query = query.eq('id', id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        dbItems = data
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
      }
    } catch (err) {
      console.error('Admin Supabase fetch items error:', err);
    }
  }

  // Always read local items (so locally added/saved items like custom suits are NEVER lost on refresh!)
  const localItems = getLocalItems();

  // Merge database items and local items seamlessly
  const itemMap = new Map<string, any>();
  dbItems.forEach((item) => itemMap.set(item.id, item));
  localItems.forEach((item: any) => {
    if (!deletedIds.includes(item.id)) {
      itemMap.set(item.id, { ...itemMap.get(item.id), ...item });
    }
  });

  let merged = Array.from(itemMap.values());
  if (id) {
    merged = merged.filter((i: any) => i.id === id);
  }
  return NextResponse.json(merged);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || !body.name) {
      return NextResponse.json({ error: 'Item name is required' }, { status: 400 });
    }

    let slug: string =
      body.slug ||
      body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const itemId = body.id || `item-${Date.now().toString().slice(-6)}`;
    removeDeletedItemId(itemId);

    // Guarantee a unique slug and SKU (Supabase has unique constraints on items.slug and items.sku)
    let sku: string = body.sku || `UF-${Math.floor(100 + Math.random() * 900)}`;
    if (isSupabaseConfigured()) {
      try {
        const sb = await createClient();
        const { data: clash } = await sb
          .from('items')
          .select('id')
          .eq('slug', slug)
          .neq('id', itemId)
          .limit(1);
        if (clash && clash.length > 0) {
          slug = `${slug}-${Date.now().toString().slice(-5)}`;
        }
        for (let attempt = 0; attempt < 8; attempt++) {
          const { data: skuClash } = await sb
            .from('items')
            .select('id')
            .eq('sku', sku)
            .neq('id', itemId)
            .limit(1);
          if (!skuClash || skuClash.length === 0) break;
          sku = `UF-${Math.floor(1000 + Math.random() * 9000)}`;
        }
      } catch (e) {
        console.error('Slug/SKU uniqueness check failed:', e);
      }
    }

    const record = {
      id: itemId,
      slug,
      name: body.name,
      sku,
      category: body.category || 'Suits',
      category_slug: body.categorySlug || 'suits',
      color: body.color || '',
      fabric: body.fabric || '',
      fit: body.fit || '',
      description: body.description || '',
      rental_price: Number(body.rentalPrice || body.price || 0),
      refundable_deposit: Number(body.refundableDeposit || 0),
      rental_period_days: Number(body.rentalPeriodDays || 4),
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
        // Send only valid columns present in the Supabase items schema
        const dbRecord = {
          id: record.id,
          slug: record.slug,
          name: record.name,
          sku: record.sku,
          category: record.category,
          category_slug: record.category_slug,
          color: record.color,
          fit: record.fit,
          description: record.description,
          rental_price: record.rental_price,
          rental_period_days: record.rental_period_days,
          images: record.images,
          sizes: record.sizes,
          size_range: record.size_range,
          simple_status: record.simple_status,
          condition: record.condition,
          stock_by_size: record.stock_by_size,
          total_stock: record.total_stock,
          ready_stock: record.ready_stock,
          rented_stock: record.rented_stock,
          in_care_stock: record.in_care_stock,
          status: record.status,
          allow_online_booking: record.allow_online_booking,
          cleaning_turnaround_days: record.cleaning_turnaround_days,
          badge: record.badge,
          is_archived: record.is_archived,
          updated_at: record.updated_at,
        };

        const { data, error } = await supabase
          .from('items')
          .upsert(dbRecord, { onConflict: 'id' })
          .select()
          .single();

        if (error) {
          console.error('Admin Supabase item upsert error:', error);
          return NextResponse.json({ success: true, item: record, warning: error.message });
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
