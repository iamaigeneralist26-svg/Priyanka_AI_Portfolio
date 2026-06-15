Supabase setup for `contact_submissions`

This file contains SQL and steps to create the `contact_submissions` table and a policy that allows anonymous (public) inserts from your frontend.

1) Run this SQL (Supabase SQL editor):

```sql
create table if not exists public.contact_submissions (
  id serial primary key,
  full_name text,
  email text,
  subject text,
  message text,
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS) if you want it enabled, then create a policy to allow anonymous inserts.
-- If you prefer not to use RLS, you may skip enabling it. However, Supabase projects created after 2021 have RLS enabled by default.

-- Enable RLS (optional; Supabase projects often have RLS enabled by default)
-- alter table public.contact_submissions enable row level security;

-- Policy to allow anonymous (public) inserts
create policy "Allow anon inserts" on public.contact_submissions
  for insert
  with check (true);

-- Grant insert permission to anon role (usually unnecessary if policy exists)
grant insert on public.contact_submissions to anon;
```

2) UI steps (alternative):
- Open Supabase Console → Table Editor → Create table `contact_submissions` with columns shown above.
- In the table view, go to "Policies" → "New Policy" and choose a template that allows inserts by everyone (or create a custom policy with `WITH CHECK (true)`).

3) Security notes:
- Allowing public inserts (`WITH CHECK (true)`) means anyone with your anon key can write to the table. This is common for contact forms but consider adding moderation, captcha, or server-side validation if spam is a concern.
- If you need stricter control, consider creating a server-side endpoint that uses the `service_role` key (kept secret) to write to the table.

4) After running the SQL or enabling the policy, reload your contact page and try submitting the form again. The RLS error should no longer occur.
