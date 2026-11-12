import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { INITIAL_ITEMS } from '@/lib/data/mock-catalog';

function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(url && !url.includes('placeholder-project'));
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const slug = searchParams.get('slug');

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      let query = supabase.from('items').select('*').eq('is_archived', false);

      if (slug) {
        query = query.eq('slug', slug);
      }
      if (category && category !== 'all') {
        query = query.eq('category_slug', category);
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
        }));
        return NextResponse.json(mapped, { headers: CORS_HEADERS });
      }
    } catch (err) {
      console.error('Supabase fetch items error:', err);
    }
  }

  // Fallback to local catalog
  let filtered = INITIAL_ITEMS;
  if (slug) {
    filtered = filtered.filter((i) => i.slug === slug);
  }
  if (category && category !== 'all') {
    filtered = filtered.filter((i) => i.categorySlug === category);
  }

  return NextResponse.json(filtered, { headers: CORS_HEADERS });
}

