#!/bin/bash

# Script to restore Docker volumes from backup
# Usage: ./restore-volumes.sh [backup_directory]

set -e

BACKUP_DIR="${1}"

if [ -z "$BACKUP_DIR" ]; then
    echo "Error: Backup directory not specified"
    echo "Usage: ./restore-volumes.sh [backup_directory]"
    exit 1
fi

if [ ! -d "$BACKUP_DIR" ]; then
    echo "Error: Backup directory not found: $BACKUP_DIR"
    exit 1
fi

echo "WARNING: This will overwrite existing Docker volumes!"
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Restore cancelled."
    exit 0
fi

echo "Restoring Docker volumes from $BACKUP_DIR..."

# List of volumes to restore
VOLUMES=(
    "postgres_data_prod"
    "mongodb_data_prod"
    "neo4j_data_prod"
    "redis_data_prod"
    "elasticsearch_data_prod"
    "prometheus_data"
    "grafana_data"
)

for volume in "${VOLUMES[@]}"; do
    BACKUP_FILE="${BACKUP_DIR}/${volume}.tar.gz"
    if [ -f "$BACKUP_FILE" ]; then
        echo "Restoring volume: $volume"
        
        # Create volume if it doesn't exist
        docker volume create "$volume" 2>/dev/null || true
        
        # Restore data
        docker run --rm \
            -v "$volume":/data \
            -v "$(pwd)/$BACKUP_DIR":/backup \
            alpine sh -c "rm -rf /data/* && tar xzf /backup/${volume}.tar.gz -C /data"
    else
        echo "Warning: Backup file for $volume not found, skipping..."
    fi
done

echo "Restore completed!"








