# Fix: Login Not Working After Backend Restarts

**Issue:** Getting 401 errors on login after making updates/restarting backend.

**Root Cause:** NextAuth sessions become invalid after backend restarts, and the frontend needs to clear cached sessions.

---

## Quick Fix

**After restarting backend, clear browser cache and cookies:**

1. **Open Browser Developer Tools** (F12)
2. **Go to Application tab** (Chrome) or **Storage tab** (Firefox)
3. **Clear all site data:**
   - Cookies
   - Local Storage
   - Session Storage
4. **Or use Incognito/Private mode** for testing

---

## Why This Happens

When the backend restarts:
- JWT tokens become invalid
- NextAuth sessions expire
- Browser still has old session cookies
- Frontend tries to use invalid session → 401 error

---

## Permanent Solution

The backend auth is working correctly (logs show successful logins). The issue is:

1. **Stale sessions in browser** - Clear browser data
2. **NextAuth session cache** - Should auto-refresh but sometimes doesn't

---

## Testing Steps

1. **Clear browser cache/cookies** OR use incognito
2. **Go to login page:** `http://localhost:3000/en/login`
3. **Login with:**
   - Email: `admin@grcplatform.com`
   - Password: `password123`
4. Should work now!

---

## Alternative: Restart Frontend Too

If clearing cache doesn't work:

```bash
docker-compose restart frontend
```

This will clear NextAuth's server-side session cache.

---

## Prevention

Add a session validation endpoint that returns 401 when backend restarts, forcing NextAuth to clear invalid sessions automatically.







