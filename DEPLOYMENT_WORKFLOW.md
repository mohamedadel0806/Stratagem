# Deployment Workflow

This document describes how to deploy updates to the GRC Platform staging server.

## Quick Reference

### Full Deployment with Database Restore (Recommended)
```bash
./scripts/deploy-with-db-restore.sh
```
**Use this for complete deployments including database restore from local**

### Full Deployment (All Services)
```bash
./scripts/deploy-update.sh
```
**Now includes automatic database schema fixes**

### Quick Deployment (Single Service)
```bash
# Deploy only backend
./scripts/deploy-quick.sh backend

# Deploy only frontend
./scripts/deploy-quick.sh frontend

# Deploy only AI service
./scripts/deploy-quick.sh ai-service
```

### Fix Database Schema Issues
```bash
# On server, run:
./scripts/fix-database-schema.sh
```
**Fixes common schema issues like missing columns**

## Deployment Process

### 1. Complete Deployment with Database Restore (`deploy-with-db-restore.sh`)

This script:
- ✅ Exports local database
- ✅ Transfers all source code (backend, frontend, ai-service)
- ✅ Transfers and restores database from local
- ✅ Rebuilds all Docker images on the server
- ✅ Fixes database schema issues automatically
- ✅ Restarts all services
- ✅ Reloads Caddy if configuration changed

**When to use:**
- When you want to sync local database to server
- After making database changes locally
- When you need a fresh database restore

**Time:** ~10-15 minutes

### 2. Full Deployment (`deploy-update.sh`)

This script:
- ✅ Transfers all source code (backend, frontend, ai-service)
- ✅ Transfers configuration files (docker-compose.prod.yml, Caddyfile)
- ✅ Rebuilds all Docker images on the server
- ✅ **Automatically fixes database schema issues**
- ✅ Restarts all services
- ✅ Reloads Caddy if configuration changed

**When to use:**
- Code updates without database changes
- Major updates affecting multiple services
- Configuration changes
- After pulling latest code from git

**Time:** ~5-10 minutes

### 3. Quick Deployment (`deploy-quick.sh`)

This script:
- ✅ Transfers only the specified service
- ✅ Rebuilds only that service's Docker image
- ✅ Restarts only that service

**When to use:**
- Small changes to a single service
- Frontend UI updates
- Backend API changes
- AI service updates

**Time:** ~2-5 minutes

## Step-by-Step Manual Deployment

If you prefer manual control:

### 1. Transfer Code
```bash
# Backend
rsync -avz -e "ssh -i /Users/adelsayed/Downloads/AWS/ssh-oracle-24.key" \
  --exclude 'node_modules' --exclude 'dist' --exclude '.git' \
  ./backend/ ubuntu@84.235.247.141:/opt/stratagem/backend/

# Frontend
rsync -avz -e "ssh -i /Users/adelsayed/Downloads/AWS/ssh-oracle-24.key" \
  --exclude 'node_modules' --exclude '.next' --exclude '.git' \
  ./frontend/ ubuntu@84.235.247.141:/opt/stratagem/frontend/
```

### 2. Rebuild on Server
```bash
ssh -i /Users/adelsayed/Downloads/AWS/ssh-oracle-24.key ubuntu@84.235.247.141
cd /opt/stratagem

# Load environment
export $(cat .env | grep -v '^#' | xargs)

# Rebuild services
docker compose -f docker-compose.prod.yml build backend
docker compose -f docker-compose.prod.yml build --build-arg NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} --build-arg NEXTAUTH_URL=${FRONTEND_URL} --build-arg NEXTAUTH_SECRET=${NEXTAUTH_SECRET} frontend

# Restart services
docker compose -f docker-compose.prod.yml up -d backend frontend
```

### 3. Update Caddy (if needed)
```bash
sudo cp /opt/stratagem/infrastructure/caddy/Caddyfile /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

## Database Migrations

If you have database schema changes:

### 1. Export Local Database (Backup)
```bash
./scripts/export-database.sh
```

### 2. Create Migration Script
Create migration SQL files in `backend/src/migrations/`

### 3. Apply Migrations on Server
```bash
ssh -i /Users/adelsayed/Downloads/AWS/ssh-oracle-24.key ubuntu@84.235.247.141
cd /opt/stratagem
docker compose -f docker-compose.prod.yml exec backend npm run migration:run
```

## Environment Variables

Environment variables are stored in `/opt/stratagem/.env` on the server.

**Important variables:**
- `FRONTEND_URL=https://grc-staging.newmehub.com`
- `NEXT_PUBLIC_API_URL=https://grc-staging.newmehub.com/api`
- `NEXTAUTH_URL=https://grc-staging.newmehub.com`
- `NEXTAUTH_SECRET` - Must match between builds
- Database credentials
- JWT secrets

**To update:**
```bash
ssh -i /Users/adelsayed/Downloads/AWS/ssh-oracle-24.key ubuntu@84.235.247.141
cd /opt/stratagem
nano .env  # Edit variables
# Then rebuild frontend if NEXT_PUBLIC_* variables changed
docker compose -f docker-compose.prod.yml build --build-arg NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} frontend
docker compose -f docker-compose.prod.yml up -d frontend
```

## Troubleshooting

### Check Service Logs
```bash
ssh -i /Users/adelsayed/Downloads/AWS/ssh-oracle-24.key ubuntu@84.235.247.141
cd /opt/stratagem
docker compose -f docker-compose.prod.yml logs --tail 100 backend
docker compose -f docker-compose.prod.yml logs --tail 100 frontend
```

### Check Service Status
```bash
docker compose -f docker-compose.prod.yml ps
```

### Restart All Services
```bash
docker compose -f docker-compose.prod.yml restart
```

### View Caddy Logs
```bash
sudo journalctl -u caddy -f
```

### Test API Endpoint
```bash
curl https://grc-staging.newmehub.com/api/dashboard/overview \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Best Practices

1. **Always test locally first** before deploying
2. **Commit changes to git** before deploying
3. **Use quick deployment** for small changes
4. **Use full deployment** for major updates
5. **Check logs after deployment** to ensure services started correctly
6. **Backup database** before schema changes
7. **Update environment variables** if needed before rebuilding frontend

## Deployment Checklist

- [ ] Code tested locally
- [ ] Changes committed to git
- [ ] Environment variables updated (if needed)
- [ ] Database backup created (if schema changes)
- [ ] Deployment script executed
- [ ] Services restarted successfully
- [ ] Logs checked for errors
- [ ] Website tested in browser
- [ ] API endpoints tested





