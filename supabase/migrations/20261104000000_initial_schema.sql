-- =============================================================================
-- Uno Fashion Agency Rental & Inventory Platform
-- Migration 001: Core Schema, Storage Bucket, & Row Level Security (RLS)
-- =============================================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. ITEMS TABLE (Rental Catalog & Inventory Central)
-- -----------------------------------------------------------------------------
create table if not exists public.items (
  id text primary key default ('item-' || substr(gen_random_uuid()::text, 1, 8)),
  slug text not null unique,
  name text not null,
  sku text not null unique,
  category text not null check (category in ('Suits', 'Bridal gowns', 'Accessories', 'Tuxedo', 'Suit')),
  category_slug text not null default 'suits' check (category_slug in ('suits', 'gowns', 'accessories', 'veils')),
  color text not null default '',
  fabric text not null default '',
  fit text not null default '',
  description text not null default '',
  rental_price integer not null default 0 check (rental_price >= 0),
  refundable_deposit integer not null default 0 check (refundable_deposit >= 0),
  rental_period_days integer not null default 4 check (rental_period_days > 0),
  images text[] not null default '{}',
  sizes text[] not null default '{}',
  size_range text default '',
  simple_status text not null default 'Available' check (simple_status in ('Available', 'Rented', 'Dry cleaning')),
  condition text default 'Excellent',
  stock_by_size jsonb not null default '[]'::jsonb,
  total_stock integer not null default 1 check (total_stock >= 0),
  ready_stock integer not null default 1 check (ready_stock >= 0),
  rented_stock integer not null default 0 check (rented_stock >= 0),
  in_care_stock integer not null default 0 check (in_care_stock >= 0),
  status text not null default 'Published' check (status in ('Published', 'Draft', 'Archived')),
  allow_online_booking boolean not null default true,
  cleaning_turnaround_days integer not null default 1 check (cleaning_turnaround_days >= 0),
  badge text,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_items_slug on public.items(slug);
create index if not exists idx_items_sku on public.items(sku);
create index if not exists idx_items_category_slug on public.items(category_slug);
create index if not exists idx_items_simple_status on public.items(simple_status);

-- -----------------------------------------------------------------------------
-- 2. BOOKINGS TABLE (Suit & Gown Rental Reservations + Fitting Requests)
-- -----------------------------------------------------------------------------
create table if not exists public.bookings (
  id text primary key default ('bk-' || substr(gen_random_uuid()::text, 1, 8)),
  booking_number text not null unique,
  customer_name text not null,
  customer_email text not null default '',
  customer_phone text not null,
  customer_address text default '',
  type text not null default 'Online' check (type in ('Online', 'Walk-in')),
  item_id text references public.items(id) on delete set null,
  item_name text not null,
  item_sku text not null default '',
  item_image text,
  size text not null default '',
  pickup_date date not null,
  return_date date not null,
  rental_fee integer not null default 0 check (rental_fee >= 0),
  deposit_fee integer not null default 0 check (deposit_fee >= 0),
  total_amount integer not null default 0 check (total_amount >= 0),
  payment_status text not null default 'Unpaid' check (payment_status in ('Paid', 'Unpaid', 'Refunded')),
  status text not null default 'Pending' check (
    status in (
      'Confirmed',
      'Ready',
      'Request',
      'Pending',
      'Delivered',
      'Completed',
      'Out on rent',
      'Due today',
      'Returned'
    )
  ),
  fitting_date text,
  fitting_time text,
  occasion text,
  notes text,
  created_at_label text,
  created_time_label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_date_order_check check (return_date >= pickup_date)
);

create index if not exists idx_bookings_item_id on public.bookings(item_id);
create index if not exists idx_bookings_status on public.bookings(status);
create index if not exists idx_bookings_dates on public.bookings(pickup_date, return_date);

-- -----------------------------------------------------------------------------
-- 3. PROTOCOL BOOKINGS TABLE (Wedding & VIP Protocol Service Inquiries)
-- -----------------------------------------------------------------------------
create table if not exists public.protocol_bookings (
  id text primary key default ('proto-' || substr(gen_random_uuid()::text, 1, 8)),
  booking_number text not null unique,
  customer_name text not null,
  customer_phone text not null default '',
  event_date text not null default '',
  service_type text not null default 'Wedding Protocol Service',
  party_size text default '',
  venue text default '',
  notes text default '',
  status text not null default 'Pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- 4. CLIENT BOOK TABLE (Physical Atelier Out/Returned/Fitting Ledger)
-- -----------------------------------------------------------------------------
create table if not exists public.client_book (
  id text primary key default ('cb-' || substr(gen_random_uuid()::text, 1, 8)),
  date_logged text not null,
  time_logged text not null,
  client_name text not null,
  telephone text not null,
  national_id text not null default '—',
  outfit_taken text not null,
  return_due text not null,
  status text not null default 'OUT' check (status in ('OUT', 'RETURNED', 'FITTING')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- 5. ACCOLADES TABLE (Celebrity Looks, Awards & Certifications CMS)
-- -----------------------------------------------------------------------------
create table if not exists public.accolades (
  id text primary key default ('acc-' || substr(gen_random_uuid()::text, 1, 8)),
  title text not null,
  category text not null default 'Celebrity' check (category in ('Celebrity', 'Certification', 'Award', 'Press')),
  year text not null default '2026',
  image text not null,
  featured_person text,
  badge text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- 6. SITE SETTINGS TABLE (Hero Config & Storefront CMS Settings)
-- -----------------------------------------------------------------------------
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- 7. UPDATED_AT TRIGGER FUNCTION
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_items_updated_at on public.items;
create trigger trg_items_updated_at
  before update on public.items
  for each row execute function public.set_updated_at();

drop trigger if exists trg_bookings_updated_at on public.bookings;
create trigger trg_bookings_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

drop trigger if exists trg_protocol_bookings_updated_at on public.protocol_bookings;
create trigger trg_protocol_bookings_updated_at
  before update on public.protocol_bookings
  for each row execute function public.set_updated_at();

drop trigger if exists trg_client_book_updated_at on public.client_book;
create trigger trg_client_book_updated_at
  before update on public.client_book
  for each row execute function public.set_updated_at();

drop trigger if exists trg_accolades_updated_at on public.accolades;
create trigger trg_accolades_updated_at
  before update on public.accolades
  for each row execute function public.set_updated_at();

drop trigger if exists trg_site_settings_updated_at on public.site_settings;
create trigger trg_site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------
alter table public.items enable row level security;
alter table public.bookings enable row level security;
alter table public.protocol_bookings enable row level security;
alter table public.client_book enable row level security;
alter table public.accolades enable row level security;
alter table public.site_settings enable row level security;

-- Items: Public can read all items; Authenticated (Boutique Owner) has full CRUD
drop policy if exists "Public can view items" on public.items;
create policy "Public can view items"
  on public.items for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated owner can manage items" on public.items;
create policy "Authenticated owner can manage items"
  on public.items for all
  to authenticated
  using (true)
  with check (true);

-- Bookings: Public can create bookings & view bookings (for availability checks); Authenticated has full CRUD
drop policy if exists "Public can view bookings" on public.bookings;
create policy "Public can view bookings"
  on public.bookings for select
  to anon, authenticated
  using (true);

drop policy if exists "Public can create bookings" on public.bookings;
create policy "Public can create bookings"
  on public.bookings for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Authenticated owner can manage bookings" on public.bookings;
create policy "Authenticated owner can manage bookings"
  on public.bookings for all
  to authenticated
  using (true)
  with check (true);

-- Protocol Bookings: Public can submit & read; Authenticated has full CRUD
drop policy if exists "Public can view protocol bookings" on public.protocol_bookings;
create policy "Public can view protocol bookings"
  on public.protocol_bookings for select
  to anon, authenticated
  using (true);

drop policy if exists "Public can create protocol bookings" on public.protocol_bookings;
create policy "Public can create protocol bookings"
  on public.protocol_bookings for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Authenticated owner can manage protocol bookings" on public.protocol_bookings;
create policy "Authenticated owner can manage protocol bookings"
  on public.protocol_bookings for all
  to authenticated
  using (true)
  with check (true);

-- Client Book: Read/write for authenticated owner (and anon fallback while in demo mode if needed)
drop policy if exists "Allow access to client_book" on public.client_book;
create policy "Allow access to client_book"
  on public.client_book for all
  to anon, authenticated
  using (true)
  with check (true);

-- Accolades: Public read; Authenticated write
drop policy if exists "Public can view accolades" on public.accolades;
create policy "Public can view accolades"
  on public.accolades for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated owner can manage accolades" on public.accolades;
create policy "Authenticated owner can manage accolades"
  on public.accolades for all
  to authenticated
  using (true)
  with check (true);

-- Site Settings: Public read; Authenticated write
drop policy if exists "Public can view site settings" on public.site_settings;
create policy "Public can view site settings"
  on public.site_settings for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated owner can manage site settings" on public.site_settings;
create policy "Authenticated owner can manage site settings"
  on public.site_settings for all
  to authenticated
  using (true)
  with check (true);

-- -----------------------------------------------------------------------------
-- 9. SUPABASE STORAGE BUCKET: inventory-photos
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'inventory-photos',
  'inventory-photos',
  true,
  26214400, -- 25 MB limit
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/heic', 'image/heif']
)
on conflict (id) do update
set public = true,
    file_size_limit = 26214400,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/heic', 'image/heif'];

-- Storage RLS Policies for inventory-photos
drop policy if exists "Public read access for inventory-photos" on storage.objects;
create policy "Public read access for inventory-photos"
  on storage.objects for select
  to public
  using (bucket_id = 'inventory-photos');

drop policy if exists "Authenticated upload access for inventory-photos" on storage.objects;
create policy "Authenticated upload access for inventory-photos"
  on storage.objects for insert
  to authenticated, anon
  with check (bucket_id = 'inventory-photos');

drop policy if exists "Authenticated update access for inventory-photos" on storage.objects;
create policy "Authenticated update access for inventory-photos"
  on storage.objects for update
  to authenticated, anon
  using (bucket_id = 'inventory-photos');

drop policy if exists "Authenticated delete access for inventory-photos" on storage.objects;
create policy "Authenticated delete access for inventory-photos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'inventory-photos');

-- -----------------------------------------------------------------------------
-- 10. SUPABASE REALTIME CONFIGURATION
-- -----------------------------------------------------------------------------
-- Ensure tables broadcast live changes to connected clients over WebSockets
alter table public.items replica identity full;
alter table public.site_settings replica identity full;
alter table public.accolades replica identity full;
alter table public.bookings replica identity full;
alter table public.protocol_bookings replica identity full;
alter table public.client_book replica identity full;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table public.items;
    alter publication supabase_realtime add table public.site_settings;
    alter publication supabase_realtime add table public.accolades;
    alter publication supabase_realtime add table public.bookings;
    alter publication supabase_realtime add table public.protocol_bookings;
    alter publication supabase_realtime add table public.client_book;
  end if;
exception when others then
  -- Tables might already be in publication; ignore duplicate error
  null;
end $$;

