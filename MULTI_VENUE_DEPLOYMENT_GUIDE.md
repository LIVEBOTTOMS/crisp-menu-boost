# 🍽️ Multi-Venue Menu App - Deployment Guide

## Overview
This menu app is designed to be **easily reusable** for any hotel, bar, or restaurant. Follow this guide to deploy it for a new venue while maintaining consistency and similar functionality.

---

## 📋 Quick Start (5-Minute Setup)

### Step 1: Clone the Repository
```bash
git clone https://github.com/LIVEBOTTOMS/crisp-menu-boost.git
cd crisp-menu-boost
npm install
```

### Step 2: Configure Your Venue
Open `src/config/venueConfig.ts` and update the `venueConfig` object:

```typescript
export const venueConfig: VenueConfig = {
  // Replace these with your venue's information
  name: "YOUR RESTAURANT NAME",
  tagline: "Your Tagline Here",
  subtitle: "RESTAURANT TYPE • CITY",
  establishedYear: "2024",
  
  logoText: "YOUR LOGO",
  logoSubtext: "Your • Sub • Text",
  
  city: "Your City",
  address: "Your Full Address",
  
  // Optional: Add contact info
  phone: "+91 XXXXXXXXXX",
  email: "contact@yourrestaurant.com",
};
```

### Step 3: Set Up Supabase Database
1. Create a new Supabase project at https://supabase.com
2. Copy your project URL and API key
3. Update `.env` file:

```env
VITE_SUPABASE_URL="your-supabase-url"
VITE_SUPABASE_PUBLISHABLE_KEY="your-supabase-anon-key"
```

4. Run the database migrations:
   - Go to Supabase SQL Editor
   - Run the migration files in order from `supabase/migrations/`

### Step 4: Add Your Menu Items (Option 1: Admin Dashboard)
```bash
npm run dev
# Open http://localhost:5173/admin
# Login and use "Sync from Code" button
```

### Step 5: Add Your Menu Items (Option 2: Direct Database)
Update your menu in the Supabase database or use the admin panel.

### Step 6: Deploy
```bash
# Build for production
npm run build

# Deploy to your hosting platform (Vercel, Netlify, etc.)
```

---

## 🎨 Customization Options

### 1. **Update Venue Information**
All venue-specific information is centralized in `src/config/venueConfig.ts`:

- **Basic Info**: Name, tagline, subtitle, established year
- **Branding**: Logo text, subtext
- **Location**: City, address, Google Maps URL
- **Contact**: Phone, email, website
- **Social Media**: Instagram, Facebook, Twitter
- **QR Code**: Custom QR code and label

### 2. **Replace QR Code**
Replace `src/assets/qr-code.png` with your own QR code image.

### 3. **Update Colors (Optional)**
The app uses a premium cyberpunk theme by default. To customize colors, update `tailwind.config.ts`:

```typescript
colors: {
  neon: {
    cyan: "#00f0ff",      // Change primary color
    magenta: "#ff00ff",   // Change secondary color
    gold: "#ffd700",      // Change accent color
  },
}
```

### 4. **Enable/Disable Features**
In `src/config/venueConfig.ts`, toggle features:

```typescript
features: {
  enableOnlineOrdering: false,
  enableReservations: false,
  enableLoyaltyProgram: true,
  enableReviews: true,
  enableARExperience: true,
}
```

---

## 📱 Features Included

### ✅ Core Features (Always Active)
- **Digital Menu Display** - Beautiful, responsive menu with categories
- **Admin Dashboard** - Edit menu items, prices, and descriptions
- **PDF Export** - Generate professional menu PDFs
- **QR Code Integration** - Link to location, reservations, etc.
- **Mobile Responsive** - Perfect on all devices
- **Dark Mode** - Premium cyberpunk aesthetic

### 🔧 Optional Features (Enable as Needed)
- **Online Ordering** - Accept orders through the menu
- **Reservations** - Table booking system
- **Loyalty Program** - Points and rewards
- **Customer Reviews** - Display testimonials
- **AR Experience** - 3D menu visualization

---

## 🏗️ Architecture Overview

### File Structure
```
crisp-menu-boost/
├── src/
│   ├── config/
│   │   └── venueConfig.ts          ← EDIT THIS FOR NEW VENUE
│   ├── components/
│   │   ├── MenuHeader.tsx          ← Uses venueConfig
│   │   ├── MenuSection.tsx
│   │   ├── EditableMenuItem.tsx
│   │   └── ...
│   ├── pages/
│   │   ├── Index.tsx               ← Main menu page
│   │   └── AdminDashboard.tsx      ← Admin panel
│   ├── data/
│   │   └── menuData.ts             ← Fallback menu data
│   └── ...
├── supabase/
│   └── migrations/                 ← Database schema
├── .env                            ← Supabase credentials
└── package.json
```

