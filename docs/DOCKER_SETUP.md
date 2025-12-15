# Docker Setup Guide

## Quick Start

### 1. Start Docker Desktop
- Open Docker Desktop application
- Wait for it to fully start (whale icon in menu bar should be steady)

### 2. Start Database Services
```bash
# Start just PostgreSQL (for basic functionality)
docker-compose up -d postgres

# Or start all services
docker-compose up -d
```

### 3. Check Database Status
```bash
docker-compose ps postgres
```

### 4. Run Migrations
```bash
cd backend
DB_HOST=localhost npm run migrate
```

### 5. Seed Database (Create Users)
```bash
cd backend
DB_HOST=localhost npm run seed
```

## Database Credentials

From `docker-compose.yml`:
- **Host:** `localhost` (when connecting from host) or `postgres` (from Docker network)
- **Port:** `5432`
- **Database:** `grc_platform`
- **Username:** `postgres`
- **Password:** `password`

## Default Login Credentials

After running the seed script:
- **Email:** `admin@grcplatform.com`
- **Password:** `password123`

## Docker Services

The platform uses these Docker services:
- **postgres** - PostgreSQL database (port 5432)
- **mongodb** - MongoDB for documents (port 27017)
- **neo4j** - Neo4j graph database (ports 7474, 7687)
- **redis** - Redis cache (port 6379)
- **elasticsearch** - Elasticsearch search engine (port 9200)
- **keycloak** - Keycloak authentication (port 8080)
- **kong** - API Gateway (port 8000)

## Troubleshooting

### Docker Not Running
```bash
# Start Docker Desktop manually
open -a Docker

# Or check if Docker is installed
docker --version
```

### Database Connection Issues
- Ensure Docker is running
- Check if postgres container is up: `docker ps | grep postgres`
- Check logs: `docker-compose logs postgres`

### Port Already in Use
If port 5432 is already in use:
```bash
# Check what's using the port
lsof -i :5432

# Stop local PostgreSQL if running
brew services stop postgresql  # macOS
```

## Environment Variables

The backend needs these environment variables (from `.env` or docker-compose):
- `DB_HOST=localhost` (when running backend locally)
- `DB_HOST=postgres` (when running backend in Docker)
- `POSTGRES_USER=postgres`
- `POSTGRES_PASSWORD=password`
- `POSTGRES_DB=grc_platform`








