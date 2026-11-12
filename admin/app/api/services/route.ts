import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const DEFAULT_SERVICES = [
  {
    id: 'svc-1',
    name: "Couple's Package",
    includes: 'Bridal gown + tailored tuxedo · Complete styling · 2 private fittings',
    price: 'from 460,000 Frw',
    status: 'Active',
  },
  {
    id: 'svc-2',
    name: 'Bridal Party & Groomsmen Package',
    includes: '4 curated suits · Group fitting session · Bowties & pocket squares',
    price: 'from 580,000 Frw',
    status: 'Active',
  },
  {
    id: 'svc-3',
    name: 'Day-Of Ceremonial Protocol Service',
    includes: 'Certified protocol officers · Red carpet entrance pacing · Dressing assistance',
    price: 'from 250,000 Frw',
    status: 'Active',
  },
  {
    id: 'svc-4',
    name: 'Bespoke Atelier Consultation',
    includes: '60 minutes personalized fitting with head tailor in Kigali',
    price: 'Complimentary with rental',
    status: 'Active',
  },
];

function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(url && !url.includes('placeholder-project'));
}

export async function GET() {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'wedding_services')
        .maybeSingle();

      if (!error && Array.isArray(data?.value) && data.value.length > 0) {
        return NextResponse.json(data.value);
      }
    } catch (err) {
      console.error('Admin Supabase services fetch error:', err);
    }
  }

  return NextResponse.json(DEFAULT_SERVICES);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: 'Payload must be an array of services' }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        const { error } = await supabase.from('site_settings').upsert({
          key: 'wedding_services',
          value: body,
          updated_at: new Date().toISOString(),
        });

        if (error) {
          console.error('Admin Supabase services upsert error:', error);
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
      } catch (err) {
        console.error('Admin Supabase error saving services:', err);
      }
    }

    return NextResponse.json({ success: true, services: body });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Invalid request' },
      { status: 500 }
    );
  }
}

