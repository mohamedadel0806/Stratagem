# Fix: Login Connection Refused Error

**Error:** `connect ECONNREFUSED 172.20.0.5:3001`

**Issue:** Frontend cannot connect to backend after restarts.

---

## Root Cause

The frontend is trying to connect to the backend but getting connection refused. This happens when:

1. **Backend is still starting** - Takes time to fully initialize
2. **Network connectivity issue** - Containers can't communicate
3. **Backend crashed during startup** - Check backend logs

---

## Quick Fix

### Step 1: Wait for Backend to Fully Start

Check if backend is ready:

```bash
docker-compose logs backend | grep "Application successfully started"
```

Wait until you see this message before trying to login.

### Step 2: Restart Frontend

After backend is ready, restart frontend to reconnect:

```bash
docker-compose restart frontend
```

### Step 3: Try Login Again

Wait 5-10 seconds after restart, then try logging in again.

---

## Verify Backend is Running

```bash
# Check backend status
docker-compose ps backend

# Check backend logs for errors
docker-compose logs backend | tail -50

# Check if backend is listening on port 3001
docker-compose exec backend netstat -tuln | grep 3001
```

---

## Permanent Solution

Add a health check endpoint and wait for backend to be ready before starting frontend:

```yaml
# In docker-compose.yml
backend:
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
    interval: 10s
    timeout: 5s
    retries: 5

frontend:
  depends_on:
    backend:
      condition: service_healthy
```

This ensures frontend only starts after backend is fully ready.

---

## Current Status

The backend is running (logs show successful logins), but there might be a timing issue where:
- Backend restarts
- Frontend tries to connect immediately
- Backend isn't ready yet → Connection refused
- Session gets cached as failed → 401 errors persist

**Solution:** Wait a few seconds after backend restart, or restart frontend too.




