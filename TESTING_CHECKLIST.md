# 🧪 Multi-Menu Platform - Testing Checklist

## ✅ Pre-Testing Setup

### 1. Database Migration
- [ ] Go to https://supabase.com → Your project
- [ ] Open SQL Editor
- [ ] Copy SQL from `supabase/migrations/20260104_multi_venue_system.sql`
- [ ] Run the SQL
- [ ] Verify tables created: `venues` and `venue_menu_items`

---

## 🎯 Testing Steps

### Test 1: Homepage
- [✅] Open http://localhost:5173
- [✅] Verify you see **"MENU PLATFORM"** header
- [✅] Verify you see **"Create Menu"** card (left, cyan)
- [✅] Verify you see **"View Menus"** card (right, magenta)
- [ ] Click on each card - should navigate correctly

### Test 2: Create First Menu
1. [ ] Click "Create Menu" button
2. [ ] Should navigate to `/create-menu`
3. [ ] Fill in the form:
   - Restaurant Name: "The Garden"
   - Tagline: "Farm to Fork"
   - Subtitle: "FINE DINING • MUMBAI"
   - City: "Mumbai"
   - (Other fields optional)
4. [ ] Click "Create Menu" button
5. [ ] Should show loading state
6. [ ] Should redirect to edit page
7. [ ] Verify menu items copied from template

### Test 3: View Menus List
1. [ ] Go back to homepage (click back or navigate to `/`)
2. [ ] Click "View Menus"
3. [ ] Should see "The Garden" in the list
4. [ ] Verify card shows:
   - Restaurant name
   - Subtitle/city
   - Created date
   - 4 action buttons (View, Edit, Duplicate, Delete)

### Test 4: Search Functionality
1. [ ] On menus list page
2. [ ] Type "Garden" in search box
3. [ ] Should filter to show only matching menus
4. [ ] Clear search
5. [ ] All menus should show again

### Test 5: View Public Menu
1. [ ] On menus list, click the "View" (eye icon) button
2. [ ] Should navigate to `/menu/the-garden`
3. [ ] Should see menu display with:
   - Restaurant name in header
   - Menu categories
   - Menu items with prices
4. [ ] Verify branding shows "The Garden" not "LIVE BAR"

### Test 6: Edit Menu
1. [ ] Go back to menus list
2. [ ] Click "Edit" (pencil icon) button
3. [ ] Should navigate to `/edit-menu/the-garden`
4. [ ] Should see admin dashboard
5. [  ] Try editing an item:
   - Click on a menu item
   - Change the price
   - Save
6. [ ] Verify change persists

### Test 7: Duplicate Menu
1. [ ] Go to menus list
2. [ ] Click "Duplicate" (copy icon) button
3. [ ] Wait for confirmation toast
4. [ ] Should see "The Garden (Copy)" in list
5. [ ] Verify it has all the same menu items
6. [ ] Verify it has unique slug

### Test 8: Delete Menu
1. [ ] On menus list
2. [ ] Click "Delete" (trash icon) on the copy
3. [ ] Confirm deletion in dialog
4. [ ] Menu should disappear from list
5. [ ] (Soft delete - still in database with is_active=false)

### Test 9: Create Second Menu (Different Type)
1. [ ] Click "Create New Menu" button
2. [ ] Fill in for a different type:
   - Name: "Champions Sports Bar"
   - Tagline: "Where Legends Are Made"
   - Subtitle: "SPORTS BAR • BANGALORE"
   - City: "Bangalore"
3. [ ] Create and customize
4. [ ] Go to menus list
5. [ ] Should see both "The Garden" and "Champions Sports Bar"

### Test 10: Multiple Menu Navigation
1. [ ] View list with 2+ menus
2. [ ] Click View on different menus
3. [ ] Each should show different branding
4. [ ] URLs should be different:
   - `/menu/the-garden`
   - `/menu/champions-sports-bar`

---

## 🐛 Common Issues to Check

### Database Issues
- [ ] If "table doesn't exist" → Run migration
- [ ] If "permission denied" → Check RLS policies  
- [ ] If data not saving → Check Supabase logs

### UI Issues
- [ ] If blank page → Check browser console
- [ ] If TypeScript errors → Expected (tables not in types yet)
- [ ] If navigation broken → Check routes in App.tsx

### Performance
- [ ] Page loads quickly
- [ ] No lag when creating menus
- [ ] Search is responsive
- [ ] List view performs well with 5+ menus

---

## 📊 Expected Results

After testing, you should have:
- [ ] Homepage working with 2 options
- [ ] At least 2 different menus created
- [ ] Ability to view each menu publicly
- [ ] Ability to edit each menu
- [ ] Search working
- [ ] Duplicate working
- [ ] Delete working (soft delete)

---

## 🚀 Ready for Git?

Once all tests pass:
- [ ] All pages load correctly
- [ ] Can create menus
- [ ] Can edit menus
- [ ] Can view menus
- [ ] Can duplicate/delete
- [ ] No critical console errors
- [ ] Database migration documented

Then you're ready to:
```bash
git add .
git commit -m "feat: Multi-menu management platform

- Added homepage with Create/View menu options
- Created menu creation form
- Builthomenus list with search
- Added per-menu view and edit pages
- Database schema for multiple venues
- Each menu has unique URL and branding"

git push origin main
```

---

## 📝 Notes

**TypeScript Errors**: You'll see TS errors about `venues` and `venue_menu_items` tables. This is expected - they're not in the Supabase type definitions yet. The code will work fine at runtime once the migration is run.

**Test Data**: Create diverse test data:
- Different restaurant types (fine dining, sports bar, cafe)
- Different cities
- Different price ranges
- Different menu structures

This will help validate the system works for various use cases.

---

## ✅ Success Criteria

✓ Can create unlimited menus  
✓ Each menu is independent  
✓ Changes to one don't affect others  
✓ Each has unique URL  
✓ Search and filter work  
✓ Duplicate copies everything  
✓ Delete is reversible (soft delete)  

**Status**: Ready for local testing! Run the migration and start testing! 🎉
