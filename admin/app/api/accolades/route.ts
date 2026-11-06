import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { INITIAL_ACCOLADES } from '@/lib/data/mock-catalog';

const DATA_FILE = path.join(process.cwd(), '..', 'website', 'lib', 'data', 'accolades.json');

function getAccolades() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const fileData = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(fileData);
    }
  } catch (error) {
    console.error('Admin API error reading accolades:', error);
  }
  return INITIAL_ACCOLADES;
}

function saveAccolades(data: unknown) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Admin API error writing accolades:', error);
    return false;
  }
}

export async function GET() {
  const data = getAccolades();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: 'Payload must be an array of accolades' }, { status: 400 });
    }
    const ok = saveAccolades(body);
    if (!ok) {
      return NextResponse.json({ error: 'Failed to write accolades' }, { status: 500 });
    }
    return NextResponse.json({ success: true, count: body.length });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Invalid request' },
      { status: 500 }
    );
  }
}

