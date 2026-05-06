# Supabase Setup

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local`.
3. Fill in `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SECRET_KEY`.
4. Open the Supabase SQL Editor and run `supabase/schema.sql`.
5. If you want the current sample data, run `supabase/seed.sql`.

This project uses the server-only secret key for database access through Next.js Route Handlers and Server Components.
Do not expose `SUPABASE_SECRET_KEY` in the browser.
