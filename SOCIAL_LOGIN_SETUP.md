# Social Login Setup Guide for Supabase

## 🎯 Overview

This guide will help you configure Google, Facebook, and Apple authentication for your MenuX application.

---

## 1. Google OAuth Setup

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to "APIs & Services" → "Credentials"

### Step 2: Configure OAuth Consent Screen
1. Click "OAuth consent screen"
2. Select "External" user type
3. Fill in:
   - App name: **MenuX Prime**
   - User support email: your-email@domain.com
   - Developer contact: your-email@domain.com
4. Add scopes:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
5. Add test users (optional for testing)
6. Save and continue

### Step 3: Create OAuth Credentials
1. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
2. Application type: **Web application**
3. Name: **MenuX Web Client**
4. Authorized JavaScript origins:
   ```
   http://localhost:5173
   https://your-domain.com
   ```
5. Authorized redirect URIs:
   ```
   https://[your-supabase-project-ref].supabase.co/auth/v1/callback
   ```
6. Click "Create"
7. **Save your Client ID and Client Secret**

### Step 4: Configure in Supabase
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to "Authentication" → "Providers"
4. Find "Google" and toggle it ON
5. Enter your **Client ID** and **Client Secret**
6. Save changes

---

## 2. Facebook Login Setup

### Step 1: Create Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "My Apps" → "Create App"
3. Select use case: **Consumer**
4. App name: **MenuX Prime** 5. App contact email: your-email@domain.com
6. Create app and note your **App ID**

### Step 2: Add Facebook Login Product
1. In your app dashboard, click "Add Product"
2. Find "Facebook Login" and click "Set Up"
3. Select platform: **Web**
4. Site URL: `https://your-domain.com`
5. Save settings

### Step 3: Configure OAuth Redirect URIs
1. Go to "Facebook Login" → "Settings"
2. Add Valid OAuth Redirect URIs:
   ```
   https://[your-supabase-project-ref].supabase.co/auth/v1/callback
   ```
3. Save changes

### Step 4: Get App Secret
1. Go to "Settings" → "Basic"
2. Click "Show" next to **App Secret**
3. **Copy both App ID and App Secret**

### Step 5: Configure in Supabase
1. Go to Supabase Dashboard → "Authentication" → "Providers"
2. Find "Facebook" and toggle it ON
3. Enter your **App ID** and **App Secret**
4. Save changes

---

## 3. Apple Sign In Setup

