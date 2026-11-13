-- =============================================================================
-- UNO FASHION AGENCY: ENABLE SUPABASE REALTIME
-- Run this in your Supabase SQL Editor to enable live WebSocket updates
-- without requiring any browser page refreshes!
-- =============================================================================

-- 1. Enable Full Replica Identity for all primary tables
-- (ensures update and delete payloads include full row data)
alter table public.items replica identity full;
alter table public.site_settings replica identity full;
alter table public.accolades replica identity full;
alter table public.bookings replica identity full;
alter table public.protocol_bookings replica identity full;
alter table public.client_book replica identity full;

-- 2. Add tables to the supabase_realtime publication
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    begin
      alter publication supabase_realtime add table public.items;
    exception when others then null;
    end;
    
    begin
      alter publication supabase_realtime add table public.site_settings;
    exception when others then null;
    end;

    begin
      alter publication supabase_realtime add table public.accolades;
    exception when others then null;
    end;

    begin
      alter publication supabase_realtime add table public.bookings;
    exception when others then null;
    end;

    begin
      alter publication supabase_realtime add table public.protocol_bookings;
    exception when others then null;
    end;

    begin
      alter publication supabase_realtime add table public.client_book;
    exception when others then null;
    end;
  end if;
end $$;

