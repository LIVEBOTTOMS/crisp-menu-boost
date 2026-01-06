-- Seed default venues: LIVE BAR and MoonWalk NX
-- This ensures they appear in the menus dashboard

-- Insert LIVE BAR if it doesn't exist
INSERT INTO venues (
    name,
    slug,
    tagline,
    subtitle,
    logo_text,
    logo_subtext,
    theme,
    city,
    is_active
)
VALUES (
    'LIVE BAR',
    'live',
    'Eat.Drink.Code.Repeat',
    'FINE DINING • PUNE',
    'LIVE',
    'Eat • Drink • Code • Repeat',
    'cyberpunk-tech',
    'Pune',
    true
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    subtitle = EXCLUDED.subtitle,
    logo_text = EXCLUDED.logo_text,
    logo_subtext = EXCLUDED.logo_subtext,
    theme = EXCLUDED.theme,
    city = EXCLUDED.city,
    is_active = EXCLUDED.is_active;

-- Insert MoonWalk NX if it doesn't exist
INSERT INTO venues (
    name,
    slug,
    tagline,
    subtitle,
    logo_text,
    logo_subtext,
    logo_image_url,
    theme,
    city,
    is_active
)
VALUES (
    'MoonWalk NX',
    'moonwalk-nx',
    'Where Culinary Art Meets Innovation',
    'FINE DINING • PUNE',
    'MOONWALK',
    'NX • Premium Dining',
    '/lovable-uploads/44cfff7f-ac94-4f62-8ebe-1ac4f6fc0df9.png',
    'elegant-classic',
    'Pune',
    true
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    subtitle = EXCLUDED.subtitle,
    logo_text = EXCLUDED.logo_text,
    logo_subtext = EXCLUDED.logo_subtext,
    logo_image_url = EXCLUDED.logo_image_url,
    theme = EXCLUDED.theme,
    city = EXCLUDED.city,
    is_active = EXCLUDED.is_active;
