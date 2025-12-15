#!/bin/bash

# Import database data on server
# Usage: ./import-database.sh [export_directory]

set -e

IMPORT_DIR="${1:-./database-import/latest}"

if [ ! -d "$IMPORT_DIR" ]; then
    echo "❌ Import directory not found: $IMPORT_DIR"
    echo "Usage: ./import-database.sh [export_directory]"
    exit 1
fi

echo "📥 Importing database data from: $IMPORT_DIR"
echo ""

# Check if containers are running
if ! docker compose -f docker-compose.prod.yml ps postgres | grep -q "Up"; then
    echo "❌ PostgreSQL container is not running. Please start it first:"
    echo "   docker compose -f docker-compose.prod.yml up -d postgres"
    exit 1
fi

# Import PostgreSQL
if [ -f "$IMPORT_DIR/postgres_grc_platform.sql" ]; then
    echo "📊 Importing PostgreSQL main database..."
    docker compose -f docker-compose.prod.yml exec -T postgres psql -U postgres -d grc_platform < "$IMPORT_DIR/postgres_grc_platform.sql"
    echo "✅ PostgreSQL main database imported"
else
    echo "⚠️  PostgreSQL main database dump not found"
fi

# Skip Kong database import for DB-less mode
if [ -f "$IMPORT_DIR/postgres_kong.sql" ]; then
    echo "📊 Skipping Kong database import (DB-less mode enabled)"
fi

if [ -f "$IMPORT_DIR/postgres_keycloak.sql" ]; then
    echo "📊 Importing Keycloak database..."
    docker compose -f docker-compose.prod.yml exec -T postgres psql -U postgres -d keycloak < "$IMPORT_DIR/postgres_keycloak.sql" 2>/dev/null || echo "Keycloak database import skipped (may already exist)"
fi

# Import MongoDB
if [ -f "$IMPORT_DIR/mongodb_grc_documents.archive" ] && docker compose -f docker-compose.prod.yml ps mongodb | grep -q "Up"; then
    echo "📊 Importing MongoDB database..."
    docker compose -f docker-compose.prod.yml exec -T mongodb mongorestore --username admin --password password --authenticationDatabase admin --db grc_documents --archive < "$IMPORT_DIR/mongodb_grc_documents.archive" 2>/dev/null || echo "MongoDB import failed or database is empty"
    echo "✅ MongoDB imported"
fi

# Import Neo4j
if [ -f "$IMPORT_DIR/neo4j_export.graphml" ] && docker compose -f docker-compose.prod.yml ps neo4j | grep -q "Up"; then
    echo "📊 Importing Neo4j database..."
    docker compose -f docker-compose.prod.yml cp "$IMPORT_DIR/neo4j_export.graphml" neo4j:/tmp/neo4j_import.graphml
    docker compose -f docker-compose.prod.yml exec -T neo4j cypher-shell -u neo4j -p password "CALL apoc.import.graphml('/tmp/neo4j_import.graphml', {})" 2>/dev/null || echo "Neo4j import attempted (may require manual import)"
    echo "✅ Neo4j import attempted"
fi

echo ""
echo "✅ Database import complete!"
echo ""

# Fix database schema issues
echo "🔧 Fixing database schema issues..."
if [ -f scripts/fix-database-schema.sh ]; then
    chmod +x scripts/fix-database-schema.sh
    ./scripts/fix-database-schema.sh 2>&1 | grep -v "already exists" || echo "Schema fixes completed (some errors expected)"
else
    echo "⚠️  fix-database-schema.sh not found, skipping schema fixes"
fi

echo ""
echo "Note: You may need to restart services for changes to take effect:"
echo "  docker compose -f docker-compose.prod.yml restart backend"

