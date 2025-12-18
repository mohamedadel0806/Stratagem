# Complete Deployment Script

## Overview

`deploy-complete.sh` is a comprehensive deployment script that handles the entire deployment process from start to finish, including:

- ✅ Local database backup
- ✅ File transfer to remote server
- ✅ Environment configuration
- ✅ Docker network setup
- ✅ Image building with correct build arguments
- ✅ Database restoration
- ✅ Migration execution
- ✅ Service startup
- ✅ Deployment verification

## Prerequisites

1. **Local Environment:**
   - Docker and Docker Compose installed
   - Local development environment running (for database backup)
   - SSH key for remote server access

2. **Remote Server:**
   - Docker and Docker Compose installed
   - SSH access configured
   - Sufficient disk space

3. **Configuration:**
   - Update the script with your server details:
     ```bash
     REMOTE_USER="ubuntu"
     REMOTE_HOST="84.235.247.141"
     REMOTE_SSH_KEY="/Users/adelsayed/Downloads/AWS/ssh-oracle-24.key"
     ```

4. **Environment File:**
   - Ensure `.env` file exists on the remote server with production values
   - If it doesn't exist, the script will create a template and exit (you'll need to configure it)

## Usage

### Basic Usage

```bash
./scripts/deploy-complete.sh
```

### What the Script Does

1. **Prerequisites Check**
   - Verifies SSH key exists
   - Checks Docker and Docker Compose availability
   - Tests SSH connection to server

2. **Local Database Backup**
   - Exports PostgreSQL databases (grc_platform, keycloak)
   - Exports MongoDB database
   - Creates backup manifest
   - Saves to `./database-export/export_TIMESTAMP/`

3. **Server Setup**
   - Creates directory structure on remote server
   - Transfers all necessary files (backend, frontend, infrastructure, scripts)
   - Transfers database backup

4. **Environment Configuration**
   - Creates `.env` template if it doesn't exist (and exits for you to configure)
   - Creates `frontend/.env.production` with correct Kong settings

5. **Infrastructure Setup**
   - Creates/verifies Docker network (`grc-network`)
   - Configures network with correct subnet

6. **Build and Start Services**
   - Stops existing services
   - Starts databases first
   - Waits for databases to be ready
   - Builds backend image
   - Builds frontend image with all required build args:
     - `NEXT_PUBLIC_API_URL`
     - `NEXT_PUBLIC_USE_KONG`
     - `NEXT_PUBLIC_KONG_URL`
     - `NEXTAUTH_URL`
     - `NEXTAUTH_SECRET`
   - Builds AI service (if exists)
   - Starts all services

7. **Database Restoration**
   - Backs up existing database (if exists)
   - Restores PostgreSQL databases
   - Restores MongoDB database
   - Fixes Keycloak user password

8. **Migrations**
   - Waits for backend to be ready
   - Runs database migrations

9. **Verification**
   - Checks service status
   - Verifies Kong is running
   - Checks backend health
   - Verifies frontend is accessible

## Configuration

### Required Environment Variables

The `.env` file on the remote server must contain:

```bash
# Application Secrets
NEXTAUTH_SECRET=<generated-secret>
JWT_SECRET=<generated-secret>

# Database Credentials
POSTGRES_PASSWORD=<strong-password>
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=<strong-password>
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=<strong-password>
REDIS_PASSWORD=<strong-password>
ELASTIC_PASSWORD=<strong-password>

# Keycloak
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=<strong-password>

# API Configuration
FRONTEND_URL=https://grc-staging.newmehub.com
NEXT_PUBLIC_API_URL=https://grc-staging.newmehub.com/api/v1
NEXT_PUBLIC_USE_KONG=true
NEXT_PUBLIC_KONG_URL=https://grc-staging.newmehub.com/api
BACKEND_URL=http://backend:3001

# Database URLs
DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@postgres:5432/grc_platform
MONGODB_URL=mongodb://${MONGO_ROOT_USERNAME}:${MONGO_ROOT_PASSWORD}@mongodb:27017/grc_documents?authSource=admin
NEO4J_URL=bolt://neo4j:7687
REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
ELASTICSEARCH_URL=http://elasticsearch:9200
```

### Generating Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate JWT_SECRET
openssl rand -base64 32
```

## Troubleshooting

### Script Fails at Environment Setup

If the script exits saying `.env` file doesn't exist:
1. SSH into the server
2. Navigate to `/opt/stratagem`
3. Edit `.env` with production values
4. Run the script again

### Database Restore Fails

- Check that the backup files were transferred correctly
- Verify PostgreSQL container is running
- Check database backup files are not empty

### Build Fails

- Check Docker has enough disk space
- Verify all required files were transferred
- Check build logs: `docker compose -f docker-compose.prod.yml logs backend`

### Services Don't Start

- Check service logs: `docker compose -f docker-compose.prod.yml logs`
- Verify Docker network exists: `docker network ls | grep grc-network`
- Check environment variables are set correctly

### Kong Not Working

- Verify Kong configuration: `curl http://localhost:8001/services`
- Check Kong logs: `docker compose -f docker-compose.prod.yml logs kong`
- Verify `infrastructure/kong/kong.yml` was transferred

### Frontend API Errors

- Verify `frontend/.env.production` exists with correct values
- Check frontend was built with correct build args
- Verify Kong CORS configuration includes production domain

## Post-Deployment

### Check Logs

```bash
ssh -i /path/to/key ubuntu@84.235.247.141
cd /opt/stratagem
docker compose -f docker-compose.prod.yml logs -f
```

### Verify Services

```bash
# Check all services
docker compose -f docker-compose.prod.yml ps

# Check specific service
docker compose -f docker-compose.prod.yml logs backend
docker compose -f docker-compose.prod.yml logs frontend
docker compose -f docker-compose.prod.yml logs kong
```

### Test Endpoints

```bash
# Backend health
curl http://localhost:3001/health

# Kong services
curl http://localhost:8001/services

# Frontend
curl -I http://localhost:3000
```

## Notes

- The script creates backups before restoring, so existing data is safe
- Database restoration only happens if backup files exist and are not empty
- Migrations run automatically after database restoration
- All services are built on the server (not locally) to avoid image transfer issues
- The script handles errors gracefully and provides clear status messages

## Support

If you encounter issues:
1. Check the script output for error messages
2. Review service logs on the remote server
3. Verify all prerequisites are met
4. Ensure `.env` file is correctly configured




