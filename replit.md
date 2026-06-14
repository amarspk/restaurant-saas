# Restaurant SaaS

A multi-tenant restaurant ordering platform built with React, TypeScript, Supabase, and Tailwind CSS.

## Setup

1. Create a Supabase project at https://app.supabase.com
2. Run `supabase/schema.sql` in the Supabase SQL editor
3. Copy `.env.example` to `.env.local` and fill in your Supabase URL and anon key
4. `pnpm install`
5. `pnpm dev`

See `supabase/README.md` for full setup instructions.

## User preferences

- Bilingual: Arabic (RTL) + English (LTR)
- Mobile-first customer UI
- Theme color is per-restaurant (CSS variable)
- Build step by step — stop and wait after each step for approval
