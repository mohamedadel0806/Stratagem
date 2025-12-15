# Deployment Script Improvements

## Overview

The deployment scripts have been updated to automatically handle common database schema issues that occurred during deployments.

## What Was Fixed

### Common Issues Addressed

1. **Missing Columns**
   - `asset_requirement_mapping.created_at`
   - `policies.deleted_at`
   - `workflow_approvals.signature_data`
   - `policies.version_number`
   - `policies.next_review_date`
   - `policies.owner_id`
   - `policies.supersedes_policy_id`
   - `policies.updated_by`
   - `policies.content`
   - `policies.linked_influencers`
   - `workflow_approvals.created_by`

2. **Missing Enum Values**
   - `assessment_type_enum.operating_effectiveness`

3. **Keycloak Password Issues**
   - Automatic password reset for Keycloak database user

4. **Migration Conflicts**
   - Better handling of existing constraints and tables

## New Scripts

### 1. `fix-database-schema.sh`

Automatically fixes common database schema issues:
- Adds missing columns with proper defaults
- Fixes enum types
- Resets Keycloak password
- Attempts to run migrations (ignores expected errors)

**Usage:**
```bash
# On server
cd /opt/stratagem
./scripts/fix-database-schema.sh
```

### 2. `deploy-with-db-restore.sh`

Complete deployment with database restore:
- Exports local database
- Transfers code and database to server
- Restores database completely
- Rebuilds services
- Fixes schema issues
- Restarts services

**Usage:**
```bash
# From local machine
./scripts/deploy-with-db-restore.sh
```

## Updated Scripts

### `deploy-update.sh`

Now includes:
- Automatic database schema fixes after deployment
- Backend restart after schema fixes
- Better error handling

**Usage:**
```bash
./scripts/deploy-update.sh
```

### `import-database.sh`

Now includes:
- Automatic schema fixes after import
- Better error handling

**Usage:**
```bash
# On server
./scripts/import-database.sh database-import/export_YYYYMMDD_HHMMSS
```

## Deployment Workflow

### Option 1: Complete Deployment with Database Restore (Recommended for Fresh Deployments)

```bash
./scripts/deploy-with-db-restore.sh
```

This is the most comprehensive option and ensures:
- Local database is synced to server
- All schema issues are fixed
- Services are properly restarted

### Option 2: Code-Only Deployment (For Updates Without DB Changes)

```bash
./scripts/deploy-update.sh
```

This option:
- Updates code only
- Fixes schema issues automatically
- Faster deployment (~5-10 minutes)

### Option 3: Quick Single-Service Deployment

```bash
./scripts/deploy-quick.sh backend
./scripts/deploy-quick.sh frontend
./scripts/deploy-quick.sh ai-service
```

## Manual Schema Fixes

If you need to fix schema issues manually:

```bash
# SSH to server
ssh -i /path/to/key ubuntu@84.235.247.141

# Run fix script
cd /opt/stratagem
./scripts/fix-database-schema.sh
```

## Troubleshooting

### If schema fixes fail:

1. Check database connection:
   ```bash
   docker compose -f docker-compose.prod.yml ps postgres
   ```

2. Check logs:
   ```bash
   docker compose -f docker-compose.prod.yml logs backend | grep -i error
   ```

3. Manually fix specific columns:
   ```bash
   docker compose -f docker-compose.prod.yml exec postgres psql -U postgres -d grc_platform
   # Then run SQL commands to add missing columns
   ```

### If Keycloak fails to start:

1. Check password:
   ```bash
   docker compose -f docker-compose.prod.yml exec postgres psql -U postgres -c "ALTER USER keycloak WITH PASSWORD 'keycloak_password';"
   ```

2. Restart Keycloak:
   ```bash
   docker compose -f docker-compose.prod.yml restart keycloak
   ```

## Best Practices

1. **Always backup before deployment:**
   ```bash
   # On server
   cd /opt/stratagem
   ./scripts/backup-volumes.sh
   ```

2. **Use deploy-with-db-restore.sh for major changes:**
   - Ensures database is in sync
   - Handles all schema issues

3. **Use deploy-update.sh for code-only updates:**
   - Faster
   - Still fixes schema issues automatically

4. **Check logs after deployment:**
   ```bash
   docker compose -f docker-compose.prod.yml logs --tail 50 backend
   ```

## Summary

All deployment scripts now automatically handle:
- ✅ Missing database columns
- ✅ Schema mismatches
- ✅ Keycloak password issues
- ✅ Migration conflicts

You should no longer need to manually fix these issues after each deployment!




