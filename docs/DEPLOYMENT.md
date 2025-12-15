# Stratagem GRC Platform - Deployment Guide

This guide covers deploying the Stratagem GRC Platform to a remote server with Docker, Docker Compose, and Caddy web server.

## Prerequisites

### Local Machine
- Docker and Docker Compose installed
- SSH access to the remote server
- SCP for file transfer
- Git (for version control)

### Remote Server
- Ubuntu/Debian Linux (or similar)
- Docker and Docker Compose installed
- Caddy web server installed
- SSH access configured
- At least 8GB RAM recommended
- Sufficient disk space (50GB+ recommended for data)

## Deployment Architecture

```
Internet
   │
   ▼
Caddy (Port 80/443)
   │
   ├──► Frontend (Port 3000)
   ├──► Kong Gateway (Port 8000)
   │    ├──► Backend API (Port 3001)
   │    └──► AI Service (Port 8000)
   ├──► Keycloak (Port 8080)
   └──► Monitoring (Ports 9091, 3010) - Optional
```

## Step-by-Step Deployment

### Step 1: Prepare Deployment Package (Local Machine)

1. **Navigate to project root:**
   ```bash
   cd /path/to/Stratagem
   ```

2. **Make deployment script executable:**
   ```bash
   chmod +x scripts/deploy.sh
   ```

3. **Run the deployment script:**
   ```bash
   ./scripts/deploy.sh
   ```

   This script will:
   - Build all Docker images for production
   - Save images as compressed tar.gz files
   - Copy all configuration files
   - Create deployment package in `./deploy/` directory

4. **Review the deployment package:**
   ```bash
   ls -lh deploy/
   ```

   You should see:
   - `images/` - Compressed Docker images
   - `config/` - Configuration files
   - `scripts/` - Deployment scripts
   - `MANIFEST.txt` - Deployment information

### Step 2: Configure Environment Variables

1. **Create production .env file:**
   ```bash
   cd deploy/config
   cp .env.template .env
   ```

2. **Edit .env with production values:**
   ```bash
   nano .env
   ```

   **Important values to set:**
   - Generate strong secrets:
     ```bash
     openssl rand -base64 32  # For NEXTAUTH_SECRET
     openssl rand -base64 32  # For JWT_SECRET
     ```
   - Set strong database passwords
   - Update `FRONTEND_URL` with your domain
   - Update `NEXT_PUBLIC_API_URL` with your domain

### Step 3: Transfer Files to Server

**Server Details:**
- **Host:** 84.235.247.141
- **User:** ubuntu
- **SSH Key:** /Users/adelsayed/Downloads/AWS/ssh-oracle-24.key

**Option A: Automated Deployment (Recommended)**

1. **Use the automated script:**
   ```bash
   chmod +x scripts/deploy-to-server.sh
   ./scripts/deploy-to-server.sh
   ```
   
   This script will:
   - Build and package the application
   - Test SSH connection
   - Transfer files to server
   - Provide next steps

**Option B: Manual Transfer**

1. **Create directory on server:**
   ```bash
   ssh -i /Users/adelsayed/Downloads/AWS/ssh-oracle-24.key ubuntu@84.235.247.141 "mkdir -p /opt/stratagem"
   ```

2. **Transfer deployment package:**
   ```bash
   scp -i /Users/adelsayed/Downloads/AWS/ssh-oracle-24.key -r deploy/ ubuntu@84.235.247.141:/opt/stratagem/
   ```

   **Note:** This may take a while depending on your connection speed and image sizes.

   **Alternative:** If transfer is slow, you can:
   - Compress the package first:
     ```bash
     tar czf stratagem-deploy.tar.gz deploy/
     scp -i /Users/adelsayed/Downloads/AWS/ssh-oracle-24.key stratagem-deploy.tar.gz ubuntu@84.235.247.141:/opt/stratagem/
     ```
   - Then on server:
     ```bash
     cd /opt/stratagem
     tar xzf stratagem-deploy.tar.gz
     ```

### Step 4: Server Setup (SSH into Server)

1. **SSH into your server:**
   ```bash
   ssh -i /Users/adelsayed/Downloads/AWS/ssh-oracle-24.key ubuntu@84.235.247.141
   ```

2. **Navigate to deployment directory:**
   ```bash
   cd /opt/stratagem/deploy
   ```

3. **Make scripts executable:**
   ```bash
   chmod +x scripts/*.sh
   ```

4. **Run server deployment script:**
   ```bash
   sudo ./scripts/deploy-server.sh
   ```

   This script will:
   - Load all Docker images
   - Create Docker volumes for data persistence
   - Set up configuration files
   - Create systemd service for auto-start

5. **Configure environment file:**
   ```bash
   cd /opt/stratagem
   nano .env
   ```
   
   Update all values with your production settings.

### Step 5: Configure Caddy Reverse Proxy

1. **Copy Caddy configuration:**
   ```bash
   sudo cp /opt/stratagem/deploy/config/infrastructure/caddy/Caddyfile /etc/caddy/Caddyfile
   ```

2. **Edit Caddyfile with your domain:**
   ```bash
   sudo nano /etc/caddy/Caddyfile
   ```
   
   Replace `your-domain.com` with your actual domain name.

3. **Test Caddy configuration:**
   ```bash
   sudo caddy validate --config /etc/caddy/Caddyfile
   ```

4. **Reload Caddy:**
   ```bash
   sudo systemctl reload caddy
   ```

   Or if Caddy is not running as a service:
   ```bash
   sudo caddy reload --config /etc/caddy/Caddyfile
   ```

### Step 6: Start the Application

