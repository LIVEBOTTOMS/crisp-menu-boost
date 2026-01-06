-- Template System Schema & Logic
-- This migration sets up the structure for the Template Marketplace

-- 1. Add Template Metadata to Venues Table
ALTER TABLE venues 
ADD COLUMN IF NOT EXISTS is_template BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS template_category TEXT, -- e.g., 'Fine Dining', 'Fast Food', 'Cafe', 'Bar'
ADD COLUMN IF NOT EXISTS template_tags TEXT[],   -- e.g., ['dark', 'minimal', 'video-bg']
ADD COLUMN IF NOT EXISTS preview_image_url TEXT;

-- 2. Create Index for Fast Template Filtering
CREATE INDEX IF NOT EXISTS idx_venues_template 
ON venues(is_template, template_category);

-- 3. Function to Deep Clone a Venue (Template -> New User Venue)
CREATE OR REPLACE FUNCTION clone_venue_from_template(
  template_id UUID,
  new_owner_id UUID,
  new_name TEXT
) RETURNS UUID AS $$
DECLARE
  new_venue_id UUID;
  section_rec RECORD;
  new_section_id UUID;
  category_rec RECORD;
  new_category_id UUID;
  item_rec RECORD;
BEGIN
  -- A. Copy Venue (Base)
  INSERT INTO venues (
    name, 
    slug, 
    type, 
    owner_id, 
    theme_settings, 
    logo_url,
    background_url,
    font_family,
    primary_color,
    secondary_color,
    accent_color,
    is_public -- Cloned venues are private by default
  )
  SELECT 
    new_name, 
    slug || '-' || substr(md5(random()::text), 1, 6), -- Generate unique slug suffix
    type, 
    new_owner_id, 
    theme_settings,
    logo_url,
    background_url,
    font_family,
    primary_color,
    secondary_color,
    accent_color,
    false -- Set is_public to false
  FROM venues 
  WHERE id = template_id
  RETURNING id INTO new_venue_id;

  -- B. Loop through Sections
  FOR section_rec IN 
    SELECT * FROM menu_sections WHERE venue_id = template_id ORDER BY "order"
  LOOP
    INSERT INTO menu_sections (venue_id, name, "order", is_visible)
    VALUES (new_venue_id, section_rec.name, section_rec."order", section_rec.is_visible)
    RETURNING id INTO new_section_id;

    -- C. Loop through Categories in this Section
    FOR category_rec IN 
      SELECT * FROM menu_categories WHERE section_id = section_rec.id ORDER BY "order"
    LOOP
      INSERT INTO menu_categories (section_id, name, description, "order", is_visible)
      VALUES (new_section_id, category_rec.name, category_rec.description, category_rec."order", category_rec.is_visible)
      RETURNING id INTO new_category_id;

      -- D. Copy Items for this Category
      INSERT INTO menu_items (
        category_id, 
        name, 
        description, 
        price, 
        currency, 
        image_url, 
        is_vegetarian, 
        is_vegan, 
        is_gluten_free, 
        is_spicy, 
        is_available, 
        "order",
        calories,
        preparation_time,
        labels
      )
      SELECT 
        new_category_id, 
        name, 
        description, 
        price, 
        currency, 
        image_url, 
        is_vegetarian, 
        is_vegan, 
        is_gluten_free, 
        is_spicy, 
        is_available, 
        "order",
        calories,
        preparation_time,
        labels
      FROM menu_items 
      WHERE category_id = category_rec.id;
      
    END LOOP; -- End Categories Loop
    
  END LOOP; -- End Sections Loop

  RETURN new_venue_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
