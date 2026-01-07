-- Check if LIVE data exists in old tables vs new venues table
-- Run this in Supabase SQL Editor

-- 1. Check venues table
SELECT 'VENUES TABLE' as source, id, name, slug, created_at 
FROM venues 
ORDER BY created_at;

-- 2. Check if there's data in the old menu_sections table (pre-multi-venue)
SELECT 'MENU_SECTIONS TABLE' as source, id, name, created_at 
FROM menu_sections 
ORDER BY created_at;

-- 3. Check menu_categories
SELECT 'MENU_CATEGORIES TABLE' as source, COUNT(*) as total_categories
FROM menu_categories;

-- 4. Check menu_items
SELECT 'MENU_ITEMS TABLE' as source, COUNT(*) as total_items
FROM menu_items;

-- 5. Check if LIVE exists as a venue
SELECT * FROM venues WHERE slug = 'live' OR name ILIKE '%live%';

-- 6. Check venue_menu_items (new multi-venue table)
SELECT 'VENUE_MENU_ITEMS TABLE' as source, COUNT(*) as total_items, venue_id
FROM venue_menu_items
GROUP BY venue_id;
