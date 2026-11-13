import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { INITIAL_BOOKINGS } from '@/lib/data/mock-catalog';

function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(url && !url.includes('placeholder-project'));
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
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
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        const mapped = data.map((b) => ({
          id: b.id,
          bookingNumber: b.booking_number,
          customerName: b.customer_name,
          customerEmail: b.customer_email,
          customerPhone: b.customer_phone,
          customerAddress: b.customer_address,
          type: b.type,
          itemId: b.item_id,
          itemName: b.item_name,
          itemSku: b.item_sku,
          itemImage: b.item_image,
          size: b.size,
          pickupDate: b.pickup_date,
          returnDate: b.return_date,
          rentalFee: b.rental_fee,
          depositFee: b.deposit_fee,
          totalAmount: b.total_amount,
          paymentStatus: b.payment_status,
          status: b.status,
          fittingDate: b.fitting_date,
          fittingTime: b.fitting_time,
          occasion: b.occasion,
          notes: b.notes,
          createdAt: b.created_at_label || b.created_at,
          createdTime: b.created_time_label,
        }));
        return NextResponse.json(mapped, { headers: CORS_HEADERS });
      }
    } catch (err) {
      console.error('Supabase fetch bookings error:', err);
    }
  }

  return NextResponse.json(INITIAL_BOOKINGS, { headers: CORS_HEADERS });
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

    const bookingId = body.id || `bk-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const bookingNumber = body.bookingNumber || `#UF-${Math.floor(1050 + Math.random() * 8900)}`;

    const pickupDate = body.pickupDate || new Date().toISOString().split('T')[0];
    let returnDate = body.returnDate;
    if (!returnDate || returnDate < pickupDate) {
      const pTime = new Date(pickupDate + 'T00:00:00').getTime();
      returnDate = new Date(pTime + 4 * 86400000).toISOString().split('T')[0];
    }

    let validItemId: string | null = null;
    if (body.itemId && isSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        const { data: itemMatch } = await supabase
          .from('items')
          .select('id')
          .eq('id', body.itemId)
          .maybeSingle();
        if (itemMatch) {
          validItemId = itemMatch.id;
        }
      } catch (err) {
        console.error('Item validation error in Supabase:', err);
      }
    }

    const newBooking = {
      id: bookingId,
      booking_number: bookingNumber,
      customer_name: body.customerName,
      customer_email: body.customerEmail || '',
      customer_phone: body.customerPhone,
      customer_address: body.customerAddress || '',
      type: body.type || 'Online',
      item_id: validItemId,
      item_name: body.itemName || 'Custom Tailored Piece',
      item_sku: body.itemSku || '',
      item_image: body.itemImage || null,
      size: body.size || '',
      pickup_date: pickupDate,
      return_date: returnDate,
      rental_fee: Number(body.rentalFee || 0),
      deposit_fee: Number(body.depositFee || 0),
      total_amount: Number(body.totalAmount || body.rentalFee || 0),
      payment_status: body.paymentStatus || 'Unpaid',
      status: body.status || 'Pending',
      fitting_date: body.fittingDate || null,
      fitting_time: body.fittingTime || null,
      occasion: body.occasion || null,
      notes: body.notes || null,
      created_at_label: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      created_time_label: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        const { data, error } = await supabase
          .from('bookings')
          .insert(newBooking)
          .select()
          .single();

        if (error) {
          console.error('Supabase booking insert error:', error);
          // If insert fails due to foreign key or other constraint on item_id, retry with item_id null
          if (newBooking.item_id !== null) {
            const fallbackBooking = { ...newBooking, item_id: null };
            const { data: retryData, error: retryError } = await supabase
              .from('bookings')
              .insert(fallbackBooking)
              .select()
              .single();
            if (!retryError && retryData) {
              return NextResponse.json({ success: true, booking: retryData }, { headers: CORS_HEADERS });
            }
          }
          return NextResponse.json(
            { error: error.message },
            { status: 500, headers: CORS_HEADERS }
          );
        }

        return NextResponse.json({ success: true, booking: data }, { headers: CORS_HEADERS });
      } catch (err: unknown) {
        console.error('Supabase error inserting booking:', err);
      }
    }

    return NextResponse.json({ success: true, booking: newBooking }, { headers: CORS_HEADERS });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Invalid request' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400, headers: CORS_HEADERS });
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        const { error } = await supabase
          .from('bookings')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Supabase booking delete error:', error);
          return NextResponse.json({ error: error.message }, { status: 500, headers: CORS_HEADERS });
        }

        return NextResponse.json({ success: true, deleted: id }, { headers: CORS_HEADERS });
      } catch (err) {
        console.error('Supabase error deleting booking:', err);
      }
    }

    return NextResponse.json({ success: true, deleted: id }, { headers: CORS_HEADERS });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Invalid request' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
