#!/bin/bash

# Deployment Rollback Script
# Use this when a deployment fails and you need to revert to previous state

set -e

REMOTE_USER="ubuntu"
REMOTE_HOST="84.235.247.141"
REMOTE_SSH_KEY="/Users/adelsayed/Downloads/AWS/ssh-oracle-24.key"
REMOTE_PATH="/opt/stratagem"

echo "🔄 Starting deployment rollback..."
echo ""

# Test SSH connection
echo "📡 Testing SSH connection..."
if ! ssh -i "$REMOTE_SSH_KEY" -o ConnectTimeout=5 "$REMOTE_USER@$REMOTE_HOST" "echo 'Connection successful'" > /dev/null 2>&1; then
    echo "❌ Failed to connect to server. Cannot rollback."
    exit 1
fi
echo "✅ SSH connection successful"
echo ""

# Execute rollback on server
ssh -i "$REMOTE_SSH_KEY" "$REMOTE_USER@$REMOTE_HOST" << 'ENDSSH'
cd /opt/stratagem

echo "🛑 Stopping all services..."
docker compose -f docker-compose.prod.yml down

echo "💾 Restoring database from backup..."
if [ -d backups ] && [ "$(ls -A backups)" ]; then
    # Find the most recent backup
    LATEST_BACKUP=$(ls -t backups/ | head -1)
    echo "Found backup: $LATEST_BACKUP"

    # Restore volumes from backup
    ./scripts/restore-volumes.sh "backups/$LATEST_BACKUP"
else
    echo "⚠️  No backups found! Skipping database restore."
fi

echo "🐳 Restarting services..."
docker compose -f docker-compose.prod.yml up -d

echo "⏳ Waiting for services to start..."
sleep 30

echo "🔍 Validating rollback..."
if [ -f scripts/validate-deployment.sh ]; then
    ./scripts/validate-deployment.sh
else
    echo "⚠️  Validation script not found"
fi

echo "✅ Rollback complete!"
ENDSSH

echo ""
echo "🎯 Rollback completed!"
echo ""
echo "Next steps:"
echo "  - Test the application: https://grc-staging.newmehub.com"
echo "  - Check service logs if issues persist"
echo "  - Investigate what caused the deployment to fail"</content>
<parameter name="filePath">/Users/adelsayed/Documents/Code/Stratagem/scripts/deploy-rollback.sh