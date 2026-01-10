# Security & Robustness Testing Guide

## 🧪 Pre-Deployment Testing Checklist

### 1. Authentication Flow Testing

#### ✅ Sign Up Flow
- [ ] **Valid Signup**
   - Navigate to `/auth` or `/signup`
   - Enter valid email: `test@example.com`
   - Enter strong password: `TestPass123`
   - Confirm password matches
   - Click "Create Account"
   - ✅ Should show success message
   - ✅ Should receive verification email (check Supabase)
   - ✅ Should auto-create default venue

- [ ] **Invalid Email**
   - Enter invalid email: `notanemail`
   - ✅ Should show "Invalid email address" error

- [ ] **Weak Password**
   - Enter weak password: `pass`
   - ✅ Should show password requirements error
   - ✅ Password strength indicator should show "Weak"

- [ ] **Password Mismatch**
   - Enter password: `TestPass123`
   - Confirm password: `Different123`
   - ✅ Should show "Passwords don't match" error

- [ ] **Duplicate Email**
   - Try signing up with existing email
   - ✅ Should show "Email already registered" error

#### ✅ Login Flow
- [ ] **Valid Login**
   - Navigate to `/login`
   - Enter registered email and password
   - Click "Sign In"
   - ✅ Should redirect to `/menus`
   - ✅ Should show "Welcome back!" toast

- [ ] **Invalid Credentials**
   - Enter wrong password
   - ✅ Should show "Invalid email or password" error
   - ✅ Should not reveal which field is wrong (security)

- [ ] **Unverified Email**
   - Login with unverified account
   - ✅ Should show "Please verify your email" message

### 2. Onboarding Flow Testing

#### ✅ New User Onboarding
- [ ] **Auto-Venue Creation**
   - Sign up new account
   - Navigate to `/menus`
   - ✅ Should see "My Restaurant" venue
   - ✅ Venue should have sample menu items
   - ✅ Should see Starters, Main Course, Beverages

- [ ] **Sample Menu Content**
   - Click "View Menu" on default venue
   - ✅ Should see Spring Rolls, Garlic Bread
   - ✅ Should see Margherita Pizza, Pasta, Chicken
   - ✅ Should see Fresh Lime Soda, Mango Smoothie, Coffee
   - ✅ All items should have prices

- [ ] **Edit Default Menu**
   - Click "Edit" on default venue
   - ✅ Should open editor
   - ✅ Can edit item names
   - ✅ Can edit prices
   - ✅ Can add new items
   - ✅ Changes save successfully

### 3. Input Validation Testing

#### ✅ Venue Creation
- [ ] **Valid Venue**
   - Name: `Test Restaurant`
   - Slug: Auto-generated or `test-restaurant`
   - ✅ Should create successfully

- [ ] **Invalid Name**
   - Name: `A` (too short)
   - ✅ Should show "must be at least 2 characters" error
   
- [ ] **Invalid Characters**
   - Name: `<script>alert('xss')</script>`
   - ✅ Should sanitize or reject

- [ ] **Invalid Slug**
   - Slug: `TEST Restaurant!`
   - ✅ Should auto-sanitize to `test-restaurant`

#### ✅ Menu Item Creation
- [ ] **Valid Item**
   - Name: `Deluxe Burger`
   - Price: `350`
   - Description: `Juicy beef burger with cheese`
   - ✅ Should create successfully

- [ ] **Invalid Price**
   - Price: `-100` (negative)
   - ✅ Should show "Price cannot be negative" error

- [ ] **Long Description**
   - Description: (1001+ characters)
   - ✅ Should show "Description is too long" error

- [ ] **XSS Attempt**
   - Name: `<img src=x onerror=alert('xss')>`
   - ✅ Should be sanitized/escaped

### 4. Error Handling Testing

#### ✅ Error Boundary
- [ ] **Trigger Error (Dev Mode)**
   - Navigate to `/test-features`
   - Add test button to throw error
   - ✅ Should show error boundary UI
   - ✅ Should show error details in dev mode
   - ✅ "Try Again" button should reset state
   - ✅ "Go to Homepage" should work

- [ ] **Network Errors**
   - Disconnect internet
   - Try to load menu
   - ✅ Should show offline page (PWA)
   - ✅ Should show user-friendly error message

#### ✅ Loading States
- [ ] **Auth Loading**
   - Click "Sign In"
   - ✅ Button should show spinner
   - ✅ Button should be disabled
   - ✅ Should show "Signing In..." text

- [ ] **Menu Loading**
   - Navigate to `/menus`
   - ✅ Should show loading skeleton
   - ✅ Should not show blank screen

