#!/bin/bash

# Complete setup script: Transfer database export and setup server
# This script helps you export local data and set up the server

set -e

REMOTE_USER="ubuntu"
REMOTE_HOST="84.235.247.141"
REMOTE_SSH_KEY="/Users/adelsayed/Downloads/AWS/ssh-oracle-24.key"
REMOTE_PATH="/opt/stratagem"

echo "🚀 Complete Server Setup Script"
echo "================================"
echo ""

# Step 1: Export local database
echo "Step 1: Exporting local database..."
if [ -f "./scripts/export-database.sh" ]; then
    ./scripts/export-database.sh
    LATEST_EXPORT=$(ls -td ./database-export/export_* 2>/dev/null | head -1)
    if [ -n "$LATEST_EXPORT" ]; then
        echo "✅ Database exported to: $LATEST_EXPORT"
    else
        echo "⚠️  No database export found. You may need to run this manually."
        LATEST_EXPORT=""
    fi
else
    echo "⚠️  Export script not found. Skipping database export."
    LATEST_EXPORT=""
fi

echo ""
echo "Step 2: Transferring files to server..."
echo ""

# Transfer setup script
scp -i "$REMOTE_SSH_KEY" \
    scripts/setup-server-env.sh \
    scripts/import-database.sh \
    "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/scripts/"

# Transfer database export if available
if [ -n "$LATEST_EXPORT" ] && [ -d "$LATEST_EXPORT" ]; then
    echo "Transferring database export..."
    ssh -i "$REMOTE_SSH_KEY" "$REMOTE_USER@$REMOTE_HOST" "mkdir -p $REMOTE_PATH/database-import"
    scp -i "$REMOTE_SSH_KEY" -r "$LATEST_EXPORT" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/database-import/latest"
    echo "✅ Database export transferred"
fi

echo ""
echo "✅ Files transferred!"
echo ""
echo "Next steps on server:"
echo "====================="
echo ""
echo "1. SSH into server:"
echo "   ssh -i $REMOTE_SSH_KEY $REMOTE_USER@$REMOTE_HOST"
echo ""
echo "2. Setup environment:"
echo "   cd $REMOTE_PATH"
echo "   chmod +x scripts/*.sh"
echo "   ./scripts/setup-server-env.sh"
echo "   nano .env  # Update FRONTEND_URL and NEXT_PUBLIC_API_URL"
echo ""
if [ -n "$LATEST_EXPORT" ]; then
    echo "3. Import database (after services are running):"
    echo "   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d postgres mongodb neo4j"
    echo "   sleep 10  # Wait for databases to start"
    echo "   ./scripts/import-database.sh database-import/latest"
    echo ""
fi
echo "4. Build and start application:"
echo "   docker-compose -f docker-compose.yml -f docker-compose.prod.yml build"
echo "   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d"
echo ""
echo "5. Seed database (if not importing):"
echo "   docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec backend npm run seed"
echo ""











