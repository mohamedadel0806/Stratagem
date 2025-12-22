#!/bin/bash

# Clean import database data on server (drops existing data first)
# Usage: ./import-database-clean.sh [export_directory]

set -e

IMPORT_DIR="${1:-./database-import/latest}"

if [ ! -d "$IMPORT_DIR" ]; then
    echo "❌ Import directory not found: $IMPORT_DIR"
    echo "Usage: ./import-database-clean.sh [export_directory]"
    exit 1
fi

echo "📥 Clean importing database data from: $IMPORT_DIR"
echo "⚠️  WARNING: This will DELETE all existing data!"
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo "❌ Import cancelled"
    exit 1
fi

# Check if containers are running
if ! docker compose -f docker-compose.prod.yml ps postgres | grep -q "Up"; then
    echo "❌ PostgreSQL container is not running. Please start it first:"
    echo "   docker compose -f docker-compose.prod.yml up -d postgres"
    exit 1
fi

# Drop and recreate the database
echo "🗑️  Dropping existing database..."
docker compose -f docker-compose.prod.yml exec -T postgres psql -U postgres << 'EOF'
-- Terminate all connections to the database
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = 'grc_platform'
  AND pid <> pg_backend_pid();

-- Drop and recreate database
DROP DATABASE IF EXISTS grc_platform;
CREATE DATABASE grc_platform;
EOF

echo "✅ Database recreated"

# Import PostgreSQL
if [ -f "$IMPORT_DIR/postgres_grc_platform.sql" ]; then
    echo "📊 Importing PostgreSQL main database..."
    docker compose -f docker-compose.prod.yml exec -T postgres psql -U postgres -d grc_platform < "$IMPORT_DIR/postgres_grc_platform.sql"
    echo "✅ PostgreSQL main database imported"
else
    echo "⚠️  PostgreSQL main database dump not found"
fi

# Import MongoDB (drop existing data first)
if [ -f "$IMPORT_DIR/mongodb_grc_documents.archive" ] && docker compose -f docker-compose.prod.yml ps mongodb | grep -q "Up"; then
    echo "📊 Dropping and importing MongoDB database..."
    docker compose -f docker-compose.prod.yml exec -T mongodb mongosh --quiet --eval "use grc_documents; db.dropDatabase();" --username admin --password password --authenticationDatabase admin 2>/dev/null || true
    docker compose -f docker-compose.prod.yml exec -T mongodb mongorestore --username admin --password password --authenticationDatabase admin --db grc_documents --archive < "$IMPORT_DIR/mongodb_grc_documents.archive" 2>/dev/null || echo "MongoDB import failed or database is empty"
    echo "✅ MongoDB imported"
fi

# Import Neo4j (clear existing data first)
if [ -f "$IMPORT_DIR/neo4j_export.graphml" ] && docker compose -f docker-compose.prod.yml ps neo4j | grep -q "Up"; then
    echo "📊 Clearing and importing Neo4j database..."
    docker compose -f docker-compose.prod.yml exec -T neo4j cypher-shell -u neo4j -p password "MATCH (n) DETACH DELETE n;" 2>/dev/null || true
    docker compose -f docker-compose.prod.yml cp "$IMPORT_DIR/neo4j_export.graphml" neo4j:/tmp/neo4j_import.graphml 2>/dev/null || true
    docker compose -f docker-compose.prod.yml exec -T neo4j cypher-shell -u neo4j -p password "CALL apoc.import.graphml('/tmp/neo4j_import.graphml', {})" 2>/dev/null || echo "Neo4j import attempted (may require manual import)"
    echo "✅ Neo4j import attempted"
fi

echo ""
echo "✅ Clean database import complete!"
echo ""
echo "Note: You may need to restart services for changes to take effect:"
echo "  docker compose -f docker-compose.prod.yml restart backend"











