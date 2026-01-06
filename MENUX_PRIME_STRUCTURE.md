# MenuX Prime - Application Structure

## Overview
**MenuX Prime** is now a world-class menu creation platform (SaaS). The application allows restaurants to create, manage, and display premium digital menus with real-time synchronization.

## Key Pages

### 1. Landing Page (`/`)
- **Purpose**: Marketing page showcasing MenuX Prime platform
- **Features**:
  - Hero section with gradient headline
  - Feature cards (Real-Time Sync, Mobile Optimized, Print Ready, etc.)
  - Featured venues showcase (LIVE BAR, MoonWalk NX)
  - CTA buttons to create menus or view demos
  - Premium dark theme with neon accents

### 2. Menus Dashboard (`/menus`)
- **Purpose**: User dashboard to manage all their menus
- **Features**:
  - Lists all created menus including LIVE BAR and MoonWalk NX
  - Search and filter functionality
  - Actions: View, Edit, Duplicate, Delete
  - Real-time updates when menus are created/modified

### 3. Create Menu Page (`/create-menu`)
- **Purpose**: Create a new restaurant menu
- **Features**:
  - Multi-step form (Basic Info, Theme, Branding)
  - Theme selection with live preview
  - Option to copy default menu items
  - Auto-generates slug from name

### 4. Public Menu View (`/menu/:slug`)
- **Purpose**: Customer-facing menu display
- **Examples**: 
  - `/menu/live` - LIVE BAR menu
  - `/menu/moonwalk-nx` - MoonWalk NX menu
- **Features**:
  - Venue-specific branding and themes
  - Responsive design
  - QR code generation
  - Real-time menu updates

### 5. Admin Dashboard (`/admin` or `/edit-menu/:slug`)
- **Purpose**: Manage menu items, prices, and settings
- **Features**:
  - Edit mode for inline editing
  - Price adjustment tools
  - Theme switcher
  - Menu archives (LIVE only)
  - Print/PDF export
  - QR code management

## Default Venues

### LIVE BAR
- **Slug**: `live`
- **Theme**: Cyberpunk Tech
- **Location**: Wakad, Pune
- **Features**: Full menu with archives enabled
- **Access**: 
  - Public: `/menu/live`
  - Admin: `/admin` or `/edit-menu/live`

### MoonWalk NX
- **Slug**: `moonwalk-nx`
- **Theme**: Elegant Classic
- **Location**: Pune
- **Features**: Premium dining menu, archives disabled
- **Access**:
  - Public: `/menu/moonwalk-nx`
  - Admin: `/edit-menu/moonwalk-nx`

## Key Features

### Real-Time Synchronization
- Changes made in the admin panel instantly reflect on all public views
- Powered by Supabase postgres_changes channels
- Venue-specific data filtering

### Multi-Venue Support
- Each venue has independent:
  - Menu sections, categories, and items
  - Branding (logo, colors, theme)
  - Settings and configurations
- Centralized management through the dashboard

### Archive System (LIVE only)
- Automatic archiving before price adjustments
- Ability to restore previous menu versions
- PDF export of archived menus
- MoonWalk explicitly excludes archives

### Theme System
Available themes:
- Cyberpunk Tech (Neon accents, futuristic)
- Elegant Classic (Sophisticated, premium)
- Modern Minimalist
- Luxury Dark
- Nature & Organic

## Navigation Flow

```
Landing Page (/)
    │
    ├─→ Login/Signup (/auth)
    │
    ├─→ Menus Dashboard (/menus)
    │   │
    │   ├─→ View Menu (/menu/:slug)
    │   ├─→ Edit Menu (/edit-menu/:slug)
    │   ├─→ Create New Menu (/create-menu)
    │   └─→ Duplicate/Delete Menu
    │
    └─→ Direct Menu Access (/menu/live, /menu/moonwalk-nx)
```

## Database Structure

### Tables
- **venues**: Store venue/restaurant information
- **menu_sections**: Menu sections (Snacks, Food, Beverages, Sides)
- **menu_categories**: Categories within sections
- **menu_items**: Individual menu items
- **archived_menus**: Historical menu snapshots (LIVE only)
- **user_roles**: Admin access control

### Key Relationships
- Sections belong to a venue (`venue_id`)
- Categories belong to a section
- Items belong to a category
- Real-time sync filters by venue_id

## Configuration Files

### `/src/config/venueConfig.ts`
- Default venue configuration (LIVE BAR)
- Used as fallback when venue-specific data is unavailable

### `/src/config/menuThemes.ts`
- Theme definitions with colors, fonts, and styling
- Applied per-venue basis

## Important Notes

1. **LIVE BAR** and **MoonWalk NX** are hardcoded as default demo venues
2. They automatically seed to the database on first load
3. Archives are only enabled for venues with "live" in the name
4. All menus support real-time synchronization
5. The landing page is purely marketing - actual menus are managed separately

## For Developers

### Adding a New Venue
1. Use `/create-menu` form
2. Or insert directly into `venues` table
3. Menu items can be copied from defaults or created manually

### Customizing Themes
Edit `/src/config/menuThemes.ts` to add new themes or modify existing ones.

### Disabling Archives
Archives are disabled for any venue that doesn't include "live" in its configured name (case-insensitive).
