# MenuX Prime - Quick Start Guide

## 🚀 Getting Started (When You Return)

### 1. Start Development Server
```bash
cd c:\Users\shams\Downloads\Menu\crisp-menu-boost
npm run dev
```
Server will run on: **http://localhost:5173**

### 2. Access Platform Admin Dashboard
**Method 1 (Keyboard Shortcut):**
- Press `Ctrl+Shift+A` from anywhere in the app

**Method 2 (Direct URL):**
- Navigate to: `http://localhost:5173/platform-admin`

### 3. Login Credentials
- **Super Admin Email**: `shamsud.ahmed@gmail.com`
- **Password**: [Your Supabase auth password]

---

## 📁 Project Structure

### Key Directories
```
crisp-menu-boost/
├── src/
│   ├── components/
│   │   ├── admin/              # Platform admin components
│   │   │   ├── PlatformSidebar.tsx
│   │   │   └── PlatformOverview.tsx
│   │   └── GlobalShortcuts.tsx # Ctrl+Shift+A handler
│   ├── pages/
│   │   ├── MasterAdminDashboard.tsx  # Main admin container
│   │   ├── VenueManagementPage.tsx   # Venue management
│   │   ├── UserManagementPage.tsx    # User management
│   │   └── PaymentApprovalsPage.tsx  # Payment approvals
│   └── App.tsx                 # Main app with routes
├── supabase/
│   └── migrations/             # Database migrations
└── MASTER_ADMIN_DASHBOARD_SUMMARY.md  # Full documentation
```

---

## 🎯 Common Tasks

### Add a New Admin User
1. Open Supabase SQL Editor
2. Run:
```sql
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'new.admin@example.com';
```

### Add a New Venue
1. Go to `/platform-admin/venues`
2. Or insert directly:
```sql
INSERT INTO venues (name, slug, city, is_active, is_public, owner_id)
VALUES (
    'New Restaurant',
    'new-restaurant',
    'Pune',
    true,
    true,
    (SELECT id FROM auth.users WHERE email = 'owner@example.com')
);
```

### View All Platform Data
```sql
-- All venues
SELECT * FROM venues;

-- All users with roles
SELECT * FROM admin_users_view;

-- Platform stats
SELECT 
    (SELECT COUNT(*) FROM user_roles) as total_users,
    (SELECT COUNT(*) FROM venues) as total_venues,
    (SELECT COUNT(*) FROM venues WHERE is_active = true) as active_venues;
```

---

## 🗄️ Database Migrations to Run

### Required Migrations (Run in Supabase SQL Editor)
1. **Grant Super Admin**:
   - File: `supabase/migrations/20260107_grant_super_admin.sql`
   - Purpose: Makes shamsud.ahmed@gmail.com a super admin

2. **Create LIVE Venue**:
   - File: `supabase/migrations/20260107_create_live_venue.sql`
   - Purpose: Adds LIVE BAR to venues table

3. **Admin Users View**:
   - File: `supabase/migrations/20260107_admin_users_view.sql`
   - Purpose: Allows viewing user emails in dashboard

4. **Fix Venue RLS**:
   - File: `supabase/migrations/20260107_fix_venue_rls.sql`
   - Purpose: Allows admins to see all venues

---

## 🎨 Platform Admin Features

### Dashboard Sections
1. **Overview** (`/platform-admin`)
   - Total users, venues, revenue
   - Platform health status
   - Quick actions

2. **Venues** (`/platform-admin/venues`)
   - View all businesses
   - Toggle active/inactive
   - Live preview links

3. **Users** (`/platform-admin/users`)
   - View all users
   - Manage admin roles
   - See subscription plans

4. **Payments** (`/platform-admin/payments`)
   - Approve/reject payment requests
   - Add admin notes

5. **Analytics** (`/platform-admin/analytics`)
   - Coming soon

---

## 🔧 Troubleshooting

### Dashboard Not Loading
1. Check if you're logged in as admin
2. Verify admin role in database:
```sql
SELECT * FROM user_roles WHERE user_id = auth.uid();
```

### Venues Not Showing
1. Check RLS policies:
```sql
SELECT * FROM pg_policies WHERE tablename = 'venues';
```
2. Verify venues exist:
```sql
SELECT * FROM venues;
```

### User Emails Showing as UUIDs
1. Check if view exists:
```sql
SELECT * FROM admin_users_view;
```
2. If not, run: `20260107_admin_users_view.sql`

---

## 📊 Current Platform Status

### Venues
- **LIVE BAR** (slug: `live`)
- **MOONWALK NX** (slug: `moonwalk-nx`)

### Super Admins
- shamsud.ahmed@gmail.com

### Routes
- Homepage: `/`
- Platform Admin: `/platform-admin`
- Venue Menu: `/menu/{slug}`
- Edit Menu: `/edit-menu/{slug}`

---

## 🔐 Security Notes

### Admin Access
- Only users with `role = 'admin'` in `user_roles` table
- RLS policies enforce data visibility
- Access denied screen for non-admins

### Database Security
- Row Level Security (RLS) enabled on all tables
- Admins can view all data
- Regular users can only view their own data

---

## 📝 Next Development Steps

### High Priority
1. **Real Trend Calculations**: Replace hardcoded percentages with actual month-over-month growth
2. **Pagination**: Add for users and venues lists
3. **Real-time Updates**: Use Supabase subscriptions for live data
4. **Analytics Module**: Implement charts and graphs

### Medium Priority
1. **Audit Logs**: Track all admin actions
2. **Bulk Operations**: Multi-select for venues/users
3. **Export Functionality**: CSV/JSON exports
4. **Email Notifications**: Alert on new signups/payments

### Low Priority
1. **User Impersonation**: View app as any user
2. **Advanced Filters**: Date ranges, status filters
3. **Settings Page**: Platform-wide configuration
4. **Mobile Optimization**: Better mobile admin experience

---

## 🆘 Support

### Documentation
- **Full Summary**: `MASTER_ADMIN_DASHBOARD_SUMMARY.md`
- **Git History**: Check commit `8e13201` for all changes

### Useful Commands
```bash
# View git log
git log --oneline -10

# Check current branch
git branch

# Pull latest changes
git pull origin main

# View file changes
git diff HEAD~1
```

---

## ✅ Pre-Flight Checklist

Before starting work:
- [ ] Development server running (`npm run dev`)
- [ ] Logged in as super admin
- [ ] All migrations run in Supabase
- [ ] Can access `/platform-admin`
- [ ] Both venues visible
- [ ] User emails displaying correctly

---

**Last Updated**: January 7, 2026
**Git Commit**: 8e13201
**Branch**: main
**Status**: ✅ Production Ready
