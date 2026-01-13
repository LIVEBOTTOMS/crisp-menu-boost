-- Add latitude and longitude to venues table for geolocation verification
ALTER TABLE venues ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE venues ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
ALTER TABLE venues ADD COLUMN IF NOT EXISTS geofence_radius_meters INTEGER DEFAULT 100;

-- Add comment
COMMENT ON COLUMN venues.latitude IS 'Venue latitude coordinate for geolocation verification';
COMMENT ON COLUMN venues.longitude IS 'Venue longitude coordinate for geolocation verification';
COMMENT ON COLUMN venues.geofence_radius_meters IS 'Allowed radius in meters for voting (default 100m)';

-- Example: Update the 'live' venue with coordinates (you'll need to set real coordinates)
-- UPDATE venues SET latitude = 18.5204, longitude = 73.8567, geofence_radius_meters = 100 WHERE slug = 'live';
