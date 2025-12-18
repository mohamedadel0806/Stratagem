# Template File Access in Docker

## Overview

Since the application is running in Docker, there are specific considerations for accessing static files like the evidence template.

## File Location

The template file is located at:
```
frontend/public/uploads/evidence-template-sample.txt
```

## Docker Configuration

### Development Mode

In development, the frontend directory is mounted as a volume:
```yaml
volumes:
  - ./frontend:/app
```

This means:
- ✅ Files in `frontend/public/` are accessible directly
- ✅ Template file should be available at: `http://localhost:3000/uploads/evidence-template-sample.txt`
- ✅ No rebuild needed when template file changes

### Production Mode

For production builds with `output: 'standalone'`, the Dockerfile now explicitly copies the public folder:
```dockerfile
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
```

## Access URLs

### Development (Docker)
```
http://localhost:3000/uploads/evidence-template-sample.txt
```

### Production (Docker)
```
http://your-domain.com/uploads/evidence-template-sample.txt
```

## Important Notes

1. **No Locale Prefix**: Static files should be accessed WITHOUT locale prefix (`/en/`)
   - ✅ Correct: `/uploads/evidence-template-sample.txt`
   - ❌ Wrong: `/en/uploads/evidence-template-sample.txt`

2. **Middleware Configuration**: The middleware now excludes static files from locale redirects

3. **Docker Volume**: In development, ensure the file exists in `frontend/public/uploads/` on your host machine

## Troubleshooting

### File Not Found in Docker

1. **Check file exists:**
   ```bash
   ls -la frontend/public/uploads/evidence-template-sample.txt
   ```

2. **Check Docker volume mount:**
   ```bash
   docker-compose exec frontend ls -la /app/public/uploads/
   ```

3. **Restart frontend container:**
   ```bash
   docker-compose restart frontend
   ```

4. **Rebuild if needed (production):**
   ```bash
   docker-compose build frontend
   docker-compose up -d frontend
   ```

### Access Template File

1. **From host machine:**
   - Direct URL: `http://localhost:3000/uploads/evidence-template-sample.txt`
   - Via Evidence form: Click "Download Template" link

2. **From inside container:**
   ```bash
   docker-compose exec frontend cat /app/public/uploads/evidence-template-sample.txt
   ```

## Verification Steps

1. **Check file exists in container:**
   ```bash
   docker-compose exec frontend ls -la /app/public/uploads/
   ```

2. **Test file access:**
   ```bash
   curl http://localhost:3000/uploads/evidence-template-sample.txt
   ```

3. **Check middleware exclusion:**
   - Access should NOT redirect to `/en/uploads/...`
   - Should return file directly

## Docker Compose Commands

```bash
# Restart frontend (for middleware changes)
docker-compose restart frontend

# View frontend logs
docker-compose logs -f frontend

# Access frontend container shell
docker-compose exec frontend sh

# Check public folder in container
docker-compose exec frontend ls -la /app/public/uploads/
```

## Next Steps After Changes

If you've made changes to:
- **Middleware**: Restart frontend container
- **Template file**: File is available immediately (volume mount)
- **Dockerfile**: Rebuild the image

```bash
# Restart (for middleware/file changes)
docker-compose restart frontend

# Rebuild (for Dockerfile changes)
docker-compose build frontend
docker-compose up -d frontend
```

---

**Last Updated:** December 2024





