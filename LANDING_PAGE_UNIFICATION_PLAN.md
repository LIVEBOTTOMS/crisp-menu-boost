# Landing Page Unification with Print Format

## Objective
Make the public menu landing page (Index.tsx) match the premium styling of the Download/Print preview for complete uniformity across all views.

## Implementation Plan

### Phase 1: Extract Shared Components
1. **PremiumBorderFrame** - Reusable border with corner accents
2. **SectionHeader** - Premium section title with gradient underlines
3. **CategoryDivider** - Enhanced category headers with icons
4. **MenuItemRow** - Consistent menu item display

### Phase 2: Update Index.tsx
1. Replace current layout with PDF-style structure
2. Add premium border frames
3. Update section navigation to match PDF styling
4. Implement consistent spacing and typography

### Phase 3: Ensure Venue Data Flow
1. Verify venue props are passed correctly
2. Test with both LIVE and Moon Walk NX menus
3. Ensure all dynamic content renders properly

## Files to Modify
- `src/pages/Index.tsx` - Main menu display page
- `src/components/MenuSection.tsx` - Section display component
- `src/components/MenuHeader.tsx` - Header component (already updated)
- Create new shared components in `src/components/premium/`

## Rollback Plan
If issues arise:
```bash
git reset --hard HEAD~1
```

## Testing Checklist
- [ ] LIVE menu displays correctly
- [ ] Moon Walk NX menu displays correctly
- [ ] All sections render properly
- [ ] Navigation works smoothly
- [ ] Responsive on mobile
- [ ] Print preview matches landing page
