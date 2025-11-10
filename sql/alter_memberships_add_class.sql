-- Alter memberships table: add class column
-- Run this in your Supabase SQL editor

alter table if exists public.memberships
  add column if not exists class text;

-- Optional: backfill or set default values as needed
-- update public.memberships set class = '' where class is null;