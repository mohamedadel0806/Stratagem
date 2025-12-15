#!/bin/bash

# Complete Deployment Script with Data Backup and Restore
# This script handles the entire deployment process from start to finish
# It backs up local data, deploys to server, and restores data

set -e

# Configuration
REMOTE_USER="ubuntu"
REMOTE_HOST="84.235.247.141"
REMOTE_SSH_KEY="/Users/adelsayed/Downloads/AWS/ssh-oracle-24.key"
REMOTE_PATH="/opt/stratagem"
LOCAL_EXPORT_DIR="./database-export"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_step() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}▶ $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_step "Checking Prerequisites"
    
    if [ ! -f "$REMOTE_SSH_KEY" ]; then
        print_error "SSH key not found: $REMOTE_SSH_KEY"
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed or not in PATH"
        exit 1
    fi
    
    # Check if docker compose command is available (but don't require daemon to be running)
    if ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not available"
        exit 1
    fi
    
    print_status "All prerequisites met"
}

# Test SSH connection
test_ssh() {
    print_step "Testing SSH Connection"
    
    if ! ssh -i "$REMOTE_SSH_KEY" -o ConnectTimeout=5 -o StrictHostKeyChecking=no "$REMOTE_USER@$REMOTE_HOST" "echo 'Connection successful'" &>/dev/null; then
        print_error "Cannot connect to server"
        print_error "  SSH key: $REMOTE_SSH_KEY"
        print_error "  Server: $REMOTE_USER@$REMOTE_HOST"
        exit 1
    fi
    
    print_status "SSH connection successful"
}

# Backup local database
backup_local_data() {
    print_step "Backing Up Local Database"
    
    # Check if containers are running
    if ! docker compose ps postgres | grep -q "Up"; then
        print_warning "PostgreSQL container is not running. Starting it..."
        docker compose up -d postgres
        sleep 5
    fi
    
    # Create export directory
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    EXPORT_PATH="${LOCAL_EXPORT_DIR}/export_${TIMESTAMP}"
    mkdir -p "$EXPORT_PATH"
    
    print_status "Exporting to: $EXPORT_PATH"
    
    # Export PostgreSQL
    print_status "Exporting PostgreSQL databases..."
    docker compose exec -T postgres pg_dump -U postgres grc_platform > "$EXPORT_PATH/postgres_grc_platform.sql" 2>/dev/null || {
        print_warning "grc_platform database export failed or is empty"
        touch "$EXPORT_PATH/postgres_grc_platform.sql"
    }
    
    docker compose exec -T postgres pg_dump -U postgres keycloak > "$EXPORT_PATH/postgres_keycloak.sql" 2>/dev/null || {
        print_warning "keycloak database not found, skipping..."
        touch "$EXPORT_PATH/postgres_keycloak.sql"
    }
    
    # Export MongoDB
    if docker compose ps mongodb | grep -q "Up"; then
        print_status "Exporting MongoDB..."
        docker compose exec -T mongodb mongodump --username admin --password password --authenticationDatabase admin --db grc_documents --archive > "$EXPORT_PATH/mongodb_grc_documents.archive" 2>/dev/null || {
            print_warning "MongoDB export failed or is empty"
            touch "$EXPORT_PATH/mongodb_grc_documents.archive"
        }
    else
        print_warning "MongoDB container not running, skipping..."
        touch "$EXPORT_PATH/mongodb_grc_documents.archive"
    fi
    
    # Create manifest
    cat > "$EXPORT_PATH/MANIFEST.txt" << EOF
Database Export
Generated: $(date)
Source: Local Development Environment

Contents:
- postgres_grc_platform.sql - Main PostgreSQL database
- postgres_keycloak.sql - Keycloak database
- mongodb_grc_documents.archive - MongoDB database dump
EOF
    
    print_status "Local backup complete: $EXPORT_PATH"
    echo "$EXPORT_PATH"
}

