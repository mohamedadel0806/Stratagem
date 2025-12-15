# Stratagem GRC Platform - Deployment Guide

## Remote Server Details
- **Server IP**: 84.235.247.141
- **User**: ubuntu
- **Deployment Path**: /opt/stratagem
- **SSH Key**: /Users/adelsayed/Downloads/AWS/ssh-oracle-24.key

## Prerequisites

Before deploying, ensure:
1. SSH key has correct permissions: `chmod 600 /Users/adelsayed/Downloads/AWS/ssh-oracle-24.key`
2. Server is reachable: `ssh -i /Users/adelsayed/Downloads/AWS/ssh-oracle-24.key ubuntu@84.235.247.141`
3. Docker and Docker Compose are installed on the remote server
4. You have a domain name or IP configured

## Deployment Steps

### Step 1: Build and Package (Local Machine)
```bash
cd /Users/adelsayed/Documents/Code/Stratagem
chmod +x scripts/deploy.sh scripts/deploy-to-server.sh
./scripts/deploy-to-server.sh
```

This will:
- Build production Docker images (frontend, backend, ai-service)
- Save images as tar files
- Transfer deployment package to remote server
- Create docker-compose.prod.yml and configuration files

### Step 2: Server Setup (On Remote Server)

After deployment package is transferred, SSH into the server:

```bash
ssh -i /Users/adelsayed/Downloads/AWS/ssh-oracle-24.key ubuntu@84.235.247.141
```

Then run on the server:

```bash
cd /opt/stratagem/deploy
chmod +x scripts/*.sh
sudo ./scripts/deploy-server.sh
```

This will:
- Load Docker images
- Create Docker volumes for persistence
- Set up configuration
- Start all services with docker-compose.prod.yml

### Step 3: Configure Environment (On Remote Server)

Edit the environment file:
```bash
cd /opt/stratagem/deploy
nano config/.env
```

Update these critical values:
```bash
# Change these to your production values
NEXTAUTH_SECRET=your-secure-random-secret-here
JWT_SECRET=your-jwt-secret-here
FRONTEND_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com/api
NEXT_PUBLIC_KONG_URL=https://your-domain.com

# Database passwords (CHANGE FROM DEFAULTS)
POSTGRES_PASSWORD=your-secure-password
```

### Step 4: Verify Deployment

```bash
# Check if all containers are running
sudo docker-compose -f docker-compose.prod.yml ps

# Check logs
sudo docker-compose -f docker-compose.prod.yml logs frontend
sudo docker-compose -f docker-compose.prod.yml logs backend
sudo docker-compose -f docker-compose.prod.yml logs kong
```

## Kong Configuration

Kong is already configured in **DB-less mode** (declarative only), which means:
- Routes are defined in `infrastructure/kong/kong.yml`
- No separate Kong database required
- Configuration is version-controlled
- Simple to manage and deploy

Current Kong routes:
- `/api` → Backend service (port 3001)
- `/` → Catch-all to Backend
- `/ai` → AI Service (port 8000)

## Volumes and Data Persistence

The deployment creates Docker volumes for:
- PostgreSQL data
- MongoDB data
- Neo4j data
- Redis data
- Elasticsearch data
- Frontend/backend logs

These are persisted even if containers restart.

## Monitoring and Health Checks

Services have health checks configured:
- Backend: HTTP health check
- Keycloak: HTTP ready check
- PostgreSQL: pg_isready check

View health status:
```bash
sudo docker-compose -f docker-compose.prod.yml ps
```

## Troubleshooting

### Kong is not routing requests
```bash
# Check Kong routes
curl http://localhost:8001/routes

# Check Kong status
sudo docker-compose -f docker-compose.prod.yml logs kong
```

### Database connection issues
```bash
# Check PostgreSQL
sudo docker-compose -f docker-compose.prod.yml logs postgres

# Test connection
sudo docker-compose -f docker-compose.prod.yml exec postgres psql -U postgres -d grc_platform -c "SELECT 1"
```

### Frontend not accessible
```bash
# Check frontend logs
sudo docker-compose -f docker-compose.prod.yml logs frontend

# Verify frontend is listening
curl http://localhost:3000
```

## Backup and Restore

### Backup volumes:
```bash
cd /opt/stratagem/deploy
./scripts/backup-volumes.sh
```

### Restore volumes:
```bash
cd /opt/stratagem/deploy
./scripts/restore-volumes.sh
```

## Next Steps

1. Run deployment script locally
2. Configure environment on remote server
3. Start services and verify
4. Set up domain/DNS routing
5. Configure SSL certificates (if using Caddy)
6. Monitor logs and health checks

## Environment Variables Reference

See `scripts/setup-server-env.sh` for complete list of environment variables and their defaults.
