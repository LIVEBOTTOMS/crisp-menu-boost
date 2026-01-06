-- Payment Requests Table for Manual UPI Verification
CREATE TABLE IF NOT EXISTS payment_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_name TEXT,
  plan_id UUID REFERENCES subscription_plans(id),
  plan_name TEXT NOT NULL,
  billing_period TEXT NOT NULL, -- 'monthly', 'yearly'
  amount DECIMAL(10,2) NOT NULL,
  
  -- Payment Details
  upi_transaction_id TEXT,
  payment_screenshot_url TEXT,
  payment_date TIMESTAMPTZ,
  payment_notes TEXT,
  
  -- Admin Verification
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  admin_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payment_requests_user_id ON payment_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_requests_status ON payment_requests(status);
CREATE INDEX IF NOT EXISTS idx_payment_requests_created_at ON payment_requests(created_at DESC);

-- RLS Policies
ALTER TABLE payment_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own payment requests
CREATE POLICY "Users can view own payment requests"
ON payment_requests FOR SELECT
USING (auth.uid() = user_id);

-- Users can create payment requests
CREATE POLICY "Users can create payment requests"
ON payment_requests FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view all payment requests
CREATE POLICY "Admins can view all payment requests"
ON payment_requests FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Admins can update payment requests (approve/reject)
CREATE POLICY "Admins can update payment requests"
ON payment_requests FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Function to activate subscription after admin approval
CREATE OR REPLACE FUNCTION activate_subscription_from_payment()
RETURNS TRIGGER AS $$
BEGIN
  -- Only proceed if status changed to 'approved'
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    -- Update or insert user subscription
    INSERT INTO user_subscriptions (
      user_id,
      plan_id,
      status,
      billing_period,
      current_period_start,
      current_period_end,
      payment_provider,
      auto_renew
    )
    VALUES (
      NEW.user_id,
      NEW.plan_id,
      'active',
      NEW.billing_period,
      NOW(),
      CASE 
        WHEN NEW.billing_period = 'monthly' THEN NOW() + INTERVAL '1 month'
        WHEN NEW.billing_period = 'yearly' THEN NOW() + INTERVAL '1 year'
      END,
      'manual_upi',
      false
    )
    ON CONFLICT (user_id) 
    DO UPDATE SET
      plan_id = EXCLUDED.plan_id,
      status = EXCLUDED.status,
      billing_period = EXCLUDED.billing_period,
      current_period_start = EXCLUDED.current_period_start,
      current_period_end = EXCLUDED.current_period_end,
      updated_at = NOW();
    
    -- Record in payment history
    INSERT INTO payment_history (
      user_id,
      subscription_id,
      amount,
      status,
      payment_provider,
      payment_provider_payment_id
    )
    SELECT
      NEW.user_id,
      us.id,
      NEW.amount,
      'success',
      'manual_upi',
      NEW.upi_transaction_id
    FROM user_subscriptions us
    WHERE us.user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to activate subscription on approval
DROP TRIGGER IF EXISTS on_payment_approved ON payment_requests;
CREATE TRIGGER on_payment_approved
  AFTER UPDATE ON payment_requests
  FOR EACH ROW
  EXECUTE FUNCTION activate_subscription_from_payment();
