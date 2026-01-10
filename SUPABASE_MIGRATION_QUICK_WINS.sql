-- Migration for Quick Wins Features

-- Add new columns to menu_items table JSONB structure 
-- Note: Since menu_items in this project seems to be stored as a JSONB blob in 'menu_data' table or similar (based on code context showing menuData structure),
-- we might not need schema changes if it's NoSQL-style storage.
-- HOWEVER, if there is a 'menu_items' table (more standard), here is the SQL.

-- Based on useMenuDatabase hook, let's check if we're using a single JSON blob or normalized tables.
-- If using normalized tables:

ALTER TABLE menu_items 
ADD COLUMN IF NOT EXISTS dietary VARCHAR(20),
ADD COLUMN IF NOT EXISTS spice_level VARCHAR(20),
ADD COLUMN IF NOT EXISTS calories INTEGER,
ADD COLUMN IF NOT EXISTS protein INTEGER,
ADD COLUMN IF NOT EXISTS carbs INTEGER,
ADD COLUMN IF NOT EXISTS fat INTEGER,
ADD COLUMN IF NOT EXISTS discount_percent INTEGER,
ADD COLUMN IF NOT EXISTS original_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS badge VARCHAR(50);

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_menu_items_dietary ON menu_items(dietary);
CREATE INDEX IF NOT EXISTS idx_menu_items_badge ON menu_items(badge);

-- Comment on columns
COMMENT ON COLUMN menu_items.dietary IS 'Dietary preference: veg, non-veg, vegan, etc.';
COMMENT ON COLUMN menu_items.spice_level IS 'Spice intensity: none, mild, medium, hot, extra-hot';
COMMENT ON COLUMN menu_items.badge IS 'Special badges: new, bestseller, chef-special';
