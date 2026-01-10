-- Push Notification Subscriptions
-- Stores user device push notification subscriptions for PWA

-- Create push_subscriptions table
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
    
    -- Push subscription data
    endpoint TEXT NOT NULL UNIQUE,
    keys JSONB NOT NULL, -- Contains p256dh and auth keys
    
    -- Metadata
    user_agent TEXT,
    device_type TEXT, -- 'mobile', 'desktop', 'tablet'
    is_active BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT now(),
    last_used_at TIMESTAMPTZ DEFAULT now(),
    
    -- Indexes for faster queries
    CONSTRAINT valid_keys CHECK (keys ? 'p256dh' AND keys ? 'auth')
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_venue_id ON push_subscriptions(venue_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_active ON push_subscriptions(is_active) WHERE is_active = true;

-- Push notification log (track sent notifications)
CREATE TABLE IF NOT EXISTS push_notification_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Target
    user_id UUID REFERENCES auth.users(id),
    venue_id UUID REFERENCES venues(id),
    subscription_id UUID REFERENCES push_subscriptions(id) ON DELETE SET NULL,
    
    -- Notification content
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    icon TEXT,
    badge TEXT,
    data JSONB,
    
    -- Delivery status
    status TEXT DEFAULT 'pending', -- pending, sent, failed, clicked
    error_message TEXT,
    
    -- Timestamps
    sent_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for analytics
CREATE INDEX IF NOT EXISTS idx_push_log_user_id ON push_notification_log(user_id);
CREATE INDEX IF NOT EXISTS idx_push_log_venue_id ON push_notification_log(venue_id);
CREATE INDEX IF NOT EXISTS idx_push_log_status ON push_notification_log(status);
CREATE INDEX IF NOT EXISTS idx_push_log_created_at ON push_notification_log(created_at DESC);

-- Function to clean up inactive subscriptions (older than 90 days)
CREATE OR REPLACE FUNCTION cleanup_inactive_subscriptions()
RETURNS void AS $$
BEGIN
    UPDATE push_subscriptions
    SET is_active = false
    WHERE last_used_at < NOW() - INTERVAL '90 days'
    AND is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_notification_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for push_subscriptions
-- Users can view and manage their own subscriptions
CREATE POLICY "Users can view own subscriptions"
    ON push_subscriptions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions"
    ON push_subscriptions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
    ON push_subscriptions FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own subscriptions"
    ON push_subscriptions FOR DELETE
    USING (auth.uid() = user_id);

-- Admin can view all subscriptions
CREATE POLICY "Admins can view all subscriptions"
    ON push_subscriptions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.user_id = auth.uid()
            AND admin_users.is_active = true
        )
    );

-- RLS Policies for push_notification_log
-- Users can view their own notification history
CREATE POLICY "Users can view own notifications"
    ON push_notification_log FOR SELECT
    USING (auth.uid() = user_id);

-- Admins can view all notifications
CREATE POLICY "Admins can view all notifications"
    ON push_notification_log FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.user_id = auth.uid()
            AND admin_users.is_active = true
        )
    );

-- Only system/admin can insert notification logs
CREATE POLICY "System can create notification logs"
    ON push_notification_log FOR INSERT
    WITH CHECK (true); -- Will be handled by service role

-- Comments for documentation
COMMENT ON TABLE push_subscriptions IS 'Stores Web Push API subscription data for PWA notifications';
COMMENT ON TABLE push_notification_log IS 'Tracks sent push notifications for analytics and debugging';
COMMENT ON FUNCTION cleanup_inactive_subscriptions IS 'Deactivates push subscriptions that have not been used in 90 days';
