#!/bin/bash

# Export database data from local development environment
# This exports PostgreSQL data for the GRC platform

set -e

EXPORT_DIR="./database-export"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
EXPORT_PATH="${EXPORT_DIR}/export_${TIMESTAMP}"

mkdir -p "$EXPORT_PATH"

echo "📦 Exporting PostgreSQL database..."
echo "Export directory: $EXPORT_PATH"
echo ""

# Check if containers are running
if ! docker compose ps postgres | grep -q "Up"; then
    echo "❌ PostgreSQL container is not running. Please start it first:"
    echo "   docker compose up -d postgres"
    exit 1
fi

# Export PostgreSQL
echo "📊 Exporting grc_platform database..."
docker compose exec -T postgres pg_dump -U postgres grc_platform > "$EXPORT_PATH/postgres_grc_platform.sql"

# Export Kong (if configured)
docker compose exec -T postgres pg_dump -U postgres kong > "$EXPORT_PATH/postgres_kong.sql" 2>/dev/null || echo "Kong database not found, skipping..."

# Create a manifest file
cat > "$EXPORT_PATH/MANIFEST.txt" << EOF
Database Export
Generated: $(date)
Source: Local Development Environment

Contents:
- postgres_grc_platform.sql - Main PostgreSQL database
- postgres_kong.sql - Kong database (if exists)

To import on server:
1. Transfer this directory to server
2. Run: ./scripts/import-database.sh $EXPORT_PATH
EOF

echo ""
echo "✅ Database export complete!"
echo "📁 Export location: $EXPORT_PATH"
echo ""
echo "To transfer to server:"
echo "  scp -i /Users/adelsayed/Downloads/AWS/ssh-oracle-24.key -r $EXPORT_PATH ubuntu@84.235.247.141:/opt/stratagem/database-import/"
