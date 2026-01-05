# Adding Moon Walk Logo - Instructions

## ✅ Code Changes Complete

The code has been updated to support logo images for Moon Walk NX!

## 📋 Manual Step Required

You need to copy the Moon Walk logo image to the correct location:

### Step 1: Locate the Logo Image
The logo image you uploaded is:
- **File**: `uploaded_image_1_1767596973936.jpg`
- **Location**: `C:/Users/shams/.gemini/antigravity/brain/498af547-f893-4df4-84bd-38d2f53d118d/uploaded_image_1_1767596973936.jpg`

### Step 2: Copy to Public Folder
1. **Copy** the image file
2. **Paste** it to: `c:\Users\shams\Downloads\Menu\crisp-menu-boost\public\`
3. **Rename** it to: `moonwalk-logo.jpg`

### Final Path Should Be:
```
c:\Users\shams\Downloads\Menu\crisp-menu-boost\public\moonwalk-logo.jpg
```

## 🔄 Alternative: Use PowerShell Command

You can also copy the file using this PowerShell command:

```powershell
Copy-Item "C:/Users/shams/.gemini/antigravity/brain/498af547-f893-4df4-84bd-38d2f53d118d/uploaded_image_1_1767596973936.jpg" "c:\Users\shams\Downloads\Menu\crisp-menu-boost\public\moonwalk-logo.jpg"
```

## ✨ What Will Happen

Once the logo is in place:
- Moon Walk NX menu will show the **image logo** instead of text
- LIVE menu will continue to show the **text logo** ("LIVE")
- The logo will have a golden glow effect
- It will be responsive and look great on all devices

## 🧪 Testing

After copying the logo:
1. Navigate to: `http://localhost:5173/menu/moonwalk-nx`
2. **Hard refresh**: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. You should see the Moon Walk logo image instead of text

## 🎨 How It Works

The code checks the venue slug:
- If `slug === 'moonwalk-nx'` → Shows image logo from `/moonwalk-logo.jpg`
- Otherwise → Shows text logo (LIVE, etc.)

## 📝 Adding Logos for Other Venues

To add logos for other venues in the future:

1. Add the logo image to `/public/` folder
2. Update `MenuHeader.tsx` line 24-25:

```tsx
const hasLogoImage = venueSlug === 'moonwalk-nx' || venueSlug === 'your-new-venue';
const logoImagePath = venueSlug === 'moonwalk-nx' ? '/moonwalk-logo.jpg' 
                    : venueSlug === 'your-new-venue' ? '/your-logo.jpg'
                    : null;
```

Or better yet, store logo paths in the database!

## 🔧 Troubleshooting

**Logo not showing?**
1. Check file exists at: `public/moonwalk-logo.jpg`
2. Check filename is exactly: `moonwalk-logo.jpg` (lowercase, no spaces)
3. Hard refresh the browser
4. Check browser console for errors

**Tagline still showing?**
1. Hard refresh: `Ctrl+Shift+R`
2. Clear browser cache
3. Try incognito/private window
4. The code is correct - it's just browser caching

---

**Ready!** Just copy the logo file and you're all set! 🚀
