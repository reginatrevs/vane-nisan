-- ============================================================
--  Nişan RSVP schema
--  Run this in Regina's Supabase project:
--  Dashboard -> SQL Editor -> New query -> paste -> Run
-- ============================================================

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),

  -- Short human-friendly confirmation code, e.g. "K7M2QX"
  code text not null unique,

  -- Name as typed by the guest
  name text not null,
  -- Case/accent-folded copy of the name, kept for sorting and for spotting
  -- duplicates by eye on the guest list.
  name_key text not null,

  attending boolean not null,

  -- Total people in the party INCLUDING the person replying.
  -- The upper bound is a sanity cap against typos, not a real limit.
  -- Keep in sync with `maxGuests` in content/event.ts (cap = maxGuests + 1).
  party_size integer not null default 1
    check (party_size >= 1 and party_size <= 21),

  note text,
  locale text not null default 'en' check (locale in ('en', 'es', 'tr')),

  cancelled boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Names are deliberately NOT unique: two guests can share a name, and it is
-- kinder to let someone reply twice than to block them. Vanessa deletes any
-- true duplicates from the guest list herself.

create index if not exists rsvps_created_at_idx
  on public.rsvps (created_at desc);

-- Keep updated_at fresh
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists rsvps_touch_updated_at on public.rsvps;
create trigger rsvps_touch_updated_at
  before update on public.rsvps
  for each row execute function public.touch_updated_at();

-- ------------------------------------------------------------
--  Row Level Security
--  The public site NEVER talks to this table directly.
--  All access goes through Next.js server routes using the
--  service role key, so we lock the anon role out entirely.
-- ------------------------------------------------------------
alter table public.rsvps enable row level security;

-- No policies = no access for anon / authenticated roles.
-- (service_role bypasses RLS by design.)

revoke all on public.rsvps from anon, authenticated;
