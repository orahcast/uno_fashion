import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { INITIAL_BOOKINGS } from '@/lib/data/mock-catalog';

function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(url && !url.includes('placeholder-project'));
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
        return NextResponse.json(mapped);
      }
    } catch (err) {
      console.error('Admin Supabase fetch bookings error:', err);
    }
  }

  return NextResponse.json(INITIAL_BOOKINGS);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || !body.customerName || !body.customerPhone) {
      return NextResponse.json(
        { error: 'Name and phone are required' },
        { status: 400 }
      );
    }

    const bookingId = body.id || `bk-${Date.now().toString().slice(-4)}`;
    const bookingNumber = body.bookingNumber || `#UF-${Math.floor(1050 + Math.random() * 900)}`;

    const newBooking = {
      id: bookingId,
      booking_number: bookingNumber,
      customer_name: body.customerName,
      customer_email: body.customerEmail || '',
      customer_phone: body.customerPhone,
      customer_address: body.customerAddress || '',
      type: body.type || 'Walk-in',
      item_id: body.itemId || null,
      item_name: body.itemName || 'Custom Tailored Piece',
      item_sku: body.itemSku || '',
      item_image: body.itemImage || null,
      size: body.size || '',
      pickup_date: body.pickupDate || new Date().toISOString().split('T')[0],
      return_date:
        body.returnDate ||
        new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
      rental_fee: Number(body.rentalFee || 0),
      deposit_fee: Number(body.depositFee || 0),
      total_amount: Number(body.totalAmount || body.rentalFee || 0),
      payment_status: body.paymentStatus || 'Paid',
      status: body.status || 'Confirmed',
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
          console.error('Admin Supabase booking insert error:', error);
          return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, booking: data });
      } catch (err) {
        console.error('Admin Supabase error inserting booking:', err);
      }
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
    const { id, status, paymentStatus } = body;

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        const updates: Record<string, any> = {};
        if (status) updates.status = status;
        if (paymentStatus) updates.payment_status = paymentStatus;

        const { error } = await supabase
          .from('bookings')
          .update(updates)
          .eq('id', id);

        if (error) {
          console.error('Admin Supabase booking patch error:', error);
          return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
      } catch (err) {
        console.error('Admin Supabase error patching booking:', err);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Invalid request' },
      { status: 500 }
    );
  }
}

