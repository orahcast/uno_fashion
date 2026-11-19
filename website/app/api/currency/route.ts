import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@/lib/supabase/server';
import { DEFAULT_USD_RATE } from '@/lib/currency';

function getCurrencyFilePath() {
  const possiblePaths = [
    path.join(process.cwd(), 'lib', 'data', 'currency.json'),
    path.join(process.cwd(), 'website', 'lib', 'data', 'currency.json'),
    path.join(process.cwd(), '..', 'website', 'lib', 'data', 'currency.json'),
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
          return NextResponse.json({ rate }, { headers: CORS_HEADERS });
        }
      }
    } catch (err) {
      console.error('Error fetching usd_exchange_rate from Supabase:', err);
    }
  }

  const rate = getLocalCurrencyRate();
  return NextResponse.json({ rate }, { headers: CORS_HEADERS });
}
