-- Auto-create default venue and template menu for new users
-- This ensures every new user has a venue to work with immediately

-- Function to create default venue and menu for a new user
CREATE OR REPLACE FUNCTION create_default_venue_for_user()
RETURNS TRIGGER AS $$
DECLARE
  new_venue_id UUID;
  section_id UUID;
  category_id UUID;
BEGIN
  -- Create default venue for the new user
  INSERT INTO venues (
    name,
    slug,
    tagline,
    subtitle,
    logo_text,
    logo_subtext,
    theme,
    user_id
  ) VALUES (
    'My Restaurant',
    CONCAT('my-restaurant-', LOWER(SUBSTRING(MD5(NEW.id::text), 1, 8))),
    'Delicious food, great atmosphere',
    'Your tagline here',
    'MY RESTAURANT',
    'EST. ' || EXTRACT(YEAR FROM NOW())::TEXT,
    'cyberpunk-tech',
    NEW.id
  ) RETURNING id INTO new_venue_id;

  -- Create default sections
  -- Food Section
  INSERT INTO menu_sections (name, type, venue_id)
  VALUES ('Food', 'food', new_venue_id)
  RETURNING id INTO section_id;

  -- Create "Starters" category
  INSERT INTO menu_categories (name, section_id, venue_id)
  VALUES ('Starters', section_id, new_venue_id)
  RETURNING id INTO category_id;

  -- Add sample menu items
  INSERT INTO menu_items (name, description, price, category_id, venue_id) VALUES
    ('Spring Rolls', 'Crispy vegetable spring rolls served with sweet chili sauce', 250, category_id, new_venue_id),
    ('Garlic Bread', 'Freshly baked bread with garlic butter and herbs', 180, category_id, new_venue_id);

  -- Create "Main Course" category
  INSERT INTO menu_categories (name, section_id, venue_id)
  VALUES ('Main Course', section_id, new_venue_id)
  RETURNING id INTO category_id;

  INSERT INTO menu_items (name, description, price, category_id, venue_id) VALUES
    ('Margherita Pizza', 'Classic pizza with fresh mozzarella, tomato sauce, and basil', 450, category_id, new_venue_id),
    ('Pasta Carbonara', 'Creamy pasta with bacon, eggs, and parmesan cheese', 380, category_id, new_venue_id),
    ('Grilled Chicken', 'Tender chicken breast with seasonal vegetables', 420, category_id, new_venue_id);

  -- Beverages Section
  INSERT INTO menu_sections (name, type, venue_id)
  VALUES ('Beverages', 'beverages', new_venue_id)
  RETURNING id INTO section_id;

  INSERT INTO menu_categories (name, section_id, venue_id)
  VALUES ('Cold Drinks', section_id, new_venue_id)
  RETURNING id INTO category_id;

  INSERT INTO menu_items (name, description, price, category_id, venue_id) VALUES
    ('Fresh Lime Soda', 'Refreshing lime soda with mint', 80, category_id, new_venue_id),
    ('Mango Smoothie', 'Thick mango smoothie with cream', 150, category_id, new_venue_id),
    ('Cold Coffee', 'Iced coffee with milk and ice cream', 120, category_id, new_venue_id);

  -- Log the onboarding
  RAISE NOTICE 'Created default venue % for user %', new_venue_id, NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-create venue when user is created
DROP TRIGGER IF EXISTS on_user_created_create_venue ON auth.users;
CREATE TRIGGER on_user_created_create_venue
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_venue_for_user();

-- Function to check if user needs onboarding
CREATE OR REPLACE FUNCTION user_needs_onboarding(user_id_param UUID)
RETURNS BOOLEAN AS $$
DECLARE
  venue_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO venue_count
  FROM venues
  WHERE user_id = user_id_param;

  RETURN venue_count = 0;
END;
$$ LANGUAGE plpgsql;

-- Add onboarding_completed column to track user progress
ALTER TABLE venues ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

-- Function to mark onboarding as complete
CREATE OR REPLACE FUNCTION mark_onboarding_complete(venue_id_param UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE venues
  SET onboarding_completed = true
  WHERE id = venue_id_param;
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON FUNCTION create_default_venue_for_user IS 'Automatically creates a default venue with sample menu for new users';
COMMENT ON FUNCTION user_needs_onboarding IS 'Checks if a user needs to go through onboarding (has no venues)';
COMMENT ON FUNCTION mark_onboarding_complete IS 'Marks a venue as having completed the onboarding process';

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION user_needs_onboarding TO authenticated;
GRANT EXECUTE ON FUNCTION mark_onboarding_complete TO authenticated;
