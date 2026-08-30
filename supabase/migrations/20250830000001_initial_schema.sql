-- Product Catalog Backend + Admin Dashboard — Initial Schema
-- Part 1.1 categories, 1.2 products, 1.3 looks + look_products, 1.4 storage, 1.5 RLS
-- Verified App Router: app/ exists

-- Enable pgcrypto for gen_random_uuid if not already
create extension if not exists "pgcrypto";

-- 1.1 categories
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  image_url text,
  created_at timestamptz not null default now()
);

insert into categories (name, slug) values
  ('Clothes', 'clothes'),
  ('Bags', 'bags'),
  ('Shoes', 'shoes'),
  ('Wristwatches', 'wristwatches'),
  ('Jewelry', 'jewelry')
on conflict (slug) do nothing;

-- 1.2 products
do $$ begin
  create type stock_status as enum ('in_stock', 'out_of_stock');
exception when duplicate_object then null;
end $$;

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price numeric(10,2) not null,
  category_id uuid not null references categories(id) on delete restrict,
  images text[] not null default '{}',
  stock_status stock_status not null default 'in_stock',
  created_at timestamptz not null default now()
);

create index if not exists products_category_id_idx on products(category_id);
create index if not exists products_stock_status_idx on products(stock_status);

-- 1.3 looks + look_products (hero & lookbook)
do $$ begin
  create type look_placement as enum ('hero', 'lookbook');
exception when duplicate_object then null;
end $$;

create table if not exists looks (
  id uuid primary key default gen_random_uuid(),
  placement look_placement not null,
  image_url text not null,
  caption text,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists look_products (
  look_id uuid not null references looks(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  primary key (look_id, product_id)
);

create index if not exists looks_placement_idx on looks(placement);

-- 1.4 Storage bucket: product-images (public read)
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- 1.5 RLS Policies — Highest-risk, review line-by-line
-- Enable RLS
alter table categories enable row level security;
alter table products enable row level security;
alter table looks enable row level security;
alter table look_products enable row level security;

-- Drop existing policies if re-running
drop policy if exists "Public read categories" on categories;
drop policy if exists "Public read products" on products;
drop policy if exists "Public read looks" on looks;
drop policy if exists "Public read look_products" on look_products;
drop policy if exists "Admin insert categories" on categories;
drop policy if exists "Admin insert products" on products;
drop policy if exists "Admin delete products" on products;
drop policy if exists "Admin update products" on products;
drop policy if exists "Admin insert looks" on looks;
drop policy if exists "Admin update looks" on looks;
drop policy if exists "Admin delete looks" on looks;
drop policy if exists "Admin insert look_products" on look_products;
drop policy if exists "Admin delete look_products" on look_products;

-- Public can read everything
create policy "Public read categories" on categories for select using (true);
create policy "Public read products" on products for select using (true);
create policy "Public read looks" on looks for select using (true);
create policy "Public read look_products" on look_products for select using (true);

-- Only allowlisted admin emails can write
-- Replace admin@yourdomain.com with real admin email before going live
-- Add more emails to the IN list later if client needs own login
create policy "Admin insert categories" on categories for insert
  with check (auth.jwt() ->> 'email' in ('admin@yourdomain.com'));

create policy "Admin insert products" on products for insert
  with check (auth.jwt() ->> 'email' in ('admin@yourdomain.com'));

create policy "Admin delete products" on products for delete
  using (auth.jwt() ->> 'email' in ('admin@yourdomain.com'));

create policy "Admin update products" on products for update
  using (auth.jwt() ->> 'email' in ('admin@yourdomain.com'));

create policy "Admin insert looks" on looks for insert
  with check (auth.jwt() ->> 'email' in ('admin@yourdomain.com'));

create policy "Admin update looks" on looks for update
  using (auth.jwt() ->> 'email' in ('admin@yourdomain.com'));

create policy "Admin delete looks" on looks for delete
  using (auth.jwt() ->> 'email' in ('admin@yourdomain.com'));

create policy "Admin insert look_products" on look_products for insert
  with check (auth.jwt() ->> 'email' in ('admin@yourdomain.com'));

create policy "Admin delete look_products" on look_products for delete
  using (auth.jwt() ->> 'email' in ('admin@yourdomain.com'));

-- Storage RLS: public read, admin write
-- Note: storage.objects policies use auth.role() = 'authenticated' + email allowlist
drop policy if exists "Public read product-images" on storage.objects;
drop policy if exists "Admin write product-images" on storage.objects;
drop policy if exists "Admin delete product-images" on storage.objects;

create policy "Public read product-images" on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Admin write product-images" on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.jwt() ->> 'email' in ('admin@yourdomain.com'));

create policy "Admin delete product-images" on storage.objects for delete
  using (bucket_id = 'product-images' and auth.jwt() ->> 'email' in ('admin@yourdomain.com'));

-- Optional: allow admin to update (overwrite) objects
drop policy if exists "Admin update product-images" on storage.objects;
create policy "Admin update product-images" on storage.objects for update
  using (bucket_id = 'product-images' and auth.jwt() ->> 'email' in ('admin@yourdomain.com'));
