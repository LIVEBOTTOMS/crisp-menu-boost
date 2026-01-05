# 🚀 Quick Reference Card - Multi-Venue Menu App

## ⚡ Super Quick Setup (Copy & Paste)

### New Venue in 3 Steps:
```bash
# 1. Clone & Install
git clone https://github.com/LIVEBOTTOMS/crisp-menu-boost.git YOUR-VENUE-NAME
cd YOUR-VENUE-NAME && npm install

# 2. Setup Venue (Interactive Wizard)
node setupVenue.js

# 3. Launch!
npm run dev
```

**Open:** http://localhost:5173

---

## 📝 Files to Edit for New Venue

| File | What to Change | Time |
|------|----------------|------|
| `src/config/venueConfig.ts` | Venue name, tagline, location | 2 min |
| `src/assets/qr-code.png` | Replace with your QR code | 1 min |
| `.env` | Supabase credentials | 1 min |

**Total Time:** ~5 minutes

---

## 🎯 Venue Config Template

```typescript
// src/config/venueConfig.ts
export const venueConfig = {
  name: "THE GARDEN",              // Restaurant name
  tagline: "Farm to Fork",         // Main tagline
  subtitle: "FINE DINING • MUMBAI",// Type & City
  establishedYear: "2024",
  logoText: "GARDEN",              // Logo (short)
  logoSubtext: "Fresh • Organic",
  city: "Mumbai",
  address: "Bandra West, Mumbai",
  phone: "+91 1234567890",         // Optional
  email: "hello@garden.com",       // Optional
  qrCodeLabel: "Scan to Reserve",
};
```

---

## 🗂️ Menu Categories

Default categories in the app:
- **Snacks & Starters** - Appetizers
- **Food Menu** - Main courses
- **Beverages** - Drinks
- **Sides** - Side dishes

Update via Admin Dashboard → `/admin`

---

## 🎨 Color Customization

### Quick Theme Change
Edit `tailwind.config.ts`:

```typescript
// Cyberpunk (Default)
neon: { cyan: "#00f0ff", magenta: "#ff00ff", gold: "#ffd700" }

// Ocean Blue
neon: { cyan: "#0099cc", magenta: "#0066cc", gold: "#00ccff" }

// Sunset Orange
neon: { cyan: "#ff6600", magenta: "#ff3300", gold: "#ffcc00" }

// Forest Green
neon: { cyan: "#00cc66", magenta: "#009944", gold: "#ccff00" }
```

---

## 📊 Database Setup (Supabase)

### Quick Setup:
1. Go to https://supabase.com
2. Create Project
3. SQL Editor → Run migrations from `supabase/migrations/`
4. Copy credentials:
   - **URL**: Project Settings → API → Project URL
   - **Key**: Project Settings → API → anon public

### Update `.env`:
```env
VITE_SUPABASE_URL="https://xxxxx.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGc..."
```

---

## 🔐 Admin Access

| URL | Purpose |
|-----|---------|
| `/auth` | Login page |
| `/admin` | Admin dashboard |
| `/admin` → "Sync from Code" | Load menu from database |

**Default credentials:** Set in Supabase Auth

---

## 📤 Export Options

### PDF Menu
1. Go to `/admin`
2. Click "Export PDF"
3. Professional menu PDF generated

### Menu Data
- Export from Supabase dashboard
- Backup: SQL dump in Supabase

---

## 🐛 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Blank screen | Go to `/admin` → Click "Sync from Code" |
| Database error | Check `.env` credentials |
| Port 5173 in use | Kill process: `taskkill /PID xxxx /F` (Windows) |
| Menu not loading | Run migrations in Supabase |
| Images not showing | Check image URLs in database |

---

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

All components are fully responsive!

---

## 🎬 Deployment Checklist

Before going live:
- [ ] Updated `venueConfig.ts`
- [ ] Replaced QR code
- [ ] Set Supabase credentials
- [ ] Added menu items via admin
- [ ] Tested on mobile & desktop
- [ ] PDF export works
- [ ] Admin panel accessible
- [ ] Custom domain set (if needed)

---

## 🚀 Deploy Commands

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Manual
```bash
npm run build
# Upload dist/ folder to your server
```

---

## 🎯 Venue Type Templates

### Fine Dining
- Elegant fonts (Cinzel priority)
- Gold/Silver accents
- Professional photos
- Detailed descriptions

### Sports Bar
- Bold fonts (Orbitron priority)
- Vibrant colors
- Quick-read layout
- Happy hour section

### Cafe
- Friendly fonts (Rajdhani)
- Warm colors
- Casual layout
- Daily specials

### Hotel Restaurant
- Luxurious fonts
- Premium colors
- Service hours
- Room service QR

---

## 🔄 Update Existing Venue

```bash
# 1. Pull latest changes
git pull origin main

# 2. Update config
# Edit src/config/venueConfig.ts

# 3. Rebuild
npm run build

# 4. Redeploy
vercel --prod
```

---

## 📞 Quick Links

- **Setup Guide**: [MULTI_VENUE_DEPLOYMENT_GUIDE.md](MULTI_VENUE_DEPLOYMENT_GUIDE.md)
- **Main README**: [README.md](README.md)
- **Supabase**: https://supabase.com
- **Vercel**: https://vercel.com

---

## 💡 Pro Tips

1. **Version Control**: Create branch for each venue
2. **Environment Variables**: Never commit `.env`
3. **Database Backup**: Export weekly from Supabase
4. **QR Positioning**: Place at table entrance
5. **Mobile First**: Test on actual phones
6. **PDF Updates**: Regenerate monthly
7. **Menu Photos**: Use high-quality images (< 500KB each)
8. **Performance**: Optimize images before upload

---

## 🌟 Feature Flags

Enable/disable in `venueConfig.ts`:

```typescript
features: {
  enableOnlineOrdering: false,   // Coming soon
  enableReservations: false,     // Coming soon
  enableLoyaltyProgram: true,    // Active
  enableReviews: true,           // Active
  enableARExperience: true,      // Beta
}
```

---

**Need Help?** Check the [Full Deployment Guide](MULTI_VENUE_DEPLOYMENT_GUIDE.md)

**Ready to Launch?** Run: `node setupVenue.js` 🚀
