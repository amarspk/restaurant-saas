# Restaurant SaaS — Architecture Overview

## Roles

| Role | Access |
|------|--------|
| `super_admin` | Full platform access: manage all restaurants, suspend/activate, manage users |
| `restaurant_owner` | Manage their own restaurant: categories, products, orders, branches, settings |
| _Customer (anonymous)_ | Browse restaurant menu, add to cart, place orders — no account required |

## Multi-tenancy model

Each restaurant is identified by a unique `slug` (e.g. `/burgerhouse`).  
The customer-facing URL is `/:slug` — the app fetches the restaurant by slug, applies its theme color, and renders its menu.

Restaurant owners are linked to a single restaurant via the `restaurants.owner_id → profiles.id` foreign key.

## Authentication flow

```
User visits /login → signs in with Supabase Auth
  └─ Supabase creates/restores session
  └─ AuthContext fetches profile row (role, name)
  └─ AppRouter redirects based on role:
       super_admin       → /admin
       restaurant_owner  → /dashboard
```

## URL structure

| Path | Audience |
|------|----------|
| `/login`, `/register` | All |
| `/admin/*` | super_admin only |
| `/dashboard/*` | restaurant_owner only |
| `/:slug/*` | Customers (public) |

## Database design decisions

- **Bilingual first**: every user-facing text column has `_en` and `_ar` variants.
- **Snapshot pricing**: `order_items` stores `product_name_en/ar` and `unit_price` at order time to survive future product edits.
- **RLS everywhere**: all tables have Row Level Security enabled. Helpers `is_super_admin()` and `my_restaurant_id()` keep policies DRY.
- **Soft delete pattern**: restaurants use a `status` enum (`active/suspended/pending`) instead of hard deletes.
- **Theme per restaurant**: `restaurants.theme_color` is a hex string injected as a CSS variable (`--color-primary`) on the customer layout.

## Folder structure

```
src/
├── app/              # Entry point
├── router/           # AppRouter + ProtectedRoute
├── contexts/         # AuthContext (Supabase session + profile)
├── layouts/          # AdminLayout, RestaurantLayout, CustomerLayout, AuthLayout
├── pages/
│   ├── admin/        # Super-admin pages
│   ├── restaurant/   # Restaurant-owner pages
│   ├── customer/     # Customer-facing pages
│   └── auth/         # Login / Register
├── components/
│   ├── ui/           # Reusable primitives (Button, Badge, Spinner…)
│   ├── admin/        # Admin-specific components (Step 2+)
│   ├── restaurant/   # Owner-specific components (Step 2+)
│   └── customer/     # Customer-facing components (Step 2+)
├── hooks/            # Data hooks (useMyRestaurant, useCategories…)
├── stores/           # Zustand stores (cartStore)
├── lib/              # supabase client, utils
├── types/            # TypeScript types (auth, restaurant, order, database)
└── i18n/             # i18next config + en/ar locale files
supabase/
├── schema.sql        # Full schema with RLS
└── README.md         # Setup instructions
```

## Step roadmap

| Step | Focus |
|------|-------|
| ✅ 1 | Folder structure, schema, auth architecture, roles |
| 2 | Admin panel: restaurant CRUD, suspend/activate, user list |
| 3 | Restaurant owner panel: categories, products, product images |
| 4 | Customer website: category cards, product listing, cart |
| 5 | Checkout flow, order creation, order management |
| 6 | Branches, settings, theme customization, logo upload |
| 7 | Polish: mobile-first, RTL, responsive, real-time order updates |
