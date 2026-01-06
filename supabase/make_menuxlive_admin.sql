-- Make menuxlive@proton.me admin with Premium+ for LIVE and MoonWalk venues
-- Run this in Supabase SQL Editor (FIXED)

-- 1. Set as admin (with proper conflict handling)
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'menuxlive@proton.me'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- If the above fails, try this alternative:
-- DELETE FROM user_roles WHERE user_id = (SELECT id FROM auth.users WHERE email = 'menuxlive@proton.me');
-- INSERT INTO user_roles (user_id, role)
-- SELECT id, 'admin' FROM auth.users WHERE email = 'menuxlive@proton.me';

-- 2. Assign Premium+ plan
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
  NOW() + INTERVAL '100 years',
  false
FROM auth.users u
CROSS JOIN subscription_plans sp
WHERE u.email = 'menuxlive@proton.me'
  AND sp.slug = 'premium_plus'
ON CONFLICT (user_id) DO UPDATE 
SET 
  plan_id = EXCLUDED.plan_id,
  status = 'active',
  updated_at = NOW();

-- 3. Assign ownership of LIVE and MoonWalk venues
UPDATE venues
SET owner_id = (SELECT id FROM auth.users WHERE email = 'menuxlive@proton.me')
WHERE slug IN ('live-bar', 'moonwalk-nx');

-- 4. Verify
SELECT 
  u.email,
  ur.role,
  sp.name as plan_name,
  v.name as venue_name,
  v.slug as venue_slug
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN user_subscriptions us ON u.id = us.user_id
LEFT JOIN subscription_plans sp ON us.plan_id = sp.id
LEFT JOIN venues v ON u.id = v.owner_id
WHERE u.email = 'menuxlive@proton.me';
