-- Quick setup script to apply migrations manually
-- Run this in Supabase SQL Editor if local Supabase isn't working

-- 1. First, run the subscription system migration
-- Copy contents from: 20260105_subscription_system.sql

-- 2. Then run the manual payment system migration  
-- Copy contents from: 20260105_manual_payment_system.sql

-- 3. Finally, run the access control migration
-- Copy contents from: 20260105_access_control.sql

-- 4. Verify setup
SELECT 
  u.email,
  ur.role,
  v.name as venue_name,
  v.is_public,
  v.owner_id
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN venues v ON u.id = v.owner_id
WHERE u.email = 'shamsud.ahmed@gmail.com';

-- Expected result:
-- email: shamsud.ahmed@gmail.com
-- role: super_admin
-- Should see all venues they own
