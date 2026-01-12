-- Create daily_offers table for venue-specific daily specials
CREATE TABLE IF NOT EXISTS daily_offers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    day_of_week TEXT NOT NULL CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
    offer_text TEXT,
    offer_type TEXT CHECK (offer_type IN ('special', 'discount', 'event')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(venue_id, day_of_week)
);

-- Add RLS policies
ALTER TABLE daily_offers ENABLE ROW LEVEL SECURITY;

-- Allow public to read active offers
CREATE POLICY "Public can view active daily offers"
    ON daily_offers FOR SELECT
    TO public
    USING (is_active = true);

-- Allow authenticated users to manage their venue's offers
CREATE POLICY "Users can manage their venue's daily offers"
    ON daily_offers FOR ALL
    TO authenticated
    USING (
        venue_id IN (
            SELECT id FROM venues 
            WHERE user_id = auth.uid()
        )
    )
    WITH CHECK (
        venue_id IN (
            SELECT id FROM venues 
            WHERE user_id = auth.uid()
        )
    );

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_daily_offers_venue_day ON daily_offers(venue_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_daily_offers_active ON daily_offers(is_active) WHERE is_active = true;

-- Add update trigger
CREATE OR REPLACE FUNCTION update_daily_offers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_daily_offers_timestamp
    BEFORE UPDATE ON daily_offers
    FOR EACH ROW
    EXECUTE FUNCTION update_daily_offers_updated_at();
