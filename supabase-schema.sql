-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/dwexnuvbhtqbbfogaogk/sql

-- Products table
create table if not exists products (
  id text primary key,
  name text not null,
  price numeric not null,
  "originalPrice" numeric,
  category text not null,
  colors text[] default '{}',
  "colorImages" jsonb default '[]',
  sizes text[] default '{}',
  images text[] default '{}',
  description text,
  rating numeric default 5,
  reviews integer default 0,
  badge text,
  created_at timestamptz default now()
);

-- Orders table
create table if not exists orders (
  id text primary key,
  customer text not null,
  email text,
  phone text,
  address text,
  items jsonb default '[]',
  total numeric not null,
  payment text,
  status text default 'Processing',
  date text,
  created_at timestamptz default now()
);

-- Reviews table
create table if not exists reviews (
  id text primary key,
  name text not null,
  rating integer not null,
  comment text not null,
  product text,
  avatar text,
  created_at timestamptz default now()
);

-- Settings table (for banners)
create table if not exists settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

-- Enable Row Level Security and allow all (public app)
alter table products enable row level security;
alter table orders enable row level security;
alter table reviews enable row level security;
alter table settings enable row level security;

create policy "Allow all" on products for all using (true) with check (true);
create policy "Allow all" on orders for all using (true) with check (true);
create policy "Allow all" on reviews for all using (true) with check (true);
create policy "Allow all" on settings for all using (true) with check (true);
