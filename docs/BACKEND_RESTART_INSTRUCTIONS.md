# Backend Restart Instructions - Apply Workflow Error Fixes

**IMPORTANT:** The backend needs to be restarted for the fixes to take effect!

---

## Quick Fix: Restart Backend Container

Since you're running in Docker, restart the backend:

```bash
# Navigate to project root
cd /Users/adelsayed/Documents/Code/Stratagem

# Restart backend container
docker-compose restart backend
```

---

## Verify Backend Restarted

Check the logs to confirm:

```bash
# Watch backend logs (will show restart)
docker-compose logs -f backend

# Look for:
# - "Application successfully started"
# - No compilation errors
# - Server listening on port 3001
```

---

## If Using Docker Compose with Different File

```bash
# Check which compose file you're using
docker-compose ps

# Restart backend
docker-compose -f docker-compose.yml restart backend
```

---

## Manual Steps

If automatic restart doesn't work:

```bash
# Stop backend
docker-compose stop backend

# Start backend
docker-compose start backend

# Or rebuild if needed
docker-compose up -d --build backend
```

---

## Check for Errors

After restart, check logs for errors:

```bash
docker-compose logs backend | grep -i error
```

If you see compilation errors, the backend might not have restarted properly.

---

## Test the Fixes

1. **Clear browser cache** (or use incognito)
2. **Open browser console** (F12)
3. **Navigate to workflows page**
4. **Check for 500 errors** - should be gone!

---

## What Changed?

All workflow endpoints now:
- ✅ Return empty arrays on errors (no 500s)
- ✅ Handle null values gracefully
- ✅ Log errors for debugging
- ✅ Never crash the endpoint

---

## Still Getting Errors?

1. **Check which endpoint is failing** - look at browser console URL
2. **Check backend logs** - see actual error message
3. **Verify backend restarted** - check logs for "Application successfully started"
4. **Check database connection** - make sure PostgreSQL is running

---

## Quick Test Command

After restart, test the endpoints:

```bash
# Test workflows endpoint (should return 200, not 500)
curl http://localhost:3001/workflows

# Test templates endpoint
curl http://localhost:3001/workflows/templates

# Test my-approvals endpoint  
curl http://localhost:3001/workflows/my-approvals
```

All should return 200 status code (even if empty arrays).





