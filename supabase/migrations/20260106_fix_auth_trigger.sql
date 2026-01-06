-- Fix Auth Trigger Blocking User Signups
-- This script temporarily disables the subscription trigger to allow user creation

-- Step 1: Drop the problematic trigger
DROP TRIGGER IF EXISTS on_auth_user_created_assign_plan ON auth.users;

-- Step 2: Verify subscription_plans table exists and has data
DO $$
BEGIN
    -- Check if subscription_plans table exists
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'subscription_plans') THEN
        RAISE NOTICE 'subscription_plans table does not exist - creating it';
        
        CREATE TABLE subscription_plans (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          price_monthly DECIMAL(10,2) NOT NULL,
          price_yearly DECIMAL(10,2) NOT NULL,
          features JSONB NOT NULL,
          tier_level INTEGER NOT NULL,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        -- Seed the freemium plan
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
        }'::jsonb);
    END IF;
    
    -- Check if user_subscriptions table exists
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_subscriptions') THEN
        RAISE NOTICE 'user_subscriptions table does not exist - creating it';
        
        CREATE TABLE user_subscriptions (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          plan_id UUID REFERENCES subscription_plans(id),
          status TEXT NOT NULL DEFAULT 'active',
          billing_period TEXT NOT NULL DEFAULT 'monthly',
          current_period_start TIMESTAMPTZ DEFAULT NOW(),
          current_period_end TIMESTAMPTZ,
          payment_provider TEXT,
          payment_provider_subscription_id TEXT,
          payment_provider_customer_id TEXT,
          auto_renew BOOLEAN DEFAULT true,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE(user_id)
        );
        
        -- Enable RLS
        ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
        
        -- Create policy
        CREATE POLICY "Users can view own subscription"
        ON user_subscriptions FOR SELECT
        USING (auth.uid() = user_id);
    END IF;
END $$;

-- Step 3: Recreate the trigger function with better error handling
CREATE OR REPLACE FUNCTION assign_freemium_plan()
RETURNS TRIGGER AS $$
DECLARE
  freemium_plan_id UUID;
BEGIN
  -- Get the freemium plan ID
  SELECT id INTO freemium_plan_id
  FROM subscription_plans
  WHERE slug = 'freemium'
  LIMIT 1;
  
  -- Only insert if plan exists
  IF freemium_plan_id IS NOT NULL THEN
    INSERT INTO user_subscriptions (user_id, plan_id, status, current_period_end)
    VALUES (
      NEW.id,
      freemium_plan_id,
      'active',
      NULL -- Freemium never expires
    )
    ON CONFLICT (user_id) DO NOTHING; -- Prevent duplicate errors
  ELSE
    RAISE WARNING 'Freemium plan not found - skipping subscription assignment for user %', NEW.id;
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't block user creation
    RAISE WARNING 'Error assigning freemium plan to user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Recreate the trigger
CREATE TRIGGER on_auth_user_created_assign_plan
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION assign_freemium_plan();

-- Success message
SELECT 'Auth trigger fixed! Users can now sign up.' as status;
