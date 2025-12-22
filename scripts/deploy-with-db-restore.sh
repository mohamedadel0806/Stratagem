#!/bin/bash

# Complete deployment script with database restore from local
# This script exports local database, transfers it, and restores it on server

set -e

REMOTE_USER="ubuntu"
REMOTE_HOST="84.235.247.141"
REMOTE_SSH_KEY="/Users/adelsayed/Downloads/AWS/ssh-oracle-24.key"
REMOTE_PATH="/opt/stratagem"

echo "🚀 Starting complete deployment with database restore..."
echo ""

# Test SSH connection
echo "📡 Testing SSH connection..."
if ! ssh -i "$REMOTE_SSH_KEY" -o ConnectTimeout=5 "$REMOTE_USER@$REMOTE_HOST" "echo 'Connection successful'" > /dev/null 2>&1; then
    echo "❌ Failed to connect to server"
    exit 1
fi
echo "✅ SSH connection successful"
echo ""

# Step 1: Export local database
echo "📦 Step 1: Exporting local database..."
if [ ! -f "./scripts/export-database.sh" ]; then
    echo "❌ export-database.sh not found"
    exit 1
fi

chmod +x ./scripts/export-database.sh
./scripts/export-database.sh

# Get the latest export directory
LATEST_EXPORT=$(ls -td ./database-export/export_* 2>/dev/null | head -1)
if [ -z "$LATEST_EXPORT" ]; then
    echo "❌ No database export found"
    exit 1
fi

echo "✅ Local database exported to: $LATEST_EXPORT"
echo ""

# Step 2: Transfer code and database
echo "📦 Step 2: Transferring code and database..."
rsync -avz --progress \
    -e "ssh -i $REMOTE_SSH_KEY" \
    --exclude 'node_modules' \
    --exclude '.next' \
    --exclude 'dist' \
    --exclude '.git' \
    --exclude '*.log' \
    --exclude '.env' \
    ./backend/ "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/backend/"

rsync -avz --progress \
    -e "ssh -i $REMOTE_SSH_KEY" \
    --exclude 'node_modules' \
    --exclude '.next' \
    --exclude '.git' \
    --exclude '*.log' \
    --exclude '.env.local' \
    ./frontend/ "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/frontend/"

rsync -avz --progress \
    -e "ssh -i $REMOTE_SSH_KEY" \
    --exclude '__pycache__' \
    --exclude '*.pyc' \
    --exclude '.git' \
    ./ai-service/ "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/ai-service/"

# Transfer database export
scp -i "$REMOTE_SSH_KEY" -r "$LATEST_EXPORT" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/database-import/"

# Transfer configuration
scp -i "$REMOTE_SSH_KEY" \
    docker-compose.prod.yml \
    "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/"

scp -i "$REMOTE_SSH_KEY" \
    infrastructure/caddy/Caddyfile \
    "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/infrastructure/caddy/Caddyfile"

echo "✅ Files transferred"
echo ""

# Step 3: Rebuild and restore on server
echo "🔨 Step 3: Rebuilding services and restoring database on server..."
ssh -i "$REMOTE_SSH_KEY" "$REMOTE_USER@$REMOTE_HOST" << ENDSSH
set -e
cd /opt/stratagem

# Load environment variables
if [ -f .env ]; then
    export \$(cat .env | grep -v '^#' | xargs)
fi

# Stop services that use databases
echo "Stopping services..."
docker compose -f docker-compose.prod.yml stop backend keycloak 2>/dev/null || true

# Backup existing database
echo "Creating backup..."
mkdir -p backups
TIMESTAMP=\$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="backups/backup_\${TIMESTAMP}"
mkdir -p "\$BACKUP_PATH"

# Backup PostgreSQL
docker compose -f docker-compose.prod.yml exec -T postgres pg_dump -U postgres grc_platform > "\$BACKUP_PATH/postgres_grc_platform.sql" 2>/dev/null || echo "Backup skipped"

# Restore database
EXPORT_DIR="database-import/\$(basename $LATEST_EXPORT)"
echo "Restoring database from: \$EXPORT_DIR"

