# Docker Configuration for GRC Platform

This document contains all the Docker configurations needed for the Modern AI-Powered GRC Platform development environment.

## Main Docker Compose Configuration

### docker-compose.yml

```yaml
version: '3.8'

services:
  # Frontend - Next.js Application
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      target: development
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - NEXTAUTH_URL=http://localhost:3000
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - KEYCLOAK_URL=http://keycloak:8080
      - API_URL=http://kong:8000
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next
    depends_on:
      - backend
      - keycloak
    networks:
      - grc-network
    restart: unless-stopped

  # Backend - NestJS Services
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
      target: development
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=development
      - PORT=3001
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/grc_platform
      - MONGODB_URL=mongodb://admin:password@mongodb:27017/grc_documents?authSource=admin
      - NEO4J_URL=bolt://neo4j:7687
      - NEO4J_USERNAME=neo4j
      - NEO4J_PASSWORD=password
      - REDIS_URL=redis://redis:6379
      - ELASTICSEARCH_URL=http://elasticsearch:9200
      - JWT_SECRET=${JWT_SECRET}
      - KEYCLOAK_URL=http://keycloak:8080
    volumes:
      - ./backend:/app
      - /app/node_modules
    depends_on:
      - postgres
      - mongodb
      - neo4j
      - redis
      - elasticsearch
      - keycloak
    networks:
      - grc-network
    restart: unless-stopped

  # AI Service - FastAPI
  ai-service:
    build:
      context: ./ai-service
      dockerfile: Dockerfile
      target: development
    ports:
      - "3006:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/grc_platform
      - REDIS_URL=redis://redis:6379
      - ELASTICSEARCH_URL=http://elasticsearch:9200
      - PYTHONPATH=/app
    volumes:
      - ./ai-service:/app
    depends_on:
      - postgres
      - redis
      - elasticsearch
    networks:
      - grc-network
    restart: unless-stopped

  # API Gateway - Kong
  kong:
    image: kong:3.4
    ports:
      - "8000:8000"  # Kong proxy
      - "8001:8001"  # Admin API
      - "8443:8443"  # Kong proxy SSL
      - "8444:8444"  # Admin API SSL
    environment:
      - KONG_DATABASE=postgres
      - KONG_PG_HOST=postgres
      - KONG_PG_DATABASE=kong
      - KONG_PG_USER=kong
      - KONG_PG_PASSWORD=kong_password
      - KONG_PROXY_ACCESS_LOG=/dev/stdout
      - KONG_ADMIN_ACCESS_LOG=/dev/stdout
      - KONG_PROXY_ERROR_LOG=/dev/stderr
      - KONG_ADMIN_ERROR_LOG=/dev/stderr
      - KONG_ADMIN_LISTEN=0.0.0.0:8001
      - KONG_ADMIN_GUI_URL=http://localhost:8002
    volumes:
      - ./infrastructure/kong/kong.yml:/usr/local/kong/declarative/kong.yml
    depends_on:
      - postgres
    networks:
      - grc-network
    restart: unless-stopped

  # Authentication - Keycloak
  keycloak:
    image: quay.io/keycloak/keycloak:23.0
    ports:
      - "8080:8080"
    environment:
      - KEYCLOAK_ADMIN=admin
      - KEYCLOAK_ADMIN_PASSWORD=admin
      - KC_DB=postgres
      - KC_DB_URL=jdbc:postgresql://postgres:5432/keycloak
      - KC_DB_USERNAME=keycloak
      - KC_DB_PASSWORD=keycloak_password
      - KC_HOSTNAME=localhost
      - KC_HOSTNAME_PORT=8080
      - KC_HOSTNAME_STRICT_BACKCHANNEL=false
      - KC_HTTP_ENABLED=true
      - KC_HEALTH_ENABLED=true
    command:
      - start-dev
      - --http-enabled=true
      - --import-realm
    volumes:
      - ./infrastructure/keycloak/realm-export.json:/opt/keycloak/data/import/realm-export.json
    depends_on:
      - postgres
    networks:
      - grc-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health/ready"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Primary Database - PostgreSQL
  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=grc_platform
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_MULTIPLE_DATABASES=kong,keycloak
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./infrastructure/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql
      - ./infrastructure/postgres/create-multiple-postgresql-databases.sh:/docker-entrypoint-initdb.d/create-multiple-postgresql-databases.sh
    networks:
      - grc-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Document Database - MongoDB
  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password
      - MONGO_INITDB_DATABASE=grc_documents
    volumes:
      - mongodb_data:/data/db
      - ./infrastructure/mongodb/init-mongo.js:/docker-entrypoint-initdb.d/init-mongo.js
    networks:
      - grc-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Graph Database - Neo4j
  neo4j:
    image: neo4j:5.14-community
    ports:
      - "7474:7474"  # HTTP
      - "7687:7687"  # Bolt
    environment:
      - NEO4J_AUTH=neo4j/password
      - NEO4J_PLUGINS=["apoc", "graph-data-science"]
      - NEO4J_dbms_security_procedures_unrestricted=apoc.*,gds.*
      - NEO4J_dbms_memory_heap_initial__size=512m
      - NEO4J_dbms_memory_heap_max__size=2G
      - NEO4J_dbms_security_allow__csv__import__from__file__urls=true
    volumes:
      - neo4j_data:/data
      - neo4j_logs:/logs
      - neo4j_import:/var/lib/neo4j/import
      - neo4j_plugins:/plugins
      - ./infrastructure/neo4j/init.cypher:/var/lib/neo4j/import/init.cypher
    networks:
      - grc-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "cypher-shell", "-u", "neo4j", "-p", "password", "RETURN 1"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Cache & Message Queue - Redis
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server /usr/local/etc/redis/redis.conf
    volumes:
      - redis_data:/data
      - ./infrastructure/redis/redis.conf:/usr/local/etc/redis/redis.conf
    networks:
      - grc-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Search Engine - Elasticsearch
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
    ports:
      - "9200:9200"
      - "9300:9300"
    environment:
      - node.name=elasticsearch
      - cluster.name=grc-cluster
      - discovery.type=single-node
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms1g -Xmx1g"
      - xpack.security.enabled=false
      - xpack.security.enrollment.enabled=false
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
      - ./infrastructure/elasticsearch/init-elastic.sh:/usr/local/bin/init-elastic.sh
    networks:
      - grc-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:9200/_cluster/health || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 5

  # Monitoring - Prometheus
  prometheus:
    image: prom/prometheus:v2.40.0
    ports:
      - "9090:9090"
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=200h'
      - '--web.enable-lifecycle'
    volumes:
      - prometheus_data:/prometheus
      - ./monitoring/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - ./monitoring/prometheus/rules:/etc/prometheus/rules
    networks:
      - grc-network
    restart: unless-stopped

  # Monitoring - Grafana
  grafana:
    image: grafana/grafana:10.0.0
    ports:
      - "3010:3000"
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_USERS_ALLOW_SIGN_UP=false
      - GF_INSTALL_PLUGINS=grafana-clock-panel,grafana-simple-json-datasource
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/provisioning:/etc/grafana/provisioning
      - ./monitoring/grafana/dashboards:/var/lib/grafana/dashboards
    networks:
      - grc-network
    restart: unless-stopped
    depends_on:
      - prometheus

  # Kong Manager (Optional)
  kong-manager:
    image: pantsel/konga
    ports:
      - "8002:1337"
    environment:
      - NODE_ENV=development
      - KONGA_HOOK_TIMEOUT=10000
    networks:
      - grc-network
    depends_on:
      - kong
    restart: unless-stopped

networks:
  grc-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16

volumes:
  postgres_data:
  mongodb_data:
  neo4j_data:
  neo4j_logs:
  neo4j_import:
  neo4j_plugins:
  redis_data:
  elasticsearch_data:
  prometheus_data:
  grafana_data:
```

