# Menu Theme System Implementation

## Completed ✅
1. Created 5 distinct menu themes in `menuThemes.ts`
2. Made tagline venue-specific (only LIVE shows "EAT • DRINK • CODE • REPEAT")
3. Removed QR code from landing page

## Next Steps

### 1. Database Schema Update
Add `theme` and `tagline` columns to `venues` table:
```sql
ALTER TABLE venues 
ADD COLUMN theme VARCHAR(50) DEFAULT 'elegant-classic',
ADD COLUMN tagline TEXT,
ADD COLUMN show_qr_on_menu BOOLEAN DEFAULT false;
```

### 2. Theme Selector Component
Create `ThemeSelector.tsx` in admin panel:
- Visual preview of each theme
- Radio buttons or cards for selection
- Live preview capability
- Save to database

### 3. QR Code in Print Preview
Add QR code option in PrintPreview component:
- Toggle to include/exclude QR code
- Position selector (top-right, bottom-center, etc.)
- Custom QR code upload option

### 4. Apply Theme to Components
Update these components to use selected theme:
- `Index.tsx` - Landing page
- `PrintPreview.tsx` - PDF export
- `MenuSection.tsx` - Menu sections
- `PremiumBorderFrame.tsx` - Border styling

## Theme Descriptions

### 1. Cyberpunk Tech (Current LIVE style)
- **Colors**: Neon cyan, magenta, gold on dark background
- **Fonts**: Orbitron, Rajdhani, Cinzel
- **Style**: Futuristic, tech-premium, neon accents
- **Best For**: Modern bars, tech cafes, nightlife venues

### 2. Elegant Classic
- **Colors**: Gold, brown, cream on light background
- **Fonts**: Playfair Display, Lora, Cormorant Garamond
- **Style**: Traditional, sophisticated, timeless
- **Best For**: Fine dining, upscale restaurants, hotels

### 3. Modern Minimal
- **Colors**: Black, gray, orange on white
- **Fonts**: Inter, Space Grotesk
- **Style**: Clean, contemporary, content-focused
- **Best For**: Cafes, bistros, modern eateries

### 4. Rustic Organic
- **Colors**: Brown, orange, green on cream
- **Fonts**: Merriweather, Open Sans, Caveat
- **Style**: Warm, natural, handcrafted
- **Best For**: Farm-to-table, organic cafes, countryside restaurants

### 5. Vibrant Playful
- **Colors**: Pink, teal, yellow on light gray
- **Fonts**: Poppins, Nunito, Fredoka One
- **Style**: Bold, energetic, fun
- **Best For**: Family restaurants, casual dining, food trucks

## Implementation Priority
1. ✅ Theme system created
2. ✅ Tagline made venue-specific
3. ⏳ Database schema update
4. ⏳ Theme selector UI
5. ⏳ QR code in print preview
6. ⏳ Apply themes to components
