#!/bin/bash

# Configure Kong and Docker Network on Remote Server
# This script transfers configuration files and sets up Kong + Docker network
# WITHOUT building images locally

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

# Test SSH connection
print_status "Testing SSH connection..."
if ! ssh -i "$REMOTE_SSH_KEY" -o ConnectTimeout=5 -o StrictHostKeyChecking=no "$REMOTE_USER@$REMOTE_HOST" "echo 'Connection successful'" &>/dev/null; then
    print_error "Cannot connect to server. Please check:"
    print_error "  - SSH key path: $REMOTE_SSH_KEY"
    print_error "  - Server address: $REMOTE_HOST"
    print_error "  - User: $REMOTE_USER"
    exit 1
fi

print_status "SSH connection successful!"

# Step 1: Transfer infrastructure configuration files
print_status "Step 1: Transferring infrastructure configuration files..."

# Transfer Kong configuration
print_status "Transferring Kong configuration..."
rsync -avz --progress \
    -e "ssh -i $REMOTE_SSH_KEY" \
    ./infrastructure/kong/ "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/infrastructure/kong/"

# Transfer all infrastructure files
print_status "Transferring all infrastructure configurations..."
rsync -avz --progress \
    -e "ssh -i $REMOTE_SSH_KEY" \
    ./infrastructure/ "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/infrastructure/"

# Step 2: Transfer Docker Compose files
print_status "Step 2: Transferring Docker Compose files..."
scp -i "$REMOTE_SSH_KEY" \
    docker-compose.yml \
    docker-compose.prod.yml \
    "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/"

# Step 3: Transfer Docker network configuration script and Kong setup script
print_status "Step 3: Transferring Docker network and Kong setup scripts..."
scp -i "$REMOTE_SSH_KEY" \
    ./scripts/configure-docker-network.sh \
    ./scripts/setup-kong-on-server.sh \
    "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/scripts/"

# Step 4: Configure Docker network on remote server
print_status "Step 4: Configuring Docker network on remote server..."
ssh -i "$REMOTE_SSH_KEY" "$REMOTE_USER@$REMOTE_HOST" << 'ENDSSH'
cd /opt/stratagem

# Make script executable
chmod +x scripts/configure-docker-network.sh

# Run Docker network configuration
echo "Configuring Docker daemon..."
sudo bash scripts/configure-docker-network.sh

# Create or verify grc-network exists
echo "Creating/verifying grc-network..."
if docker network inspect grc-network &>/dev/null; then
    echo "grc-network already exists"
    docker network inspect grc-network
else
    echo "Creating grc-network..."
    docker network create \
        --driver bridge \
        --subnet 172.20.0.0/16 \
        --opt com.docker.network.driver.mtu=1500 \
        grc-network
    echo "✅ grc-network created successfully"
fi

# Verify network configuration
echo ""
echo "Network configuration:"
docker network inspect grc-network | grep -A 5 "IPAM"
ENDSSH

# Step 5: Verify Kong configuration file
print_status "Step 5: Verifying Kong configuration on remote server..."
ssh -i "$REMOTE_SSH_KEY" "$REMOTE_USER@$REMOTE_HOST" << 'ENDSSH'
cd /opt/stratagem

if [ -f infrastructure/kong/kong.yml ]; then
    echo "✅ Kong configuration file found"
    echo "Kong configuration preview:"
    head -20 infrastructure/kong/kong.yml
else
    echo "❌ Kong configuration file not found!"
    exit 1
fi
ENDSSH

# Step 6: Check if Kong container needs to be started
print_status "Step 6: Checking Kong setup..."
ssh -i "$REMOTE_SSH_KEY" "$REMOTE_USER@$REMOTE_HOST" << 'ENDSSH'
cd /opt/stratagem

# Check if Kong image exists
if docker images | grep -q "kong:3.4"; then
    echo "✅ Kong image found"
else
    echo "⚠️  Kong image not found. It will be pulled when starting services."
fi

# Check if Kong container is running
if docker ps | grep -q "kong"; then
    echo "✅ Kong container is running"
    docker ps | grep kong
else
    echo "ℹ️  Kong container is not running. Start it with:"
    echo "   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d kong"
fi

# Verify network connectivity
echo ""
echo "Network status:"
docker network ls | grep grc-network
ENDSSH

print_status ""
print_status "✅ Configuration files transferred!"
print_status ""
print_status "Next steps:"
print_status ""
print_status "Option 1: Automated setup (recommended)"
print_status "  Run on server: bash $REMOTE_PATH/scripts/setup-kong-on-server.sh"
print_status ""
print_status "Option 2: Manual setup"
print_status "  1. SSH into the server: ssh -i $REMOTE_SSH_KEY $REMOTE_USER@$REMOTE_HOST"
print_status "  2. Navigate to: cd $REMOTE_PATH"
print_status "  3. Ensure .env file is configured with production values"
print_status "  4. Configure Docker network: bash scripts/configure-docker-network.sh"
print_status "  5. Start Kong: docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d kong"
print_status "  6. Verify Kong: curl http://localhost:8001/services"
print_status ""
print_status "To start all services:"
print_status "   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d"
print_status ""

