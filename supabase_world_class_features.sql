-- WORLD-CLASS FEATURES DATABASE SCHEMA
-- Add tables for AR Menu Experience, Customer Reviews, and Loyalty Program

-- 1. AR Menu Experience Tables
CREATE TABLE IF NOT EXISTS menu_item_ar_assets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
    asset_type TEXT NOT NULL CHECK (asset_type IN ('3d_model', 'video', '360_photo', 'animation')),
    asset_url TEXT NOT NULL,
    thumbnail_url TEXT,
    file_size_bytes INTEGER,
    format TEXT NOT NULL, -- gltf, glb, mp4, jpg, etc.
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Customer Reviews & Ratings Tables
CREATE TABLE IF NOT EXISTS customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone_number TEXT UNIQUE,
    email TEXT,
    name TEXT,
    preferred_language TEXT DEFAULT 'en',
    dietary_preferences TEXT[], -- vegetarian, vegan, gluten-free, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    photo_urls TEXT[], -- Array of uploaded photo URLs
    is_verified BOOLEAN DEFAULT false,
    helpful_votes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Loyalty Program Tables
CREATE TABLE IF NOT EXISTS loyalty_accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE UNIQUE,
    total_points INTEGER DEFAULT 0,
    current_tier TEXT DEFAULT 'bronze' CHECK (current_tier IN ('bronze', 'silver', 'gold', 'platinum')),
    points_to_next_tier INTEGER DEFAULT 100,
    member_since TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS loyalty_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    account_id UUID REFERENCES loyalty_accounts(id) ON DELETE CASCADE,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earn', 'redeem', 'bonus', 'expiry')),
    points INTEGER NOT NULL,
    reason TEXT NOT NULL, -- "Order placed", "Review submitted", "Birthday bonus", etc.
    order_reference TEXT, -- Link to order if applicable
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS loyalty_rewards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    points_required INTEGER NOT NULL,
    reward_type TEXT NOT NULL CHECK (reward_type IN ('discount', 'free_item', 'vip_access', 'custom')),
    reward_value TEXT NOT NULL, -- "10% off", "Free appetizer", etc.
    is_active BOOLEAN DEFAULT true,
    max_claims_per_customer INTEGER,
    valid_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Customer Preferences & Recommendations
CREATE TABLE IF NOT EXISTS customer_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    favorite_categories TEXT[],
    disliked_ingredients TEXT[],
    spice_tolerance TEXT DEFAULT 'medium' CHECK (spice_tolerance IN ('mild', 'medium', 'hot', 'very_hot')),
    budget_range TEXT DEFAULT 'medium' CHECK (budget_range IN ('budget', 'medium', 'premium')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Personalized Recommendations Tracking
CREATE TABLE IF NOT EXISTS recommendation_interactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
    interaction_type TEXT NOT NULL CHECK (interaction_type IN ('viewed', 'ordered', 'liked', 'disliked', 'shared')),
    recommendation_source TEXT NOT NULL, -- "loyalty_tier", "past_orders", "popular", "similar_taste"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. QR Code Sessions for AR/Menu Access
CREATE TABLE IF NOT EXISTS qr_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_token TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    device_info JSONB, -- browser, OS, location data
    purpose TEXT NOT NULL CHECK (purpose IN ('menu_view', 'ar_experience', 'feedback', 'loyalty_check')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE menu_item_ar_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendation_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access (where appropriate)
CREATE POLICY "Public Read Access" ON menu_item_ar_assets FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON reviews FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON loyalty_rewards FOR SELECT USING (true);

-- Admin access for all tables
CREATE POLICY "Admin Access" ON menu_item_ar_assets FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin Access" ON customers FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin Access" ON reviews FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin Access" ON loyalty_accounts FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin Access" ON loyalty_transactions FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin Access" ON loyalty_rewards FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin Access" ON customer_preferences FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin Access" ON recommendation_interactions FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin Access" ON qr_sessions FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Insert sample loyalty rewards
INSERT INTO loyalty_rewards (title, description, points_required, reward_type, reward_value) VALUES
('Welcome Bonus', 'Free welcome drink on your first visit', 0, 'free_item', 'Welcome Drink'),
('10% Off', 'Get 10% discount on your next order', 50, 'discount', '10% off'),
('Free Appetizer', 'Choose any appetizer from our menu', 100, 'free_item', 'Free Appetizer'),
('VIP Access', 'Priority seating and exclusive event invites', 250, 'vip_access', 'VIP Member Status'),
('Birthday Special', 'Free dessert on your birthday month', 150, 'free_item', 'Free Dessert'),
('Loyalty Champion', 'Complimentary main course', 500, 'free_item', 'Free Main Course');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_menu_item_ar_assets_menu_item_id ON menu_item_ar_assets(menu_item_id);
CREATE INDEX IF NOT EXISTS idx_reviews_menu_item_id ON reviews(menu_item_id);
CREATE INDEX IF NOT EXISTS idx_reviews_customer_id ON reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_accounts_customer_id ON loyalty_accounts(customer_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_account_id ON loyalty_transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_customer_preferences_customer_id ON customer_preferences(customer_id);
CREATE INDEX IF NOT EXISTS idx_qr_sessions_token ON qr_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_qr_sessions_expires_at ON qr_sessions(expires_at);

-- Update triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_menu_item_ar_assets_updated_at BEFORE UPDATE ON menu_item_ar_assets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically update loyalty tier based on points
CREATE OR REPLACE FUNCTION update_loyalty_tier()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.total_points >= 1000 THEN
        NEW.current_tier = 'platinum';
        NEW.points_to_next_tier = 0;
    ELSIF NEW.total_points >= 500 THEN
        NEW.current_tier = 'gold';
        NEW.points_to_next_tier = 1000 - NEW.total_points;
    ELSIF NEW.total_points >= 200 THEN
        NEW.current_tier = 'silver';
        NEW.points_to_next_tier = 500 - NEW.total_points;
    ELSE
        NEW.current_tier = 'bronze';
        NEW.points_to_next_tier = 200 - NEW.total_points;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_loyalty_tier_trigger
    BEFORE UPDATE ON loyalty_accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_loyalty_tier();

SELECT 'World-class features database schema created successfully!' as status;
