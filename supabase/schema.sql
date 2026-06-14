-- ============================================================
-- Restaurant SaaS — Complete Database Schema
-- Apply via Supabase SQL editor or `supabase db push`
-- ============================================================

-- ── Extensions ──────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Enums ───────────────────────────────────────────────────
create type user_role as enum ('super_admin', 'restaurant_owner');
create type restaurant_status as enum ('active', 'suspended', 'pending');
create type order_status as enum (
  'pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'
);

-- ── profiles ────────────────────────────────────────────────
-- One row per auth.users record. Created automatically via trigger.
create table profiles (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid unique not null references auth.users (id) on delete cascade,
  role        user_role not null default 'restaurant_owner',
  full_name   text,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── restaurants ─────────────────────────────────────────────
create table restaurants (
  id           uuid primary key default uuid_generate_v4(),
  owner_id     uuid not null references profiles (id) on delete cascade,
  name_en      text not null,
  name_ar      text not null,
  slug         text unique not null,            -- used in customer URL /:slug
  logo_url     text,
  theme_color  text not null default '#e85d04', -- hex colour
  status       restaurant_status not null default 'pending',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ── branches ────────────────────────────────────────────────
create table branches (
  id             uuid primary key default uuid_generate_v4(),
  restaurant_id  uuid not null references restaurants (id) on delete cascade,
  name_en        text not null,
  name_ar        text not null,
  address_en     text,
  address_ar     text,
  phone          text,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now()
);

-- ── categories ──────────────────────────────────────────────
create table categories (
  id             uuid primary key default uuid_generate_v4(),
  restaurant_id  uuid not null references restaurants (id) on delete cascade,
  name_en        text not null,
  name_ar        text not null,
  image_url      text,
  sort_order     int not null default 0,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now()
);

-- ── products ────────────────────────────────────────────────
create table products (
  id              uuid primary key default uuid_generate_v4(),
  restaurant_id   uuid not null references restaurants (id) on delete cascade,
  category_id     uuid not null references categories (id) on delete cascade,
  name_en         text not null,
  name_ar         text not null,
  description_en  text,
  description_ar  text,
  price           numeric(10, 2) not null check (price >= 0),
  is_available    boolean not null default true,
  sort_order      int not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ── product_images ──────────────────────────────────────────
create table product_images (
  id          uuid primary key default uuid_generate_v4(),
  product_id  uuid not null references products (id) on delete cascade,
  url         text not null,
  is_primary  boolean not null default false,
  sort_order  int not null default 0
);

-- ── orders ──────────────────────────────────────────────────
create table orders (
  id               uuid primary key default uuid_generate_v4(),
  restaurant_id    uuid not null references restaurants (id) on delete cascade,
  branch_id        uuid references branches (id) on delete set null,
  customer_name    text not null,
  customer_phone   text not null,
  customer_notes   text,
  status           order_status not null default 'pending',
  total_amount     numeric(10, 2) not null check (total_amount >= 0),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ── order_items ─────────────────────────────────────────────
create table order_items (
  id               uuid primary key default uuid_generate_v4(),
  order_id         uuid not null references orders (id) on delete cascade,
  product_id       uuid not null references products (id) on delete restrict,
  product_name_en  text not null, -- snapshot at order time
  product_name_ar  text not null,
  quantity         int not null check (quantity > 0),
  unit_price       numeric(10, 2) not null check (unit_price >= 0),
  subtotal         numeric(10, 2) not null check (subtotal >= 0)
);

-- ============================================================
-- Indexes
-- ============================================================
create index on restaurants (slug);
create index on restaurants (owner_id);
create index on branches (restaurant_id);
create index on categories (restaurant_id, sort_order);
create index on products (restaurant_id, category_id, sort_order);
create index on product_images (product_id);
create index on orders (restaurant_id, created_at desc);
create index on order_items (order_id);

-- ============================================================
-- Triggers — auto-update updated_at
-- ============================================================
create or replace function handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at_profiles
  before update on profiles
  for each row execute procedure handle_updated_at();

create trigger set_updated_at_restaurants
  before update on restaurants
  for each row execute procedure handle_updated_at();

create trigger set_updated_at_products
  before update on products
  for each row execute procedure handle_updated_at();

create trigger set_updated_at_orders
  before update on orders
  for each row execute procedure handle_updated_at();

-- ============================================================
-- Trigger — auto-create profile on signup
-- ============================================================
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (user_id, full_name, role)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    coalesce(
      (new.raw_user_meta_data ->> 'role')::user_role,
      'restaurant_owner'
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
alter table profiles       enable row level security;
alter table restaurants    enable row level security;
alter table branches       enable row level security;
alter table categories     enable row level security;
alter table products       enable row level security;
alter table product_images enable row level security;
alter table orders         enable row level security;
alter table order_items    enable row level security;

-- ── Helper: is the current user a super_admin? ────────────
create or replace function is_super_admin()
returns boolean language sql security definer as $$
  select exists (
    select 1 from profiles
    where user_id = auth.uid() and role = 'super_admin'
  );
$$;

-- ── Helper: restaurant_id owned by the current user ───────
create or replace function my_restaurant_id()
returns uuid language sql security definer as $$
  select id from restaurants
  where owner_id = (select id from profiles where user_id = auth.uid())
  limit 1;
$$;

-- ── profiles ──────────────────────────────────────────────
create policy "Users can read their own profile"
  on profiles for select using (user_id = auth.uid() or is_super_admin());

create policy "Users can update their own profile"
  on profiles for update using (user_id = auth.uid());

create policy "Super admin can manage all profiles"
  on profiles for all using (is_super_admin());

-- ── restaurants ──────────────────────────────────────────
create policy "Super admin full access to restaurants"
  on restaurants for all using (is_super_admin());

create policy "Owner can read their restaurant"
  on restaurants for select
  using (owner_id = (select id from profiles where user_id = auth.uid()));

create policy "Owner can update their restaurant"
  on restaurants for update
  using (owner_id = (select id from profiles where user_id = auth.uid()));

create policy "Public can read active restaurants"
  on restaurants for select using (status = 'active');

-- ── branches ─────────────────────────────────────────────
create policy "Owner manages their branches"
  on branches for all
  using (restaurant_id = my_restaurant_id() or is_super_admin());

create policy "Public can read active branches"
  on branches for select
  using (is_active = true and restaurant_id in (
    select id from restaurants where status = 'active'
  ));

-- ── categories ───────────────────────────────────────────
create policy "Owner manages their categories"
  on categories for all
  using (restaurant_id = my_restaurant_id() or is_super_admin());

create policy "Public can read active categories"
  on categories for select
  using (is_active = true and restaurant_id in (
    select id from restaurants where status = 'active'
  ));

-- ── products ─────────────────────────────────────────────
create policy "Owner manages their products"
  on products for all
  using (restaurant_id = my_restaurant_id() or is_super_admin());

create policy "Public can read available products"
  on products for select
  using (is_available = true and restaurant_id in (
    select id from restaurants where status = 'active'
  ));

-- ── product_images ───────────────────────────────────────
create policy "Owner manages product images"
  on product_images for all
  using (product_id in (
    select id from products where restaurant_id = my_restaurant_id()
  ) or is_super_admin());

create policy "Public can read product images"
  on product_images for select
  using (product_id in (select id from products where is_available = true));

-- ── orders ───────────────────────────────────────────────
create policy "Owner reads their orders"
  on orders for select
  using (restaurant_id = my_restaurant_id() or is_super_admin());

create policy "Owner updates their orders"
  on orders for update
  using (restaurant_id = my_restaurant_id() or is_super_admin());

create policy "Anyone can insert an order for an active restaurant"
  on orders for insert with check (
    restaurant_id in (select id from restaurants where status = 'active')
  );

-- ── order_items ──────────────────────────────────────────
create policy "Owner reads order items"
  on order_items for select
  using (order_id in (
    select id from orders where restaurant_id = my_restaurant_id()
  ) or is_super_admin());

create policy "Anyone can insert order items"
  on order_items for insert with check (
    order_id in (select id from orders where restaurant_id in (
      select id from restaurants where status = 'active'
    ))
  );

-- ============================================================
-- Storage buckets (run after enabling storage extension)
-- ============================================================
-- insert into storage.buckets (id, name, public) values
--   ('restaurant-logos', 'restaurant-logos', true),
--   ('product-images', 'product-images', true);
