# 🍽️ Crisp Menu Boost - Multi-Venue Digital Menu System

**A beautiful, reusable digital menu application for restaurants, bars, and hotels.**

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/LIVEBOTTOMS/crisp-menu-boost)

---

## ✨ Features

### 🎯 Core Features
- **Premium Cyberpunk Design** - Eye-catching neon aesthetics with glassmorphism
- **Fully Responsive** - Perfect on mobile, tablet, and desktop
- **Admin Dashboard** - Easy menu management without coding
- **PDF Export** - Generate professional printable menus
- **QR Code Integration** - Link to location, payments, or reservations
- **Real-time Updates** - Changes reflect instantly
- **Multi-Venue Ready** - Easy deployment for multiple locations

### 🚀 Advanced Features
- **Supabase Integration** - Scalable cloud database
- **Authentication** - Secure admin access
- **Image Support** - Beautiful food photography
- **Category Management** - Organize menu by sections
- **Price Management** - Easy pricing updates
- **Veg/Non-Veg Indicators** - Automatic dietary labels

---

## 🎬 Quick Start (5 Minutes!)

### Method 1: Setup Wizard (Easiest)
```bash
# Clone repository
git clone https://github.com/LIVEBOTTOMS/crisp-menu-boost.git
cd crisp-menu-boost

# Install dependencies
npm install

# Run setup wizard
node setupVenue.js

# Start development server
npm run dev
```

### Method 2: Manual Setup
```bash
# Clone and install
git clone https://github.com/LIVEBOTTOMS/crisp-menu-boost.git
cd crisp-menu-boost
npm install

# Edit venue configuration
# Open: src/config/venueConfig.ts
# Update with your restaurant details

# Start development server
npm run dev
```

Open **http://localhost:5173** to see your menu!

---

## 📝 Configuration

### Update Venue Information
Edit `src/config/venueConfig.ts`:

```typescript
export const venueConfig: VenueConfig = {
  name: "YOUR RESTAURANT NAME",
  tagline: "Your Tagline Here",
  subtitle: "RESTAURANT TYPE • CITY",
  establishedYear: "2024",
  logoText: "YOUR LOGO",
  logoSubtext: "Your • Sub • Text",
  city: "Your City",
  address: "Your Full Address",
  // ... more options
};
```

### Setup Database
1. Create Supabase account at https://supabase.com
2. Create new project
3. Copy credentials to `.env`:
```env
VITE_SUPABASE_URL="your-project-url"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
```
4. Run migrations from `supabase/migrations/` in Supabase SQL Editor

---

## 🎨 Customization

### Replace QR Code
Replace `src/assets/qr-code.png` with your QR code

### Update Colors
Edit `tailwind.config.ts` to change theme colors:
```typescript
colors: {
  neon: {
    cyan: "#00f0ff",    // Primary
    magenta: "#ff00ff", // Secondary
    gold: "#ffd700",    // Accent
  },
}
```

### Enable/Disable Features
In `venueConfig.ts`:
```typescript
features: {
  enableOnlineOrdering: false,
  enableReservations: false,
  enableLoyaltyProgram: true,
}
```

---

## 📖 Usage

### Admin Panel
1. Navigate to `/auth`
2. Login with credentials
3. Access `/admin`
4. Click "Sync from Code" to load menu
5. Edit items, prices, and categories

### Menu Management
- **Add Items**: Click "Add New Item"
- **Edit Items**: Click on any item
- **Export PDF**: Click "Export PDF" button
- **Reorder**: Drag and drop items

---

## 🏗️ Tech Stack

- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS + Custom Neon Theme
- **Database**: Supabase (PostgreSQL)
- **Build Tool**: Vite
- **UI Components**: shadcn/ui
- **PDF Generation**: Built-in export
- **Deployment**: Vercel / Netlify ready

---

## 📁 Project Structure

```
crisp-menu-boost/
├── src/
│   ├── config/
│   │   └── venueConfig.ts       ← Edit for new venue
│   ├── components/
│   │   ├── MenuHeader.tsx
│   │   ├── MenuSection.tsx
│   │   └── ...
│   ├── pages/
│   │   ├── Index.tsx            ← Main menu
│   │   └── AdminDashboard.tsx   ← Admin panel
│   └── ...
├── supabase/
│   └── migrations/              ← Database schema
├── setupVenue.js                ← Setup wizard
├── MULTI_VENUE_DEPLOYMENT_GUIDE.md
└── README.md
```

---

## 🚀 Deployment

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### Deploy to Custom Server
```bash
npm run build
# Upload dist/ to your web server
```

---

## 🎯 Use Cases

Perfect for:
- ✅ Restaurants & Cafes
- ✅ Bars & Pubs
- ✅ Hotel Restaurants
- ✅ Food Courts
- ✅ Cloud Kitchens
- ✅ Catering Services

---

## 📚 Documentation

- **[Multi-Venue Deployment Guide](MULTI_VENUE_DEPLOYMENT_GUIDE.md)** - Complete setup guide
- **[Next Session](NEXT_SESSION.md)** - Latest updates and status
- **[Checkpoint](CHECKPOINT_DINEOUT_MENU_COMPLETE.md)** - Feature completion status

---

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## 🐛 Troubleshooting

### Blank Screen?
1. Go to `/admin`
2. Click "Sync from Code"

### Database Error?
1. Check `.env` credentials
2. Run migrations in Supabase
3. Verify RLS policies

### Port Already in Use?
App uses port 5173. Kill existing process:
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5173 | xargs kill
```

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

---

## 📄 License

MIT License - feel free to use for commercial projects!

---

## 🌟 Credits

Built with ❤️ using modern web technologies

- Design inspired by premium cyberpunk aesthetics
- Icons from Lucide React
- Fonts from Google Fonts (Orbitron, Cinzel, Rajdhani)

---

## 📞 Support

- **Issues**: Open a GitHub issue
- **Documentation**: See MULTI_VENUE_DEPLOYMENT_GUIDE.md
- **Quick Start**: Run `node setupVenue.js`

---

## 🎉 Ready to Launch?

```bash
git clone https://github.com/LIVEBOTTOMS/crisp-menu-boost.git
cd crisp-menu-boost
npm install
node setupVenue.js
npm run dev
```

**Your digital menu will be live in less than 5 minutes!** 🚀

---

**[View Demo](http://localhost:5173)** • **[Documentation](MULTI_VENUE_DEPLOYMENT_GUIDE.md)** • **[Report Bug](https://github.com/LIVEBOTTOMS/crisp-menu-boost/issues)**
