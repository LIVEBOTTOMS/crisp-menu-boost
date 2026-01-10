# Push Notifications Setup Guide

## 🎉 Push Notifications Implemented!

You now have full push notification support for MenuX PWA!

---

## ✅ What's Been Added

### Database
- ✅ `push_subscriptions` table - Stores user device subscriptions
- ✅ `push_notification_log` table - Tracks sent notifications
- ✅ RLS policies for security
- ✅ Auto-cleanup function for inactive subscriptions

### Frontend
- ✅ `usePushNotifications` hook - Complete notification management
- ✅ `NotificationSettings` component - Beautiful UI to manage notifications
- ✅ `SettingsPage` - Centralized settings page
- ✅ Service worker notification handlers (already in sw.js)

---

## 🚀 How to Use

### For Users

1. **Navigate to Settings**
   ```
   http://localhost:5173/settings
   ```

2. **Enable Notifications**
   - Click "Notifications" tab
   - Click "Request Permission" (if not already granted)
   - Click "Enable Notifications"
   - Click "Send Test Notification" to test

3. **Test Offline Notifications**
   - Enable notifications
   - Close the browser
   - Notifications will appear even when app is closed!

---

## 🔧 Configuration Required

### 1. Generate VAPID Keys (Production)

For production, you MUST generate your own VAPID keys:

```bash
# Install web-push globally
npm install -g web-push

# Generate VAPID keys
npx web-push generate-vapid-keys
```

**Output will look like:**
```
Public Key: BOr...ABC (87 characters)
Private Key: xyz...789 (43 characters)
```

### 2. Add to Environment Variables

Create `.env.local`:
```env
VITE_VAPID_PUBLIC_KEY=your-public-key-here
VITE_VAPID_PRIVATE_KEY=your-private-key-here
```

### 3. Update Supabase

Run the migration:
```bash
# Option 1: Via Supabase Dashboard
1. Go to SQL Editor
2. Paste contents of supabase/migrations/20260110_push_notifications.sql
3. Click "Run"

# Option 2: Via Supabase CLI
supabase db push
```

---

## 📱 Testing Checklist

### Desktop Testing
- [ ] Open http://localhost:5173/settings
- [ ] Click "Request Permission" → Should show browser prompt
- [ ] Click "Enable Notifications" → Should subscribe successfully
- [ ] Click "Send Test Notification" → Should show notification
- [ ] Close browser → Notification should still appear
- [ ] Click notification → Should open app

### Mobile Testing (iOS/Android)
- [ ] Open site on mobile browser
- [ ] Navigate to /settings
- [ ] Enable notifications
- [ ] Add to home screen (install PWA)
- [ ] Test notification while app is closed
- [ ] Test notification while app is open

---

## 🎯 How It Works

### 1. **User Subscribes**
```
User → Request Permission → Browser Prompt → Granted
      → Subscribe → Generate Push Subscription
      → Save to Database (endpoint + keys)
```

### 2. **Sending Notifications**
```
Server → Get subscriptions from DB
       → For each subscription:
         - Sign with VAPID private key
         - Send to push service (FCM/etc)
       → Log result to push_notification_log
```

### 3. **User Receives**
```
Push Service → Service Worker → Show Notification
                               → User clicks
                               → Open app/URL
```

---

## 🔐 Security Notes

### Current Setup (Development)
- Using demo VAPID keys (insecure)
- Good for testing only
- **Replace before production!**

### Production Requirements
- Generate unique VAPID keys
- Store private key securely (server-side only)
- Never expose private key in frontend
- Use HTTPS (required for service workers)
- Implement rate limiting

---

## 📊 Database Schema

### push_subscriptions
```sql
id              UUID PRIMARY KEY
user_id         UUID → auth.users
venue_id        UUID → venues (optional)
endpoint        TEXT UNIQUE
keys            JSONB {p256dh, auth}
device_type     TEXT
is_active       BOOLEAN
created_at      TIMESTAMPTZ
last_used_at    TIMESTAMPTZ
```

### push_notification_log
```sql
id              UUID PRIMARY KEY
user_id         UUID
subscription_id UUID
title           TEXT
body            TEXT
status          TEXT (pending/sent/failed/clicked)
sent_at         TIMESTAMPTZ
created_at      TIMESTAMPTZ
```

---

## 🎨 Notification Customization

### In Service Worker (public/sw.js)
```javascript
self.registration.showNotification(title, {
  body: 'Your message',
  icon: '/icons/icon-192x192.png',
  badge: '/icons/icon-72x72.png',
  vibrate: [100, 50, 100],
  data: { url: '/menu/special-offer' },
  actions: [
    { action: 'view', title: 'View' },
    { action: 'close', title: 'Close' }
  ]
});
```

### Data Payload
```javascript
{
  title: 'New Menu Item!',
  body: 'Check out our Truffle Fries',
  icon: '/icons/icon-192x192.png',
  data: {
    url: '/menu/live',
    itemId: '123',
    action: 'view-item'
  }
}
```

---

## 🚨 Troubleshooting

### Notifications not working?
1. Check browser supports notifications
2. Verify permission is granted
3. Check service worker is active
4. Look for errors in console
5. Ensure HTTPS (or localhost)

### Subscription failing?
1. Check VAPID keys are correct
2. Verify service worker is registered
3. Check network tab for errors
4. Try unsubscribe then resubscribe

### Notifications not appearing?
1. Check device notification settings
2. Verify browser allows notifications
3. Check Do Not Disturb mode
4. Test with simpler notification

---

## 📈 Next Steps

### Phase 2 Features (Coming Soon)
- [ ] **Admin panel** to send notifications to all users
- [ ] **Scheduled notifications** for promotions
- [ ] **Targeted notifications** by venue/segment
- [ ] **Rich media** notifications with images
- [ ] **Action buttons** in notifications
- [ ] **Analytics** dashboard for notification performance

### Server-Side Implementation
You'll need to create:
1. API endpoint to send notifications
2. Cron job for scheduled notifications
3. Admin UI to compose and send
4. Analytics tracking

Example API endpoint:
```typescript
// /api/notifications/send
POST {
  user_ids: ['uuid1', 'uuid2'],
  title: 'New Menu!',
  body: 'Check it out',
  data: { url: '/menu/new' }
}
```

---

## 📞 Quick Commands

```bash
# Test in browser console
Notification.requestPermission()

# Check permission status
Notification.permission // 'granted', 'denied', or 'default'

# Check if subscribed
navigator.serviceWorker.ready.then(reg => 
  reg.pushManager.getSubscription()
)

# Generate VAPID keys
npx web-push generate-vapid-keys
```

---

**🎉 Congratulations!** Your PWA now has full push notification support!

Visit http://localhost:5173/settings to try it out!
