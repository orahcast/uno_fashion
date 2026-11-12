import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@/lib/supabase/server';

const DATA_FILE = path.join(process.cwd(), '..', 'website', 'lib', 'data', 'hero-config.json');

const DEFAULT_CONFIG = {
  image: '/images/landing-page-3.jpeg',
  alt: 'Uno Fashion Agency - Tailoring & Wedding Protocol in Kigali',
  headlinePrefix: 'TAILORING — WITH',
  headlineHighlight: 'QUIET AUTHORITY',
  subtitle:
    'Uno Fashion Agency Ltd provides bespoke suit rentals, tuxedos, and wedding protocol services to ensure you make an indelible impression across Kigali.',
  updatedAt: new Date().toISOString(),
};

function getLocalConfig() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const fileData = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(fileData);
    }
  } catch (error) {
    console.error('Admin API error reading hero-config:', error);
  }
  return DEFAULT_CONFIG;
}

function saveLocalConfig(data: unknown) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
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
        .eq('key', 'hero_config')
        .maybeSingle();

      if (!error && data?.value) {
        return NextResponse.json(data.value);
      }
    } catch (err) {
      console.error('Admin Supabase hero fetch error:', err);
    }
  }

  const config = getLocalConfig();
  return NextResponse.json(config);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object' || !body.image) {
      return NextResponse.json(
        { error: 'Payload must include an image property' },
        { status: 400 }
      );
    }
    const updated = {
      ...DEFAULT_CONFIG,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        const { error } = await supabase
          .from('site_settings')
          .upsert({
            key: 'hero_config',
            value: updated,
            updated_at: new Date().toISOString(),
          });

        if (error) {
          console.error('Admin Supabase hero upsert error:', error);
        }
      } catch (err) {
        console.error('Admin Supabase error saving hero:', err);
      }
    }

    saveLocalConfig(updated);
    return NextResponse.json({ success: true, config: updated });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Invalid request' },
      { status: 500 }
    );
  }
}
