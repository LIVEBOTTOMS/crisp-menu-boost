-- Debug script to check venues table
-- Run this in Supabase SQL Editor to see what's happening

-- 1. Check all venues in the database
SELECT 
    id,
    name,
    slug,
    is_active,
    owner_id,
    is_public,
    created_at,
    created_by
FROM venues 
ORDER BY created_at DESC;

-- 2. Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'venues';

-- 3. List all policies on venues table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'venues';

-- 4. Test the query as your user would see it
SELECT * FROM venues;