### Step 1: Enroll in Apple Developer Program
- You need an active Apple Developer account ($99/year)
- Go to [Apple Developer](https://developer.apple.com/)

### Step 2: Create App ID
1. Go to "Certificates, Identifiers & Profiles"
2. Click "Identifiers" → "+" → "App IDs"
3. Select "App" and continue
4. Description: **MenuX Prime**
5. Bundle ID: `com.menux.prime` (or your domain)
6. Enable "Sign In with Apple"
7. Register

### Step 3: Create Services ID
1. Go to "Identifiers" → "+" → "Services IDs"
2. Description: **MenuX Web Service**
3. Identifier: `com.menux.prime.web`
4. Enable "Sign In with Apple"
5. Click "Configure"
6. Add domain: `your-domain.com`
7. Add Return URL:
   ```
   https://[your-supabase-project-ref].supabase.co/auth/v1/callback
   ```
8. Save and register

### Step 4: Create Key
1. Go to "Keys" → "+"
2. Key Name: **MenuX Auth Key**
3. Enable "Sign In with Apple"
4. Configure and select your App ID
5. Register and **download the .p8 key file** (only shown once!)
6. Note your **Key ID**

### Step 5: Get Team ID
1. Go to "Membership" in Apple Developer
2. Copy your **Team ID**

### Step 6: Configure in Supabase
1. Go to Supabase Dashboard → "Authentication" → "Providers"
2. Find "Apple" and toggle it ON
3. Enter:
   - **Services ID**: com.menux.prime.web
   - **Team ID**: (from step 5)
   - **Key ID**: (from step 4)
   - **Private Key**: (contents of .p8 file)
4. Save changes

---

## 4. Magic Link (Already Configured!)

Magic link authentication works out of the box with Supabase. No additional setup needed!

**How it works:**
1. User enters email
2. Supabase sends a magic link
3. User clicks link
4. Automatically signed in

**Email template customization:**
1. Go to Supabase Dashboard → "Authentication" → "Email Templates"
2. Customize "Magic Link" template
3. Add your branding and messaging

---

## 5. Testing the Setup

### Test Google Login
1. Navigate to `/auth`
2. Click "Continue with Google"
3. Sign in with Google account
4. Should redirect to `/menus`
5. Check Supabase Dashboard → "Authentication" → "Users"

### Test Facebook Login
1. Navigate to `/auth`
2. Click "Facebook"
3. Sign in with Facebook
4. Should redirect to `/menus`

### Test Apple Sign In
1. Navigate to `/auth`
2. Click "Apple"
3. Sign in with Apple ID
4. Should redirect to `/menus`

### Test Magic Link
1. Navigate to `/auth`
2. Click "Sign in with magic link"
3. Enter your email
4. Check email inbox
5. Click the link
6. Should automatically sign in

---

## 6. Environment Variables (Optional)

For better security, you can add provider credentials to environment variables:

```env
# .env.local

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your-client-id
VITE_GOOGLE_CLIENT_SECRET=your-client-secret

# Facebook
VITE_FACEBOOK_APP_ID=your-app-id
VITE_FACEBOOK_APP_SECRET=your-app-secret

# Apple
VITE_APPLE_CLIENT_ID=com.menux.prime.web
VITE_APPLE_TEAM_ID=your-team-id
VITE_APPLE_KEY_ID=your-key-id
```

---

## 7. Production Checklist

Before going live:

- [ ] Replace localhost URLs with production domain
- [ ] Update redirect URIs in all provider consoles
- [ ] Test each provider in production
- [ ] Verify email templates are branded
- [ ] Enable email rate limiting in Supabase
- [ ] Set up proper error logging
- [ ] Review privacy policy and terms

---

## 8. Troubleshooting

### Google Login Issues
**Error**: "redirect_uri_mismatch"
- **Fix**: Ensure redirect URI in Google Console matches Supabase callback URL exactly

**Error**: "access_denied"
- **Fix**: Check OAuth consent screen is published and not in testing mode

### Facebook Login Issues
**Error**: "redirect_uri not whitelisted"
- **Fix**: Add Supabase callback URL to Valid OAuth Redirect URIs in Facebook settings

**Error**: "App Not Set Up"
- **Fix**: Ensure Facebook Login product is added and configured

### Apple Sign In Issues
**Error**: "invalid_client"
- **Fix**: Verify Services ID, Team ID, and Key ID are correct

**Error**: "invalid_request"
- **Fix**: Check return URL matches exactly in Services ID configuration

### Magic Link Issues
**Error**: Email not received
- **Fix**: Check spam folder, verify SMTP settings in Supabase

**Error**: Link expired
- **Fix**: Magic links expire after 1 hour. Request a new one.

---

## 9. Quick Start Commands

```bash
# Test social login locally
npm run dev

# Navigate to auth page
open http://localhost:5173/auth

# Check Supabase logs
# Go to: Supabase Dashboard → Logs
```

---

## ✅ Setup Complete!

Once all providers are configured, users can:
- ✅ Sign in with Google (1-click)
- ✅ Sign in with Facebook (1-click)
- ✅ Sign in with Apple (1-click)
- ✅ Use Magic Link (passwordless)
- ✅ Traditional email/password

**All methods work seamlessly with auto-onboarding!**

New users will automatically get:
- Default "My Restaurant" venue
- Sample menu with 8 items
- Ready to customize immediately

---

**Need Help?**
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Google OAuth Docs](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Docs](https://developers.facebook.com/docs/facebook-login)
- [Apple Sign In Docs](https://developer.apple.com/sign-in-with-apple/)
