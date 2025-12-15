#!/bin/bash

# Script to backup Docker volumes
# Usage: ./backup-volumes.sh [backup_directory]

set -e

BACKUP_DIR="${1:-./backups}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="${BACKUP_DIR}/backup_${TIMESTAMP}"

mkdir -p "$BACKUP_PATH"

echo "Backing up Docker volumes to $BACKUP_PATH..."

# List of volumes to backup
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
    if docker volume inspect "$volume" &> /dev/null; then
        echo "Backing up volume: $volume"
        docker run --rm \
            -v "$volume":/data \
            -v "$(pwd)/$BACKUP_PATH":/backup \
            alpine tar czf "/backup/${volume}.tar.gz" -C /data .
    else
        echo "Warning: Volume $volume does not exist, skipping..."
    fi
done

echo "Backup completed: $BACKUP_PATH"
echo "To restore, use: ./restore-volumes.sh $BACKUP_PATH"








