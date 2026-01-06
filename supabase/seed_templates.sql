-- Mark 'LIVE BAR' as a template for testing
UPDATE venues 
SET 
  is_template = true, 
  template_category = 'Bar & Nightclub',
  template_tags = ARRAY['dark', 'neon', 'modern', 'cocktails'],
  preview_image_url = 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1000'
WHERE slug = 'live-bar';

-- Create another dummy template 'Italian Bistro' (if not exists)
INSERT INTO venues (
  name, 
  slug, 
  type, 
  owner_id, 
  is_template, 
  template_category, 
  template_tags,
  preview_image_url,
  theme_settings
)
SELECT 
  'Tuscany Italian Bistro',
  'tuscany-bistro-template',
  'restaurant',
  (SELECT id FROM auth.users WHERE email = 'shamsud.ahmed@gmail.com'),
  true,
  'Fine Dining',
  ARRAY['elegant', 'light', 'classic'],
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1000',
  '{"primaryColor": "#c2410c", "backgroundColor": "#fff7ed", "fontFamily": "serif"}'
WHERE NOT EXISTS (SELECT 1 FROM venues WHERE slug = 'tuscany-bistro-template');