### 5. Security Testing

#### ✅ Session Management
- [ ] **Token Refresh**
   - Login
   - Wait for token to expire (or force in dev tools)
   - ✅ Should auto-refresh token
   - ✅ User should stay logged in

- [ ] **Logout**
   - Click logout
   - ✅ Should clear session
   - ✅ Should redirect to login
   - ✅ Back button should not access protected routes

#### ✅ Authorization
- [ ] **Own Data Only**
   - User A creates venue
   - User B logs in
   - ✅ User B should NOT see User A's venue
   - ✅ User B cannot edit User A's menu

- [ ] **Direct URL Access**
   - Logged out user tries `/menus`
   - ✅ Should redirect to `/auth`
   
   - User A tries to edit User B's venue directly
   - ✅ Should show error or redirect

#### ✅ SQL Injection Prevention
-  [ ] **Malicious Input**
   - Venue name: `'; DROP TABLE venues;--`
   - ✅ Should be treated as string, not SQL
   - ✅ Should create venue with that exact name (escaped)

### 6. Mobile Testing

#### ✅ Touch Interactions
- [ ] **Homepage**
   - Swipe testimonials left/right
   - ✅ Should change testimonial
   - ✅ Should be smooth, no lag

- [ ] **Auth Page**
   - Tap show/hide password
   - ✅ Should toggle visibility
   - ✅ Button should have active state

- [ ] **Menu View**
   - Scroll through categories
   - ✅ Should scroll smoothly
   - ✅ Touch targets should be 44x44px minimum

#### ✅ Responsive Design
- [ ] **Mobile (< 640px)**
   - ✅ Navigation should be hamburger menu
   - ✅ Stats should be 2 columns
   - ✅ CTAs should be stacked vertically
   - ✅ Text should be readable

- [ ] **Tablet (640-1024px)**
   - ✅ Features should be 2 columns
   - ✅ Stats should be 4 columns
   - ✅ Layout should not break

- [ ] **Desktop (> 1024px)**
   - ✅ Hero should be side-by-side
   - ✅ Features should be 3 columns
   - ✅ Parallax effects should work

### 7. PWA Testing

#### ✅ Installation
- [ ] **Desktop Install**
   - Visit site on Chrome/Edge
   - Wait 30 seconds
   - ✅ Install prompt should appear
   - Click "Install Now"
   - ✅ App should install
   - ✅ Should open in standalone window

- [ ] **Mobile Install**
   - Visit on mobile browser
   - ✅ Install prompt should appear
   - ✅ Can add to home screen
   - ✅ Icon should appear on home screen

#### ✅ Offline Support
- [ ] **Go Offline**
   - Load homepage
   - Turn off WiFi
   - Navigate to different page
   - ✅ Should show cached content or offline page
   - ✅ Should not crash

- [ ] **Back Online**
   - Turn WiFi back on
   - ✅ Should auto-reconnect
   - ✅ Should reload fresh content

### 8. Database Integrity

#### ✅ Auto-Onboarding Trigger
- [ ] **New User Creation**
   - Check Supabase Functions
   - ✅ `create_default_venue_for_user` function exists
   - ✅ Trigger `on_user_created_create_venue` exists
   
- [ ] **Verify Data**
   - Sign up new user
   - Check Supabase database
   - ✅ User in `auth.users`
   - ✅ Venue in `venues` table
   - ✅ Sections in `menu_sections`
   - ✅ Categories in `menu_categories`
   - ✅ Items in `menu_items`
   - ✅ All linked with correct venue_id

---

## 🎯 Performance Testing

### Speed Metrics
- [ ] Homepage loads < 2s
- [ ] Auth page loads < 1.5s
- [ ] Menu page loads < 3s (with data)
- [ ] Animations run at 60fps

### Lighthouse Scores (Target)
- [ ] Performance: > 90
- [ ] Accessibility: > 95
- [ ] Best Practices: > 95
- [ ] SEO: > 90
- [ ] PWA: 100

---

## ✅ Ready to Deploy When:
- [ ] All authentication flows tested
- [ ] Input validation working
- [ ] Error boundaries catching errors
- [ ] Auto-onboarding creating venues
- [ ] No console errors
- [ ] Mobile experience smooth
- [ ] PWA installable
- [ ] Database triggers working
- [ ] RLS policies protecting data
- [ ] No security vulnerabilities

---

## 🐛 If Issues Found:
1. Document the issue
2. Create a fix
3. Re-test the fix
4. Verify no regressions
5. Update this checklist

**Only push to Git when ALL tests pass!** ✅
