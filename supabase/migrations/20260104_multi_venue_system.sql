-- Create venues table to store multiple restaurants/menus
CREATE TABLE IF NOT EXISTS venues (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tagline TEXT,
    subtitle TEXT,
    logo_text TEXT,
    logo_subtext TEXT,
    city TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    qr_code_url TEXT,
    qr_code_label TEXT,
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    is_active BOOLEAN DEFAULT true
);

-- Create menu_items table linked to venues
CREATE TABLE IF NOT EXISTS venue_menu_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
    section_type TEXT NOT NULL, -- 'snacks', 'food', 'beverages', 'sides'
    category_name TEXT NOT NULL,
    category_index INTEGER NOT NULL,
    item_name TEXT NOT NULL,
    item_index INTEGER NOT NULL,
    description TEXT,
    price TEXT,
    half_price TEXT,
    full_price TEXT,
    sizes TEXT[], -- Array of sizes
    size_labels TEXT[], -- Array of size labels
    is_veg BOOLEAN,
    is_non_veg BOOLEAN,
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(venue_id, section_type, category_index, item_index)
);

-- Enable RLS
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_menu_items ENABLE ROW LEVEL SECURITY;

-- Policies for venues
CREATE POLICY "Public can view active venues" ON venues
    FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can create venues" ON venues
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own venues" ON venues
    FOR UPDATE USING (created_by = auth.uid())
    WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can delete their own venues" ON venues
    FOR DELETE USING (created_by = auth.uid());

-- Policies for venue_menu_items
CREATE POLICY "Public can view menu items for active venues" ON venue_menu_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM venues 
            WHERE venues.id = venue_menu_items.venue_id 
            AND venues.is_active = true
        )
    );

CREATE POLICY "Authenticated users can manage menu items" ON venue_menu_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM venues 
            WHERE venues.id = venue_menu_items.venue_id 
            AND (venues.created_by = auth.uid() OR auth.role() = 'authenticated')
        )
    );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_venues_slug ON venues(slug);
CREATE INDEX IF NOT EXISTS idx_venues_created_by ON venues(created_by);
CREATE INDEX IF NOT EXISTS idx_venue_menu_items_venue_id ON venue_menu_items(venue_id);
CREATE INDEX IF NOT EXISTS idx_venue_menu_items_section ON venue_menu_items(venue_id, section_type);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers
DROP TRIGGER IF EXISTS update_venues_updated_at ON venues;
CREATE TRIGGER update_venues_updated_at 
    BEFORE UPDATE ON venues 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_venue_menu_items_updated_at ON venue_menu_items;
CREATE TRIGGER update_venue_menu_items_updated_at 
    BEFORE UPDATE ON venue_menu_items 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