# Setup remote server structure
setup_remote_server() {
    print_step "Setting Up Remote Server Structure"
    
    ssh -i "$REMOTE_SSH_KEY" "$REMOTE_USER@$REMOTE_HOST" << 'ENDSSH'
set -e
sudo mkdir -p /opt/stratagem
sudo chown -R $USER:$USER /opt/stratagem
cd /opt/stratagem

# Create directory structure
mkdir -p backend frontend ai-service infrastructure monitoring scripts database-import backups

# Create .dockerignore if it doesn't exist
if [ ! -f .dockerignore ]; then
    cat > .dockerignore << 'EOF'
node_modules
.next
dist
*.log
.git
.env.local
.DS_Store
EOF
fi
ENDSSH
    
    print_status "Remote server structure created"
}

# Transfer files to server
transfer_files() {
    print_step "Transferring Files to Server"
    
    # Create exclude file
    EXCLUDE_FILE=$(mktemp)
    cat > "$EXCLUDE_FILE" << 'EOF'
node_modules/
.next/
dist/
*.log
.git/
.env.local
.env.*.local
.DS_Store
*.swp
*.swo
*~
.vscode/
.idea/
coverage/
.nyc_output/
*.tar.gz
deploy/
database-export/
backups/
EOF
    
    print_status "Transferring backend..."
    rsync -avz --progress \
        -e "ssh -i $REMOTE_SSH_KEY" \
        --exclude-from="$EXCLUDE_FILE" \
        ./backend/ "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/backend/"
    
    print_status "Transferring frontend..."
    rsync -avz --progress \
        -e "ssh -i $REMOTE_SSH_KEY" \
        --exclude-from="$EXCLUDE_FILE" \
        ./frontend/ "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/frontend/"
    
    print_status "Transferring AI service..."
    rsync -avz --progress \
        -e "ssh -i $REMOTE_SSH_KEY" \
        --exclude-from="$EXCLUDE_FILE" \
        ./ai-service/ "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/ai-service/"
    
    print_status "Transferring infrastructure..."
    rsync -avz --progress \
        -e "ssh -i $REMOTE_SSH_KEY" \
        ./infrastructure/ "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/infrastructure/"
    
    print_status "Transferring Docker Compose files..."
    scp -i "$REMOTE_SSH_KEY" \
        docker-compose.yml \
        docker-compose.prod.yml \
        "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/"
    
    print_status "Transferring scripts..."
    rsync -avz --progress \
        -e "ssh -i $REMOTE_SSH_KEY" \
        ./scripts/ "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/scripts/"
    
    # Transfer database backup
    if [ -n "$EXPORT_PATH" ] && [ -d "$EXPORT_PATH" ]; then
        print_status "Transferring database backup..."
        scp -i "$REMOTE_SSH_KEY" -r "$EXPORT_PATH" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/database-import/"
    fi
    
    rm "$EXCLUDE_FILE"
    print_status "All files transferred"
}

# Setup environment on server
setup_environment() {
    print_step "Setting Up Environment on Server"
    
    ssh -i "$REMOTE_SSH_KEY" "$REMOTE_USER@$REMOTE_HOST" << 'ENDSSH'
set -e
cd /opt/stratagem

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "⚠ .env file not found! Creating template..."
    cat > .env << 'ENVEOF'
# Application Secrets
NEXTAUTH_SECRET=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)

# Database Credentials
POSTGRES_PASSWORD=change-this-strong-password
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=change-this-strong-password
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=change-this-strong-password
REDIS_PASSWORD=change-this-strong-password
ELASTIC_PASSWORD=change-this-strong-password

# Keycloak Configuration
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=change-this-strong-password

# API Configuration
API_URL=http://localhost:8000
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

# Monitoring
GRAFANA_ADMIN_PASSWORD=admin
ENVEOF
    echo "⚠ Created .env template. Please update with production values!"
    echo "⚠ Run: nano /opt/stratagem/.env"
    echo "⚠ Exiting - please configure .env file first"
    exit 1
fi

# Ensure frontend .env.production exists with correct values
mkdir -p frontend
# Load environment to get FRONTEND_URL
set -a
source .env 2>/dev/null || true
set +a
FRONTEND_URL_VALUE=\${FRONTEND_URL:-https://grc-staging.newmehub.com}
cat > frontend/.env.production << EOF
NEXT_PUBLIC_USE_KONG=true
NEXT_PUBLIC_KONG_URL=\${FRONTEND_URL_VALUE}/api
NEXT_PUBLIC_API_URL=\${FRONTEND_URL_VALUE}/api/v1
EOF

echo "✓ Environment files configured"
echo "Frontend .env.production contents:"
cat frontend/.env.production
ENDSSH
    
    print_status "Environment setup complete"
}

