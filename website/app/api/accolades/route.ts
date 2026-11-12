import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { INITIAL_ACCOLADES } from '@/lib/data/mock-catalog';
import { createClient } from '@/lib/supabase/server';

const DATA_FILE = path.join(process.cwd(), 'lib', 'data', 'accolades.json');

function getLocalAccolades() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const fileData = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(fileData);
    }
  } catch (error) {
    console.error('Error reading accolades file:', error);
  }
  return INITIAL_ACCOLADES;
}

function saveLocalAccolades(data: unknown) {
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
        .from('accolades')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!error && Array.isArray(data) && data.length > 0) {
        // Map database column names to camelCase for UI compatibility
        const formatted = data.map((item) => ({
          id: item.id,
          title: item.title,
          category: item.category,
          year: item.year,
          image: item.image,
          featuredPerson: item.featured_person,
          badge: item.badge,
        }));
        return NextResponse.json(formatted, { headers: CORS_HEADERS });
      }
    } catch (err) {
      console.error('Supabase accolades fetch error:', err);
    }
  }

  const accolades = getLocalAccolades();
  return NextResponse.json(accolades, { headers: CORS_HEADERS });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: 'Payload must be an array of accolades' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        const records = body.map((item, idx) => ({
          id: item.id,
          title: item.title,
          category: item.category || 'Celebrity',
          year: item.year || '2026',
          image: item.image,
          featured_person: item.featuredPerson || null,
          badge: item.badge || null,
          sort_order: idx + 1,
          updated_at: new Date().toISOString(),
        }));

        const { error } = await supabase
          .from('accolades')
          .upsert(records, { onConflict: 'id' });

        if (error) {
          console.error('Supabase accolades upsert error:', error);
        }
      } catch (err) {
        console.error('Supabase error saving accolades:', err);
      }
    }

    saveLocalAccolades(body);
    return NextResponse.json({ success: true, count: body.length }, { headers: CORS_HEADERS });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Invalid request' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
