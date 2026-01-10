# Quick Google OAuth Setup - 5 Minutes

## ⚡ Fast Track Setup (Development Mode)

### Option 1: Using Supabase's Built-in Google OAuth (Easiest - 2 minutes)

Supabase provides a development OAuth setup that works immediately!

#### Steps:

1. **Go to Supabase Dashboard**
   - Navigate to: https://app.supabase.com
   - Select your project

2. **Enable Google Provider**
   - Go to: **Authentication** → **Providers**
   - Find **Google** in the list
   - Toggle it **ON**

3. **Use Supabase's Development Credentials**
   - Supabase provides built-in Google OAuth credentials for development
   - Just toggle ON - no configuration needed!
   - ✅ Google login will work immediately

4. **Test It**
   - Go to `http://localhost:5173/auth`
   - Click "Continue with Google"
   - ✅ Should redirect to Google login
   - ✅ After auth, redirects back to your app

**That's it!** Google login should work now. 🎉

---

## 🎯 Option 2: Your Own Google Cloud Credentials (Production - 10 minutes)

For production, you'll want your own credentials:

### A. Create Google Cloud Project

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com
   - Click "Select a project" → "New Project"
   - Name: **MenuX**
   - Click "Create"

2. **Enable Google+ API**
   - In search bar, type "Google+ API"
   - Click "Enable"

### B. Configure OAuth Consent Screen

1. **Go to OAuth consent screen**
   - Left menu: **APIs & Services** → **OAuth consent screen**
   
2. **Select User Type**
   - Choose: **External**
   - Click "Create"

3. **Fill App Information**
   ```
   App name: MenuX
   User support email: your-email@example.com
   Developer contact: your-email@example.com
   ```
   - Click "Save and Continue"

4. **Scopes** (Click "Add or Remove Scopes")
   - Select: `../auth/userinfo.email`
   - Select: `../auth/userinfo.profile`
   - Click "Update" → "Save and Continue"

5. **Test Users** (For development)
   - Add your email address
   - Click "Save and Continue"

### C. Create OAuth Credentials

1. **Create Credentials**
   - Left menu: **Credentials**
   - Click "Create Credentials" → "OAuth 2.0 Client ID"

2. **Application Type**
   - Select: **Web application**
   - Name: **MenuX Web Client**

3. **Authorized JavaScript origins**
   ```
   http://localhost:5173
   https://your-domain.com (when deployed)
   ```

4. **Authorized redirect URIs**
   - Go back to Supabase Dashboard
   - Copy your callback URL (shown in Google provider settings)
   - It looks like: `https://[project-ref].supabase.co/auth/v1/callback`
   - Paste it in Google Console

5. **Create**
   - Click "Create"
   - **Copy your Client ID**
   - **Copy your Client Secret** (click "Show" to reveal)

### D. Add to Supabase

1. **Back to Supabase Dashboard**
   - Authentication → Providers → Google

2. **Enter Credentials**
   ```
   Client ID: [paste your Google Client ID]
   Client Secret: [paste your Google Client Secret]
   ```

3. **Save**
   - ✅ Google login now uses YOUR credentials

---

## 🧪 Testing

### Test in Browser:

1. Open DevTools (F12) → Console tab
2. Navigate to: `http://localhost:5173/auth`
3. Click "Continue with Google"

**Expected behavior:**
- ✅ Redirects to Google sign-in page
- ✅ Shows consent screen (first time)
- ✅ After approval, redirects back to app
- ✅ User is logged in
- ✅ Redirects to `/menus`
- ✅ Auto-onboarding creates default venue

**If you see errors:**
- ❌ "redirect_uri_mismatch" → Check redirect URI in Google Console matches Supabase
- ❌ "invalid_client" → Check Client ID/Secret are correct
- ❌ "access_denied" → Make sure your email is added as test user

---

## 🎯 Quick Checklist

### Using Supabase Development OAuth (Fastest):
- [ ] Go to Supabase Dashboard
- [ ] Authentication → Providers → Google
- [ ] Toggle ON
- [ ] Test on http://localhost:5173/auth
- [ ] ✅ Working!

### Using Your Own Credentials:
- [ ] Create Google Cloud Project
- [ ] Configure OAuth Consent Screen
- [ ] Create OAuth 2.0 Client ID
- [ ] Copy redirect URI from Supabase
- [ ] Add authorized origins and redirect URIs
- [ ] Copy Client ID and Secret
- [ ] Paste into Supabase
- [ ] Test login
- [ ] ✅ Working!

---

## 🚀 After Google Works:

### Enable Other Providers (Optional):

**Facebook Login** (5 min):
- Create Facebook App at developers.facebook.com
- Add Facebook Login product
- Get App ID and Secret
- Add to Supabase

**Apple Sign In** (15 min):
- Requires Apple Developer account ($99/year)
- Create Services ID
- Generate Key
- Add to Supabase

---

## ⚡ Fastest Path to Working Google Login:

```bash
# Right now:
1. Open Supabase Dashboard
2. Authentication → Providers
3. Find "Google"
4. Click toggle to ON
5. Test at localhost:5173/auth

# Takes 30 seconds! ✅
```

---

## 🐛 Troubleshooting

### Error: "Popup blocked"
- **Fix**: Allow popups for localhost in browser settings

### Error: "This app is blocked"
- **Fix**: Add your email as test user in Google Cloud Console

### Error: "redirect_uri_mismatch"
- **Fix**: 
  1. Copy exact redirect URI from Supabase
  2. Paste into Google Cloud Console
  3. Make sure there are no extra spaces

### No error but nothing happens:
- **Fix**: Check browser console for errors
- Look in Supabase Dashboard → Logs for auth errors

---

## 📝 Production Checklist

Before going live:
- [ ] Own Google Cloud credentials (not Supabase's)
- [ ] OAuth consent screen published (not in testing)
- [ ] Production domain added to authorized origins
- [ ] Production callback URL added to redirect URIs
- [ ] Brand logo and privacy policy URLs added
- [ ] Remove test users, make it public

---

**Need help?** The Supabase development OAuth is the fastest way to test. You can always upgrade to your own credentials later!
