# 🎯 Vote-to-Discount System Implementation Guide

## Overview
The Vote-to-Discount system allows customers to vote for menu items to reduce their prices dynamically. This gamification feature increases engagement and creates viral potential.

## Business Logic
- **10 votes = 1% discount**
- **Maximum: 100 votes = 10% discount**
- **Anti-Fraud:** Browser fingerprinting prevents duplicate votes
- **Real-time:** Prices update instantly
- **Anonymous:** No login required

---

## Phase 1: Database Setup ✅

### Run Migration
```sql
-- File: supabase/migrations/20260112_vote_to_discount.sql
-- Run this in Supabase SQL Editor
```

**Tables Created:**
1. `item_votes` - Stores individual votes
2. `item_original_prices` - Tracks base prices
3. `item_vote_counts` (VIEW) - Aggregated vote counts

**Key Features:**
- Row Level Security (RLS) enabled
- Duplicate vote prevention via UNIQUE constraint
- Indexed for performance
- Helper functions for admins

---

## Phase 2: Integration Steps

### Step 1: Add Vote Button to Menu Items

**File:** `src/components/EditableMenuItem.tsx` or `src/components/MenuItem.tsx`

```tsx
import { VoteButton } from '@/components/VoteButton';

// Inside your menu item render:
<VoteButton
  itemId={`${sectionKey}_${categoryIndex}_${itemIndex}`}
  venueId={venueId}
  itemName={item.name}
  originalPrice={parseFloat(item.price?.replace(/[₹,]/g, '') || '0')}
  onVoteSuccess={(discountPercent) => {
    // Optional: Update displayed price
    console.log('New discount:', discountPercent);
  }}
/>
```

### Step 2: Display Discounted Prices

```tsx
// Calculate and show discounted price
import { calculateDiscountedPrice } from '@/lib/voteSystem';

const originalPrice = 500; // Base price
const voteCount = 25; // From database

const { discountedPrice, discountPercent } = calculateDiscountedPrice(
  originalPrice,
  voteCount
);

// Display:
// Original: ₹500
// Discounted: ₹475 (5% OFF - 25 votes)
```

### Step 3: Add Admin Controls

**File:** `src/pages/AdminDashboard.tsx`

```tsx
import { VoteSystemSettings } from '@/components/VoteSystemSettings';

// Add in admin dashboard:
<VoteSystemSettings venueId={venueData.id} />
```

---

## Phase 3: Testing Checklist

### Local Testing

1. **Run Migration:**
   ```bash
   # Copy content from supabase/migrations/20260112_vote_to_discount.sql
   # Paste into Supabase SQL Editor
   # Execute
   ```

2. **Verify Tables:**
   ```sql
   SELECT * FROM item_votes LIMIT 1;
   SELECT * FROM item_original_prices LIMIT 1;
   SELECT * FROM item_vote_counts;
   ```

3. **Test Voting:**
   - Navigate to menu: `/menu/live`
   - Click "Vote for Discount" on any item
   - Should see: "Vote counted! X votes = Y% discount"
   - Try voting again (should say "already voted")

4. **Test in Incognito:**
   - Open incognito window
   - Vote for same item
   - Should allow (different fingerprint)

5. **Verify Discount:**
   - After 10 votes, should show "1% OFF"
   - After 50 votes, should show "5% OFF"
   - After 100 votes, should show "10% OFF" + "Max Discount!"

---

## Phase 4: Going Live

### Pre-Launch Checklist

⬜ Database migration applied to production  
⬜ VoteButton integrated into menu display  
⬜ Admin controls accessible  
⬜ Tested with multiple users  
⬜ Price calculations verified  
⬜ Anti-fraud working (no duplicate votes)  

### Deployment

```bash
# Commit all changes
git add .
git commit -m "feat: Add vote-to-discount gamification system"
git push origin main

# Deploy updates Vercel automatically
```

---

## How It Works (Technical)

### Vote Submission Flow

1. User clicks "Vote for Discount"
2. Browser fingerprint generated (FingerprintJS)
3. Check if user already voted (fingerprint + item_id)
4. If not, insert vote into `item_votes`
5. Aggregate view `item_vote_counts` auto-updates
6. Frontend refetches vote count
7. Display updated discount

### Price Calculation

```
votes = 27
discount_percent = floor(27 / 10) = 2
discount_percent = min(2, 10) = 2%

original_price = ₹500
discount_amount = 500 * 0.02 = ₹10
discounted_price = 500 - 10 = ₹490
```

### Anti-Fraud Measures

1. **Browser Fingerprinting:** Unique ID per device
2. **Database Constraint:** `UNIQUE(item_id, venue_id, voter_fingerprint)`
3. **IP Logging:** Secondary check (optional)
4. **Admin Reset:** Admins can reset

 suspicious votes

---

## Future Enhancements

### Phase 5 (Optional)
- [ ] Daily vote reset (scheduled job)
- [ ] Vote history analytics
- [ ] Social sharing ("Help get this to 10% off!")
- [ ] Leaderboard (most voted items)
- [ ] Time-limited voting campaigns
- [ ] SMS notifications at discount milestones

---

## Troubleshooting

### Issue: "Failed to submit vote"
**Solution:** Check Supabase RLS policies are enabled

### Issue: Duplicate votes working
**Solution:** Verify UNIQUE constraint exists on `item_votes`

### Issue: Prices not updating
**Solution:** Check `item_vote_counts` view is created

### Issue: Fingerprint library error
**Solution:** Run `npm install @fingerprintjs/fingerprintjs`

---

## Support & Questions

For implementation help, check:
1. Browser console for errors
2. Supabase logs for database issues
3. Network tab for API failures

**Status:** Ready for testing ✅
**Estimated Setup Time:** 30 minutes
**Risk Level:** Low (isolated feature, can be disabled)
