-- Migration: Create venue-specific menu copies
-- This script duplicates the master menu (venue_id = NULL) for each venue
-- Run this in Supabase SQL Editor

-- Step 0: Fix the unique constraint on menu_sections.type
-- We need to allow multiple sections with same type (one per venue)
ALTER TABLE menu_sections DROP CONSTRAINT IF EXISTS menu_sections_type_key;

-- Create a new compound unique constraint (type + venue_id)
-- This allows: snacks for venue1, snacks for venue2, etc.
ALTER TABLE menu_sections ADD CONSTRAINT menu_sections_type_venue_unique 
  UNIQUE (type, venue_id);

-- Step 1: Ensure venues exist
INSERT INTO venues (slug, name, is_active)
VALUES 
  ('live', 'LIVE', true),
  ('moonwalk', 'MoonWalk', true)
ON CONFLICT (slug) DO UPDATE SET is_active = true;

-- Step 2: Get venue IDs
DO $$
DECLARE
  v_live_id UUID;
  v_moonwalk_id UUID;
  v_section RECORD;
  v_new_section_id UUID;
  v_category RECORD;
  v_new_category_id UUID;
BEGIN
  -- Get venue IDs
  SELECT id INTO v_live_id FROM venues WHERE slug = 'live';
  SELECT id INTO v_moonwalk_id FROM venues WHERE slug = 'moonwalk';
  
  RAISE NOTICE 'LIVE venue ID: %', v_live_id;
  RAISE NOTICE 'MoonWalk venue ID: %', v_moonwalk_id;
  
  -- Skip if LIVE already has menu data
  IF EXISTS (SELECT 1 FROM menu_sections WHERE venue_id = v_live_id) THEN
    RAISE NOTICE 'LIVE already has menu data, skipping...';
  ELSE
    RAISE NOTICE 'Creating menu copy for LIVE...';
    
    -- Duplicate sections for LIVE
    FOR v_section IN 
      SELECT * FROM menu_sections WHERE venue_id IS NULL ORDER BY display_order
    LOOP
      -- Insert new section with LIVE venue_id
      INSERT INTO menu_sections (type, title, display_order, venue_id)
      VALUES (v_section.type, v_section.title, v_section.display_order, v_live_id)
      RETURNING id INTO v_new_section_id;
      
      -- Duplicate categories for this section
      FOR v_category IN 
        SELECT * FROM menu_categories WHERE section_id = v_section.id ORDER BY display_order
      LOOP
        -- Insert new category
        INSERT INTO menu_categories (section_id, title, icon, display_order)
        VALUES (v_new_section_id, v_category.title, v_category.icon, v_category.display_order)
        RETURNING id INTO v_new_category_id;
        
        -- Duplicate items for this category
        INSERT INTO menu_items (
          category_id, name, description, price, half_price, full_price, sizes,
          display_order, image_url, is_best_seller, is_chef_special, is_new,
          is_veg, is_spicy, is_premium, is_top_shelf
        )
        SELECT 
          v_new_category_id, name, description, price, half_price, full_price, sizes,
          display_order, image_url, is_best_seller, is_chef_special, is_new,
          is_veg, is_spicy, is_premium, is_top_shelf
        FROM menu_items WHERE category_id = v_category.id;
      END LOOP;
    END LOOP;
    
    RAISE NOTICE 'LIVE menu created!';
  END IF;
  
  -- Skip if MoonWalk already has menu data
  IF EXISTS (SELECT 1 FROM menu_sections WHERE venue_id = v_moonwalk_id) THEN
    RAISE NOTICE 'MoonWalk already has menu data, skipping...';
  ELSE
    RAISE NOTICE 'Creating menu copy for MoonWalk...';
    
    -- Duplicate sections for MoonWalk
    FOR v_section IN 
      SELECT * FROM menu_sections WHERE venue_id IS NULL ORDER BY display_order
    LOOP
      -- Insert new section with MoonWalk venue_id
      INSERT INTO menu_sections (type, title, display_order, venue_id)
      VALUES (v_section.type, v_section.title, v_section.display_order, v_moonwalk_id)
      RETURNING id INTO v_new_section_id;
      
      -- Duplicate categories for this section
      FOR v_category IN 
        SELECT * FROM menu_categories WHERE section_id = v_section.id ORDER BY display_order
      LOOP
        -- Insert new category
        INSERT INTO menu_categories (section_id, title, icon, display_order)
        VALUES (v_new_section_id, v_category.title, v_category.icon, v_category.display_order)
        RETURNING id INTO v_new_category_id;
        
        -- Duplicate items for this category
        INSERT INTO menu_items (
          category_id, name, description, price, half_price, full_price, sizes,
          display_order, image_url, is_best_seller, is_chef_special, is_new,
          is_veg, is_spicy, is_premium, is_top_shelf
        )
        SELECT 
          v_new_category_id, name, description, price, half_price, full_price, sizes,
          display_order, image_url, is_best_seller, is_chef_special, is_new,
          is_veg, is_spicy, is_premium, is_top_shelf
        FROM menu_items WHERE category_id = v_category.id;
      END LOOP;
    END LOOP;
    
    RAISE NOTICE 'MoonWalk menu created!';
  END IF;
  
END $$;

-- Step 3: Verify the results
SELECT 
  v.name as venue_name,
  v.slug as venue_slug,
  COUNT(DISTINCT ms.id) as sections,
  COUNT(DISTINCT mc.id) as categories,
  COUNT(DISTINCT mi.id) as items
FROM venues v
LEFT JOIN menu_sections ms ON ms.venue_id = v.id
LEFT JOIN menu_categories mc ON mc.section_id = ms.id
LEFT JOIN menu_items mi ON mi.category_id = mc.id
GROUP BY v.id, v.name, v.slug
ORDER BY v.name;

-- Also show master menu (venue_id = NULL)
SELECT 
  'MASTER (template)' as venue_name,
  NULL as venue_slug,
  COUNT(DISTINCT ms.id) as sections,
  COUNT(DISTINCT mc.id) as categories,
  COUNT(DISTINCT mi.id) as items
FROM menu_sections ms
LEFT JOIN menu_categories mc ON mc.section_id = ms.id
LEFT JOIN menu_items mi ON mi.category_id = mc.id
WHERE ms.venue_id IS NULL;
