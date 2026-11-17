import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
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

function getPhotosFilePath() {
  const possiblePaths = [
    path.join(process.cwd(), '..', 'website', 'lib', 'data', 'protocol-photos.json'),
    path.join(process.cwd(), 'website', 'lib', 'data', 'protocol-photos.json'),
    path.join(process.cwd(), 'lib', 'data', 'protocol-photos.json'),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return possiblePaths[0];
}

function getLocalPhotos(): ProtocolPhoto[] | null {
  try {
    const f = getPhotosFilePath();
    if (fs.existsSync(f)) {
      const content = fs.readFileSync(f, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Error reading protocol-photos.json:', err);
  }
  return null;
}

function saveLocalPhotos(photos: ProtocolPhoto[]) {
  try {
    const f = getPhotosFilePath();
    fs.writeFileSync(f, JSON.stringify(photos, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving protocol-photos.json:', err);
    return false;
  }
}

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
        .eq('key', 'protocol_photos')
        .maybeSingle();

      if (!error && data && Array.isArray(data.value)) {
        return NextResponse.json(data.value);
      }
    } catch (err) {
      console.error('Admin Supabase protocol photos fetch error:', err);
    }
  }

  const local = getLocalPhotos();
  if (local !== null) {
    return NextResponse.json(local);
  }

  return NextResponse.json([]);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: 'Payload must be an array of protocol photos' },
        { status: 400 }
      );
    }

    // Save locally
    saveLocalPhotos(body);

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        const { error } = await supabase.from('site_settings').upsert({
          key: 'protocol_photos',
          value: body,
          updated_at: new Date().toISOString(),
        });

        if (error) {
          console.error('Admin Supabase protocol photos upsert error:', error);
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
      } catch (err) {
        console.error('Admin Supabase error saving protocol photos:', err);
      }
    }

    return NextResponse.json({ success: true, photos: body });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Invalid request' },
      { status: 500 }
    );
  }
}
