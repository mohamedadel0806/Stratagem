#!/bin/bash

# Deployment script for Stratagem GRC Platform
# This script builds Docker images, saves them, and prepares for SCP transfer

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DEPLOY_DIR="./deploy"
IMAGES_DIR="${DEPLOY_DIR}/images"
DATA_DIR="${DEPLOY_DIR}/data"
SCRIPTS_DIR="${DEPLOY_DIR}/scripts"
CONFIG_DIR="${DEPLOY_DIR}/config"

# Remote server configuration (set via environment variables or defaults)
REMOTE_USER="${REMOTE_USER:-ubuntu}"
REMOTE_HOST="${REMOTE_HOST:-84.235.247.141}"
REMOTE_SSH_KEY="${REMOTE_SSH_KEY:-/Users/adelsayed/Downloads/AWS/ssh-oracle-24.key}"
REMOTE_PATH="${REMOTE_PATH:-/opt/stratagem}"

# Image names
FRONTEND_IMAGE="stratagem-frontend"
BACKEND_IMAGE="stratagem-backend"
AI_SERVICE_IMAGE="stratagem-ai-service"

echo -e "${GREEN}=== Stratagem Deployment Script ===${NC}\n"

# Function to print status
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Create deployment directories
print_status "Creating deployment directories..."
mkdir -p "${IMAGES_DIR}"
mkdir -p "${DATA_DIR}"
mkdir -p "${SCRIPTS_DIR}"
mkdir -p "${CONFIG_DIR}"

# Step 1: Build Docker images
print_status "Building Docker images for production..."

print_status "Building frontend image..."
docker build -t "${FRONTEND_IMAGE}:latest" \
    --target runner \
    --build-arg NEXT_PUBLIC_API_URL="/api" \
    --build-arg NEXTAUTH_URL="http://localhost:3000" \
    --build-arg NEXTAUTH_SECRET="build-time-secret" \
    -f ./frontend/Dockerfile \
    ./frontend

print_status "Building backend image..."
docker build -t "${BACKEND_IMAGE}:latest" \
    --target production \
    -f ./backend/Dockerfile \
    ./backend

print_status "Building AI service image..."
docker build -t "${AI_SERVICE_IMAGE}:latest" \
    --target production \
    -f ./ai-service/Dockerfile \
    ./ai-service

# Step 2: Save Docker images to tar files
print_status "Saving Docker images to tar files..."

print_status "Saving frontend image..."
docker save "${FRONTEND_IMAGE}:latest" | gzip > "${IMAGES_DIR}/frontend.tar.gz"

print_status "Saving backend image..."
docker save "${BACKEND_IMAGE}:latest" | gzip > "${IMAGES_DIR}/backend.tar.gz"

print_status "Saving AI service image..."
docker save "${AI_SERVICE_IMAGE}:latest" | gzip > "${IMAGES_DIR}/ai-service.tar.gz"

# Step 3: Save third-party images
print_status "Saving third-party Docker images..."

# Pull and save third-party images
THIRD_PARTY_IMAGES=(
    "postgres:15-alpine"
    "mongo:7"
    "neo4j:5.14-community"
    "redis:7-alpine"
    "docker.elastic.co/elasticsearch/elasticsearch:8.11.0"
    "kong:3.4"
    "quay.io/keycloak/keycloak:23.0"
    "prom/prometheus:v2.40.0"
    "grafana/grafana:10.0.0"
    "pantsel/konga"
)

for image in "${THIRD_PARTY_IMAGES[@]}"; do
    print_status "Pulling and saving ${image}..."
    docker pull "${image}" || print_warning "Failed to pull ${image}, continuing..."
    IMAGE_NAME=$(echo "${image}" | tr '/:' '_')
    docker save "${image}" | gzip > "${IMAGES_DIR}/${IMAGE_NAME}.tar.gz" || print_warning "Failed to save ${image}"
done

# Step 4: Copy configuration files
print_status "Copying configuration files..."

# Copy docker-compose files
cp docker-compose.yml "${CONFIG_DIR}/"
cp docker-compose.prod.yml "${CONFIG_DIR}/"

