-- Add logo_image_url to venues table
ALTER TABLE venues ADD COLUMN IF NOT EXISTS logo_image_url TEXT;

-- Update Moon Walk NX to use the specific logo image
UPDATE venues 
SET logo_image_url = '/moonwalk-logo.jpg' 
WHERE slug ILIKE '%moonwalk%';

-- Ensure LIVE venue has null logo_image_url (to use text logo)
UPDATE venues 
SET logo_image_url = NULL 
WHERE slug = 'live';
