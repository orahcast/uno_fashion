import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@/lib/supabase/server';

const DATA_FILE = path.join(process.cwd(), 'lib', 'data', 'protocol-bookings.json');

function getLocalBookings() {
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

function saveLocalBookings(data: unknown) {
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
        .from('protocol_bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        const formatted = data.map((b) => ({
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
        return NextResponse.json(formatted, { headers: CORS_HEADERS });
      }
    } catch (err) {
      console.error('Supabase protocol bookings fetch error:', err);
    }
  }

  const data = getLocalBookings();
  return NextResponse.json(data, { headers: CORS_HEADERS });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || !body.customerName) {
      return NextResponse.json(
        { error: 'Customer name is required' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

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
          console.error('Supabase insert protocol booking error:', error);
        }
      } catch (err) {
        console.error('Supabase error creating protocol booking:', err);
      }
    }

    const current = getLocalBookings();
    saveLocalBookings([newBooking, ...current]);

    return NextResponse.json({ success: true, booking: newBooking }, { headers: CORS_HEADERS });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Invalid request' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
