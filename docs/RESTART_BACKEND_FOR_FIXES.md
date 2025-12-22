# How to Restart Backend to Apply Workflow Error Fixes

**Issue:** 500 errors persist after fixes - backend needs to be restarted

---

## Quick Restart (Docker)

Since you're running in Docker, restart the backend container:

```bash
# Restart just the backend container
docker-compose restart backend

# OR if using a specific compose file
docker-compose -f docker-compose.yml restart backend
```

---

## Check Backend Logs

After restarting, check the logs to see if there are any errors:

```bash
# View backend logs
docker-compose logs -f backend

# OR check last 50 lines
docker-compose logs --tail=50 backend
```

---

## Verify Changes Are Applied

The backend should automatically reload with `npm run start:dev` in development mode. Check logs for:

```
[Nest] Starting Nest application...
[Nest] Application successfully started
```

---

## If Errors Persist After Restart

1. **Check for compilation errors:**
   ```bash
   docker-compose logs backend | grep -i error
   ```

2. **Check which endpoint is failing:**
   - Look at browser console for the exact URL
   - Check backend logs for that specific endpoint

3. **Verify the fixes are in place:**
   - All endpoints should return empty arrays on error
   - No `throw error` statements in catch blocks

---

## Manual Backend Restart Steps

1. **Stop the backend:**
   ```bash
   docker-compose stop backend
   ```

2. **Start it again:**
   ```bash
   docker-compose start backend
   ```

3. **Or rebuild if needed:**
   ```bash
   docker-compose up -d --build backend
   ```

---

## Test After Restart

1. Clear browser cache
2. Open browser console
3. Navigate to workflows page
4. Check for 500 errors
5. Verify endpoints return 200 with data or empty arrays







