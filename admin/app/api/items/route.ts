import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { INITIAL_ITEMS } from '@/lib/data/mock-catalog';

function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(url && !url.includes('placeholder-project'));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      let query = supabase.from('items').select('*');

      if (id) {
        query = query.eq('id', id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        const mapped = data.map((item) => ({
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

  let items = INITIAL_ITEMS;
  if (id) {
    items = items.filter((i) => i.id === id);
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

    const record = {
      id: body.id || `item-${Date.now().toString().slice(-6)}`,
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
          return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, item: data });
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

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        const { error } = await supabase.from('items').delete().eq('id', id);

        if (error) {
          console.error('Admin Supabase item delete error:', error);
          return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
      } catch (err) {
        console.error('Admin Supabase error deleting item:', err);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Invalid request' },
      { status: 500 }
    );
  }
}