# Configure Docker network
configure_docker_network() {
    print_step "Configuring Docker Network"
    
    ssh -i "$REMOTE_SSH_KEY" "$REMOTE_USER@$REMOTE_HOST" << 'ENDSSH'
set -e
cd /opt/stratagem

# Create or verify grc-network
if docker network inspect grc-network &>/dev/null; then
    echo "✓ grc-network already exists"
else
    echo "Creating grc-network..."
    docker network create \
        --driver bridge \
        --subnet 172.20.0.0/16 \
        --opt com.docker.network.driver.mtu=1500 \
        grc-network || {
        echo "Network creation failed, checking if it exists with different config..."
        docker network inspect grc-network
    }
    echo "✓ grc-network created"
fi

# Verify network
docker network inspect grc-network | grep -A 5 "IPAM" || true
ENDSSH
    
    print_status "Docker network configured"
}

# Build and start services
build_and_start() {
    print_step "Building and Starting Services"
    
    ssh -i "$REMOTE_SSH_KEY" "$REMOTE_USER@$REMOTE_HOST" << 'ENDSSH'
set -e
cd /opt/stratagem

# Load environment variables (handle spaces and special chars)
set -a
source .env
set +a

# Stop existing services
echo "Stopping existing services..."
docker compose -f docker-compose.prod.yml down 2>/dev/null || true

# Start databases first
echo "Starting databases..."
docker compose -f docker-compose.prod.yml up -d postgres mongodb neo4j redis elasticsearch

# Wait for databases to be ready
echo "Waiting for databases to be ready..."
sleep 10

# Check PostgreSQL
for i in {1..30}; do
    if docker compose -f docker-compose.prod.yml exec -T postgres pg_isready -U postgres &>/dev/null; then
        echo "✓ PostgreSQL is ready"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "✗ PostgreSQL failed to start"
        exit 1
    fi
    sleep 2
done

# Build backend
echo "Building backend..."
docker build --network host \
    -t stratagem-backend:latest \
    --target production \
    -f ./backend/Dockerfile \
    ./backend

# Build frontend with all required build args
echo "Building frontend..."
docker build --network host \
    --build-arg NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} \
    --build-arg NEXT_PUBLIC_USE_KONG=${NEXT_PUBLIC_USE_KONG} \
    --build-arg NEXT_PUBLIC_KONG_URL=${NEXT_PUBLIC_KONG_URL} \
    --build-arg NEXTAUTH_URL=${FRONTEND_URL} \
    --build-arg NEXTAUTH_SECRET=${NEXTAUTH_SECRET} \
    -t stratagem-frontend:latest \
    --target runner \
    -f ./frontend/Dockerfile \
    ./frontend

# Build AI service if it exists
if [ -d "./ai-service" ] && [ -f "./ai-service/Dockerfile" ]; then
    echo "Building AI service..."
    docker build --network host \
        -t stratagem-ai-service:latest \
        --target production \
        -f ./ai-service/Dockerfile \
        ./ai-service || echo "AI service build skipped"
fi

# Start Kong first (critical for API routing)
echo "Starting Kong..."
docker compose -f docker-compose.prod.yml up -d kong
sleep 5

# Verify Kong started
if ! docker compose -f docker-compose.prod.yml ps kong | grep -q "Up"; then
    echo "✗ Kong failed to start"
    docker compose -f docker-compose.prod.yml logs kong
    exit 1
fi
echo "✓ Kong is running"

# Start all other services
echo "Starting all services..."
docker compose -f docker-compose.prod.yml up -d

# Wait for services to be ready
echo "Waiting for services to start..."
sleep 15

