# Print/Download Price Update Fix

## Problem
When users updated menu item prices via the EDIT mode and then clicked "Download / Print", the PrintPreview dialog was showing **old prices** instead of the updated values.

## Root Cause
The `PrintPreview` component was using data from the `MenuContext` via the `useMenu()` hook. While the context had real-time sync enabled, there was a timing issue where the PrintPreview would open before the latest data was fetched from the database.

**Code Flow:**
1. User edits price → `updateMenuItem()` called
2. Local state updated immediately
3. Database updated via `dbUpdateMenuItem()`
4. Real-time sync *should* trigger `refreshMenu()` 
5. **BUT** PrintPreview opens before sync completes → shows stale data

## Solution
Added explicit `refreshMenu()` calls **before** opening the PrintPreview dialog in two locations:

### 1. Download/Print Button (AdminDashboard.tsx:434-442)
```tsx
<Button
  variant="outline"
  onClick={async () => {
    // Refresh menu data to ensure we have the latest prices
    await refreshMenu();
    setIsPrintPreviewOpen(true);
  }}
  className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
>
  <Download className="w-4 h-4 mr-2" />
  Download / Print
</Button>
```

### 2. PDF Prompt Dialog (AdminDashboard.tsx:576-587)
```tsx
<Button
  onClick={async () => {
    setShowPDFPrompt(false);
    // Refresh menu data before opening print preview
    await refreshMenu();
    setIsPrintPreviewOpen(true);
  }}
  className="bg-cyan-600 hover:bg-cyan-700"
>
  <Download className="w-4 h-4 mr-2" />
  Download PDF
</Button>
```

## Changes Made
- **File:** `src/pages/AdminDashboard.tsx`
  - Line 42: Added `refreshMenu` to destructured `useMenu()` context
  - Lines 434-442: Modified Download/Print button to call `refreshMenu()` before opening dialog
  - Lines 576-587: Modified PDF prompt button to call `refreshMenu()` before opening dialog

## Testing Instructions
1. Navigate to Admin Dashboard
2. Click "Edit Menu" to enter edit mode
3. Update a menu item price (e.g., change "Budweiser Mild" from ₹280 to ₹300)
4. Click "Download / Print"
5. **Verify:** PrintPreview shows the NEW price (₹300), not the old price (₹280)

## Technical Details
- The `refreshMenu()` function is async and fetches fresh data from Supabase
- It's defined in `MenuContext.tsx` (line 84-89)
- It calls `fetchMenuData()` which queries the database for the latest menu items
- The await ensures the data is fully loaded before the PrintPreview renders

## Status
✅ **FIXED** - Print/Download now shows updated prices immediately after editing
