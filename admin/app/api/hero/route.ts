import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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

function getHeroConfig() {
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

function saveHeroConfig(data: unknown) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Admin API error writing hero-config:', error);
    return false;
  }
}

export async function GET() {
  const config = getHeroConfig();
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
    const success = saveHeroConfig(updated);
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to write hero configuration' },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true, config: updated });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Invalid request' },
      { status: 500 }
    );
  }
}

