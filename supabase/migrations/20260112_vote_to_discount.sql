-- ============================================
-- VOTE-TO-DISCOUNT SYSTEM
-- Customers vote for items to reduce prices
-- 10 votes = 1% discount, max 10% (100 votes)
-- ============================================

-- Item Votes Table
CREATE TABLE IF NOT EXISTS item_votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_id TEXT NOT NULL, -- Composite key: section_category_itemIndex
    venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    voter_fingerprint TEXT NOT NULL, -- Browser fingerprint for anonymity
    voter_ip TEXT, -- IP as secondary check
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Prevent duplicate votes from same user for same item
    UNIQUE(item_id, venue_id, voter_fingerprint)
);

-- Vote Counts View (aggregated for performance)
CREATE OR REPLACE VIEW item_vote_counts AS
SELECT 
    item_id,
    venue_id,
    COUNT(*) as vote_count,
    LEAST(FLOOR(COUNT(*) / 10.0), 10) as discount_percent,
    MAX(created_at) as last_vote_at
FROM item_votes
GROUP BY item_id, venue_id;

-- Original Prices Table (to track base price before discounts)
CREATE TABLE IF NOT EXISTS item_original_prices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_id TEXT NOT NULL,
    venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    original_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(item_id, venue_id)
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE item_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_original_prices ENABLE ROW LEVEL SECURITY;

-- Public can view vote counts
CREATE POLICY "Public can view item votes"
    ON item_votes FOR SELECT
    TO public
    USING (true);

-- Public can submit votes (will be checked in application logic)
CREATE POLICY "Public can submit votes"
    ON item_votes FOR INSERT
    TO public
    WITH CHECK (true);

-- Admins can manage votes
CREATE POLICY "Admins can manage votes"
    ON item_votes FOR ALL
    TO authenticated
    USING (
        venue_id IN (
            SELECT id FROM venues 
            WHERE user_id = auth.uid()
        )
    );

-- Public can view original prices
CREATE POLICY "Public can view original prices"
    ON item_original_prices FOR SELECT
    TO public
    USING (true);

-- Admins can manage original prices
CREATE POLICY "Admins can manage original prices"
    ON item_original_prices FOR ALL
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

-- ============================================
-- INDEXES for Performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_item_votes_item_venue ON item_votes(item_id, venue_id);
CREATE INDEX IF NOT EXISTS idx_item_votes_fingerprint ON item_votes(voter_fingerprint);
CREATE INDEX IF NOT EXISTS idx_item_votes_created ON item_votes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_original_prices_item_venue ON item_original_prices(item_id, venue_id);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to get current discount for an item
CREATE OR REPLACE FUNCTION get_item_discount(
    p_item_id TEXT,
    p_venue_id UUID
) RETURNS TABLE (
    vote_count BIGINT,
    discount_percent INTEGER,
    discounted_price DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(vc.vote_count, 0) as vote_count,
        COALESCE(vc.discount_percent, 0)::INTEGER as discount_percent,
        CASE 
            WHEN op.original_price IS NOT NULL THEN
                op.original_price * (1 - COALESCE(vc.discount_percent, 0) / 100.0)
            ELSE
                NULL
        END as discounted_price
    FROM item_original_prices op
    LEFT JOIN item_vote_counts vc 
        ON vc.item_id = p_item_id AND vc.venue_id = p_venue_id
    WHERE op.item_id = p_item_id AND op.venue_id = p_venue_id;
END;
$$ LANGUAGE plpgsql;

-- Function to reset votes for an item (admin only)
CREATE OR REPLACE FUNCTION reset_item_votes(
    p_item_id TEXT,
    p_venue_id UUID
) RETURNS void AS $$
BEGIN
    DELETE FROM item_votes 
    WHERE item_id = p_item_id AND venue_id = p_venue_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update timestamp
CREATE OR REPLACE FUNCTION update_original_prices_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_original_prices_updated_at
    BEFORE UPDATE ON item_original_prices
    FOR EACH ROW
    EXECUTE FUNCTION update_original_prices_timestamp();