## Development Override Configuration

### docker-compose.dev.yml

```yaml
version: '3.8'

services:
  frontend:
    environment:
      - NODE_ENV=development
      - CHOKIDAR_USEPOLLING=true
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next
    command: npm run dev

  backend:
    environment:
      - NODE_ENV=development
    volumes:
      - ./backend:/app
      - /app/node_modules
    command: npm run start:dev

  ai-service:
    environment:
      - PYTHONPATH=/app
      - PYTHONDONTWRITEBYTECODE=1
    volumes:
      - ./ai-service:/app
    command: uvicorn main:app --host 0.0.0.0 --port 8000 --reload

  postgres:
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=grc_platform_dev
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password

  mongodb:
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_DATABASE=grc_documents_dev

  redis:
    ports:
      - "6379:6379"

  elasticsearch:
    ports:
      - "9200:9200"
    environment:
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"

  neo4j:
    ports:
      - "7474:7474"
      - "7687:7687"
    environment:
      - NEO4J_AUTH=neo4j/password
      - NEO4J_dbms_memory_heap_initial__size=256m
      - NEO4J_dbms_memory_heap_max__size=512m
```

## Production Configuration

### docker-compose.prod.yml

```yaml
version: '3.8'

services:
  frontend:
    build:
      target: production
    environment:
      - NODE_ENV=production
    volumes:
      - ./frontend/public:/app/public
    command: npm start

  backend:
    build:
      target: production
    environment:
      - NODE_ENV=production
    command: npm run start:prod

  ai-service:
    build:
      target: production
    environment:
      - PYTHONPATH=/app
    command: gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000

  postgres:
    environment:
      - POSTGRES_DB=grc_platform
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data_prod:/var/lib/postgresql/data

  mongodb:
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_ROOT_USERNAME}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_ROOT_PASSWORD}
    volumes:
      - mongodb_data_prod:/data/db

  redis:
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data_prod:/data

  elasticsearch:
    environment:
      - "ES_JAVA_OPTS=-Xms2g -Xmx2g"
      - xpack.security.enabled=true
      - ELASTIC_PASSWORD=${ELASTIC_PASSWORD}
    volumes:
      - elasticsearch_data_prod:/usr/share/elasticsearch/data

  neo4j:
    environment:
      - NEO4J_AUTH=${NEO4J_USERNAME}/${NEO4J_PASSWORD}
      - NEO4J_dbms_memory_heap_initial__size=1g
      - NEO4J_dbms_memory_heap_max__size=4g
    volumes:
      - neo4j_data_prod:/data

volumes:
  postgres_data_prod:
  mongodb_data_prod:
  neo4j_data_prod:
  redis_data_prod:
  elasticsearch_data_prod:
```

