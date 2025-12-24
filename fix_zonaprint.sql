-- FIX SCRIPT FOR ZONAPRINT (UPDATED v2)
-- Run this in Supabase SQL Editor

-- 1. Add order_id to reviews table if missing and make product_id nullable
ALTER TABLE public.reviews 
ADD COLUMN IF NOT EXISTS order_id TEXT;

ALTER TABLE public.reviews 
ALTER COLUMN product_id DROP NOT NULL;

-- 2. Storage Policies (Reset to Permissive)
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Products" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert Products" ON storage.objects;
DROP POLICY IF EXISTS "Public Update Products" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Products" ON storage.objects;

CREATE POLICY "Public Read Products" ON storage.objects FOR SELECT USING ( bucket_id = 'products' );
CREATE POLICY "Public Insert Products" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'products' );
CREATE POLICY "Public Update Products" ON storage.objects FOR UPDATE USING ( bucket_id = 'products' );
CREATE POLICY "Public Delete Products" ON storage.objects FOR DELETE USING ( bucket_id = 'products' );

-- 3. Reviews Policies
DROP POLICY IF EXISTS "Authenticated Insert Reviews" ON public.reviews;
DROP POLICY IF EXISTS "Public Insert Reviews" ON public.reviews;
DROP POLICY IF EXISTS "Public Read Reviews" ON public.reviews;

CREATE POLICY "Public Insert Reviews" ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Reviews" ON public.reviews FOR SELECT USING (true);

-- 4. Questionnaires Table (New)
CREATE TABLE IF NOT EXISTS public.questionnaires (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    order_id TEXT NOT NULL,
    answers JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Questionnaire Policies
ALTER TABLE public.questionnaires ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Insert Questionnaires" 
ON public.questionnaires FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public Read Questionnaires" 
ON public.questionnaires FOR SELECT 
USING (true); -- Admins need to read this, for prototypes public read is easier
