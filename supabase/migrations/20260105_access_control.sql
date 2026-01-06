-- Super Admin Setup and Access Control (FIXED v2)
-- This migration sets up proper access control for MenuX Prime

-- 1. First, add necessary columns to tables
ALTER TABLE venues ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id);
ALTER TABLE venues ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- Add venue_id to menu_sections if it doesn't exist
-- Note: This assumes menu_sections should link to venues
-- If your schema is different, adjust accordingly
ALTER TABLE menu_sections ADD COLUMN IF NOT EXISTS venue_id UUID REFERENCES venues(id);

-- 2. Set shamsud.ahmed@gmail.com as admin (super admin)
UPDATE user_roles
SET role = 'admin'
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'shamsud.ahmed@gmail.com'
);

-- If the user doesn't have a role yet, insert it
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'shamsud.ahmed@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM user_roles WHERE user_id = auth.users.id
);

-- 3. Set LIVE BAR as public demo menu
UPDATE venues
SET is_public = true
WHERE slug = 'live-bar';

-- 4. Update RLS Policies for Venues
DROP POLICY IF EXISTS "Anyone can view venues" ON venues;
DROP POLICY IF EXISTS "Users can view own venues" ON venues;
DROP POLICY IF EXISTS "Public can view public venues" ON venues;
DROP POLICY IF EXISTS "Users can create own venues" ON venues;
DROP POLICY IF EXISTS "Users can update own venues" ON venues;

-- Public can view public venues (LIVE BAR demo)
CREATE POLICY "Public can view public venues"
ON venues FOR SELECT
USING (is_public = true);

-- Authenticated users can view their own venues or public venues or if they're admin
CREATE POLICY "Users can view own venues"
ON venues FOR SELECT
USING (
  auth.uid() = owner_id
  OR is_public = true
  OR EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Users can create venues (will be their owner)
CREATE POLICY "Users can create own venues"
ON venues FOR INSERT
WITH CHECK (auth.uid() = owner_id);

-- Users can update their own venues or admins can update any
CREATE POLICY "Users can update own venues"
ON venues FOR UPDATE
USING (
  auth.uid() = owner_id
  OR EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- 5. Only update menu_sections policies if venue_id column exists
-- Check if we can use venue_id, otherwise skip these policies
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'menu_sections' AND column_name = 'venue_id'
  ) THEN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Anyone can view menu sections" ON menu_sections;
    DROP POLICY IF EXISTS "Users can view accessible menu sections" ON menu_sections;
    DROP POLICY IF EXISTS "Users can manage own menu sections" ON menu_sections;

    -- Create new policies
    EXECUTE 'CREATE POLICY "Users can view accessible menu sections"
    ON menu_sections FOR SELECT
    USING (
      venue_id IN (SELECT id FROM venues WHERE is_public = true)
      OR venue_id IN (SELECT id FROM venues WHERE owner_id = auth.uid())
      OR EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid() AND role = ''admin''
      )
    )';

    EXECUTE 'CREATE POLICY "Users can manage own menu sections"
    ON menu_sections FOR ALL
    USING (
      venue_id IN (SELECT id FROM venues WHERE owner_id = auth.uid())
      OR EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid() AND role = ''admin''
      )
    )';
  END IF;
END $$;

-- 6. Update RLS Policies for Menu Categories (if menu_sections has venue_id)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'menu_sections' AND column_name = 'venue_id'
  ) THEN
    DROP POLICY IF EXISTS "Anyone can view menu categories" ON menu_categories;
    DROP POLICY IF EXISTS "Users can view accessible menu categories" ON menu_categories;
    DROP POLICY IF EXISTS "Users can manage own menu categories" ON menu_categories;

    EXECUTE 'CREATE POLICY "Users can view accessible menu categories"
    ON menu_categories FOR SELECT
    USING (
      section_id IN (
        SELECT id FROM menu_sections
        WHERE venue_id IN (SELECT id FROM venues WHERE is_public = true OR owner_id = auth.uid())
      )
      OR EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid() AND role = ''admin''
      )
    )';

    EXECUTE 'CREATE POLICY "Users can manage own menu categories"
    ON menu_categories FOR ALL
    USING (
      section_id IN (
        SELECT id FROM menu_sections
        WHERE venue_id IN (SELECT id FROM venues WHERE owner_id = auth.uid())
      )
      OR EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid() AND role = ''admin''
      )
    )';
  END IF;
END $$;

-- 7. Update RLS Policies for Menu Items (if menu_sections has venue_id)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'menu_sections' AND column_name = 'venue_id'
  ) THEN
    DROP POLICY IF EXISTS "Anyone can view menu items" ON menu_items;
    DROP POLICY IF EXISTS "Users can view accessible menu items" ON menu_items;
    DROP POLICY IF EXISTS "Users can manage own menu items" ON menu_items;

    EXECUTE 'CREATE POLICY "Users can view accessible menu items"
    ON menu_items FOR SELECT
    USING (
      category_id IN (
        SELECT mc.id FROM menu_categories mc
        JOIN menu_sections ms ON mc.section_id = ms.id
        JOIN venues v ON ms.venue_id = v.id
        WHERE v.is_public = true OR v.owner_id = auth.uid()
      )
      OR EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid() AND role = ''admin''
      )
    )';

    EXECUTE 'CREATE POLICY "Users can manage own menu items"
    ON menu_items FOR ALL
    USING (
      category_id IN (
        SELECT mc.id FROM menu_categories mc
        JOIN menu_sections ms ON mc.section_id = ms.id
        JOIN venues v ON ms.venue_id = v.id
        WHERE v.owner_id = auth.uid()
      )
      OR EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid() AND role = ''admin''
      )
    )';
  END IF;
END $$;

-- 8. Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Create function to assign venue ownership on creation
CREATE OR REPLACE FUNCTION assign_venue_owner()
RETURNS TRIGGER AS $$
BEGIN
  -- If owner_id is not set, assign to current user
  IF NEW.owner_id IS NULL THEN
    NEW.owner_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_venue_created ON venues;
CREATE TRIGGER on_venue_created
  BEFORE INSERT ON venues
  FOR EACH ROW
  EXECUTE FUNCTION assign_venue_owner();
