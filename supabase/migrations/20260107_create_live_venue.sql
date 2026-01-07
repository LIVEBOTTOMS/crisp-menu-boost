-- Create LIVE venue in the venues table
-- This will make LIVE appear in the Platform Admin Dashboard

INSERT INTO venues (
    id,
    name,
    slug,
    tagline,
    subtitle,
    logo_text,
    city,
    address,
    is_active,
    is_public,
    owner_id,
    created_at
) VALUES (
    gen_random_uuid(),
    'LIVE BAR',
    'live',
    'Eat.Drink.Code.Repeat',
    'FINE DINING • PUNE',
    'LIVE BAR',
    'Pune',
    NULL,
    true,
    true,
    (SELECT id FROM auth.users WHERE email = 'shamsud.ahmed@gmail.com'),
    '2024-01-01 00:00:00+00'
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    is_active = true,
    is_public = true;

-- Verify the insert
SELECT id, name, slug, is_active, created_at 
FROM venues 
ORDER BY created_at;
