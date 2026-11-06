import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { INITIAL_ACCOLADES } from '@/lib/data/mock-catalog';

const DATA_FILE = path.join(process.cwd(), 'lib', 'data', 'accolades.json');

function getAccolades() {
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

function saveAccolades(data: unknown) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing accolades file:', error);
    return false;
  }
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
  const accolades = getAccolades();
  return NextResponse.json(accolades, { headers: CORS_HEADERS });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: 'Payload must be an array of accolades' }, { status: 400, headers: CORS_HEADERS });
    }
    const success = saveAccolades(body);
    if (!success) {
      return NextResponse.json({ error: 'Failed to write accolades' }, { status: 500, headers: CORS_HEADERS });
    }
    return NextResponse.json({ success: true, count: body.length }, { headers: CORS_HEADERS });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Invalid request' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

