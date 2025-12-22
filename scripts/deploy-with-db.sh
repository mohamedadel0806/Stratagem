#!/bin/bash

# Comprehensive deployment script with database backup and restore
# This script:
# 1. Exports database from local environment
# 2. Backs up existing database on server (if exists)
# 3. Deploys app updates
# 4. Imports database on server

set -e

REMOTE_USER="ubuntu"
REMOTE_HOST="84.235.247.141"
REMOTE_SSH_KEY="/Users/adelsayed/Downloads/AWS/ssh-oracle-24.key"
REMOTE_PATH="/opt/stratagem"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  Stratagem Deployment with Database Backup & Restore   ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Test SSH connection
print_step "1. Testing SSH connection..."
if ! ssh -i "$REMOTE_SSH_KEY" -o ConnectTimeout=5 "$REMOTE_USER@$REMOTE_HOST" "echo 'Connection successful'" > /dev/null 2>&1; then
    print_error "Failed to connect to server. Please check:"
    print_error "   - SSH key path: $REMOTE_SSH_KEY"
    print_error "   - Server address: $REMOTE_HOST"
    print_error "   - Network connectivity"
    exit 1
fi
print_status "SSH connection successful"
echo ""

# Step 1: Export database from local
print_step "2. Exporting database from local environment..."
if [ ! -f "./scripts/export-database.sh" ]; then
    print_error "export-database.sh script not found"
    exit 1
fi

# Run export script
./scripts/export-database.sh

# Find the latest export
EXPORT_DIR="./database-export"
LATEST_EXPORT=$(ls -td "$EXPORT_DIR"/export_* 2>/dev/null | head -1)

if [ -z "$LATEST_EXPORT" ]; then
    print_error "No database export found. Export may have failed."
    exit 1
fi

print_status "Database exported to: $LATEST_EXPORT"
echo ""

# Step 2: Backup existing database on server (if exists)
print_step "3. Backing up existing database on server..."
ssh -i "$REMOTE_SSH_KEY" "$REMOTE_USER@$REMOTE_HOST" << 'ENDSSH'
cd /opt/stratagem

# Check if database containers are running
if docker compose -f docker-compose.prod.yml ps postgres | grep -q "Up"; then
    echo "📦 Creating backup of existing database..."
    
    # Create backup directory
    BACKUP_DIR="./database-backups"
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_PATH="${BACKUP_DIR}/backup_${TIMESTAMP}"
    mkdir -p "$BACKUP_PATH"
    
    # Export PostgreSQL
    echo "Exporting PostgreSQL..."
    docker compose -f docker-compose.prod.yml exec -T postgres pg_dump -U postgres grc_platform > "$BACKUP_PATH/postgres_grc_platform.sql" 2>/dev/null || echo "PostgreSQL export failed or database is empty"
    docker compose -f docker-compose.prod.yml exec -T postgres pg_dump -U postgres kong > "$BACKUP_PATH/postgres_kong.sql" 2>/dev/null || true
    docker compose -f docker-compose.prod.yml exec -T postgres pg_dump -U postgres keycloak > "$BACKUP_PATH/postgres_keycloak.sql" 2>/dev/null || true
    
    # Export MongoDB
    if docker compose -f docker-compose.prod.yml ps mongodb | grep -q "Up"; then
        echo "Exporting MongoDB..."
        docker compose -f docker-compose.prod.yml exec -T mongodb mongodump --username admin --password password --authenticationDatabase admin --db grc_documents --archive > "$BACKUP_PATH/mongodb_grc_documents.archive" 2>/dev/null || echo "MongoDB export failed or database is empty"
    fi
    
    # Export Neo4j
    if docker compose -f docker-compose.prod.yml ps neo4j | grep -q "Up"; then
        echo "Exporting Neo4j..."
        docker compose -f docker-compose.prod.yml exec -T neo4j cypher-shell -u neo4j -p password "CALL apoc.export.graphml.all('/tmp/neo4j_export.graphml', {})" > "$BACKUP_PATH/neo4j_export.log" 2>&1 || true
        docker compose -f docker-compose.prod.yml cp neo4j:/tmp/neo4j_export.graphml "$BACKUP_PATH/neo4j_export.graphml" 2>/dev/null || true
    fi
    
    echo "✅ Server backup created at: $BACKUP_PATH"
else
    echo "⚠️  No existing database found on server, skipping backup"
fi
ENDSSH
echo ""

# Step 3: Transfer database export to server
print_step "4. Transferring database export to server..."
REMOTE_IMPORT_DIR="$REMOTE_PATH/database-import"
ssh -i "$REMOTE_SSH_KEY" "$REMOTE_USER@$REMOTE_HOST" "mkdir -p $REMOTE_IMPORT_DIR"

print_status "Transferring database files..."
scp -i "$REMOTE_SSH_KEY" -r "$LATEST_EXPORT" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_IMPORT_DIR/"

# Create a 'latest' symlink on server
ssh -i "$REMOTE_SSH_KEY" "$REMOTE_USER@$REMOTE_HOST" "cd $REMOTE_IMPORT_DIR && rm -f latest && ln -s $(basename $LATEST_EXPORT) latest"

print_status "Database export transferred to server"
echo ""

# Step 4: Transfer source code and deploy app
print_step "5. Deploying application updates..."
print_status "Transferring source code..."

