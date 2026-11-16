import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { INITIAL_ACCOLADES } from '@/lib/data/mock-catalog';
import { createClient } from '@/lib/supabase/server';

function getAccoladesFilePath() {
  const possiblePaths = [
    path.join(process.cwd(), '..', 'website', 'lib', 'data', 'accolades.json'),
    path.join(process.cwd(), 'website', 'lib', 'data', 'accolades.json'),
    path.join(process.cwd(), 'lib', 'data', 'accolades.json'),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return possiblePaths[0];
}

function getDeletedFilePath() {
  const possiblePaths = [
    path.join(process.cwd(), '..', 'website', 'lib', 'data', 'deleted-accolades.json'),
    path.join(process.cwd(), 'website', 'lib', 'data', 'deleted-accolades.json'),
    path.join(process.cwd(), 'lib', 'data', 'deleted-accolades.json'),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return possiblePaths[0];
}

function getDeletedAccoladeIds(): string[] {
  try {
    const f = getDeletedFilePath();
    if (fs.existsSync(f)) {
      const data = JSON.parse(fs.readFileSync(f, 'utf-8'));
      if (Array.isArray(data)) return data;
    }
  } catch (err) {
    console.error('Error reading deleted accolades file:', err);
  }
  return [];
}

function addDeletedAccoladeId(id: string) {
  try {
    const f = getDeletedFilePath();
    const current = getDeletedAccoladeIds();
    if (!current.includes(id)) {
      current.push(id);
      fs.writeFileSync(f, JSON.stringify(current, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Error writing deleted accolades file:', err);
  }
}

function removeDeletedAccoladeId(id: string) {
  try {
    const f = getDeletedFilePath();
    const current = getDeletedAccoladeIds().filter((d) => d !== id);
    fs.writeFileSync(f, JSON.stringify(current, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error removing deleted accolade id:', err);
  }
}

function getLocalAccolades() {
  const deletedIds = getDeletedAccoladeIds();
  try {
    const f = getAccoladesFilePath();
    if (fs.existsSync(f)) {
      const fileData = fs.readFileSync(f, 'utf-8');
      const parsed = JSON.parse(fileData);
      if (Array.isArray(parsed)) {
        return parsed.filter((item: any) => !deletedIds.includes(item.id));
      }
    }
  } catch (error) {
    console.error('Admin API error reading accolades:', error);
  }
  return INITIAL_ACCOLADES.filter((item) => !deletedIds.includes(item.id));
}

function saveLocalAccolades(data: unknown) {
  try {
    const f = getAccoladesFilePath();
    fs.writeFileSync(f, JSON.stringify(data, null, 2), 'utf-8');
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
  const deletedIds = getDeletedAccoladeIds();

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('accolades')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!error && Array.isArray(data)) {
        const formatted = data
          .filter((item) => !deletedIds.includes(item.id))
          .map((item) => ({
            id: item.id,
            title: item.title,
            category: item.category,
            year: item.year,
            image: item.image,
            featuredPerson: item.featured_person,
            badge: item.badge,
          }));
        return NextResponse.json(formatted);
      }
    } catch (err) {
      console.error('Admin Supabase accolades fetch error:', err);
    }
  }

  const data = getLocalAccolades();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: 'Payload must be an array of accolades' }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        const activeIds = body.map((item: any) => item.id).filter(Boolean);

        // Delete any existing records in Supabase that are NOT in activeIds
        const { data: existing } = await supabase.from('accolades').select('id');
        if (existing && existing.length > 0) {
          const toDelete = existing
            .map((e) => e.id)
            .filter((id) => !activeIds.includes(id));
          if (toDelete.length > 0) {
            await supabase.from('accolades').delete().in('id', toDelete);
            toDelete.forEach((delId) => addDeletedAccoladeId(delId));
          }
        }

        if (body.length > 0) {
          const records = body.map((item, idx) => {
            // If item was previously deleted, unmark it
            removeDeletedAccoladeId(item.id);
            return {
              id: item.id,
              title: item.title,
              category: item.category || 'Celebrity',
              year: item.year || '2026',
              image: item.image,
              featured_person: item.featuredPerson || null,
              badge: item.badge || null,
              sort_order: idx + 1,
              updated_at: new Date().toISOString(),
            };
          });

          const { error } = await supabase
            .from('accolades')
            .upsert(records, { onConflict: 'id' });

          if (error) {
            console.error('Admin Supabase accolades upsert error:', error);
          }
        }
      } catch (err) {
        console.error('Admin Supabase error saving accolades:', err);
      }
    }

    saveLocalAccolades(body);
    return NextResponse.json({ success: true, count: body.length });
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
      return NextResponse.json({ error: 'Accolade ID is required' }, { status: 400 });
    }

    // 1. Permanently track in deleted IDs so fallback never resurrects it
    addDeletedAccoladeId(id);

    // 2. Delete from Supabase
    if (isSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        const { error } = await supabase.from('accolades').delete().eq('id', id);
        if (error) {
          console.error('Admin Supabase error deleting accolade:', error);
        }
      } catch (err) {
        console.error('Admin Supabase error deleting accolade:', err);
      }
    }

    // 3. Remove from local JSON file
    try {
      const current = getLocalAccolades().filter((item: any) => item.id !== id);
      saveLocalAccolades(current);
    } catch (e) {
      console.error(e);
    }

    return NextResponse.json({ success: true, id });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Invalid request' },
      { status: 500 }
    );
  }
}
