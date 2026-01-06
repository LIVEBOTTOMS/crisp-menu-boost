-- Assign Premium+ plan to admin user
-- Run this in Supabase SQL Editor

-- Assign Premium+ to shamsud.ahmed@gmail.com (admin gets full access)
INSERT INTO user_subscriptions (
  user_id,
  plan_id,
  status,
  billing_period,
  current_period_start,
  current_period_end,
  auto_renew
)
SELECT 
  u.id,
  sp.id,
  'active',
  'yearly',
  NOW(),
  NOW() + INTERVAL '100 years', -- Admin Premium+ never expires
  false
FROM auth.users u
CROSS JOIN subscription_plans sp
WHERE u.email = 'shamsud.ahmed@gmail.com'
  AND sp.slug = 'premium_plus'
  AND NOT EXISTS (
    SELECT 1 FROM user_subscriptions WHERE user_id = u.id
  );

-- Verify the assignment
SELECT 
  u.email,
  ur.role,
  us.status as subscription_status,
  sp.name as plan_name,
  sp.slug as plan_slug,
  us.current_period_end
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN user_subscriptions us ON u.id = us.user_id
LEFT JOIN subscription_plans sp ON us.plan_id = sp.id
WHERE u.email = 'shamsud.ahmed@gmail.com';
