-- Add theme support to venues table
-- Migration: 20260105_add_theme_support

-- Add theme column to store selected menu theme
ALTER TABLE venues 
ADD COLUMN IF NOT EXISTS theme VARCHAR(50) DEFAULT 'elegant-classic';

-- Add tagline column for venue-specific taglines
ALTER TABLE venues 
ADD COLUMN IF NOT EXISTS tagline TEXT;

-- Add QR code display preference
ALTER TABLE venues 
ADD COLUMN IF NOT EXISTS show_qr_on_menu BOOLEAN DEFAULT false;

-- Add QR code image URL
ALTER TABLE venues 
ADD COLUMN IF NOT EXISTS qr_code_url TEXT;

-- Update LIVE venue to use cyberpunk-tech theme
UPDATE venues 
SET theme = 'cyberpunk-tech',
    tagline = 'Eat.Drink.Code.Repeat'
WHERE slug = 'live' OR name = 'LIVE BAR';

-- Add comment for documentation
COMMENT ON COLUMN venues.theme IS 'Menu theme: cyberpunk-tech, elegant-classic, modern-minimal, rustic-organic, vibrant-playful';
COMMENT ON COLUMN venues.tagline IS 'Venue-specific tagline displayed on menu';
COMMENT ON COLUMN venues.show_qr_on_menu IS 'Whether to show QR code on printed menu';
COMMENT ON COLUMN venues.qr_code_url IS 'URL or path to QR code image for location/menu';
