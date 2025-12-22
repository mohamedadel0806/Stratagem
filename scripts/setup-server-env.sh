#!/bin/bash

# Setup server environment with local development passwords
# This creates a .env file with the same passwords as local development

set -e

cd /opt/stratagem

echo "🔧 Setting up server environment with local passwords..."
echo ""

# Create .env file with local development passwords
cat > .env << 'EOF'
# Application Secrets (CHANGE THESE IN PRODUCTION!)
NEXTAUTH_SECRET=dev-secret-change-in-production
JWT_SECRET=dev-jwt-secret-change-in-production

# Database Credentials (Same as local development)
POSTGRES_PASSWORD=password
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=password
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=password
REDIS_PASSWORD=
ELASTIC_PASSWORD=

# Keycloak Configuration
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=admin

# API Configuration (UPDATE WITH YOUR DOMAIN)
API_URL=http://localhost:8000
FRONTEND_URL=https://grc-staging.newmehub.com
NEXT_PUBLIC_API_URL=https://grc-staging.newmehub.com/api

# Kong Gateway Configuration
NEXT_PUBLIC_USE_KONG=true
NEXT_PUBLIC_KONG_URL=https://grc-staging.newmehub.com/api
NEXT_PUBLIC_PROXY_URL=/api/proxy

# Backend Configuration
BACKEND_URL=http://backend:3001
DATABASE_URL=postgresql://postgres:password@postgres:5432/grc_platform
MONGODB_URL=mongodb://admin:password@mongodb:27017/grc_documents?authSource=admin
NEO4J_URL=bolt://neo4j:7687
REDIS_URL=redis://redis:6379
ELASTICSEARCH_URL=http://elasticsearch:9200

# AI Service Configuration (if needed)
OPENAI_API_KEY=
HUGGINGFACE_API_KEY=

# Monitoring Configuration
PROMETHEUS_URL=http://localhost:9091
GRAFANA_URL=http://localhost:3010
GRAFANA_ADMIN_PASSWORD=admin
EOF

echo "✅ .env file created with local development passwords"
echo ""
echo "⚠️  IMPORTANT: Update FRONTEND_URL and NEXT_PUBLIC_API_URL with your actual domain!"
echo ""
echo "To edit: nano .env"











