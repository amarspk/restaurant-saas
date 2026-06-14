# Supabase Setup Guide

## 1. Create a Supabase project
Go to https://app.supabase.com and create a new project.

## 2. Apply the schema
In the Supabase SQL editor, run the contents of `schema.sql`.

## 3. Enable Storage
In the Storage section, create two public buckets:
- `restaurant-logos`
- `product-images`

Then uncomment the storage bucket section at the bottom of `schema.sql` and run it.

## 4. Configure environment variables
Copy `.env.example` to `.env.local` and fill in:
```
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

## 5. Create the super admin user
After running the schema, manually update the profile role for your admin user:
```sql
update profiles
set role = 'super_admin'
where user_id = '<your-user-uuid>';
```

## 6. Generate types (optional but recommended)
```bash
npx supabase gen types typescript --project-id <your-project-id> > src/types/database.ts
```
