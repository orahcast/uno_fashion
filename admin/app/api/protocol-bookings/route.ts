import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), '..', 'website', 'lib', 'data', 'protocol-bookings.json');

function getBookings() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const fileData = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(fileData);
    }
  } catch (error) {
    console.error('Admin API error reading protocol bookings:', error);
  }
  return [];
}

function saveBookings(data: unknown) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Admin API error writing protocol bookings:', error);
    return false;
  }
}

export async function GET() {
  const data = getBookings();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || !body.customerName) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const current = getBookings();
    const newBooking = {
      id: `proto-${Date.now()}`,
      bookingNumber: `PR-${Math.floor(100 + Math.random() * 900)}`,
      customerName: body.customerName,
      customerPhone: body.customerPhone || '',
      eventDate: body.eventDate || '',
      serviceType: body.serviceType || 'Wedding Protocol Service',
      partySize: body.partySize || '',
      venue: body.venue || '',
      notes: body.notes || '',
      status: body.status || 'Pending',
      createdAt: new Date().toISOString(),
    };

    const updated = [newBooking, ...current];
    const ok = saveBookings(updated);
    if (!ok) {
      return NextResponse.json({ error: 'Failed to write booking' }, { status: 500 });
    }

    return NextResponse.json({ success: true, booking: newBooking });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Invalid request' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json({ error: 'id and status required' }, { status: 400 });
    }

    const current = getBookings();
    const updated = current.map((b: any) => (b.id === id ? { ...b, status } : b));
    saveBookings(updated);
    return NextResponse.json({ success: true, count: updated.length });
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
      return NextResponse.json({ error: 'id required' }, { status: 400 });
    }

    const current = getBookings();
    const updated = current.filter((b: any) => b.id !== id);
    saveBookings(updated);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Invalid request' },
      { status: 500 }
    );
  }
}

