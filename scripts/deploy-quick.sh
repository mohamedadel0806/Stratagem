#!/bin/bash

# Quick deployment - rebuilds only changed services
# Usage: ./scripts/deploy-quick.sh [service]
#   service: backend, frontend, ai-service, or all (default)

set -e

SERVICE="${1:-all}"
REMOTE_USER="ubuntu"
REMOTE_HOST="84.235.247.141"
REMOTE_SSH_KEY="/Users/adelsayed/Downloads/AWS/ssh-oracle-24.key"
REMOTE_PATH="/opt/stratagem"

echo "🚀 Quick deployment: $SERVICE"
echo ""

# Test SSH connection
if ! ssh -i "$REMOTE_SSH_KEY" -o ConnectTimeout=5 "$REMOTE_USER@$REMOTE_HOST" "echo 'OK'" > /dev/null 2>&1; then
    echo "❌ SSH connection failed"
    exit 1
fi

# Transfer only the service that changed
case "$SERVICE" in
    backend)
        echo "📦 Transferring backend..."
        rsync -avz --progress -e "ssh -i $REMOTE_SSH_KEY" \
            --exclude 'node_modules' --exclude 'dist' --exclude '.git' \
            ./backend/ "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/backend/"
        ssh -i "$REMOTE_SSH_KEY" "$REMOTE_USER@$REMOTE_HOST" \
            "cd $REMOTE_PATH && docker compose -f docker-compose.prod.yml build backend && docker compose -f docker-compose.prod.yml up -d backend"
        ;;
    frontend)
        echo "📦 Transferring frontend..."
        rsync -avz --progress -e "ssh -i $REMOTE_SSH_KEY" \
            --exclude 'node_modules' --exclude '.next' --exclude '.git' \
            ./frontend/ "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/frontend/"
        ssh -i "$REMOTE_SSH_KEY" "$REMOTE_USER@$REMOTE_HOST" << 'ENDSSH'
cd /opt/stratagem
export $(cat .env | grep -v '^#' | xargs)
docker compose -f docker-compose.prod.yml build --build-arg NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} --build-arg NEXTAUTH_URL=${FRONTEND_URL} --build-arg NEXTAUTH_SECRET=${NEXTAUTH_SECRET} frontend
docker compose -f docker-compose.prod.yml up -d frontend
ENDSSH
        ;;
    ai-service)
        echo "📦 Transferring AI service..."
        rsync -avz --progress -e "ssh -i $REMOTE_SSH_KEY" \
            --exclude '__pycache__' --exclude '*.pyc' --exclude '.git' \
            ./ai-service/ "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/ai-service/"
        ssh -i "$REMOTE_SSH_KEY" "$REMOTE_USER@$REMOTE_HOST" \
            "cd $REMOTE_PATH && docker compose -f docker-compose.prod.yml build ai-service && docker compose -f docker-compose.prod.yml up -d ai-service"
        ;;
    all|*)
        echo "📦 Transferring all services..."
        ./scripts/deploy-update.sh
        exit 0
        ;;
esac

echo ""
echo "✅ $SERVICE deployed successfully!"








