import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@/lib/supabase/server';
import { DEFAULT_USD_RATE } from '@/lib/currency';

function getCurrencyFilePath() {
  const possiblePaths = [
    path.join(process.cwd(), '..', 'website', 'lib', 'data', 'currency.json'),
    path.join(process.cwd(), 'lib', 'data', 'currency.json'),
    path.join(process.cwd(), 'website', 'lib', 'data', 'currency.json'),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return possiblePaths[0];
}

function getLocalCurrencyRate(): number {
  try {
    const f = getCurrencyFilePath();
    if (fs.existsSync(f)) {
      const content = fs.readFileSync(f, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed.rate === 'number' && parsed.rate > 0) {
        return parsed.rate;
      }
    }
  } catch (err) {
    console.error('Error reading currency.json:', err);
  }
  return DEFAULT_USD_RATE;
}

function saveLocalCurrencyRate(rate: number) {
  try {
    const f = getCurrencyFilePath();
    fs.writeFileSync(
      f,
      JSON.stringify({ rate, updatedAt: new Date().toISOString() }, null, 2),
      'utf-8'
    );
    return true;
  } catch (err) {
    console.error('Error saving currency.json:', err);
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
        .eq('key', 'usd_exchange_rate')
        .maybeSingle();

      if (!error && data?.value) {
        const rate = typeof data.value === 'number' ? data.value : data.value.rate;
        if (typeof rate === 'number' && rate > 0) {
          return NextResponse.json({ rate });
        }
      }
    } catch (err) {
      console.error('Admin Supabase currency fetch error:', err);
    }
  }

  const rate = getLocalCurrencyRate();
  return NextResponse.json({ rate });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rate = Number(body?.rate);

    if (!rate || rate <= 0 || isNaN(rate)) {
      return NextResponse.json(
        { error: 'Rate must be a positive number' },
        { status: 400 }
      );
    }

    saveLocalCurrencyRate(rate);

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        const { error } = await supabase.from('site_settings').upsert(
          {
            key: 'usd_exchange_rate',
            value: { rate, updatedAt: new Date().toISOString() },
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'key' }
        );

        if (error) {
          console.error('Error upserting currency in Supabase:', error);
        }
      } catch (err) {
        console.error('Admin currency POST Supabase error:', err);
      }
    }

    return NextResponse.json({ success: true, rate });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