## Environment Variables

### .env.example

```bash
# Application Secrets
NEXTAUTH_SECRET=your-nextauth-secret-here
JWT_SECRET=your-jwt-secret-here

# Database Credentials
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

# API Configuration
API_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000

# AI Service Configuration
OPENAI_API_KEY=your-openai-api-key
HUGGINGFACE_API_KEY=your-huggingface-api-key

# Monitoring Configuration
PROMETHEUS_URL=http://localhost:9090
GRAFANA_URL=http://localhost:3010

# Development Settings
NODE_ENV=development
LOG_LEVEL=debug
```

## Dockerfiles

### Frontend Dockerfile (./frontend/Dockerfile)

```dockerfile
# Multi-stage build for Next.js application
FROM node:18-alpine AS base
# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]

# Development stage
FROM base AS development
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
```

### Backend Dockerfile (./backend/Dockerfile)

```dockerfile
# Multi-stage build for NestJS application
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Build the application
FROM base AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM base AS production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001
USER nestjs
EXPOSE 3001
CMD ["node", "dist/main.js"]

# Development stage
FROM base AS development
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3001
CMD ["npm", "run", "start:dev"]
```

### AI Service Dockerfile (./ai-service/Dockerfile)

```dockerfile
# Multi-stage build for FastAPI application
FROM python:3.11-slim AS base

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Development stage
FROM base AS development
WORKDIR /app
COPY --from=deps /app /app
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# Production stage
FROM base AS production
WORKDIR /app
COPY --from=deps /app /app
COPY . .
RUN adduser --disabled-password --gecos '' appuser && chown -R appuser /app
USER appuser
EXPOSE 8000
CMD ["gunicorn", "main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:8000"]
```

## Database Initialization Scripts

### PostgreSQL Init Script (./infrastructure/postgres/init.sql)

