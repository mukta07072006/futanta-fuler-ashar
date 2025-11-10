-- Create a public bucket for membership images and basic policies
-- Run this in Supabase SQL editor

-- Create bucket (public read enabled)
select storage.create_bucket('memberships-images', public => true);

-- Allow public read from this bucket
create policy if not exists "Public read for memberships-images"
on storage.objects for select
to public
using (bucket_id = 'memberships-images');

-- Allow uploads (insert) to this bucket
create policy if not exists "Public upload to memberships-images"
on storage.objects for insert
to public
with check (bucket_id = 'memberships-images');