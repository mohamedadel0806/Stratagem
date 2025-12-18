#!/bin/bash

# Server-side deployment script
# Run this script on the remote server after transferring the deployment package

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
APP_DIR="${APP_DIR:-/opt/stratagem}"
DEPLOY_DIR="${1:-./deploy}"

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then 
    print_warning "This script should be run as root or with sudo for proper setup"
fi

print_status "=== Stratagem Server Deployment ==="
print_status "App directory: ${APP_DIR}"
print_status "Deploy directory: ${DEPLOY_DIR}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create application directory
print_status "Creating application directory..."
mkdir -p "${APP_DIR}"
mkdir -p "${APP_DIR}/data"
mkdir -p "${APP_DIR}/logs"
mkdir -p "${APP_DIR}/backups"

# Copy configuration files
print_status "Copying configuration files..."
if [ -d "${DEPLOY_DIR}/config" ]; then
    cp -r "${DEPLOY_DIR}/config"/* "${APP_DIR}/"
else
    print_error "Config directory not found in ${DEPLOY_DIR}"
    exit 1
fi

# Load Docker images
print_status "Loading Docker images..."
if [ -d "${DEPLOY_DIR}/images" ]; then
    for image_file in "${DEPLOY_DIR}/images"/*.tar.gz; do
        if [ -f "$image_file" ]; then
            print_status "Loading $(basename $image_file)..."
            gunzip -c "$image_file" | docker load
        fi
    done
else
    print_warning "Images directory not found. You may need to load images manually."
fi

# Set up environment file
if [ ! -f "${APP_DIR}/.env" ]; then
    print_status "Creating .env file from template..."
    if [ -f "${APP_DIR}/.env.template" ]; then
        cp "${APP_DIR}/.env.template" "${APP_DIR}/.env"
        print_warning "Please edit ${APP_DIR}/.env with your production values!"
        print_warning "Generate secrets with: openssl rand -base64 32"
    else
        print_error ".env.template not found. Please create .env manually."
    fi
else
    print_status ".env file already exists, skipping..."
fi

# Set proper permissions
print_status "Setting permissions..."
chmod 600 "${APP_DIR}/.env" 2>/dev/null || true
chmod +x "${APP_DIR}/scripts"/*.sh 2>/dev/null || true

# Create Docker network if it doesn't exist
print_status "Creating Docker network..."
docker network create grc-network 2>/dev/null || print_status "Network already exists"

# Create Docker volumes for data persistence
print_status "Creating Docker volumes..."
docker volume create postgres_data_prod 2>/dev/null || print_status "Volume postgres_data_prod already exists"
docker volume create mongodb_data_prod 2>/dev/null || print_status "Volume mongodb_data_prod already exists"
docker volume create neo4j_data_prod 2>/dev/null || print_status "Volume neo4j_data_prod already exists"
docker volume create redis_data_prod 2>/dev/null || print_status "Volume redis_data_prod already exists"
docker volume create elasticsearch_data_prod 2>/dev/null || print_status "Volume elasticsearch_data_prod already exists"
docker volume create prometheus_data 2>/dev/null || print_status "Volume prometheus_data already exists"
docker volume create grafana_data 2>/dev/null || print_status "Volume grafana_data already exists"

# Create systemd service for auto-start (optional)
print_status "Creating systemd service for auto-start..."
cat > /etc/systemd/system/stratagem.service << EOF
[Unit]
Description=Stratagem GRC Platform
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=${APP_DIR}
ExecStart=/usr/bin/docker-compose -f ${APP_DIR}/docker-compose.yml -f ${APP_DIR}/docker-compose.prod.yml up -d
ExecStop=/usr/bin/docker-compose -f ${APP_DIR}/docker-compose.yml -f ${APP_DIR}/docker-compose.prod.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

print_status "Systemd service created. To enable auto-start, run:"
print_status "  sudo systemctl enable stratagem"
print_status "  sudo systemctl start stratagem"

# Summary
echo ""
print_status "=== Deployment Complete ==="
echo ""
print_status "Application directory: ${APP_DIR}"
print_status "Configuration files: ${APP_DIR}/"
print_status "Docker images: Loaded"
print_status "Docker volumes: Created"
echo ""
print_warning "IMPORTANT: Before starting the application:"
print_warning "1. Edit ${APP_DIR}/.env with your production values"
print_warning "2. Configure Caddy reverse proxy (see DEPLOYMENT.md)"
print_warning "3. Ensure all secrets are strong and secure"
echo ""
print_status "To start the application:"
print_status "  cd ${APP_DIR}"
print_status "  docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d"
echo ""
print_status "To view logs:"
print_status "  docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f"
echo ""









