# Evidence File Upload - Docker Quick Start

## For Docker Environments

Since you're running in Docker, here's what you need to know:

## ✅ What's Already Fixed

1. **Middleware Updated** - Static files are now excluded from locale redirects
2. **Dockerfile Updated** - Public folder will be copied in production builds
3. **Form Component Fixed** - Template link uses correct path

## 🐳 Docker-Specific Notes

### Development Mode (Current Setup)

In `docker-compose.yml`, the frontend uses:
- **Volume Mount**: `./frontend:/app` - Your local files are mounted
- **Target**: `development` - Runs in dev mode

This means:
- ✅ Template file should be accessible immediately
- ✅ No rebuild needed for file changes
- ✅ File path: `/app/public/uploads/evidence-template-sample.txt` in container

### Access the Template File

**Option 1: Via Browser (Recommended)**
```
http://localhost:3000/uploads/evidence-template-sample.txt
```

**Option 2: Via Evidence Form**
1. Navigate to: `http://localhost:3000/en/dashboard/governance/evidence`
2. Click "Add Evidence"
3. Click "Download Template" link in File Upload section

## 🔧 Verify Setup

### 1. Check File Exists in Container

```bash
docker-compose exec frontend ls -la /app/public/uploads/
```

You should see:
```
evidence-template-sample.txt
```

### 2. Test File Access

```bash
# From host machine
curl http://localhost:3000/uploads/evidence-template-sample.txt

# Should return the file content
```

### 3. Check Middleware is Working

The middleware should NOT redirect static files. Access:
```
http://localhost:3000/uploads/evidence-template-sample.txt
```

Should return file directly (no redirect to `/en/uploads/...`)

## 🚀 Apply Changes

After the fixes, you may need to:

### For Middleware Changes:
```bash
docker-compose restart frontend
```

### For Dockerfile Changes (if needed in future):
```bash
docker-compose build frontend
docker-compose up -d frontend
```

### For File Changes (development):
- No action needed - volume mount handles it automatically

## 📋 Summary of Changes Made

1. ✅ **Middleware** (`frontend/src/middleware.ts`)
   - Excludes `/uploads/` and `/downloads/` from locale redirects
   - Added file extension pattern matching

2. ✅ **Dockerfile** (`frontend/Dockerfile`)
   - Added: `COPY --from=builder --chown=nextjs:nodejs /app/public ./public`
   - Ensures public folder is included in production builds

3. ✅ **Form Component** (`frontend/src/components/governance/evidence-form.tsx`)
   - Changed from Next.js `Link` to regular `<a>` tag
   - Direct link to template file

## 🐛 Troubleshooting

### Issue: File Not Found (404)

**Check 1: File exists in container**
```bash
docker-compose exec frontend ls -la /app/public/uploads/
```

If missing, check local file:
```bash
ls -la frontend/public/uploads/evidence-template-sample.txt
```

**Check 2: Restart frontend**
```bash
docker-compose restart frontend
```

**Check 3: Check logs**
```bash
docker-compose logs frontend | grep -i error
```

### Issue: Wrong URL (redirects to /en/uploads/...)

This means middleware isn't working. Check:
1. Is middleware file updated? Check `frontend/src/middleware.ts`
2. Restart frontend: `docker-compose restart frontend`
3. Check middleware is being used (check Next.js logs)

## ✅ Quick Test

Run this to verify everything works:

```bash
# 1. Check file exists
docker-compose exec frontend test -f /app/public/uploads/evidence-template-sample.txt && echo "✅ File exists" || echo "❌ File missing"

# 2. Test file access
curl -I http://localhost:3000/uploads/evidence-template-sample.txt
# Should return HTTP 200, not 404 or 301/302 redirect
```

## 📝 Next Steps

1. **Restart frontend container** to apply middleware changes:
   ```bash
   docker-compose restart frontend
   ```

2. **Test template access**:
   - Open: `http://localhost:3000/uploads/evidence-template-sample.txt`
   - Should download/open the template file

3. **Test in Evidence form**:
   - Navigate to Evidence page
   - Click "Add Evidence"
   - Click "Download Template" link
   - Should work!

---

**Ready to test!** Restart your frontend container and the template file should be accessible.




