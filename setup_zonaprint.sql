-- ZONAPRINT SETUP SCRIPT
-- Run this in Supabase SQL Editor to fix "Bucket not found" and setup Reviews.

-- 1. Create 'products' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow Public Read Access to 'products' bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'products' );

-- 3. Allow Authenticated Users to Upload to 'products' bucket
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'products' );

-- 4. Create Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id TEXT NOT NULL, -- using TEXT because our product IDs are like 'prd-xyz'
    user_id UUID NOT NULL,    -- links to auth.users or public.users
    user_name TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Add RLS for Reviews (Optional, but good practice)
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Reviews"
ON public.reviews FOR SELECT
USING (true);

CREATE POLICY "Authenticated Insert Reviews"
ON public.reviews FOR INSERT
TO authenticated
WITH CHECK (true);