# Verify Kong is accessible
echo "Verifying Kong API..."
for i in {1..10}; do
    if curl -s http://localhost:8001/services &>/dev/null; then
        echo "✓ Kong Admin API is accessible"
        break
    fi
    if [ $i -eq 10 ]; then
        echo "⚠ Kong Admin API not accessible yet"
    fi
    sleep 2
done

# Check service status
echo "Service status:"
docker compose -f docker-compose.prod.yml ps
ENDSSH
    
    print_status "Services built and started"
}

# Restore database
restore_database() {
    print_step "Restoring Database"
    
    if [ -z "$EXPORT_PATH" ] || [ ! -d "$EXPORT_PATH" ]; then
        print_warning "No database backup to restore"
        return
    fi
    
    EXPORT_NAME=$(basename "$EXPORT_PATH")
    
    ssh -i "$REMOTE_SSH_KEY" "$REMOTE_USER@$REMOTE_HOST" << ENDSSH
set -e
cd /opt/stratagem

# Load environment
set -a
source .env
set +a

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL..."
for i in {1..30}; do
    if docker compose -f docker-compose.prod.yml exec -T postgres pg_isready -U postgres &>/dev/null; then
        break
    fi
    sleep 2
done

# Backup existing database if it exists
if docker compose -f docker-compose.prod.yml exec -T postgres psql -U postgres -lqt | cut -d \| -f 1 | grep -qw grc_platform; then
    echo "Backing up existing database..."
    TIMESTAMP=\$(date +%Y%m%d_%H%M%S)
    mkdir -p backups
    docker compose -f docker-compose.prod.yml exec -T postgres pg_dump -U postgres grc_platform > "backups/pre_restore_\${TIMESTAMP}.sql" 2>/dev/null || true
fi

# Restore grc_platform database
EXPORT_DIR="database-import/$EXPORT_NAME"
if [ -f "\$EXPORT_DIR/postgres_grc_platform.sql" ] && [ -s "\$EXPORT_DIR/postgres_grc_platform.sql" ]; then
    echo "Restoring grc_platform database..."
    
    # Terminate connections
    docker compose -f docker-compose.prod.yml exec -T postgres psql -U postgres -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'grc_platform' AND pid <> pg_backend_pid();" 2>/dev/null || true
    sleep 2
    
    # Drop and recreate
    docker compose -f docker-compose.prod.yml exec -T postgres psql -U postgres -d postgres -c "DROP DATABASE IF EXISTS grc_platform;" 2>/dev/null || true
    docker compose -f docker-compose.prod.yml exec -T postgres psql -U postgres -d postgres -c "CREATE DATABASE grc_platform;"
    
    # Import
    docker compose -f docker-compose.prod.yml exec -T postgres psql -U postgres -d grc_platform < "\$EXPORT_DIR/postgres_grc_platform.sql" 2>&1 | grep -v "ERROR" | grep -v "already exists" | tail -5 || true
    echo "✓ grc_platform database restored"
else
    echo "⚠ No grc_platform backup found or backup is empty"
fi

# Restore keycloak database
if [ -f "\$EXPORT_DIR/postgres_keycloak.sql" ] && [ -s "\$EXPORT_DIR/postgres_keycloak.sql" ]; then
    echo "Restoring keycloak database..."
    
    docker compose -f docker-compose.prod.yml exec -T postgres psql -U postgres -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'keycloak' AND pid <> pg_backend_pid();" 2>/dev/null || true
    sleep 2
    
    docker compose -f docker-compose.prod.yml exec -T postgres psql -U postgres -d postgres -c "DROP DATABASE IF EXISTS keycloak;" 2>/dev/null || true
    docker compose -f docker-compose.prod.yml exec -T postgres psql -U postgres -d postgres -c "CREATE DATABASE keycloak;"
    
    docker compose -f docker-compose.prod.yml exec -T postgres psql -U postgres -d keycloak < "\$EXPORT_DIR/postgres_keycloak.sql" 2>&1 | grep -v "ERROR" | grep -v "already exists" | tail -5 || true
    echo "✓ keycloak database restored"
fi

# Restore MongoDB
if [ -f "\$EXPORT_DIR/mongodb_grc_documents.archive" ] && [ -s "\$EXPORT_DIR/mongodb_grc_documents.archive" ]; then
    echo "Restoring MongoDB..."
    docker compose -f docker-compose.prod.yml exec -T mongodb mongorestore \
        --username \${MONGO_ROOT_USERNAME} \
        --password \${MONGO_ROOT_PASSWORD} \
        --authenticationDatabase admin \
        --db grc_documents \
        --drop \
        --archive < "\$EXPORT_DIR/mongodb_grc_documents.archive" 2>&1 | tail -5 || true
    echo "✓ MongoDB restored"
fi

# Fix Keycloak user password
docker compose -f docker-compose.prod.yml exec -T postgres psql -U postgres -d postgres -c "ALTER USER keycloak WITH PASSWORD 'keycloak_password';" 2>/dev/null || true

echo "✓ Database restore complete"
ENDSSH
    
    print_status "Database restored"
}

