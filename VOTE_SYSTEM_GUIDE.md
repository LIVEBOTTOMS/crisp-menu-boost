# 🎯 Vote-to-Discount System Implementation Guide

## Overview
The Vote-to-Discount system allows customers to vote for menu items to reduce their prices dynamically. This gamification feature increases engagement and creates viral potential.

## Business Logic
- **10 votes = 1% discount**
- **Maximum: 100 votes = 10% discount**
- **Anti-Fraud:** Browser fingerprinting prevents duplicate votes
- **Real-time:** Prices update instantly via UI and Database Trigger

---

## Phase 1: Database Setup ✅

### Step 1: Run Migrations in Supabase

1. **Vote Tables:**
   Copy content from: `supabase/migrations/20260112_vote_to_discount.sql`
   
2. **Auto-Update Trigger:**
   Copy content from: `supabase/migrations/20260112_vote_trigger.sql`
   
   *This trigger automatically updates `menu_items.price` and `menu_items.discount_percent` whenever a vote is cast.*

### Step 2: Verify Tables Created
Run this SQL:
```sql
SELECT * FROM item_votes LIMIT 1;
SELECT * FROM item_original_prices LIMIT 1;
SELECT * FROM item_vote_counts;
```

---

## Phase 2: Implementation Details (Already done in code)

### 1. Vote Button Integration
The `VoteButton` has been added to `src/components/EditableMenuItem.tsx`. It:
- Shows current vote count
- Shows progress to next 1% discount
- Handles voting logic with anti-fraud

### 2. Admin Settings
Added to `src/pages/AdminDashboard.tsx` (below Daily Offers).
- Allows resetting votes
- Shows system status

---

## Phase 3: Testing Checklist

### Local Testing

1. **Verify Database:** Ensure both migrations above are run.
2. **Test Voting:**
   - Go to `/menu/live`
   - Find an item
   - Click "Vote"
   - Confirm accurate vote count
   - Refresh page to see if price updates (after 10 votes)
3. **Test Admin:**
   - Go to `/admin/live`
   - Check "Vote-to-Discount System" panel
   - Try "Reset All Votes"

---

## Troubleshooting

### Issue: "Price not updating"
**Solution:** Ensure `trigger_update_discount_on_vote` is active in the database.

### Issue: "Already voted"
**Solution:** Use Incognito window to simulate new user.

### Issue: "Vote button missing"
**Solution:** Ensure `venueData.id` is available (try refreshing).

---

**Status:** Ready for testing ✅
