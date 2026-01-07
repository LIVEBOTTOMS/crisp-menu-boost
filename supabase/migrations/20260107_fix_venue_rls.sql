-- Check and fix RLS policies for venues table to show ALL venues to admins
-- Run this in Supabase SQL Editor

-- First, let's see what venues exist
SELECT id, name, slug, is_active, owner_id, is_public, created_at 
FROM venues 
ORDER BY created_at DESC;

-- Drop restrictive policies and create admin-friendly ones
DROP POLICY IF EXISTS "Public can view public venues" ON venues;
DROP POLICY IF EXISTS "Users can view own venues" ON venues;

-- Allow admins to see ALL venues
CREATE POLICY "Admins can view all venues"
ON venues FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'::app_role
  )
);

-- Allow public to view public venues
CREATE POLICY "Public can view public venues"
ON venues FOR SELECT
USING (is_public = true OR is_active = true);

-- Allow authenticated users to view their own venues
CREATE POLICY "Users can view own venues"
ON venues FOR SELECT
USING (
  auth.uid() = owner_id
  OR is_public = true
);
