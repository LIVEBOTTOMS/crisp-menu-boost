-- Grant super admin access to shamsud.ahmed@gmail.com
-- Run this in Supabase SQL Editor

-- Simple version: Delete any existing role and insert admin role
DELETE FROM user_roles 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'shamsud.ahmed@gmail.com');

INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'shamsud.ahmed@gmail.com';

-- Verify the change
SELECT 
    u.email,
    ur.role,
    ur.created_at
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
WHERE u.email = 'shamsud.ahmed@gmail.com';
