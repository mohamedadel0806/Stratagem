# 🔧 Login Troubleshooting Guide

## ✅ Current Status

- **Backend:** ✅ Running and healthy
- **Health Endpoint:** ✅ Working (http://localhost:3001/health/ready)
- **Frontend:** ✅ Running with new retry code

---

## 🚀 Quick Fix Steps

### Step 1: Clear Browser Cache (CRITICAL)

**Option A: Clear Site Data**
1. Press F12 (open DevTools)
2. Go to "Application" tab (Chrome) or "Storage" tab (Firefox)
3. Click "Clear site data" or "Clear storage"
4. Check all boxes (Cookies, Local Storage, Session Storage)
5. Click "Clear data"
6. Refresh the page

**Option B: Use Incognito Mode**
- Open a new incognito/private window
- Go to http://localhost:3000/en/login
- This avoids cache issues completely

### Step 2: Wait for Services

```bash
# Wait for backend to be fully ready (check health)
curl http://localhost:3001/health/ready

# Should return: {"status":"ready",...}
```

### Step 3: Try Login

- **URL:** http://localhost:3000/en/login
- **Email:** `admin@grcplatform.com`
- **Password:** `password123`

---

## 🔍 If Still Getting 401 Error

### Check 1: Verify User Exists

```bash
docker-compose exec postgres psql -U postgres -d grc_platform -c "SELECT email, status FROM users WHERE email = 'admin@grcplatform.com';"
```

### Check 2: Check Frontend Logs

```bash
docker-compose logs frontend | grep -i "login\|backend\|ready\|error" | tail -30
```

Look for:
- "Backend is ready" - Good!
- "Backend not ready" - Backend might still be starting
- "Login error" - Check the error details

### Check 3: Check Backend Logs

```bash
docker-compose logs backend | grep -i "login\|auth" | tail -20
```

### Check 4: Test Backend Auth Directly

```bash
# From your host machine
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@grcplatform.com","password":"password123"}'
```

Should return user data and accessToken if credentials are correct.

---

## 🔄 Reset Everything

If nothing works, do a full reset:

```bash
# 1. Stop all services
docker-compose down

# 2. Start services
docker-compose up -d

# 3. Wait 30 seconds for backend
sleep 30

# 4. Check backend health
curl http://localhost:3001/health/ready

# 5. Clear browser cache
# 6. Try login in incognito mode
```

---

## ✅ The New System

With the fixes applied:
- ✅ Automatically waits for backend (up to 30 seconds)
- ✅ Retries on connection errors (3 attempts)
- ✅ Shows clear error messages
- ✅ Health checks prevent premature connections

**Just clear your browser cache and try again!** 🎉







