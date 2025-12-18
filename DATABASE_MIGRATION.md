# Database Migration Guide

This guide explains how to migrate your database data from local development to the production server.

## Local Development Passwords

The following passwords are used in local development (same as production setup):

- **PostgreSQL**: `postgres` / `password`
- **MongoDB**: `admin` / `password`
- **Neo4j**: `neo4j` / `password`
- **Redis**: No password
- **Elasticsearch**: No password
- **Kong**: `kong` / `kong`
- **Keycloak**: `admin` / `admin`

## Option 1: Export and Import Database Data

### Step 1: Export Database from Local

```bash
# From your local project directory
./scripts/export-database.sh
```

This will create a directory `./database-export/export_YYYYMMDD_HHMMSS/` with:
- PostgreSQL dumps (grc_platform, kong, keycloak)
- MongoDB archive
- Neo4j export (if available)

### Step 2: Transfer to Server

```bash
# Transfer the export directory
scp -i /Users/adelsayed/Downloads/AWS/ssh-oracle-24.key -r \
  ./database-export/export_* \
  ubuntu@84.235.247.141:/opt/stratagem/database-import/latest
```

### Step 3: Import on Server

```bash
# SSH into server
ssh -i /Users/adelsayed/Downloads/AWS/ssh-oracle-24.key ubuntu@84.235.247.141

# Navigate to app directory
cd /opt/stratagem

# Start database containers first
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d postgres mongodb neo4j

# Wait for databases to be ready
sleep 10

# Import database
chmod +x scripts/import-database.sh
./scripts/import-database.sh database-import/latest
```

## Option 2: Seed Database on Server (Fresh Start)

If you don't need to migrate existing data, you can seed the database with initial data:

```bash
# SSH into server
ssh -i /Users/adelsayed/Downloads/AWS/ssh-oracle-24.key ubuntu@84.235.247.141

# Navigate to app directory
cd /opt/stratagem

# Start all services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Wait for services to be ready
sleep 15

# Seed database
docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec backend npm run seed
```

### Default Seed Accounts

After seeding, you can login with these accounts (password: `password123`):

- `admin@grcplatform.com` - Super Admin
- `compliance@grcplatform.com` - Compliance Officer
- `risk@grcplatform.com` - Risk Manager
- `auditor@grcplatform.com` - Auditor
- `user@grcplatform.com` - Regular User
- `demo@grcplatform.com` - Demo Account

## Quick Setup Script

For a complete automated setup:

```bash
# From local machine
./scripts/transfer-and-setup-server.sh
```

This script will:
1. Export your local database
2. Transfer export and setup scripts to server
3. Provide next steps

## Manual Setup on Server

### 1. Setup Environment

```bash
cd /opt/stratagem
chmod +x scripts/*.sh
./scripts/setup-server-env.sh
nano .env  # Update FRONTEND_URL and NEXT_PUBLIC_API_URL
```

### 2. Build and Start

```bash
# Build images
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### 3. Import or Seed Database

**Option A: Import existing data**
```bash
./scripts/import-database.sh database-import/latest
```

**Option B: Seed fresh data**
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec backend npm run seed
```

## Troubleshooting

### Database Connection Issues

```bash
# Check if databases are running
docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps

# Check database logs
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs postgres
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs mongodb
```

### Import Errors

If import fails, you may need to:
1. Drop existing databases first
2. Recreate databases
3. Then import

```bash
# Drop and recreate PostgreSQL databases
docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec postgres psql -U postgres -c "DROP DATABASE IF EXISTS grc_platform;"
docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec postgres psql -U postgres -c "CREATE DATABASE grc_platform;"
```

### Seed Script Errors

If seed script fails:
```bash
# Check backend logs
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs backend

# Run migrations first
docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec backend npm run migration:run
```

## Data Persistence

All database data is stored in Docker volumes:
- `postgres_data_prod` - PostgreSQL data
- `mongodb_data_prod` - MongoDB data
- `neo4j_data_prod` - Neo4j data

These volumes persist even if containers are stopped/removed.

## Backup Before Import

Always backup existing data before importing:

```bash
cd /opt/stratagem
./scripts/backup-volumes.sh
```

This creates a backup in `./backups/backup_YYYYMMDD_HHMMSS/`