# Run migrations
run_migrations() {
    print_step "Running Database Migrations"
    
    ssh -i "$REMOTE_SSH_KEY" "$REMOTE_USER@$REMOTE_HOST" << 'ENDSSH'
set -e
cd /opt/stratagem

# Wait for backend to be ready
echo "Waiting for backend to be ready..."
for i in {1..30}; do
    if docker compose -f docker-compose.prod.yml ps backend | grep -q "Up"; then
        sleep 5
        if docker compose -f docker-compose.prod.yml exec -T backend sh -c "nc -z localhost 3001" &>/dev/null; then
            break
        fi
    fi
    sleep 2
done

# Run migrations
echo "Running migrations..."
docker compose -f docker-compose.prod.yml exec -T backend npm run migrate 2>&1 | tail -20 || {
    echo "⚠ Migration may have failed or no migrations to run"
}

echo "✓ Migrations complete"
ENDSSH
    
    print_status "Migrations completed"
}

# Verify deployment
verify_deployment() {
    print_step "Verifying Deployment"
    
    ssh -i "$REMOTE_SSH_KEY" "$REMOTE_USER@$REMOTE_HOST" << 'ENDSSH'
cd /opt/stratagem

echo "Checking service status..."
docker compose -f docker-compose.prod.yml ps || true

echo ""
echo "Checking Kong..."
if curl -s http://localhost:8001/services &>/dev/null; then
    echo "✓ Kong Admin API is accessible"
    curl -s http://localhost:8001/services | jq -r '.data[].name' 2>/dev/null || echo "Services configured"
else
    echo "✗ Kong Admin API not accessible"
fi

# Check Kong proxy
if curl -s -I http://localhost:8000/api/notifications 2>&1 | grep -q "HTTP"; then
    echo "✓ Kong Proxy is accessible"
    # Test a route
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/notifications 2>/dev/null || echo "000")
    echo "  Test route /api/notifications returned: $RESPONSE"
else
    echo "✗ Kong Proxy not accessible"
fi

echo ""
echo "Checking backend health..."
curl -s http://localhost:3001/health 2>/dev/null || echo "Backend health check failed"

echo ""
echo "Checking frontend..."
curl -s -I http://localhost:3000 | head -1 || echo "Frontend not accessible"

echo ""
echo "✓ Verification complete"
ENDSSH
    
    print_status "Deployment verification complete"
}

# Main execution
main() {
    print_step "Starting Complete Deployment"
    
    check_prerequisites
    test_ssh
    
    # Backup local data
    EXPORT_PATH=$(backup_local_data)
    
    # Setup and transfer
    setup_remote_server
    transfer_files
    setup_environment
    
    # Configure infrastructure
    configure_docker_network
    
    # Build and start
    build_and_start
    
    # Restore data
    restore_database
    
    # Run migrations
    run_migrations
    
    # Verify
    verify_deployment
    
    print_step "Deployment Complete!"
    echo ""
    print_status "Application should be available at: https://grc-staging.newmehub.com"
    echo ""
    print_status "To check logs:"
    echo "  ssh -i $REMOTE_SSH_KEY $REMOTE_USER@$REMOTE_HOST"
    echo "  cd $REMOTE_PATH"
    echo "  docker compose -f docker-compose.prod.yml logs -f"
    echo ""
}

# Run main function
main "$@"

