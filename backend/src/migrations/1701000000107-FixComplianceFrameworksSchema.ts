import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration to fix compliance_frameworks table schema.
 * 
 * ROOT CAUSE: Two migrations created this table with different schemas:
 * - 1700000000004 created it with: name, code, description, region, organization_id (no version, framework_code, etc.)
 * - 1701000000005 checked if table exists, saw it did, and skipped creation
 * 
 * This migration ensures all columns exist as expected by the ComplianceFramework entity.
 */
export class FixComplianceFrameworksSchema1701000000107 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('compliance_frameworks');
    if (!table) {
      console.log('compliance_frameworks table does not exist, skipping');
      return;
    }

    // Add framework_code if missing (we already have a migration for this, but ensure it's here too)
    if (!table.findColumnByName('framework_code')) {
      await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        ADD COLUMN IF NOT EXISTS framework_code VARCHAR(100);
      `);

      // Copy from 'code' if it exists
      if (table.findColumnByName('code')) {
        await queryRunner.query(`
          UPDATE compliance_frameworks 
          SET framework_code = code 
          WHERE framework_code IS NULL AND code IS NOT NULL;
        `);
      }

      try {
        await queryRunner.query(`
          CREATE UNIQUE INDEX IF NOT EXISTS "IDX_compliance_frameworks_framework_code" 
          ON compliance_frameworks (framework_code) 
          WHERE framework_code IS NOT NULL;
        `);
      } catch (error) {
        // Index might already exist
      }
    }

    // Add version column if missing
    if (!table.findColumnByName('version')) {
      await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        ADD COLUMN IF NOT EXISTS version VARCHAR(50);
      `);
    }

    // Add issuing_authority if missing
    if (!table.findColumnByName('issuing_authority')) {
      await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        ADD COLUMN IF NOT EXISTS issuing_authority VARCHAR(300);
      `);
    }

    // Add effective_date if missing
    if (!table.findColumnByName('effective_date')) {
      await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        ADD COLUMN IF NOT EXISTS effective_date DATE;
      `);
    }

    // Add url if missing
    if (!table.findColumnByName('url')) {
      await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        ADD COLUMN IF NOT EXISTS url TEXT;
      `);
    }

    // Add status enum column if missing
    if (!table.findColumnByName('status')) {
      // First ensure the enum type exists
      await queryRunner.query(`
        DO $$ 
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'framework_status_enum') THEN
            CREATE TYPE framework_status_enum AS ENUM ('active', 'draft', 'deprecated');
          END IF;
        END $$;
      `);

      await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        ADD COLUMN IF NOT EXISTS status framework_status_enum DEFAULT 'active';
      `);
    }

    // Add structure (JSONB) if missing
    if (!table.findColumnByName('structure')) {
      await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        ADD COLUMN IF NOT EXISTS structure JSONB;
      `);
    }

    // Add tags array if missing
    if (!table.findColumnByName('tags')) {
      await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        ADD COLUMN IF NOT EXISTS tags VARCHAR[];
      `);
    }

    // Add created_by if missing
    if (!table.findColumnByName('created_by')) {
      await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        ADD COLUMN IF NOT EXISTS created_by UUID;
      `);
    }

    // Add updated_by if missing
    if (!table.findColumnByName('updated_by')) {
      await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        ADD COLUMN IF NOT EXISTS updated_by UUID;
      `);
    }

    // Add deleted_at if missing
    if (!table.findColumnByName('deleted_at')) {
      await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
      `);
    }

    // Fix created_at/createdAt mismatch - entity expects created_at
    const createdAtCamel = table.findColumnByName('createdAt');
    const createdAtSnake = table.findColumnByName('created_at');
    
    if (createdAtCamel && !createdAtSnake) {
      await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        RENAME COLUMN "createdAt" TO created_at;
      `);
    } else if (!createdAtSnake) {
      // Neither exists, add it
      await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
      `);
    }

    // Fix updated_at/updatedAt mismatch - entity expects updated_at
    const updatedAtCamel = table.findColumnByName('updatedAt');
    const updatedAtSnake = table.findColumnByName('updated_at');
    
    if (updatedAtCamel && !updatedAtSnake) {
      await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        RENAME COLUMN "updatedAt" TO updated_at;
      `);
    } else if (!updatedAtSnake) {
      // Neither exists, add it
      await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
      `);
    }

    // Ensure organizationId column exists (entity uses camelCase name)
    if (!table.findColumnByName('organizationId') && !table.findColumnByName('organization_id')) {
      await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        ADD COLUMN IF NOT EXISTS "organizationId" UUID;
      `);
    } else if (table.findColumnByName('organization_id') && !table.findColumnByName('organizationId')) {
      // If organization_id exists but not organizationId, add organizationId and copy data
      await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        ADD COLUMN IF NOT EXISTS "organizationId" UUID;
      `);
      await queryRunner.query(`
        UPDATE compliance_frameworks 
        SET "organizationId" = organization_id 
        WHERE "organizationId" IS NULL AND organization_id IS NOT NULL;
      `);
    }

    // Create indexes if missing
    try {
      await queryRunner.query(`
        CREATE INDEX IF NOT EXISTS "IDX_compliance_frameworks_framework_code" 
        ON compliance_frameworks (framework_code) 
        WHERE framework_code IS NOT NULL;
      `);
    } catch (error) {
      // Index might already exist
    }

    try {
      await queryRunner.query(`
        CREATE INDEX IF NOT EXISTS "IDX_compliance_frameworks_status" 
        ON compliance_frameworks (status);
      `);
    } catch (error) {
      // Index might already exist
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // This migration adds columns, rollback would drop them
    // But we keep them for data safety - manual rollback if needed
    console.log('Rollback not implemented - columns are kept for data safety');
  }
}


