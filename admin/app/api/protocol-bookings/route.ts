import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@/lib/supabase/server';

function getProtocolFilePath() {
  const possiblePaths = [
    path.join(process.cwd(), '..', 'website', 'lib', 'data', 'protocol-bookings.json'),
    path.join(process.cwd(), 'website', 'lib', 'data', 'protocol-bookings.json'),
    path.join(process.cwd(), 'lib', 'data', 'protocol-bookings.json'),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return possiblePaths[0];
}

function getDeletedFilePath() {
  const possiblePaths = [
    path.join(process.cwd(), '..', 'website', 'lib', 'data', 'deleted-protocol-bookings.json'),
    path.join(process.cwd(), 'website', 'lib', 'data', 'deleted-protocol-bookings.json'),
    path.join(process.cwd(), 'lib', 'data', 'deleted-protocol-bookings.json'),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return possiblePaths[0];
}

function getDeletedProtocolIds(): string[] {
  try {
    const f = getDeletedFilePath();
    if (fs.existsSync(f)) {
      const data = JSON.parse(fs.readFileSync(f, 'utf-8'));
      if (Array.isArray(data)) return data;
    }
  } catch (err) {
    console.error('Error reading deleted protocol bookings file:', err);
  }
  return [];
}

function addDeletedProtocolId(id: string) {
  try {
    const f = getDeletedFilePath();
    const current = getDeletedProtocolIds();
    if (!current.includes(id)) {
      current.push(id);
      fs.writeFileSync(f, JSON.stringify(current, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Error writing deleted protocol bookings file:', err);
  }
}

function removeDeletedProtocolId(id: string) {
  try {
    const f = getDeletedFilePath();
    const current = getDeletedProtocolIds().filter((d) => d !== id);
    fs.writeFileSync(f, JSON.stringify(current, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error removing deleted protocol id:', err);
  }
}

function getBookings() {
  const deletedIds = getDeletedProtocolIds();
  try {
    const f = getProtocolFilePath();
    if (fs.existsSync(f)) {
      const fileData = fs.readFileSync(f, 'utf-8');
      const parsed = JSON.parse(fileData);
      if (Array.isArray(parsed)) {
        return parsed.filter((b: any) => !deletedIds.includes(b.id));
      }
    }
  } catch (error) {
    console.error('Admin API error reading protocol bookings:', error);
  }
  return [];
}

function saveBookings(data: unknown) {
  try {
    const f = getProtocolFilePath();
    fs.writeFileSync(f, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Admin API error writing protocol bookings:', error);
    return false;
  }
}

function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(url && !url.includes('placeholder-project'));
}

export async function GET() {
  const deletedIds = getDeletedProtocolIds();

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('protocol_bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        const formatted = data
          .filter((b) => !deletedIds.includes(b.id))
          .map((b) => ({
            id: b.id,
            bookingNumber: b.booking_number,
            customerName: b.customer_name,
            customerPhone: b.customer_phone,
            eventDate: b.event_date,
            serviceType: b.service_type,
            partySize: b.party_size,
            venue: b.venue,
            notes: b.notes,
            status: b.status,
            createdAt: b.created_at,
          }));
        return NextResponse.json(formatted);
      }
    } catch (err) {
      console.error('Admin Supabase protocol bookings fetch error:', err);
    }
  }

  const data = getBookings();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || !body.customerName) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const bookingId = body.id || `proto-${Date.now()}`;
    removeDeletedProtocolId(bookingId);

    const newBooking = {
      id: bookingId,
      bookingNumber: body.bookingNumber || `PR-${Math.floor(100 + Math.random() * 900)}`,
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

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        const { error } = await supabase.from('protocol_bookings').insert({
          id: newBooking.id,
          booking_number: newBooking.bookingNumber,
          customer_name: newBooking.customerName,
          customer_phone: newBooking.customerPhone,
          event_date: newBooking.eventDate,
          service_type: newBooking.serviceType,
          party_size: newBooking.partySize,
          venue: newBooking.venue,
          notes: newBooking.notes,
          status: newBooking.status,
          created_at: newBooking.createdAt,
        });

        if (error) {
          console.error('Admin Supabase insert protocol booking error:', error);
        }
      } catch (err) {
        console.error('Admin Supabase error creating protocol booking:', err);
      }
    }

    const current = getBookings();
    saveBookings([newBooking, ...current]);

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

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        await supabase
          .from('protocol_bookings')
          .update({ status })
          .eq('id', id);
      } catch (err) {
        console.error('Admin Supabase update protocol booking error:', err);
      }
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

    // 1. Permanently track in deleted protocol bookings
    addDeletedProtocolId(id);

    // 2. Delete from Supabase
    if (isSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        const { error } = await supabase.from('protocol_bookings').delete().eq('id', id);
        if (error) {
          console.error('Admin Supabase protocol delete error:', error);
        }
      } catch (err) {
        console.error('Admin Supabase error deleting protocol booking:', err);
      }
    }

    // 3. Delete from local JSON file
    const current = getBookings().filter((b: any) => b.id !== id);
    saveBookings(current);

    return NextResponse.json({ success: true, id });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Invalid request' },
      { status: 500 }
    );
  }
}
