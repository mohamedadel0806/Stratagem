# Deployment Quick Start Guide

## Quick Overview

This is a condensed guide for deploying Stratagem to your server. For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Prerequisites Checklist

- [ ] Remote server with SSH access
- [ ] Docker and Docker Compose installed on server
- [ ] Caddy web server installed on server
- [ ] Domain name pointing to server IP
- [ ] At least 8GB RAM on server
- [ ] 50GB+ free disk space

## Deployment Steps

### 1. Local Machine - Build & Package

```bash
# Make script executable
chmod +x scripts/deploy.sh

# Build and package everything
./scripts/deploy.sh

# This creates: ./deploy/ directory with everything needed
```

### 2. Configure Environment

```bash
cd deploy/config
cp .env.template .env
nano .env  # Edit with your production values
```

**Critical values to set:**
- Generate secrets: `openssl rand -base64 32`
- Set strong database passwords
- Update `FRONTEND_URL` with your domain
- Update `NEXT_PUBLIC_API_URL` with your domain

### 3. Transfer to Server

**Option A: Automated (Recommended)**
```bash
# Build, package, and transfer in one command
chmod +x scripts/deploy-to-server.sh
./scripts/deploy-to-server.sh
```

**Option B: Manual**
```bash
# Transfer deployment package
scp -i /Users/adelsayed/Downloads/AWS/ssh-oracle-24.key -r deploy/ ubuntu@84.235.247.141:/opt/stratagem/
```

### 4. Server Setup

```bash
# SSH into server
ssh -i /Users/adelsayed/Downloads/AWS/ssh-oracle-24.key ubuntu@84.235.247.141

# Navigate and setup
cd /opt/stratagem/deploy
chmod +x scripts/*.sh
sudo ./scripts/deploy-server.sh

# Configure environment
cd /opt/stratagem
nano .env  # Update with production values
```

### 5. Configure Caddy

```bash
# Copy Caddy config
sudo cp /opt/stratagem/deploy/config/infrastructure/caddy/Caddyfile /etc/caddy/Caddyfile

# Edit with your domain
sudo nano /etc/caddy/Caddyfile  # Replace 'your-domain.com'

# Validate and reload
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

### 6. Start Application

```bash
cd /opt/stratagem
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### 7. Verify

```bash
# Check services
docker ps

# Check logs
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f

# Test frontend
curl -I https://your-domain.com
```

## Common Commands

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

# Reload Caddy
sudo systemctl reload caddy
```

## Troubleshooting

### Services won't start
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs
```

### Port conflicts
```bash
sudo netstat -tulpn | grep -E ':(3000|3001|8000|8080)'
```

### Caddy issues
```bash
sudo systemctl status caddy
sudo journalctl -u caddy -f
```

## Security Checklist

- [ ] Strong passwords in `.env`
- [ ] Firewall configured (only 22, 80, 443 open)
- [ ] Caddy admin endpoints restricted
- [ ] Database passwords changed from defaults
- [ ] SSL/TLS working (Caddy auto-configures)
- [ ] Regular backups scheduled

## Next Steps

1. Set up automated backups
2. Configure monitoring alerts
3. Set up log rotation
4. Review security settings
5. Test disaster recovery

For detailed information, see [DEPLOYMENT.md](./DEPLOYMENT.md).