```sql
-- Main application database
CREATE DATABASE IF NOT EXISTS grc_platform;

-- Kong database
CREATE DATABASE IF NOT EXISTS kong;

-- Keycloak database
CREATE DATABASE IF NOT EXISTS keycloak;

-- Create users
CREATE USER IF NOT EXISTS kong WITH PASSWORD 'kong_password';
CREATE USER IF NOT EXISTS keycloak WITH PASSWORD 'keycloak_password';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE kong TO kong;
GRANT ALL PRIVILEGES ON DATABASE keycloak TO keycloak;

-- Switch to main database
\c grc_platform;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Create main tables
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100),
    industry VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_organizations (
    user_id UUID REFERENCES users(id),
    organization_id UUID REFERENCES organizations(id),
    role VARCHAR(50),
    PRIMARY KEY (user_id, organization_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_organizations_country ON organizations(country);
```

### MongoDB Init Script (./infrastructure/mongodb/init-mongo.js)

```javascript
// Switch to admin database and create admin user
db = db.getSiblingDB('admin');

// Create admin user if not exists
if (!db.getUser('admin')) {
    db.createUser({
        user: 'admin',
        pwd: 'password',
        roles: [
            {
                role: 'userAdminAnyDatabase',
                db: 'admin'
            },
            {
                role: 'readWriteAnyDatabase',
                db: 'admin'
            }
        ]
    });
}

// Switch to application database
db = db.getSiblingDB('grc_documents');

// Create collections with validation
db.createCollection('policies', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['title', 'content', 'status'],
            properties: {
                title: {
                    bsonType: 'string',
                    description: 'must be a string and is required'
                },
                content: {
                    bsonType: 'string',
                    description: 'must be a string and is required'
                },
                status: {
                    enum: ['draft', 'approved', 'published', 'archived'],
                    description: 'must be one of the enum values'
                },
                framework: {
                    bsonType: 'string',
                    description: 'compliance framework'
                },
                language: {
                    enum: ['en', 'ar'],
                    description: 'document language'
                }
            }
        }
    }
});

db.createCollection('compliance_reports', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['title', 'organization_id', 'framework'],
            properties: {
                title: {
                    bsonType: 'string',
                    description: 'must be a string and is required'
                },
                organization_id: {
                    bsonType: 'string',
                    description: 'organization identifier'
                },
                framework: {
                    bsonType: 'string',
                    description: 'compliance framework'
                }
            }
        }
    }
});

// Create indexes
db.policies.createIndex({ 'title': 'text', 'content': 'text' });
db.policies.createIndex({ 'framework': 1 });
db.policies.createIndex({ 'status': 1 });
db.policies.createIndex({ 'language': 1 });

db.compliance_reports.createIndex({ 'organization_id': 1 });
db.compliance_reports.createIndex({ 'framework': 1 });
db.compliance_reports.createIndex({ 'created_at': -1 });
```

### Neo4j Init Script (./infrastructure/neo4j/init.cypher)

