#!/bin/bash

# Deploy by transferring source code and building on server
# This is faster for large Docker images as we only transfer source code

set -e

# Server configuration
REMOTE_USER="ubuntu"
REMOTE_HOST="84.235.247.141"
REMOTE_SSH_KEY="/Users/adelsayed/Downloads/AWS/ssh-oracle-24.key"
REMOTE_PATH="/opt/stratagem"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
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

# Check SSH key exists
if [ ! -f "$REMOTE_SSH_KEY" ]; then
    print_error "SSH key not found: $REMOTE_SSH_KEY"
    exit 1
fi

# Check SSH access
print_status "Testing SSH connection..."
if ! ssh -i "$REMOTE_SSH_KEY" -o ConnectTimeout=5 -o StrictHostKeyChecking=no "$REMOTE_USER@$REMOTE_HOST" "echo 'Connection successful'" &>/dev/null; then
    print_error "Cannot connect to server. Please check:"
    print_error "  - SSH key path: $REMOTE_SSH_KEY"
    print_error "  - Server address: $REMOTE_HOST"
    print_error "  - User: $REMOTE_USER"
    exit 1
fi

print_status "SSH connection successful!"

# Create .dockerignore if it doesn't exist
print_status "Preparing for transfer..."

# Create temporary exclude file for rsync
EXCLUDE_FILE=$(mktemp)
cat > "$EXCLUDE_FILE" << 'EOF'
node_modules/
.next/
dist/
*.log
.git/
.gitignore
.env
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
EOF

# Step 1: Create directory structure on server
print_status "Step 1: Creating directory structure on server..."
ssh -i "$REMOTE_SSH_KEY" "$REMOTE_USER@$REMOTE_HOST" << 'ENDSSH'
sudo mkdir -p /opt/stratagem
sudo chown -R $USER:$USER /opt/stratagem
mkdir -p /opt/stratagem/backend
mkdir -p /opt/stratagem/frontend
mkdir -p /opt/stratagem/ai-service
mkdir -p /opt/stratagem/infrastructure
mkdir -p /opt/stratagem/monitoring
mkdir -p /opt/stratagem/scripts
ENDSSH

# Step 2: Transfer source code
print_status "Step 2: Transferring source code to server..."
print_warning "This may take a few minutes depending on your connection speed..."

# Transfer backend
print_status "Transferring backend..."
rsync -avz --progress \
    -e "ssh -i $REMOTE_SSH_KEY" \
    --exclude-from="$EXCLUDE_FILE" \
    ./backend/ "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/backend/"

# Transfer frontend
print_status "Transferring frontend..."
rsync -avz --progress \
    -e "ssh -i $REMOTE_SSH_KEY" \
    --exclude-from="$EXCLUDE_FILE" \
    ./frontend/ "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/frontend/"

# Transfer AI service
print_status "Transferring AI service..."
rsync -avz --progress \
    -e "ssh -i $REMOTE_SSH_KEY" \
    --exclude-from="$EXCLUDE_FILE" \
    ./ai-service/ "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/ai-service/"

# Transfer infrastructure configs
print_status "Transferring infrastructure configurations..."
rsync -avz --progress \
    -e "ssh -i $REMOTE_SSH_KEY" \
    ./infrastructure/ "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/infrastructure/"

# Transfer monitoring configs
print_status "Transferring monitoring configurations..."
rsync -avz --progress \
    -e "ssh -i $REMOTE_SSH_KEY" \
    ./monitoring/ "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/monitoring/"

# Transfer docker-compose files
print_status "Transferring Docker Compose files..."
scp -i "$REMOTE_SSH_KEY" \
    docker-compose.yml \
    docker-compose.prod.yml \
    "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/"

# Transfer deployment scripts
print_status "Transferring deployment scripts..."
rsync -avz --progress \
    -e "ssh -i $REMOTE_SSH_KEY" \
    ./scripts/ "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/scripts/"

# Clean up exclude file
rm "$EXCLUDE_FILE"

# Step 3: Create .env template on server
print_status "Step 3: Setting up environment configuration..."
ssh -i "$REMOTE_SSH_KEY" "$REMOTE_USER@$REMOTE_HOST" << 'ENDSSH'
cd /opt/stratagem
if [ ! -f .env ]; then
    cat > .env.template << 'ENVEOF'
# Application Secrets
NEXTAUTH_SECRET=your-nextauth-secret-here-generate-with-openssl-rand-base64-32
JWT_SECRET=your-jwt-secret-here-generate-with-openssl-rand-base64-32

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
FRONTEND_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com/api

# Backend Configuration
BACKEND_URL=http://backend:3001
DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@postgres:5432/grc_platform
MONGODB_URL=mongodb://${MONGO_ROOT_USERNAME}:${MONGO_ROOT_PASSWORD}@mongodb:27017/grc_documents?authSource=admin
NEO4J_URL=bolt://neo4j:7687
REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
ELASTICSEARCH_URL=http://elasticsearch:9200

# AI Service Configuration (if needed)
OPENAI_API_KEY=your-openai-api-key
HUGGINGFACE_API_KEY=your-huggingface-api-key

# Monitoring Configuration
PROMETHEUS_URL=http://localhost:9091
GRAFANA_URL=http://localhost:3010
GRAFANA_ADMIN_PASSWORD=admin
ENVEOF
    cp .env.template .env
    echo "Created .env file from template. Please edit it with your production values!"
else
    echo ".env file already exists, skipping..."
fi
ENDSSH

# Step 4: Provide next steps
echo ""
print_status "=== Source Code Transferred Successfully ==="
echo ""
print_status "Next steps on the server:"
echo ""
echo "1. SSH into your server:"
echo "   ssh -i $REMOTE_SSH_KEY $REMOTE_USER@$REMOTE_HOST"
echo ""
echo "2. Navigate to application directory:"
echo "   cd $REMOTE_PATH"
echo ""
echo "3. Configure environment (IMPORTANT):"
echo "   nano .env"
echo "   # Generate secrets:"
echo "   openssl rand -base64 32  # For NEXTAUTH_SECRET"
echo "   openssl rand -base64 32  # For JWT_SECRET"
echo "   # Set strong passwords for all databases"
echo "   # Update FRONTEND_URL and NEXT_PUBLIC_API_URL with your domain"
echo ""
echo "4. Make scripts executable:"
echo "   chmod +x scripts/*.sh"
echo ""
echo "5. Build and start the application:"
echo "   docker-compose -f docker-compose.yml -f docker-compose.prod.yml build"
echo "   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d"
echo ""
echo "6. Configure Caddy:"
echo "   sudo cp infrastructure/caddy/Caddyfile /etc/caddy/Caddyfile"
echo "   sudo nano /etc/caddy/Caddyfile  # Replace 'your-domain.com'"
echo "   sudo systemctl reload caddy"
echo ""
print_status "Source code ready on server for building!"

