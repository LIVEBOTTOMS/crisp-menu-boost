-- Create a view to get user emails for the Platform Admin
-- Fixed version without complex joins

CREATE OR REPLACE VIEW public.admin_users_view AS
SELECT 
    ur.user_id,
    ur.role,
    ur.created_at as role_created_at,
    au.email,
    au.created_at as user_created_at,
    sp.name as plan_name
FROM user_roles ur
LEFT JOIN auth.users au ON ur.user_id = au.id
LEFT JOIN user_subscriptions us ON ur.user_id = us.user_id
LEFT JOIN subscription_plans sp ON us.plan_id = sp.id;

-- Grant access to authenticated users
GRANT SELECT ON public.admin_users_view TO authenticated;

-- Verify the view works
SELECT * FROM admin_users_view;