```cypher
// Create constraints for uniqueness
CREATE CONSTRAINT IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE;
CREATE CONSTRAINT IF NOT EXISTS FOR (o:Organization) REQUIRE o.id IS UNIQUE;
CREATE CONSTRAINT IF NOT EXISTS FOR (p:Policy) REQUIRE p.id IS UNIQUE;
CREATE CONSTRAINT IF NOT EXISTS FOR (r:Risk) REQUIRE r.id IS UNIQUE;
CREATE CONSTRAINT IF NOT EXISTS FOR (c:Control) REQUIRE c.id IS UNIQUE;
CREATE CONSTRAINT IF NOT EXISTS FOR (req:Requirement) REQUIRE req.id IS UNIQUE;

// Create indexes for performance
CREATE INDEX IF NOT EXISTS FOR (u:User) ON (u.email);
CREATE INDEX IF NOT EXISTS FOR (o:Organization) ON (o.name);
CREATE INDEX IF NOT EXISTS FOR (p:Policy) ON (p.title);
CREATE INDEX IF NOT EXISTS FOR (r:Risk) ON (r.title);
CREATE INDEX IF NOT EXISTS FOR (c:Control) ON (c.title);
CREATE INDEX IF NOT EXISTS FOR (req:Requirement) ON (req.framework);

// Sample data for development
// Create sample organization
MERGE (org:Organization {id: 'org-1', name: 'Sample Bank', country: 'Saudi Arabia', industry: 'Financial Services'});

// Create sample compliance frameworks
MERGE (nca:Framework {name: 'NCA', description: 'National Cybersecurity Authority'});
MERGE (sama:Framework {name: 'SAMA', description: 'Saudi Arabian Monetary Authority'});
MERGE (adgm:Framework {name: 'ADGM', description: 'Abu Dhabi Global Market'});

// Create sample requirements
MERGE (req1:Requirement {id: 'req-1', code: 'NCA-001', title: 'Access Control', framework: 'NCA'});
MERGE (req2:Requirement {id: 'req-2', code: 'SAMA-001', title: 'Risk Assessment', framework: 'SAMA'});

// Create sample controls
MERGE (ctrl1:Control {id: 'ctrl-1', title: 'User Access Management', type: 'Technical'});
MERGE (ctrl2:Control {id: 'ctrl-2', title: 'Risk Assessment Process', type: 'Procedural'});

// Create relationships
MERGE (req1)-[:SATISFIED_BY]->(ctrl1);
MERGE (req2)-[:SATISFIED_BY]->(ctrl2);
MERGE (org)-[:COMPLIES_WITH]->(nca);
MERGE (org)-[:COMPLIES_WITH]->(sama);
```

### Redis Configuration (./infrastructure/redis/redis.conf)

```conf
# Basic Redis configuration
bind 0.0.0.0
port 6379
protected-mode no

# Memory management
maxmemory 256mb
maxmemory-policy allkeys-lru

# Persistence
save 900 1
save 300 10
save 60 10000

# Logging
loglevel notice
logfile ""

# Performance
tcp-keepalive 300
timeout 0

# Security (uncomment for production)
# requirepass your-redis-password

# Additional settings for development
lazyfree-lazy-eviction no
lazyfree-lazy-expire no
lazyfree-lazy-server-del no
replica-lazy-flush no
```

### Kong Configuration (./infrastructure/kong/kong.yml)

```yaml
_format_version: "3.0"

services:
- name: backend-service
  url: http://backend:3001
  plugins:
  - name: rate-limiting
    config:
      minute: 100
      hour: 1000

- name: ai-service
  url: http://ai-service:8000
  plugins:
  - name: rate-limiting
    config:
      minute: 50
      hour: 500

routes:
- name: backend-route
  service: backend-service
  paths:
  - /api
  methods:
  - GET
  - POST
  - PUT
  - DELETE
  - PATCH

- name: ai-route
  service: ai-service
  paths:
  - /ai
  methods:
  - GET
  - POST

plugins:
- name: cors
  config:
    origins:
    - "http://localhost:3000"
    methods:
    - GET
    - POST
    - PUT
    - DELETE
    - OPTIONS
    headers:
    - Accept
    - Accept-Version
    - Content-Length
    - Content-MD5
    - Content-Type
    - Date
    - Authorization
    - Host
    - X-API-Version
    - X-Requested-With
    credentials: true

- name: prometheus
  config:
    per_consumer: true
```

## Usage Instructions

### Starting the Development Environment

```bash
# Clone the repository
git clone <repository-url>
cd grc-platform

# Copy environment variables
cp .env.example .env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Accessing Services

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **AI Service**: http://localhost:3006
- **API Gateway**: http://localhost:8000
- **Kong Manager**: http://localhost:8002
- **Keycloak**: http://localhost:8080
- **PostgreSQL**: localhost:5432
- **MongoDB**: localhost:27017
- **Neo4j**: http://localhost:7474
- **Redis**: localhost:6379
- **Elasticsearch**: http://localhost:9200
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3010

### Development Workflow

```bash
# Start with development overrides
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Rebuild specific service
docker-compose up -d --build frontend

# Access container shell
docker-compose exec frontend sh

# View logs for specific service
docker-compose logs -f backend

# Run database migrations
docker-compose exec backend npm run migrate

# Seed database with test data
docker-compose exec backend npm run seed
```

This comprehensive Docker configuration provides a complete development environment for the Modern AI-Powered GRC Platform with all services running in Docker as requested.