1. **Navigate to application directory:**
   ```bash
   cd /opt/stratagem
   ```

2. **Start all services:**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

3. **Check service status:**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps
   ```

4. **View logs:**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f
   ```

### Step 7: Verify Deployment

1. **Check if services are running:**
   ```bash
   docker ps
   ```

2. **Test frontend:**
   ```bash
   curl -I https://your-domain.com
   ```

3. **Test API:**
   ```bash
   curl https://your-domain.com/api/health
   ```

4. **Check Caddy logs:**
   ```bash
   sudo tail -f /var/log/caddy/stratagem.log
   ```

## Data Persistence

### Docker Volumes

All data is stored in Docker volumes:
- `postgres_data_prod` - PostgreSQL database
- `mongodb_data_prod` - MongoDB documents
- `neo4j_data_prod` - Neo4j graph database
- `redis_data_prod` - Redis cache
- `elasticsearch_data_prod` - Elasticsearch indices
- `prometheus_data` - Prometheus metrics
- `grafana_data` - Grafana dashboards

### Backup Data

1. **Create backup:**
   ```bash
   cd /opt/stratagem
   ./scripts/backup-volumes.sh
   ```

2. **Backup location:** `./backups/backup_YYYYMMDD_HHMMSS/`

3. **Transfer backup off-server:**
   ```bash
   scp -r backups/backup_* user@backup-server:/backups/stratagem/
   ```

### Restore Data

1. **Transfer backup to server:**
   ```bash
   scp -r backup_directory user@your-server.com:/opt/stratagem/backups/
   ```

2. **Stop services:**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
   ```

3. **Restore volumes:**
   ```bash
   cd /opt/stratagem
   ./scripts/restore-volumes.sh backups/backup_directory
   ```

4. **Start services:**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

## Updating the Application

### Method 1: Full Redeployment

1. **On local machine, create new deployment package:**
   ```bash
   ./scripts/deploy.sh
   ```

2. **Transfer new images to server:**
   ```bash
   scp -r deploy/images/*.tar.gz user@your-server.com:/opt/stratagem/deploy/images/
   ```

3. **On server, load new images:**
   ```bash
   cd /opt/stratagem
   ./scripts/load-images.sh deploy/images
   ```

4. **Restart services:**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --force-recreate
   ```

### Method 2: Build on Server

1. **Transfer source code:**
   ```bash
   scp -r backend/ frontend/ ai-service/ user@your-server.com:/opt/stratagem/
   ```

2. **On server, rebuild and restart:**
   ```bash
   cd /opt/stratagem
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml build
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

## Monitoring and Maintenance

### View Logs

```bash
# All services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f backend

# Last 100 lines
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs --tail=100
```

### Health Checks

```bash
# Check all containers
docker ps

# Check specific service
docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps backend

# Check resource usage
docker stats
```

### Database Maintenance

```bash
# PostgreSQL
docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec postgres psql -U postgres -d grc_platform

# MongoDB
docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec mongodb mongosh -u admin -p

# Neo4j
# Access via browser: http://your-server:7475
```

## Troubleshooting

### Services Won't Start

1. **Check logs:**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs
   ```

2. **Check Docker resources:**
   ```bash
   docker system df
   docker system prune  # Clean up if needed
   ```

3. **Check port conflicts:**
   ```bash
   sudo netstat -tulpn | grep -E ':(3000|3001|8000|8080)'
   ```

### Caddy Issues

1. **Check Caddy status:**
   ```bash
   sudo systemctl status caddy
   ```

2. **Check Caddy logs:**
   ```bash
   sudo journalctl -u caddy -f
   ```

3. **Validate configuration:**
   ```bash
   sudo caddy validate --config /etc/caddy/Caddyfile
   ```

### Database Connection Issues

1. **Check database containers:**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps postgres mongodb neo4j
   ```

2. **Check network:**
   ```bash
   docker network inspect grc-network
   ```

3. **Test connection from backend:**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec backend sh
   # Inside container:
   ping postgres
   ```

## Security Considerations

1. **Firewall Configuration:**
   ```bash
   # Allow only necessary ports
   sudo ufw allow 22/tcp    # SSH
   sudo ufw allow 80/tcp    # HTTP
   sudo ufw allow 443/tcp   # HTTPS
   sudo ufw enable
   ```

2. **Environment Variables:**
   - Never commit `.env` file to version control
   - Use strong, unique passwords
   - Rotate secrets regularly

3. **Caddy Access Control:**
   - Restrict admin endpoints (Kong, Prometheus, Grafana)
   - Use IP whitelisting for sensitive endpoints

4. **Regular Updates:**
   - Keep Docker images updated
   - Update system packages regularly
   - Monitor security advisories

## Performance Optimization

1. **Resource Limits:**
   - Adjust memory limits in `docker-compose.prod.yml`
   - Monitor resource usage with `docker stats`

2. **Database Optimization:**
   - Regular VACUUM for PostgreSQL
   - Index optimization
   - Connection pooling

3. **Caching:**
   - Redis is configured for caching
   - Adjust TTL values based on usage

## Support

For issues or questions:
1. Check logs first
2. Review this documentation
3. Check Docker and Caddy documentation
4. Review application-specific logs

## Quick Reference

```bash
# Start services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Stop services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down

# View logs
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f

# Restart specific service
docker-compose -f docker-compose.yml -f docker-compose.prod.yml restart backend

# Backup data
./scripts/backup-volumes.sh

# Restore data
./scripts/restore-volumes.sh backups/backup_directory

# Reload Caddy
sudo systemctl reload caddy
```

