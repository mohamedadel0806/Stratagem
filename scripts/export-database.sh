#!/bin/bash

# Export database data from local development environment
# This exports PostgreSQL, MongoDB, and Neo4j data

set -e

EXPORT_DIR="./database-export"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
EXPORT_PATH="${EXPORT_DIR}/export_${TIMESTAMP}"

mkdir -p "$EXPORT_PATH"

echo "📦 Exporting database data..."
echo "Export directory: $EXPORT_PATH"
echo ""

# Check if containers are running
if ! docker compose ps postgres | grep -q "Up"; then
    echo "❌ PostgreSQL container is not running. Please start it first:"
    echo "   docker compose up -d postgres"
    exit 1
fi

# Export PostgreSQL
echo "📊 Exporting PostgreSQL database..."
docker compose exec -T postgres pg_dump -U postgres grc_platform > "$EXPORT_PATH/postgres_grc_platform.sql"
docker compose exec -T postgres pg_dump -U postgres kong > "$EXPORT_PATH/postgres_kong.sql" 2>/dev/null || echo "Kong database not found, skipping..."
docker compose exec -T postgres pg_dump -U postgres keycloak > "$EXPORT_PATH/postgres_keycloak.sql" 2>/dev/null || echo "Keycloak database not found, skipping..."
echo "✅ PostgreSQL exported"

# Export MongoDB
if docker compose ps mongodb | grep -q "Up"; then
    echo "📊 Exporting MongoDB database..."
    docker compose exec -T mongodb mongodump --username admin --password password --authenticationDatabase admin --db grc_documents --archive > "$EXPORT_PATH/mongodb_grc_documents.archive" 2>/dev/null || echo "MongoDB export failed or database is empty"
    echo "✅ MongoDB exported"
else
    echo "⚠️  MongoDB container is not running, skipping..."
fi

# Export Neo4j
if docker compose ps neo4j | grep -q "Up"; then
    echo "📊 Exporting Neo4j database..."
    docker compose exec -T neo4j cypher-shell -u neo4j -p password "CALL apoc.export.graphml.all('/tmp/neo4j_export.graphml', {})" > "$EXPORT_PATH/neo4j_export.log" 2>&1 || echo "Neo4j export attempted (may require APOC plugin)"
    docker compose cp neo4j:/tmp/neo4j_export.graphml "$EXPORT_PATH/neo4j_export.graphml" 2>/dev/null || echo "Neo4j export file not found"
    echo "✅ Neo4j export attempted"
else
    echo "⚠️  Neo4j container is not running, skipping..."
fi

# Create a manifest file
cat > "$EXPORT_PATH/MANIFEST.txt" << EOF
Database Export
Generated: $(date)
Source: Local Development Environment

Contents:
- postgres_grc_platform.sql - Main PostgreSQL database
- postgres_kong.sql - Kong database (if exists)
- postgres_keycloak.sql - Keycloak database (if exists)
- mongodb_grc_documents.archive - MongoDB database dump
- neo4j_export.graphml - Neo4j graph export (if available)

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

