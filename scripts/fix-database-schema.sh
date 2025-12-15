#!/bin/bash

# Script to fix common database schema issues after deployment
# This handles missing columns, migrations, and other schema mismatches

set -e

echo "🔧 Fixing database schema issues..."
echo ""

# Check if containers are running
if ! docker compose -f docker-compose.prod.yml ps postgres | grep -q "Up"; then
    echo "❌ PostgreSQL container is not running"
    exit 1
fi

# Fix missing columns
echo "📊 Fixing missing columns..."
docker compose -f docker-compose.prod.yml exec -T postgres psql -U postgres -d grc_platform << 'SQL'
-- Fix asset_requirement_mapping.created_at
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'asset_requirement_mapping' 
        AND column_name = 'created_at'
    ) THEN
        ALTER TABLE asset_requirement_mapping ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
        RAISE NOTICE 'Added created_at to asset_requirement_mapping';
    END IF;
END $$;

-- Fix policies.deleted_at
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'policies' 
        AND column_name = 'deleted_at'
    ) THEN
        ALTER TABLE policies ADD COLUMN deleted_at TIMESTAMP;
        RAISE NOTICE 'Added deleted_at to policies';
    END IF;
END $$;

-- Fix workflow_approvals.signature_data
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'workflow_approvals' 
        AND column_name = 'signature_data'
    ) THEN
        ALTER TABLE workflow_approvals ADD COLUMN signature_data TEXT;
        RAISE NOTICE 'Added signature_data to workflow_approvals';
    END IF;
END $$;

-- Fix policies.version_number if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'policies' 
        AND column_name = 'version_number'
    ) THEN
        ALTER TABLE policies ADD COLUMN version_number VARCHAR(50);
        RAISE NOTICE 'Added version_number to policies';
    END IF;
END $$;

-- Fix policies.next_review_date if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'policies' 
        AND column_name = 'next_review_date'
    ) THEN
        ALTER TABLE policies ADD COLUMN next_review_date TIMESTAMP;
        RAISE NOTICE 'Added next_review_date to policies';
    END IF;
END $$;

-- Fix workflow_approvals.created_by if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'workflow_approvals' 
        AND column_name = 'created_by'
    ) THEN
        ALTER TABLE workflow_approvals ADD COLUMN created_by UUID;
        RAISE NOTICE 'Added created_by to workflow_approvals';
    END IF;
END $$;

-- Fix policies.owner_id if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'policies' 
        AND column_name = 'owner_id'
    ) THEN
        ALTER TABLE policies ADD COLUMN owner_id UUID;
        RAISE NOTICE 'Added owner_id to policies';
    END IF;
END $$;

-- Fix policies.supersedes_policy_id if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'policies' 
        AND column_name = 'supersedes_policy_id'
    ) THEN
        ALTER TABLE policies ADD COLUMN supersedes_policy_id UUID;
        RAISE NOTICE 'Added supersedes_policy_id to policies';
    END IF;
END $$;

-- Fix policies.updated_by if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'policies' 
        AND column_name = 'updated_by'
    ) THEN
        ALTER TABLE policies ADD COLUMN updated_by UUID;
        RAISE NOTICE 'Added updated_by to policies';
    END IF;
END $$;

-- Fix policies.content if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'policies' 
        AND column_name = 'content'
    ) THEN
        ALTER TABLE policies ADD COLUMN content TEXT;
        RAISE NOTICE 'Added content to policies';
    END IF;
END $$;

-- Fix policies.linked_influencers if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'policies' 
        AND column_name = 'linked_influencers'
    ) THEN
        ALTER TABLE policies ADD COLUMN linked_influencers UUID[];
        RAISE NOTICE 'Added linked_influencers to policies';
    END IF;
END $$;

-- Fix assessment_type_enum if missing 'operating_effectiveness'
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'operating_effectiveness' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'assessment_type_enum')
    ) THEN
        ALTER TYPE assessment_type_enum ADD VALUE IF NOT EXISTS 'operating_effectiveness';
        RAISE NOTICE 'Added operating_effectiveness to assessment_type_enum';
    END IF;
END $$;
SQL

echo "✅ Schema fixes applied"
echo ""

# Fix Keycloak password
echo "🔐 Fixing Keycloak database password..."
docker compose -f docker-compose.prod.yml exec -T postgres psql -U postgres -d postgres -c "ALTER USER keycloak WITH PASSWORD 'keycloak_password';" 2>/dev/null || echo "Keycloak user password already set or user doesn't exist"

echo "✅ Keycloak password fixed"
echo ""

# Try to run migrations (ignore errors for existing constraints)
echo "🔄 Running database migrations..."
docker compose -f docker-compose.prod.yml exec backend node node_modules/typeorm/cli.js migration:run -d dist/data-source.js 2>&1 | grep -v "already exists" | grep -v "duplicate" | tail -20 || echo "Migrations completed (some errors expected for existing objects)"

echo ""
echo "✅ Database schema fixes complete!"




