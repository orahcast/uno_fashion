import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export interface ProtocolPhoto {
  id: string;
  title: string;
  caption: string;
  image: string;
}

const DEFAULT_PROTOCOL_PHOTOS: ProtocolPhoto[] = [
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

function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(url && !url.includes('placeholder-project'));
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'protocol_photos')
        .maybeSingle();

      if (!error && Array.isArray(data?.value) && data.value.length > 0) {
        return NextResponse.json(data.value, { headers: CORS_HEADERS });
      }
    } catch (err) {
      console.error('Supabase protocol photos fetch error:', err);
    }
  }

  return NextResponse.json(DEFAULT_PROTOCOL_PHOTOS, { headers: CORS_HEADERS });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: 'Payload must be an array of protocol photos' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        const { error } = await supabase.from('site_settings').upsert({
          key: 'protocol_photos',
          value: body,
          updated_at: new Date().toISOString(),
        });

        if (error) {
          console.error('Supabase protocol photos upsert error:', error);
          return NextResponse.json({ error: error.message }, { status: 500, headers: CORS_HEADERS });
        }
      } catch (err) {
        console.error('Supabase error saving protocol photos:', err);
      }
    }

    return NextResponse.json({ success: true, photos: body }, { headers: CORS_HEADERS });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Invalid request' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

