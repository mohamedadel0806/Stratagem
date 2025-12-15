#!/bin/bash

# Automated deployment script that builds, packages, and transfers to server
# Usage: ./deploy-to-server.sh

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

# Step 1: Build and package
print_status "Step 1: Building and packaging application..."
export REMOTE_USER="$REMOTE_USER"
export REMOTE_HOST="$REMOTE_HOST"
export REMOTE_SSH_KEY="$REMOTE_SSH_KEY"
export REMOTE_PATH="$REMOTE_PATH"

./scripts/deploy.sh

# Step 2: Transfer to server
print_status "Step 2: Transferring deployment package to server..."
print_warning "This may take a while depending on your connection speed..."

if [ -d "./deploy" ]; then
    # Create remote directory
    ssh -i "$REMOTE_SSH_KEY" "$REMOTE_USER@$REMOTE_HOST" "mkdir -p $REMOTE_PATH"
    
    # Transfer files
    scp -i "$REMOTE_SSH_KEY" -r ./deploy "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/"
    
    print_status "Files transferred successfully!"
else
    print_error "Deploy directory not found. Run ./scripts/deploy.sh first."
    exit 1
fi

# Step 3: Provide next steps
echo ""
print_status "=== Deployment Package Transferred ==="
echo ""
print_status "Next steps on the server:"
echo ""
echo "1. SSH into your server:"
echo "   ssh -i $REMOTE_SSH_KEY $REMOTE_USER@$REMOTE_HOST"
echo ""
echo "2. Navigate to deployment directory:"
echo "   cd $REMOTE_PATH/deploy"
echo ""
echo "3. Configure environment:"
echo "   cd config"
echo "   cp .env.template .env"
echo "   nano .env  # Edit with your production values"
echo ""
echo "4. Run server setup:"
echo "   cd .."
echo "   chmod +x scripts/*.sh"
echo "   sudo ./scripts/deploy-server.sh"
echo ""
echo "5. Configure Caddy:"
echo "   sudo cp config/infrastructure/caddy/Caddyfile /etc/caddy/Caddyfile"
echo "   sudo nano /etc/caddy/Caddyfile  # Replace 'your-domain.com'"
echo "   sudo systemctl reload caddy"
echo ""
echo "6. Start application:"
echo "   cd $REMOTE_PATH"
echo "   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d"
echo ""
print_status "Deployment package ready on server!"

# Ensure Kong is deployed in DB-less mode
print_status "Configuring Kong for DB-less mode..."
scp -i "$REMOTE_SSH_KEY" docker-compose.prod.yml "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/docker-compose.yml"
ssh -i "$REMOTE_SSH_KEY" "$REMOTE_USER@$REMOTE_HOST" << 'EOF'
  docker compose -f $REMOTE_PATH/docker-compose.yml up -d kong
EOF
print_status "Kong deployed in DB-less mode successfully."








