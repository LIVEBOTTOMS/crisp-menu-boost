-- Subscription System for MenuX Prime
-- 3-Tier Pricing: Freemium, Premium, Premium+

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Subscription Plans Table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  price_monthly DECIMAL(10,2) NOT NULL,
  price_yearly DECIMAL(10,2) NOT NULL,
  features JSONB NOT NULL,
  tier_level INTEGER NOT NULL, -- 0=Freemium, 1=Premium, 2=Premium+
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Subscriptions Table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES subscription_plans(id),
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'cancelled', 'expired', 'trial'
  billing_period TEXT NOT NULL DEFAULT 'monthly', -- 'monthly', 'yearly'
  current_period_start TIMESTAMPTZ DEFAULT NOW(),
  current_period_end TIMESTAMPTZ,
  payment_provider TEXT, -- 'razorpay', 'stripe'
  payment_provider_subscription_id TEXT,
  payment_provider_customer_id TEXT,
  auto_renew BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Payment History Table
CREATE TABLE IF NOT EXISTS payment_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES user_subscriptions(id),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT NOT NULL, -- 'success', 'failed', 'pending', 'refunded'
  payment_provider TEXT,
  payment_provider_payment_id TEXT,
  payment_method TEXT, -- 'card', 'upi', 'netbanking', 'wallet'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Subscription Plans
INSERT INTO subscription_plans (name, slug, price_monthly, price_yearly, tier_level, features) VALUES
('Freemium', 'freemium', 0, 0, 0, '{
  "max_venues": 1,
  "max_items": 50,
  "themes": ["classic"],
  "edit_access": false,
  "customization": false,
  "qr_codes": false,
  "analytics": false,
  "discount_codes": false,
  "priority_support": false,
  "custom_domain": false,
  "api_access": false
}'::jsonb),
('Premium', 'premium', 199, 1910, 1, '{
  "max_venues": -1,
  "max_items": -1,
  "themes": "all",
  "edit_access": true,
  "customization": true,
  "qr_codes": true,
  "analytics": "basic",
  "discount_codes": false,
  "priority_support": true,
  "custom_domain": true,
  "api_access": false
}'::jsonb),
('Premium+', 'premium_plus', 249, 2390, 2, '{
  "max_venues": -1,
  "max_items": -1,
  "themes": "all",
  "edit_access": true,
  "customization": true,
  "qr_codes": true,
  "analytics": "advanced",
  "discount_codes": true,
  "priority_support": true,
  "custom_domain": true,
  "api_access": true
}'::jsonb)
ON CONFLICT (slug) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_payment_history_user_id ON payment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_status ON payment_history(status);

-- RLS Policies
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- Everyone can view subscription plans
CREATE POLICY "Anyone can view subscription plans"
ON subscription_plans FOR SELECT
USING (is_active = true);

-- Users can view their own subscription
CREATE POLICY "Users can view own subscription"
ON user_subscriptions FOR SELECT
USING (auth.uid() = user_id);

-- Users can view their own payment history
CREATE POLICY "Users can view own payment history"
ON payment_history FOR SELECT
USING (auth.uid() = user_id);

-- Function to automatically assign Freemium plan to new users
CREATE OR REPLACE FUNCTION assign_freemium_plan()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_subscriptions (user_id, plan_id, status, current_period_end)
  SELECT 
    NEW.id,
    id,
    'active',
    NULL -- Freemium never expires
  FROM subscription_plans
  WHERE slug = 'freemium'
  LIMIT 1;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to assign Freemium plan on user signup
DROP TRIGGER IF EXISTS on_auth_user_created_assign_plan ON auth.users;
CREATE TRIGGER on_auth_user_created_assign_plan
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION assign_freemium_plan();

-- Function to check if user has feature access
CREATE OR REPLACE FUNCTION has_feature_access(user_uuid UUID, feature_name TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_features JSONB;
  feature_value TEXT;
BEGIN
  SELECT sp.features INTO user_features
  FROM user_subscriptions us
  JOIN subscription_plans sp ON us.plan_id = sp.id
  WHERE us.user_id = user_uuid
    AND us.status = 'active'
  LIMIT 1;
  
  IF user_features IS NULL THEN
    RETURN FALSE;
  END IF;
  
  feature_value := user_features->>feature_name;
  
  -- Handle boolean features
  IF feature_value IN ('true', 'false') THEN
    RETURN feature_value::BOOLEAN;
  END IF;
  
  -- Handle numeric features (-1 means unlimited)
  IF feature_value ~ '^\-?[0-9]+$' THEN
    RETURN feature_value::INTEGER != 0;
  END IF;
  
  -- Handle string features
  RETURN feature_value IS NOT NULL AND feature_value != '';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
