#!/bin/bash

# Script to load Docker images from tar.gz files
# Usage: ./load-images.sh [images_directory]

set -e

IMAGES_DIR="${1:-./images}"

if [ ! -d "$IMAGES_DIR" ]; then
    echo "Error: Images directory not found: $IMAGES_DIR"
    exit 1
fi

echo "Loading Docker images from $IMAGES_DIR..."

for image_file in "$IMAGES_DIR"/*.tar.gz; do
    if [ -f "$image_file" ]; then
        echo "Loading $(basename $image_file)..."
        gunzip -c "$image_file" | docker load
    fi
done

echo "All images loaded successfully!"