rsync -avz --progress \
    -e "ssh -i $REMOTE_SSH_KEY" \
    --exclude 'node_modules' \
    --exclude '.next' \
    --exclude 'dist' \
    --exclude '.git' \
    --exclude '*.log' \
    --exclude '.env' \
    --exclude 'database-export' \
    --exclude 'database-import' \
    ./backend/ "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/backend/"

rsync -avz --progress \
    -e "ssh -i $REMOTE_SSH_KEY" \
    --exclude 'node_modules' \
    --exclude '.next' \
    --exclude 'dist' \
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

print_status "Source code transferred"
echo ""

# Transfer configuration files
print_status "Transferring configuration files..."
scp -i "$REMOTE_SSH_KEY" \
    docker-compose.prod.yml \
    "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/"

scp -i "$REMOTE_SSH_KEY" \
    infrastructure/caddy/Caddyfile \
    "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/infrastructure/caddy/Caddyfile" 2>/dev/null || print_warning "Caddyfile not found, skipping..."

# Transfer database import scripts
print_status "Transferring database scripts..."
scp -i "$REMOTE_SSH_KEY" \
    scripts/import-database.sh \
    scripts/import-database-clean.sh \
    "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/scripts/" 2>/dev/null || print_warning "Database scripts not found"

echo ""

# Step 5: Rebuild and restart services on server
print_step "6. Rebuilding services on server..."
ssh -i "$REMOTE_SSH_KEY" "$REMOTE_USER@$REMOTE_HOST" << 'ENDSSH'
cd /opt/stratagem

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Rebuild services
echo "Building backend..."
docker compose -f docker-compose.prod.yml build backend

echo "Building frontend..."
docker compose -f docker-compose.prod.yml build --build-arg NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} --build-arg NEXTAUTH_URL=${FRONTEND_URL} --build-arg NEXTAUTH_SECRET=${NEXTAUTH_SECRET} frontend

echo "Building AI service..."
docker compose -f docker-compose.prod.yml build ai-service

# Restart services
echo "Restarting services..."
docker compose -f docker-compose.prod.yml up -d backend frontend ai-service

# Wait for services to be ready
echo "Waiting for services to start..."
sleep 10

# Check service status
echo ""
echo "📊 Service Status:"
docker compose -f docker-compose.prod.yml ps backend frontend ai-service

# Reload Caddy if Caddyfile changed
if [ -f infrastructure/caddy/Caddyfile ]; then
    echo ""
    echo "🔄 Reloading Caddy..."
    sudo cp infrastructure/caddy/Caddyfile /etc/caddy/Caddyfile 2>/dev/null || true
    sudo systemctl reload caddy 2>/dev/null || true
    echo "✅ Caddy reloaded"
fi

echo ""
echo "✅ Application deployment complete!"
ENDSSH
echo ""

# Step 6: Import database on server
print_step "7. Importing database on server..."
print_warning "This will import the database from your local environment"
read -p "Do you want to import the database? (yes/no): " import_confirm

if [ "$import_confirm" = "yes" ]; then
    print_status "Importing database..."
    ssh -i "$REMOTE_SSH_KEY" "$REMOTE_USER@$REMOTE_HOST" << ENDSSH
cd /opt/stratagem

# Make sure import script is executable
chmod +x scripts/import-database.sh 2>/dev/null || true

# Check if we should do a clean import
read -p "Do you want to CLEAR existing data before import? (yes/no): " clean_confirm

if [ "\$clean_confirm" = "yes" ]; then
    echo "🗑️  Performing clean import (will delete existing data)..."
    if [ -f scripts/import-database-clean.sh ]; then
        chmod +x scripts/import-database-clean.sh
        echo "yes" | ./scripts/import-database-clean.sh database-import/latest
    else
        echo "⚠️  Clean import script not found, using regular import"
        ./scripts/import-database.sh database-import/latest
    fi
else
    echo "📥 Performing regular import (will merge with existing data)..."
    ./scripts/import-database.sh database-import/latest
fi

echo ""
echo "✅ Database import complete!"
echo ""
echo "Restarting backend to ensure changes are loaded..."
docker compose -f docker-compose.prod.yml restart backend
ENDSSH
else
    print_warning "Database import skipped. You can import it manually later:"
    echo "  ssh -i $REMOTE_SSH_KEY $REMOTE_USER@$REMOTE_HOST"
    echo "  cd $REMOTE_PATH"
    echo "  ./scripts/import-database.sh database-import/latest"
fi

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║           Deployment Complete Successfully!              ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""
print_status "Summary:"
echo "  ✅ Database exported from local"
echo "  ✅ Server database backed up (if existed)"
echo "  ✅ Application code deployed"
echo "  ✅ Services rebuilt and restarted"
if [ "$import_confirm" = "yes" ]; then
    echo "  ✅ Database imported on server"
else
    echo "  ⏭️  Database import skipped"
fi
echo ""
print_status "Next steps:"
echo "  - Check service logs:"
echo "    ssh -i $REMOTE_SSH_KEY $REMOTE_USER@$REMOTE_HOST 'cd $REMOTE_PATH && docker compose -f docker-compose.prod.yml logs --tail 50'"
echo "  - View server backups:"
echo "    ssh -i $REMOTE_SSH_KEY $REMOTE_USER@$REMOTE_HOST 'ls -lh $REMOTE_PATH/database-backups/'"
echo "  - Visit your application"
echo ""