### Database Schema
The app uses Supabase with these main tables:
- `menu_items` - All menu items with prices, descriptions
- `menu_categories` - Organize items (Appetizers, Mains, etc.)
- `venue_settings` - Store venue-specific settings

---

## 🚀 Deployment Platforms

### Option 1: Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Option 2: Netlify
```bash
npm run build
# Drag dist/ folder to Netlify drop zone
```

### Option 3: GitHub Pages
```bash
npm run build
# Push dist/ to gh-pages branch
```

---

## 🔄 Use Cases & Examples

### Use Case 1: Sports Bar
```typescript
export const venueConfig: VenueConfig = {
  name: "CHAMPIONS SPORTS BAR",
  tagline: "Where Legends Are Made",
  subtitle: "SPORTS BAR • BANGALORE",
  logoText: "CHAMPIONS",
  logoSubtext: "Sports • Drinks • Entertainment",
  city: "Bangalore",
  qrCodeLabel: "Scan for Today's Matches",
};
```

### Use Case 2: Fine Dining Restaurant
```typescript
export const venueConfig: VenueConfig = {
  name: "THE GARDEN",
  tagline: "Farm to Fork Excellence",
  subtitle: "FINE DINING • MUMBAI",
  logoText: "GARDEN",
  logoSubtext: "Fresh • Organic • Exquisite",
  city: "Mumbai",
  qrCodeLabel: "Scan to Reserve",
};
```

### Use Case 3: Hotel Restaurant
```typescript
export const venueConfig: VenueConfig = {
  name: "THE PALACE CAFE",
  tagline: "Luxury Dining Experience",
  subtitle: "HOTEL RESTAURANT • DELHI",
  logoText: "PALACE",
  logoSubtext: "Elegance • Comfort • Cuisine",
  city: "Delhi",
  qrCodeLabel: "Scan for Room Service",
};
```

---

## 📖 Admin Panel Guide

### Accessing Admin Panel
1. Navigate to `/auth` and login
2. Access `/admin` dashboard
3. Use the "Sync from Code" button to load menu data

### Managing Menu Items
- **Add Items**: Click "Add New Item" button
- **Edit Items**: Click on any item to edit
- **Delete Items**: Use delete button in edit mode
- **Reorder**: Drag and drop items
- **Export PDF**: Click "Export PDF" for printable menu

---

## 🛠️ Troubleshooting

### Issue: Blank Screen
**Solution**: Go to `/admin` and click "Sync from Code"

### Issue: Database Connection Error
**Solution**: Check `.env` file has correct Supabase credentials

### Issue: Menu Not Loading
**Solution**: 
1. Check Supabase connection
2. Run migrations in Supabase SQL Editor
3. Sync from admin panel

### Issue: localhost not working
**Solution**: 
```bash
# Kill existing process and restart
npm run dev
# App runs on http://localhost:5173
```

---

## 🎓 Best Practices

1. **Always update `venueConfig.ts` first** - This is the single source of truth
2. **Test locally before deploying** - Run `npm run dev` and verify
3. **Keep menu data in database** - Use admin panel for menu management
4. **Backup your database** - Export from Supabase regularly
5. **Use environment variables** - Never commit `.env` file
6. **Version control** - Create a new branch for each venue

---

## 📞 Support

For issues or questions:
- Check the troubleshooting section above
- Review the code comments in `venueConfig.ts`
- Consult `NEXT_SESSION.md` for latest updates

---

## 🎉 Success Checklist

Before going live, verify:
- [ ] Venue name and information updated in `venueConfig.ts`
- [ ] QR code replaced with your own
- [ ] Menu items added via admin panel
- [ ] Supabase database configured
- [ ] Environment variables set
- [ ] App tested on mobile and desktop
- [ ] PDF export works correctly
- [ ] Admin panel accessible
- [ ] Domain configured (if deploying to custom domain)

---

## 📝 Changelog

- **v1.0** - Initial multi-venue support with centralized config
- **v0.9** - Single venue version (LIVE BAR)

---

**Ready to Launch?** Follow the Quick Start guide above and you'll have your menu live in less than 30 minutes! 🚀
