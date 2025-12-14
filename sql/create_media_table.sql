-- Media table to store archive photos and videos (external URLs)
CREATE TABLE IF NOT EXISTS public.media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('photo','video')),
    title TEXT NULL,
    description TEXT NULL,
    url TEXT NOT NULL,
    thumbnail TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS and allow public read (you may tighten later)
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for media" ON public.media
    FOR SELECT USING (true);

-- Allow inserts from authenticated users (optional)
CREATE POLICY "Authenticated insert media" ON public.media
    FOR INSERT TO authenticated
    WITH CHECK (type IN ('photo','video') AND url IS NOT NULL);

-- Helpful index for filtering by type
CREATE INDEX IF NOT EXISTS media_type_idx ON public.media (type);

