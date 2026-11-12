-- =============================================================================
-- Uno Fashion Agency Rental & Inventory Platform
-- Seed Data: Initial Catalog, Bookings, Accolades, Client Book, & Site Settings
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. SEED ITEMS (Rental Catalog)
-- -----------------------------------------------------------------------------
insert into public.items (
  id, slug, name, sku, category, category_slug, color, fabric, fit,
  description, rental_price, refundable_deposit, rental_period_days,
  images, sizes, size_range, simple_status, condition, stock_by_size,
  total_stock, ready_stock, rented_stock, in_care_stock, status,
  allow_online_booking, cleaning_turnaround_days, badge
) values
(
  'item-1',
  'the-windsor-tuxedo',
  'The Windsor Tuxedo',
  'SU-001',
  'Tuxedo',
  'suits',
  'Black',
  'Italian wool · Silk lapel',
  'Modern tailored silhouette. Jacket & trousers included.',
  'Classic black tuxedo in Italian wool with a silk shawl lapel. Includes jacket and trousers.',
  185000,
  150000,
  4,
  array[
    '/images/hero-men.jpg',
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200'
  ],
  array['36', '38', '40', '42', '44'],
  '36–44',
  'Available',
  'Excellent',
  '[
    {"size": "UK 36", "total": 1, "rented": 0, "care": 0, "ready": 1, "reserved": 0},
    {"size": "UK 38", "total": 2, "rented": 1, "care": 0, "ready": 1, "reserved": 0},
    {"size": "UK 40", "total": 3, "rented": 1, "care": 0, "ready": 2, "reserved": 1},
    {"size": "UK 42", "total": 2, "rented": 0, "care": 0, "ready": 2, "reserved": 0},
    {"size": "UK 44", "total": 1, "rented": 0, "care": 1, "ready": 0, "reserved": 0}
  ]'::jsonb,
  9, 6, 2, 1,
  'Published',
  true,
  1,
  'Bestseller'
),
(
  'item-2',
  'the-celeste-gown',
  'The Céleste Gown',
  'BR-001',
  'Bridal gowns',
  'gowns',
  'Ivory',
  'Silk mikado',
  'Structured draped bodice with sweeping chapel train.',
  'Strapless silk mikado gown with architectural drapery and a regal cathedral silhouette.',
  320000,
  250000,
  4,
  array[
    'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1546804784-896d0dca3805?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200'
  ],
  array['8', '10', '12', '14'],
  '8–14',
  'Available',
  'Excellent',
  '[
    {"size": "UK 8", "total": 1, "rented": 0, "care": 0, "ready": 1, "reserved": 0},
    {"size": "UK 10", "total": 2, "rented": 1, "care": 0, "ready": 1, "reserved": 0},
    {"size": "UK 12", "total": 2, "rented": 0, "care": 0, "ready": 2, "reserved": 0},
    {"size": "UK 14", "total": 1, "rented": 0, "care": 0, "ready": 1, "reserved": 0}
  ]'::jsonb,
  6, 5, 1, 0,
  'Published',
  true,
  2,
  'Atelier favourite'
),
(
  'item-3',
  'the-oxford-suit',
  'The Oxford Suit',
  'SU-002',
  'Suits',
  'suits',
  'Midnight navy',
  'Super 130s wool',
  'Contemporary tailored fit with slim trousers.',
  'Refined midnight navy wool suit featuring hand-finished lapels and horn buttons.',
  145000,
  100000,
  4,
  array[
    'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1200'
  ],
  array['36', '38', '40', '42', '44'],
  '36–44',
  'Available',
  'Excellent',
  '[
    {"size": "UK 36", "total": 1, "rented": 0, "care": 0, "ready": 1, "reserved": 0},
    {"size": "UK 38", "total": 2, "rented": 0, "care": 0, "ready": 2, "reserved": 0},
    {"size": "UK 40", "total": 2, "rented": 1, "care": 0, "ready": 1, "reserved": 0},
    {"size": "UK 42", "total": 2, "rented": 0, "care": 0, "ready": 2, "reserved": 0},
    {"size": "UK 44", "total": 1, "rented": 0, "care": 0, "ready": 1, "reserved": 0}
  ]'::jsonb,
  8, 7, 1, 0,
  'Published',
  true,
  1,
  null
),
(
  'item-4',
  'the-amelie-gown',
  'The Amélie Gown',
  'BR-002',
  'Bridal gowns',
  'gowns',
  'Ivory',
  'Lace & crepe',
  'Fluid sheath column with sheer lace illusion sleeves.',
  'Romantic French lace and soft silk crepe gown featuring an open back and delicate buttons.',
  285000,
  250000,
  4,
  array[
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&q=80&w=1200'
  ],
  array['6', '8', '10', '12'],
  '6–12',
  'Rented',
  'Good',
  '[
    {"size": "UK 6", "total": 1, "rented": 0, "care": 0, "ready": 1, "reserved": 0},
    {"size": "UK 8", "total": 2, "rented": 1, "care": 0, "ready": 1, "reserved": 0},
    {"size": "UK 10", "total": 1, "rented": 0, "care": 1, "ready": 0, "reserved": 0},
    {"size": "UK 12", "total": 1, "rented": 0, "care": 0, "ready": 1, "reserved": 0}
  ]'::jsonb,
  5, 3, 1, 1,
  'Published',
  true,
  2,
  null
),
(
  'item-5',
  'the-riviera-suit',
  'The Riviera Suit',
  'SU-003',
  'Suits',
  'suits',
  'Sand',
  'Pure Italian linen',
  'Relaxed tailored jacket with pleated linen trousers.',
  'Bespoke breathable natural linen suit crafted for destination celebrations and outdoor receptions.',
  155000,
  100000,
  4,
  array[
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200'
  ],
  array['38', '40', '42', '44'],
  '38–44',
  'Available',
  'Excellent',
  '[
    {"size": "UK 38", "total": 2, "rented": 0, "care": 0, "ready": 2, "reserved": 0},
    {"size": "UK 40", "total": 2, "rented": 0, "care": 0, "ready": 2, "reserved": 0},
    {"size": "UK 42", "total": 1, "rented": 0, "care": 0, "ready": 1, "reserved": 0},
    {"size": "UK 44", "total": 1, "rented": 0, "care": 0, "ready": 1, "reserved": 0}
  ]'::jsonb,
  6, 6, 0, 0,
  'Published',
  true,
  1,
  'New arrival'
),
(
  'item-6',
  'the-cathedral-veil',
  'The Cathedral Veil',
  'AC-001',
  'Accessories',
  'veils',
  'Ivory',
  'Silk tulle',
  '300cm extended cathedral length with silver comb.',
  'Hand-cut translucent bridal veil with floating lace accents for dramatic elegance.',
  45000,
  50000,
  4,
  array[
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1200'
  ],
  array['One size'],
  'One size',
  'Dry cleaning',
  'Good',
  '[
    {"size": "One size", "total": 4, "rented": 0, "care": 1, "ready": 3, "reserved": 0}
  ]'::jsonb,
  4, 3, 0, 1,
  'Published',
  true,
  1,
  null
),
(
  'item-7',
  'ivory-cream-double-breasted',
  'Ivory Cream Double-Breasted Suit',
  'SU-004',
  'Suits',
  'suits',
  'Ivory Cream',
  'Italian wool blend',
  'Tailored double-breasted jacket with tapered trousers.',
  'Statement ivory cream formal suit ideal for grooms and black-tie summer receptions.',
  165000,
  120000,
  4,
  array[
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1200'
  ],
  array['38', '40', '42', '44'],
  '38–44',
  'Available',
  'Excellent',
  '[
    {"size": "UK 38", "total": 1, "rented": 0, "care": 0, "ready": 1, "reserved": 0},
    {"size": "UK 40", "total": 2, "rented": 0, "care": 0, "ready": 2, "reserved": 0},
    {"size": "UK 42", "total": 2, "rented": 0, "care": 0, "ready": 2, "reserved": 0},
    {"size": "UK 44", "total": 1, "rented": 0, "care": 0, "ready": 1, "reserved": 0}
  ]'::jsonb,
  6, 6, 0, 0,
  'Published',
  true,
  1,
  null
),
(
  'item-8',
  'charcoal-pinstripe-bespoke',
  'Charcoal Pinstripe Bespoke',
  'SU-005',
  'Suits',
  'suits',
  'Charcoal Grey',
  'Merino wool',
  'Classic Savile Row cut.',
  'Timeless charcoal grey pinstripe suit with peak lapels.',
  150000,
  100000,
  4,
  array[
    'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&q=80&w=1200'
  ],
  array['38', '40', '42', '44', '46'],
  '38–46',
  'Available',
  'Excellent',
  '[
    {"size": "UK 40", "total": 3, "rented": 0, "care": 0, "ready": 3, "reserved": 0},
    {"size": "UK 42", "total": 2, "rented": 0, "care": 0, "ready": 2, "reserved": 0}
  ]'::jsonb,
  5, 5, 0, 0,
  'Published',
  true,
  1,
  null
)
on conflict (id) do update set
  name = excluded.name,
  rental_price = excluded.rental_price,
  simple_status = excluded.simple_status,
  stock_by_size = excluded.stock_by_size;

