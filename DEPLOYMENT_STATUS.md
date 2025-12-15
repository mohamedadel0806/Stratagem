# Stratagem Deployment Status

## Deployment In Progress ✅

The deployment script is currently running and will:

1. **Build Production Docker Images**
   - Frontend (Next.js) → `stratagem-frontend:latest`
   - Backend (NestJS) → `stratagem-backend:latest`
   - AI Service (FastAPI) → `stratagem-ai-service:latest`

2. **Package and Transfer to Remote Server**
   - Server: `ubuntu@84.235.247.141`
   - Deployment Path: `/opt/stratagem`
   - Transfer method: SCP (secure copy)

3. **Expected Time**
   - Frontend build: ~5-10 minutes
   - Backend build: ~10-15 minutes
   - AI Service build: ~5 minutes
   - Total transfer: Depends on connection speed (likely 10-30 minutes)
   - **Total estimated time: 30-60 minutes**

## What Happens After Build Completes

Once images are built and transferred, you need to run on the server:

```bash
ssh -i /Users/adelsayed/Downloads/AWS/ssh-oracle-24.key ubuntu@84.235.247.141

# Navigate to deployment directory
cd /opt/stratagem/deploy

# Configure environment
chmod +x scripts/*.sh
nano config/.env

# Run server setup (requires sudo)
sudo ./scripts/deploy-server.sh
```

## Kong Configuration (Already Done)

✅ Kong is configured in **DB-less mode** with routes:
- `/api` → Backend API
- `/` → Catch-all to Backend
- `/ai` → AI Service
- CORS is enabled for http://localhost:3000

Routes are defined in `infrastructure/kong/kong.yml` and will be included in the deployment package.

## Files Included in Deployment Package

- Docker images (tar files)
- `docker-compose.prod.yml` - Production compose file
- `infrastructure/kong/kong.yml` - Kong declarative config
- Configuration templates
- Deployment scripts
- Volume backup/restore scripts

## Volumes and Data Persistence

The deployment will create:
- PostgreSQL volume (grc_postgres_prod_data)
- MongoDB volume (grc_mongodb_prod_data)
- Neo4j volume (grc_neo4j_prod_data)
- Redis volume (grc_redis_prod_data)
- Elasticsearch volume (grc_elasticsearch_prod_data)

## Next: Production Configuration

After deployment, update these environment variables in `.env`:

```bash
# Security - CHANGE THESE!
NEXTAUTH_SECRET=<generate-new-secure-secret>
JWT_SECRET=<generate-new-secure-secret>

# Domain - UPDATE WITH YOUR DOMAIN
FRONTEND_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com/api
NEXT_PUBLIC_KONG_URL=https://your-domain.com

# Database - CHANGE PASSWORDS
POSTGRES_PASSWORD=<new-secure-password>
```

## Current Status

Build started - check back in 30-60 minutes for completion.

Monitor with:
```bash
watch -n 5 "ls -lh /Users/adelsayed/Documents/Code/Stratagem/deploy/images/"
```

When `.tar.gz` files appear in the `images/` directory, the build is complete!
