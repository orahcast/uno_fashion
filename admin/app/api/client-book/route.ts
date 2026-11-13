import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { INITIAL_CLIENT_BOOK } from '@/lib/data/mock-catalog';

function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(url && !url.includes('placeholder-project'));
}

export async function GET() {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('client_book')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        const mapped = data.map((b) => ({
          id: b.id,
          dateLogged: b.date_logged,
          timeLogged: b.time_logged,
          clientName: b.client_name,
          telephone: b.telephone,
          nationalId: b.national_id,
          outfitTaken: b.outfit_taken,
          returnDue: b.return_due,
          status: b.status,
          notes: b.notes,
        }));
        return NextResponse.json(mapped);
      }
    } catch (err) {
      console.error('Admin Supabase fetch client_book error:', err);
    }
  }

  return NextResponse.json(INITIAL_CLIENT_BOOK);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || !body.clientName || !body.telephone) {
      return NextResponse.json(
        { error: 'Client name and phone are required' },
        { status: 400 }
      );
    }

    const newRecord = {
      id: body.id || `cb-${Date.now()}`,
      date_logged: body.dateLogged || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time_logged: body.timeLogged || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      client_name: body.clientName,
      telephone: body.telephone,
      national_id: body.nationalId || '—',
      outfit_taken: body.outfitTaken || '',
      return_due: body.returnDue || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      status: body.status || 'OUT',
      notes: body.notes || null,
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        const { data, error } = await supabase
          .from('client_book')
          .upsert(newRecord, { onConflict: 'id' })
          .select()
          .single();

        if (error) {
          console.error('Admin Supabase insert client_book error:', error);
          return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, entry: data });
      } catch (err) {
        console.error('Admin Supabase error saving client_book:', err);
      }
    }

    return NextResponse.json({ success: true, entry: newRecord });
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
        const { error } = await supabase
          .from('client_book')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', id);

        if (error) {
          console.error('Admin Supabase client_book patch error:', error);
          return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
      } catch (err) {
        console.error('Admin Supabase error updating client_book:', err);
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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'id query param is required' }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        const { error } = await supabase
          .from('client_book')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Admin Supabase client_book delete error:', error);
          return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, id });
      } catch (err) {
        console.error('Admin Supabase error deleting client_book:', err);
      }
    }

    return NextResponse.json({ success: true, id });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Invalid request' },
      { status: 500 }
    );
  }
}