-- -----------------------------------------------------------------------------
-- 2. SEED BOOKINGS
-- -----------------------------------------------------------------------------
insert into public.bookings (
  id, booking_number, customer_name, customer_email, customer_phone,
  customer_address, type, item_id, item_name, item_sku, size,
  pickup_date, return_date, rental_fee, deposit_fee, total_amount,
  payment_status, status, occasion, created_at_label, created_time_label
) values
(
  'bk-1048',
  '#UF-1048',
  'Amelia Bennett',
  'amelia.bennett@email.com',
  '+250 788 306 953',
  'Kiyovu, Kigali',
  'Online',
  'item-1',
  'The Windsor Tuxedo',
  'SU-001',
  'UK 40',
  '2026-11-13',
  '2026-11-17',
  185000,
  150000,
  185000,
  'Paid',
  'Confirmed',
  'Gala Night',
  'Nov 4',
  '03:51 PM'
),
(
  'bk-1047',
  '#UF-1047',
  'Sofia Williams',
  'sofia.williams@email.com',
  '+250 789 578 226',
  'Nyarutarama, Kigali',
  'Online',
  'item-2',
  'The Céleste Gown',
  'BR-001',
  'UK 10',
  '2026-11-12',
  '2026-11-16',
  320000,
  250000,
  320000,
  'Paid',
  'Confirmed',
  'Wedding Ceremony',
  'Nov 3',
  '02:15 PM'
),
(
  'bk-1046',
  '#UF-1046',
  'James Clarke',
  'james.clarke@email.com',
  '+250 782 648 624',
  'Kimihurura, Kigali',
  'Online',
  'item-3',
  'The Oxford Suit',
  'SU-002',
  'UK 42',
  '2026-11-10',
  '2026-11-14',
  145000,
  100000,
  145000,
  'Paid',
  'Delivered',
  'Corporate Anniversary',
  'Nov 1',
  '11:30 AM'
),
(
  'bk-1045',
  '#UF-1045',
  'Noah Thompson',
  'noah.thompson@email.com',
  '+250 780 900 407',
  'Kacyiru, Kigali',
  'Online',
  'item-1',
  'The Windsor Tuxedo',
  'SU-001',
  'UK 38',
  '2026-11-13',
  '2026-11-17',
  185000,
  150000,
  185000,
  'Unpaid',
  'Pending',
  'Award Banquet',
  'Nov 5',
  '09:40 AM'
),
(
  'bk-1042',
  '#UF-1042',
  'Daniel Mugabo',
  'daniel.mugabo@email.com',
  '+250 788 254 768',
  'Remera, Kigali',
  'Online',
  'item-5',
  'The Riviera Suit',
  'SU-003',
  'UK 40',
  '2026-11-01',
  '2026-11-05',
  155000,
  100000,
  155000,
  'Paid',
  'Delivered',
  null,
  'Oct 30',
  '04:20 PM'
),
(
  'bk-1041',
  '#UF-1041',
  'Emma Uwase',
  'emma.uwase@email.com',
  '+250 798 854 795',
  'Nyarutarama, Kigali',
  'Online',
  'item-4',
  'The Amélie Gown',
  'BR-002',
  'UK 8',
  '2026-10-28',
  '2026-11-01',
  285000,
  250000,
  285000,
  'Paid',
  'Completed',
  null,
  'Oct 26',
  '10:15 AM'
)
on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- 3. SEED PROTOCOL BOOKINGS
-- -----------------------------------------------------------------------------
insert into public.protocol_bookings (
  id, booking_number, customer_name, customer_phone, event_date,
  service_type, party_size, venue, notes, status
) values
(
  'proto-102',
  'PR-102',
  'Hon. Patrick Karegeya',
  '+250 783 910 220',
  '2026-12-05',
  'VIP Gala & Stage Reception Protocol',
  'Executive Delegation (4 VIPs)',
  'Kigali Convention Centre (KCC)',
  'Red carpet entrance protocol and on-stage award presentation escort.',
  'Completed'
)
on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- 4. SEED CLIENT BOOK (Out / Returned / Fitting)
-- -----------------------------------------------------------------------------
insert into public.client_book (
  id, date_logged, time_logged, client_name, telephone,
  national_id, outfit_taken, return_due, status
) values
(
  'cb-1',
  'Nov 5, 2026',
  '03:51 PM',
  'Dan Habimana',
  '0786925058 / 0788306953',
  '1 1995 8 0041293 0 42',
  'The Windsor Tuxedo (UK 40) + Silk Bowtie',
  '2026-11-08',
  'OUT'
),
(
  'cb-2',
  'Nov 5, 2026',
  '02:42 PM',
  'Claudine Ingabire',
  '0789578226',
  '1 1998 7 0092184 1 18',
  'The Céleste Gown (UK 10) + Cathedral Veil',
  '2026-11-08',
  'OUT'
),
(
  'cb-3',
  'Nov 5, 2026',
  '01:04 PM',
  'Emmy Shema',
  '0782648624',
  '1 1993 8 0019283 0 75',
  'The Riviera Suit (UK 42) — Sand Linen',
  '2026-11-08',
  'OUT'
),
(
  'cb-4',
  'Nov 4, 2026',
  '05:58 PM',
  'Aime Niyigaba',
  '0780900407',
  '1 1996 8 0074612 0 11',
  'Charcoal Pinstripe Bespoke (UK 40)',
  '2026-11-07',
  'OUT'
),
(
  'cb-5',
  'Nov 4, 2026',
  '05:19 PM',
  'Patrick Mugabo',
  '0788254768',
  '1 1991 8 0051829 0 64',
  'The Oxford Suit (UK 42) — Midnight Navy',
  '2026-11-07',
  'RETURNED'
),
(
  'cb-6',
  'Nov 4, 2026',
  '11:42 AM',
  'Grace Uwimana',
  '0798854795',
  '1 1999 7 0038192 1 09',
  'The Amélie Gown (UK 8) — Bridal Fitting',
  '2026-11-07',
  'FITTING'
)
on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- 5. SEED ACCOLADES
-- -----------------------------------------------------------------------------
insert into public.accolades (
  id, title, category, year, image, featured_person, badge, sort_order
) values
(
  'acc-1',
  'Kigali Fashion Week Gala',
  'Celebrity',
  '2026',
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
  'VIP Red Carpet Gala',
  'Celebrity Red Carpet',
  1
),
(
  'acc-2',
  'Master Sartorial Tailoring Certification',
  'Certification',
  '2025',
  'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&q=80&w=800',
  'European Bespoke Guild',
  'Certified Master Tailor',
  2
),
(
  'acc-3',
  'East African Music Awards Fitting',
  'Celebrity',
  '2025',
  'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800',
  'Headlining Artist Styling',
  'Stage & Gala Wear',
  3
),
(
  'acc-4',
  'National Protocol Styling Excellence',
  'Award',
  '2026',
  'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&q=80&w=800',
  'Rwanda Protocol Honors',
  'Official Recognition',
  4
),
(
  'acc-5',
  'Pan-African Couture & Suiting Summit',
  'Press',
  '2025',
  'https://images.unsplash.com/photo-1521341057461-6eb5f40b07ab?auto=format&fit=crop&q=80&w=800',
  'Keynote Designer Showcase',
  'Accreditation',
  5
),
(
  'acc-6',
  'Diplomatic Gala & State Banquet Styling',
  'Celebrity',
  '2026',
  'https://images.unsplash.com/photo-1555069519-127aadedf1ee?auto=format&fit=crop&q=80&w=800',
  'Dignitary Black Tie',
  'State Honors',
  6
)
on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- 6. SEED SITE SETTINGS (Hero Configuration & Protocol Photos)
-- -----------------------------------------------------------------------------
insert into public.site_settings (key, value)
values (
  'hero_config',
  '{
    "image": "/images/landing-page-3.jpeg",
    "alt": "Uno Fashion Agency - Tailoring & Wedding Protocol in Kigali",
    "headlinePrefix": "TAILORING — WITH",
    "headlineHighlight": "QUIET AUTHORITY",
    "subtitle": "Uno Fashion Agency Ltd provides bespoke suit rentals, tuxedos, and wedding protocol services to ensure you make an indelible impression across Kigali.",
    "updatedAt": "2026-11-12T12:00:00.000Z"
  }'::jsonb
)
on conflict (key) do update
set value = excluded.value;

insert into public.site_settings (key, value)
values (
  'protocol_photos',
  '[
    {
      "id": "proto-photo-1",
      "title": "Wardrobe Alignment",
      "caption": "Synchronized tuxedos, cuts, and accessories for the bridal squad.",
      "image": "/images/landing-page-1.jpeg"
    },
    {
      "id": "proto-photo-2",
      "title": "Entrance Etiquette",
      "caption": "Ceremonial walking cadence, aisle pacing, and stage presence.",
      "image": "/images/landing-page-2.jpeg"
    },
    {
      "id": "proto-photo-3",
      "title": "Day-Of Suite Dressing",
      "caption": "On-site steaming, Windsor knotting, and boutonnière pinning.",
      "image": "/images/hero-men.jpg"
    },
    {
      "id": "proto-photo-4",
      "title": "VIP & Gala Composure",
      "caption": "High-profile hosting protocol and stage reception etiquette.",
      "image": "/images/landing-page-3.jpeg"
    }
  ]'::jsonb
)
on conflict (key) do update
set value = excluded.value;

