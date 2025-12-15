#!/bin/bash

# Backup local Docker volumes and deploy to remote server
# This script:
# 1. Backs up local Docker volumes
# 2. Transfers backup and pre-built images to server
# 3. Restores database on server

set -e

REMOTE_USER="ubuntu"
REMOTE_HOST="84.235.247.141"
REMOTE_SSH_KEY="/Users/adelsayed/Downloads/AWS/ssh-oracle-24.key"
REMOTE_PATH="/opt/stratagem"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() { echo -e "${GREEN}[✓]${NC} $1"; }
print_error() { echo -e "${RED}[✗]${NC} $1"; exit 1; }
print_step() { echo -e "${YELLOW}[→]${NC} $1"; }

echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  Backup & Deploy to Remote Server    ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""

# 1. Test SSH
print_step "Testing SSH connection..."
ssh -i "$REMOTE_SSH_KEY" -o ConnectTimeout=5 "$REMOTE_USER@$REMOTE_HOST" "echo ok" > /dev/null 2>&1 || print_error "SSH connection failed"
print_status "SSH connection successful"
echo ""

# 2. Backup local volumes
print_step "Backing up local Docker volumes..."
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="${BACKUP_DIR}/backup_local_${TIMESTAMP}"
mkdir -p "$BACKUP_PATH"

# List of local dev volumes
VOLUMES=(
    "stratagem_postgres_data"
    "stratagem_mongodb_data"
    "stratagem_neo4j_data"
    "stratagem_redis_data"
    "stratagem_elasticsearch_data"
)

for volume in "${VOLUMES[@]}"; do
    if docker volume inspect "$volume" &> /dev/null; then
        print_step "  Backing up $volume..."
        docker run --rm \
            -v "$volume":/data \
            -v "$(pwd)/$BACKUP_PATH":/backup \
            alpine tar czf "/backup/${volume}.tar.gz" -C /data . 2>/dev/null
        print_status "  $volume backed up"
    else
        echo "  ⚠ Volume $volume not found, skipping..."
    fi
done

print_status "Local volumes backed up to: $BACKUP_PATH"
echo ""

# 3. Backup server database first
print_step "Backing up existing server database..."
ssh -i "$REMOTE_SSH_KEY" "$REMOTE_USER@$REMOTE_HOST" << 'SSH_BACKUP' 2>/dev/null
cd /opt/stratagem
./scripts/backup-volumes.sh > /dev/null 2>&1 || true
echo "✓ Server backup created"
SSH_BACKUP
print_status "Server database backed up"
echo ""

# 4. Stop services on server
print_step "Stopping services on server..."
ssh -i "$REMOTE_SSH_KEY" "$REMOTE_USER@$REMOTE_HOST" << 'SSH_STOP' 2>/dev/null
cd /opt/stratagem
docker compose down --remove-orphans > /dev/null 2>&1 || true
sleep 2
SSH_STOP
print_status "Services stopped"
echo ""

# 5. Transfer backup to server
print_step "Transferring backup to server..."
scp -i "$REMOTE_SSH_KEY" -r "$BACKUP_PATH" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/database-import/" > /dev/null 2>&1
print_status "Backup transferred"
echo ""

# 6. Transfer pre-built images
print_step "Preparing pre-built Docker images..."
mkdir -p deploy/images

for image in stratagem-frontend stratagem-backend stratagem-ai-service; do
    if ! docker image inspect "$image:latest" > /dev/null 2>&1; then
        print_error "Image $image:latest not found. Please build images first."
    fi
done

print_step "Saving Docker images..."
for image in stratagem-frontend stratagem-backend stratagem-ai-service; do
    print_step "  Saving $image..."
    docker save "$image:latest" | gzip > "deploy/images/${image}.tar.gz"
done
print_status "Images saved"

print_step "Transferring images to server (this may take 10-20 minutes)..."
scp -i "$REMOTE_SSH_KEY" -r deploy/images/*.tar.gz "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/deploy/images/" 2>&1 | tail -20
print_status "Images transferred"
echo ""

# 7. Load images and restore database on server
print_step "Loading images and restoring database on server..."
ssh -i "$REMOTE_SSH_KEY" "$REMOTE_USER@$REMOTE_HOST" << 'SSH_LOAD' 2>/dev/null
cd /opt/stratagem

echo "Loading Docker images..."
for file in deploy/images/*.tar.gz; do
    echo "  Loading $(basename $file)..."
    gunzip -c "$file" | docker load > /dev/null 2>&1
done
echo "✓ Images loaded"

echo "Restoring database volumes..."
LATEST_BACKUP=$(ls -td database-import/backup_local_* 2>/dev/null | head -1)
if [ -n "$LATEST_BACKUP" ]; then
    for volume_file in $LATEST_BACKUP/*.tar.gz; do
        volume_name=$(basename $volume_file .tar.gz)
        # Convert local names to prod names
        volume_name=${volume_name/stratagem_postgres_data/stratagem_postgres_data_prod}
        volume_name=${volume_name/stratagem_mongodb_data/stratagem_mongodb_data_prod}
        volume_name=${volume_name/stratagem_neo4j_data/stratagem_neo4j_data_prod}
        volume_name=${volume_name/stratagem_redis_data/stratagem_redis_data_prod}
        volume_name=${volume_name/stratagem_elasticsearch_data/stratagem_elasticsearch_data_prod}
        
        echo "  Restoring $volume_name..."
        docker volume create "$volume_name" 2>/dev/null || true
        docker run --rm \
            -v "$volume_name":/data \
            -v "$(pwd)/$LATEST_BACKUP":/backup \
            alpine sh -c "rm -rf /data/* && tar xzf /backup/$(basename $volume_file) -C /data" 2>/dev/null
    done
    echo "✓ Database restored"
else
    echo "⚠ No backup found, starting with fresh volumes"
fi

echo "Starting services..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d > /dev/null 2>&1
sleep 3
docker compose ps
echo "✓ Services started"
SSH_LOAD
print_status "Server deployment complete"
echo ""

# 8. Verify
print_step "Verifying deployment..."
sleep 2
ssh -i "$REMOTE_SSH_KEY" "$REMOTE_USER@$REMOTE_HOST" "cd /opt/stratagem && docker compose ps" | grep -E "Up|Exited"

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "Your application is running on the remote server at 84.235.247.141"
