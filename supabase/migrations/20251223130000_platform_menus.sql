-- Create platform_menus table to store menus specific to Swiggy/Zomato
CREATE TABLE IF NOT EXISTS platform_menus (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    platform_name TEXT NOT NULL, -- 'Swiggy', 'Zomato', etc.
    menu_data JSONB NOT NULL,
    markup_percentage DECIMAL NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE platform_menus ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Admin full access" ON platform_menus
    FOR ALL USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Public read access if needed (usually not for admin tools, but keeping it simple)
CREATE POLICY "Public read platform menus" ON platform_menus
    FOR SELECT USING (true);
