import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'lib', 'data', 'protocol-bookings.json');

function getBookings() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const fileData = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(fileData);
    }
  } catch (error) {
    console.error('Error reading protocol bookings:', error);
  }
  return [];
}

function saveBookings(data: unknown) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing protocol bookings:', error);
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
  const data = getBookings();
  return NextResponse.json(data, { headers: CORS_HEADERS });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || !body.customerName || !body.customerPhone) {
      return NextResponse.json(
        { error: 'Name and phone are required' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const current = getBookings();
    const newBooking = {
      id: `proto-${Date.now()}`,
      bookingNumber: `PR-${Math.floor(100 + Math.random() * 900)}`,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      eventDate: body.eventDate || '',
      serviceType: body.serviceType || 'Wedding Protocol Service',
      partySize: body.partySize || '1',
      venue: body.venue || '',
      notes: body.notes || '',
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    const updated = [newBooking, ...current];
    const ok = saveBookings(updated);
    if (!ok) {
      return NextResponse.json(
        { error: 'Failed to write booking' },
        { status: 500, headers: CORS_HEADERS }
      );
    }

    return NextResponse.json({ success: true, booking: newBooking }, { headers: CORS_HEADERS });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Invalid request' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

