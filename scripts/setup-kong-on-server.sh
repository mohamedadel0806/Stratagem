#!/bin/bash

# Setup Kong on the server
# This script should be run ON THE REMOTE SERVER after configuration files are transferred

set -e

cd /opt/stratagem

echo "🔧 Setting up Kong on server..."

# Verify Kong configuration exists
if [ ! -f infrastructure/kong/kong.yml ]; then
    echo "❌ Kong configuration file not found at infrastructure/kong/kong.yml"
    exit 1
fi

echo "✅ Kong configuration file found"

# Verify Docker network exists
if ! docker network inspect grc-network &>/dev/null; then
    echo "Creating grc-network..."
    docker network create \
        --driver bridge \
        --subnet 172.20.0.0/16 \
        --opt com.docker.network.driver.mtu=1500 \
        grc-network
    echo "✅ grc-network created"
else
    echo "✅ grc-network already exists"
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from template..."
    if [ -f .env.template ]; then
        cp .env.template .env
        echo "⚠️  Please edit .env with your production values before starting services!"
    else
        echo "❌ .env.template not found. Please create .env file manually."
        exit 1
    fi
fi

# Pull Kong image if not present
if ! docker images | grep -q "kong:3.4"; then
    echo "Pulling Kong image..."
    docker pull kong:3.4
    echo "✅ Kong image pulled"
else
    echo "✅ Kong image already present"
fi

# Stop existing Kong container if running
if docker ps | grep -q "kong"; then
    echo "Stopping existing Kong container..."
    docker compose -f docker-compose.yml -f docker-compose.prod.yml stop kong
    docker compose -f docker-compose.yml -f docker-compose.prod.yml rm -f kong
fi

# Start Kong
echo "Starting Kong..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d kong

# Wait for Kong to be ready
echo "Waiting for Kong to be ready..."
sleep 5

# Verify Kong is running
if docker ps | grep -q "kong"; then
    echo "✅ Kong container is running"
else
    echo "❌ Kong container failed to start"
    echo "Checking logs..."
    docker compose -f docker-compose.yml -f docker-compose.prod.yml logs kong
    exit 1
fi

# Test Kong Admin API
echo "Testing Kong Admin API..."
if curl -s http://localhost:8001/services > /dev/null; then
    echo "✅ Kong Admin API is responding"
    echo ""
    echo "Kong services:"
    curl -s http://localhost:8001/services | jq '.' || curl -s http://localhost:8001/services
else
    echo "⚠️  Kong Admin API not responding yet. It may need a few more seconds."
    echo "Check logs: docker compose -f docker-compose.yml -f docker-compose.prod.yml logs kong"
fi

# Display network information
echo ""
echo "Network information:"
docker network inspect grc-network | grep -A 10 "IPAM" || docker network inspect grc-network

echo ""
echo "✅ Kong setup complete!"
echo ""
echo "Kong Admin API: http://localhost:8001"
echo "Kong Proxy: http://localhost:8000"
echo ""
echo "To view Kong logs:"
echo "  docker compose -f docker-compose.yml -f docker-compose.prod.yml logs -f kong"
echo ""
echo "To verify Kong routes:"
echo "  curl http://localhost:8001/routes"
echo "  curl http://localhost:8001/services"

