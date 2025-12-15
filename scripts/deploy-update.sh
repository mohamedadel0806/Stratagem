#!/bin/bash

# Quick deployment script for app updates
# This script transfers updated code to the server and rebuilds services

set -e

REMOTE_USER="ubuntu"
REMOTE_HOST="84.235.247.141"
REMOTE_SSH_KEY="/Users/adelsayed/Downloads/AWS/ssh-oracle-24.key"
REMOTE_PATH="/opt/stratagem"

echo "🚀 Starting deployment to ${REMOTE_HOST}..."
echo ""

# Test SSH connection
echo "📡 Testing SSH connection..."
if ! ssh -i "$REMOTE_SSH_KEY" -o ConnectTimeout=5 "$REMOTE_USER@$REMOTE_HOST" "echo 'Connection successful'" > /dev/null 2>&1; then
    echo "❌ Failed to connect to server. Please check:"
    echo "   - SSH key path: $REMOTE_SSH_KEY"
    echo "   - Server address: $REMOTE_HOST"
    echo "   - Network connectivity"
    exit 1
fi
echo "✅ SSH connection successful"
echo ""

# Transfer source code
echo "📦 Transferring source code..."
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

echo "✅ Source code transferred"
echo ""

# Transfer configuration files
echo "⚙️  Transferring configuration files..."
scp -i "$REMOTE_SSH_KEY" \
    docker-compose.prod.yml \
    "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/"

scp -i "$REMOTE_SSH_KEY" \
    infrastructure/caddy/Caddyfile \
    "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/infrastructure/caddy/Caddyfile"

echo "✅ Configuration files transferred"
echo ""

# Rebuild and restart services on server
echo "🔨 Rebuilding services on server..."
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

# Fix database schema issues
echo ""
echo "🔧 Fixing database schema issues..."
if [ -f scripts/fix-database-schema.sh ]; then
    chmod +x scripts/fix-database-schema.sh
    ./scripts/fix-database-schema.sh || echo "⚠️  Some schema fixes may have failed (this is often normal)"
else
    echo "⚠️  fix-database-schema.sh not found, skipping schema fixes"
fi

# Restart backend after schema fixes
echo "Restarting backend after schema fixes..."
docker compose -f docker-compose.prod.yml restart backend
sleep 5

# Check service status
echo ""
echo "📊 Service Status:"
docker compose -f docker-compose.prod.yml ps backend frontend ai-service

# Reload Caddy if Caddyfile changed
if [ -f infrastructure/caddy/Caddyfile ]; then
    echo ""
    echo "🔄 Reloading Caddy..."
    sudo cp infrastructure/caddy/Caddyfile /etc/caddy/Caddyfile
    sudo systemctl reload caddy
    echo "✅ Caddy reloaded"
fi

# Run post-deployment validation
echo ""
echo "🔍 Running post-deployment validation..."
if [ -f scripts/validate-deployment.sh ]; then
    chmod +x scripts/validate-deployment.sh
    ./scripts/validate-deployment.sh
    VALIDATION_EXIT_CODE=$?
else
    echo "⚠️  Validation script not found, skipping automated checks"
    VALIDATION_EXIT_CODE=0
fi

echo ""
echo "✅ Deployment complete!"
ENDSSH

# Check validation result
if [ $VALIDATION_EXIT_CODE -eq 0 ]; then
    echo ""
    echo "🎉 Deployment finished successfully!"
else
    echo ""
    echo "⚠️  Deployment completed but validation failed!"
    echo "   Please check the validation output above and fix any issues."
fi
echo ""
echo "Next steps:"
echo "  - Check service logs: ssh -i $REMOTE_SSH_KEY $REMOTE_USER@$REMOTE_HOST 'cd $REMOTE_PATH && docker compose -f docker-compose.prod.yml logs --tail 50'"
echo "  - Visit: https://grc-staging.newmehub.com"