# Copy infrastructure configs
mkdir -p "${CONFIG_DIR}/infrastructure"
cp -r infrastructure/* "${CONFIG_DIR}/infrastructure/"

# Copy monitoring configs
mkdir -p "${CONFIG_DIR}/monitoring"
cp -r monitoring/* "${CONFIG_DIR}/monitoring/"

# Copy deployment scripts
cp scripts/deploy-server.sh "${SCRIPTS_DIR}/"
cp scripts/load-images.sh "${SCRIPTS_DIR}/"
cp scripts/backup-volumes.sh "${SCRIPTS_DIR}/"
cp scripts/restore-volumes.sh "${SCRIPTS_DIR}/"

# Step 5: Create .env template
print_status "Creating .env template..."
cat > "${CONFIG_DIR}/.env.template" << 'EOF'
# Application Secrets
NEXTAUTH_SECRET=your-nextauth-secret-here-generate-with-openssl-rand-base64-32
JWT_SECRET=your-jwt-secret-here-generate-with-openssl-rand-base64-32

# Database Credentials
POSTGRES_PASSWORD=change-this-strong-password
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=change-this-strong-password
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=change-this-strong-password
REDIS_PASSWORD=change-this-strong-password
ELASTIC_PASSWORD=change-this-strong-password

# Keycloak Configuration
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=change-this-strong-password

# API Configuration
API_URL=http://localhost:8000
FRONTEND_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com/api

# Backend Configuration
BACKEND_URL=http://backend:3001
DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@postgres:5432/grc_platform
MONGODB_URL=mongodb://${MONGO_ROOT_USERNAME}:${MONGO_ROOT_PASSWORD}@mongodb:27017/grc_documents?authSource=admin
NEO4J_URL=bolt://neo4j:7687
REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
ELASTICSEARCH_URL=http://elasticsearch:9200

# AI Service Configuration (if needed)
OPENAI_API_KEY=your-openai-api-key
HUGGINGFACE_API_KEY=your-huggingface-api-key

# Monitoring Configuration
PROMETHEUS_URL=http://localhost:9091
GRAFANA_URL=http://localhost:3010
EOF

# Step 6: Create deployment manifest
print_status "Creating deployment manifest..."
cat > "${DEPLOY_DIR}/MANIFEST.txt" << EOF
Stratagem GRC Platform Deployment Package
Generated: $(date)
Version: $(git describe --tags --always 2>/dev/null || echo "unknown")

Contents:
- Docker images (compressed): ${IMAGES_DIR}/
- Configuration files: ${CONFIG_DIR}/
- Deployment scripts: ${SCRIPTS_DIR}/
- Data backup scripts: ${SCRIPTS_DIR}/

Next Steps:
1. Transfer this entire 'deploy' directory to your server using SCP:
   scp -i ${REMOTE_SSH_KEY:-~/.ssh/id_rsa} -r deploy/ ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/

2. SSH into your server:
   ssh -i ${REMOTE_SSH_KEY:-~/.ssh/id_rsa} ${REMOTE_USER}@${REMOTE_HOST}

3. Run the server setup script:
   cd ${REMOTE_PATH}/deploy
   chmod +x scripts/*.sh
   sudo ./scripts/deploy-server.sh

4. Configure Caddy (see DEPLOYMENT.md for details)

5. Start the application:
   cd ${REMOTE_PATH}
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
EOF

# Step 7: Calculate sizes
print_status "Calculating package sizes..."
TOTAL_SIZE=$(du -sh "${DEPLOY_DIR}" | cut -f1)
IMAGES_SIZE=$(du -sh "${IMAGES_DIR}" | cut -f1)

echo ""
echo -e "${GREEN}=== Deployment Package Created ===${NC}"
echo "Location: ${DEPLOY_DIR}"
echo "Total size: ${TOTAL_SIZE}"
echo "Images size: ${IMAGES_SIZE}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Review the .env.template and create your .env file"
echo "2. Transfer the deploy directory to your server:"
if [ -n "${REMOTE_SSH_KEY}" ] && [ -f "${REMOTE_SSH_KEY}" ]; then
    echo "   scp -i ${REMOTE_SSH_KEY} -r ${DEPLOY_DIR}/ ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/"
else
    echo "   scp -r ${DEPLOY_DIR}/ ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/"
fi
echo "3. SSH into your server and run the deployment script:"
if [ -n "${REMOTE_SSH_KEY}" ] && [ -f "${REMOTE_SSH_KEY}" ]; then
    echo "   ssh -i ${REMOTE_SSH_KEY} ${REMOTE_USER}@${REMOTE_HOST}"
else
    echo "   ssh ${REMOTE_USER}@${REMOTE_HOST}"
fi
echo ""
echo -e "${GREEN}Deployment package ready!${NC}"

