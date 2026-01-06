-- Remove unique constraint from type to allow multiple venues to have same section types
ALTER TABLE public.menu_sections DROP CONSTRAINT IF EXISTS menu_sections_type_key;

-- Add venue_id to menu_sections
ALTER TABLE public.menu_sections ADD COLUMN IF NOT EXISTS venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_menu_sections_venue_id ON public.menu_sections(venue_id);

-- Update existing sections to belong to the "LIVE" venue if possible
-- First, find the LIVE venue ID
DO $$
DECLARE
    live_id UUID;
BEGIN
    SELECT id INTO live_id FROM venues WHERE slug = 'live' LIMIT 1;
    
    IF live_id IS NOT NULL THEN
        UPDATE menu_sections SET venue_id = live_id WHERE venue_id IS NULL;
    END IF;
END $$;