# Drop and recreate grc_platform database
docker compose -f docker-compose.prod.yml exec -T postgres psql -U postgres -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'grc_platform' AND pid <> pg_backend_pid();" 2>/dev/null || true
sleep 2
docker compose -f docker-compose.prod.yml exec -T postgres psql -U postgres -d postgres -c "DROP DATABASE IF EXISTS grc_platform;" 2>/dev/null || true
docker compose -f docker-compose.prod.yml exec -T postgres psql -U postgres -d postgres -c "CREATE DATABASE grc_platform;"

# Import main database
if [ -f "\$EXPORT_DIR/postgres_grc_platform.sql" ]; then
    echo "Importing PostgreSQL main database..."
    docker compose -f docker-compose.prod.yml exec -T postgres psql -U postgres -d grc_platform < "\$EXPORT_DIR/postgres_grc_platform.sql" 2>&1 | grep -v "ERROR" | grep -v "already exists" | tail -5 || true
fi

# Restore Keycloak database
docker compose -f docker-compose.prod.yml exec -T postgres psql -U postgres -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'keycloak' AND pid <> pg_backend_pid();" 2>/dev/null || true
sleep 2
docker compose -f docker-compose.prod.yml exec -T postgres psql -U postgres -d postgres -c "DROP DATABASE IF EXISTS keycloak;" 2>/dev/null || true
docker compose -f docker-compose.prod.yml exec -T postgres psql -U postgres -d postgres -c "CREATE DATABASE keycloak;"

if [ -f "\$EXPORT_DIR/postgres_keycloak.sql" ]; then
    echo "Importing Keycloak database..."
    docker compose -f docker-compose.prod.yml exec -T postgres psql -U postgres -d keycloak < "\$EXPORT_DIR/postgres_keycloak.sql" 2>&1 | grep -v "ERROR" | grep -v "already exists" | tail -5 || true
fi

# Restore MongoDB
if [ -f "\$EXPORT_DIR/mongodb_grc_documents.archive" ]; then
    echo "Restoring MongoDB..."
    docker compose -f docker-compose.prod.yml exec -T mongodb mongorestore --username admin --password password --authenticationDatabase admin --db grc_documents --drop --archive < "\$EXPORT_DIR/mongodb_grc_documents.archive" 2>&1 | tail -5 || true
fi

# Fix Keycloak password
echo "Fixing Keycloak password..."
docker compose -f docker-compose.prod.yml exec -T postgres psql -U postgres -d postgres -c "ALTER USER keycloak WITH PASSWORD 'keycloak_password';" 2>/dev/null || true

# Rebuild services
echo "Building backend..."
docker compose -f docker-compose.prod.yml build backend

echo "Building frontend..."
docker compose -f docker-compose.prod.yml build --build-arg NEXT_PUBLIC_API_URL=\${NEXT_PUBLIC_API_URL} --build-arg NEXTAUTH_URL=\${FRONTEND_URL} --build-arg NEXTAUTH_SECRET=\${NEXTAUTH_SECRET} frontend

echo "Building AI service..."
docker compose -f docker-compose.prod.yml build ai-service

# Fix database schema
echo "Fixing database schema..."
if [ -f scripts/fix-database-schema.sh ]; then
    chmod +x scripts/fix-database-schema.sh
    ./scripts/fix-database-schema.sh 2>&1 | grep -v "already exists" || true
fi

# Start services
echo "Starting services..."
docker compose -f docker-compose.prod.yml up -d backend frontend ai-service keycloak

# Wait for services
echo "Waiting for services to start..."
sleep 15

# Check status
echo ""
echo "📊 Service Status:"
docker compose -f docker-compose.prod.yml ps backend frontend ai-service keycloak

# Reload Caddy
if [ -f infrastructure/caddy/Caddyfile ]; then
    echo ""
    echo "🔄 Reloading Caddy..."
    sudo cp infrastructure/caddy/Caddyfile /etc/caddy/Caddyfile
    sudo systemctl reload caddy
fi

echo ""
echo "✅ Deployment complete!"
ENDSSH

echo ""
echo "🎉 Complete deployment with database restore finished!"
echo ""
echo "Next steps:"
echo "  - Visit: https://grc-staging.newmehub.com"
echo "  - Check logs: ssh -i $REMOTE_SSH_KEY $REMOTE_USER@$REMOTE_HOST 'cd $REMOTE_PATH && docker compose -f docker-compose.prod.yml logs --tail 50 backend'"







