# Server Connection Information

## Server Details
- **Host:** 84.235.247.141
- **User:** ubuntu
- **SSH Key:** `/Users/adelsayed/Downloads/AWS/ssh-oracle-24.key`
- **Application Path:** `/opt/stratagem`

## Quick Commands

### Connect to Server
```bash
ssh -i /Users/adelsayed/Downloads/AWS/ssh-oracle-24.key ubuntu@84.235.247.141
```

### Transfer Files to Server
```bash
# Transfer deployment package
scp -i /Users/adelsayed/Downloads/AWS/ssh-oracle-24.key -r deploy/ ubuntu@84.235.247.141:/opt/stratagem/

# Transfer single file
scp -i /Users/adelsayed/Downloads/AWS/ssh-oracle-24.key file.txt ubuntu@84.235.247.141:/opt/stratagem/
```

### Automated Deployment
```bash
# From project root, run:
./scripts/deploy-to-server.sh
```

This will:
1. Build and package the application
2. Test SSH connection
3. Transfer files to server
4. Provide next steps

## Server Commands (After SSH)

### Check Docker
```bash
docker --version
docker-compose --version
```

### Check Caddy
```bash
sudo systemctl status caddy
sudo caddy version
```

### Application Management
```bash
# Navigate to app directory
cd /opt/stratagem

# Start services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Stop services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down

# View logs
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f

# Check status
docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps
```

### Backup Data
```bash
cd /opt/stratagem
./scripts/backup-volumes.sh
```

### System Information
```bash
# Disk space
df -h

# Memory
free -h

# Docker disk usage
docker system df

# Running containers
docker ps
```











