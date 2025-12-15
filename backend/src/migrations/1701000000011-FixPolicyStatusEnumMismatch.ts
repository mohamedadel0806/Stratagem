import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration to fix Policy Status Enum mismatch between old Policy entity and Governance Policy entity
 * 
 * Issue: 
 * - Old Policy entity uses `policies_status_enum`: draft, active, under_review, archived
 * - Governance Policy entity uses `policy_status_enum`: draft, in_review, approved, published, archived
 * - Both entities use the same `policies` table, causing conflicts
 * 
 * This migration:
 * 1. Checks which enum type the policies table is currently using
 * 2. Migrates status values from old enum to new Governance enum:
 *    - 'active' → 'published'
 *    - 'under_review' → 'in_review'
 *    - 'draft' → 'draft' (no change)
 *    - 'archived' → 'archived' (no change)
 * 3. Changes the column type from `policies_status_enum` to `policy_status_enum`
 * 4. Optionally drops the old enum type if no longer needed
 */
export class FixPolicyStatusEnumMismatch1701000000011 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if policies table exists
    const policiesTableExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'policies'
      );
    `);

    if (!policiesTableExists[0].exists) {
      console.log('Policies table does not exist, skipping migration');
      return;
    }

    // Check which enum type the status column is using
    const columnInfo = await queryRunner.query(`
      SELECT udt_name 
      FROM information_schema.columns 
      WHERE table_name = 'policies' 
      AND column_name = 'status';
    `);

    if (columnInfo.length === 0) {
      console.log('Status column not found in policies table, skipping migration');
      return;
    }

    const currentEnumType = columnInfo[0].udt_name;
    console.log(`Current enum type for policies.status: ${currentEnumType}`);

    // If already using the Governance enum, skip migration
    if (currentEnumType === 'policy_status_enum') {
      console.log('Policies table already uses policy_status_enum, skipping migration');
      return;
    }

    // Check if old enum type exists
    const oldEnumExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'policies_status_enum'
      );
    `);

    // Check if new Governance enum type exists
    const newEnumExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'policy_status_enum'
      );
    `);

    if (!newEnumExists[0].exists) {
      console.log('ERROR: policy_status_enum does not exist. Cannot migrate.');
      throw new Error('policy_status_enum must exist before migration');
    }

    // Get current status distribution
    const statusCounts = await queryRunner.query(`
      SELECT status::text as status, COUNT(*) as count 
      FROM policies 
      GROUP BY status
      ORDER BY count DESC;
    `);

    console.log('Current policy status distribution:', statusCounts);

    // Step 1: Check counts before conversion
    const activeCount = await queryRunner.query(`
      SELECT COUNT(*) as count 
      FROM policies 
      WHERE status::text = 'active';
    `);

    const underReviewCount = await queryRunner.query(`
      SELECT COUNT(*) as count 
      FROM policies 
      WHERE status::text = 'under_review';
    `);

    console.log(`Found ${activeCount[0].count} policies with 'active' status`);
    console.log(`Found ${underReviewCount[0].count} policies with 'under_review' status`);

    // Step 2: Convert column to text temporarily
    console.log('Converting status column to text for migration...');
    await queryRunner.query(`
      ALTER TABLE policies ALTER COLUMN status TYPE text;
    `);

    // Step 3: Update old enum values to new ones
    if (activeCount[0].count > 0) {
      console.log(`Migrating ${activeCount[0].count} policies from 'active' to 'published'`);
      await queryRunner.query(`
        UPDATE policies SET status = 'published' WHERE status = 'active';
      `);
    }

    if (underReviewCount[0].count > 0) {
      console.log(`Migrating ${underReviewCount[0].count} policies from 'under_review' to 'in_review'`);
      await queryRunner.query(`
        UPDATE policies SET status = 'in_review' WHERE status = 'under_review';
      `);
    }

    // Step 4: Change column type to new Governance enum
    // First, drop the default value, then change type, then restore default
    console.log('Changing status column type to policy_status_enum');
    
    // Drop default value first
    await queryRunner.query(`
      ALTER TABLE policies 
      ALTER COLUMN status DROP DEFAULT;
    `);
    
    // Change column type
    await queryRunner.query(`
      ALTER TABLE policies 
      ALTER COLUMN status TYPE policy_status_enum 
      USING status::text::policy_status_enum;
    `);
    
    // Restore default value
    await queryRunner.query(`
      ALTER TABLE policies 
      ALTER COLUMN status SET DEFAULT 'draft'::policy_status_enum;
    `);

    // Step 3: Optionally drop old enum type if not used elsewhere
    // (We'll keep it for now to be safe, but can be dropped later if confirmed unused)
    console.log('Policy status enum migration completed successfully');
    console.log('Note: Old enum type policies_status_enum is kept for safety. Can be dropped later if confirmed unused.');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Rollback: Revert to old enum type
    // Note: This will fail if old enum values don't exist
    console.log('Rollback: Reverting to policies_status_enum (if exists)');
    
    // Check if old enum exists
    const oldEnumExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'policies_status_enum'
      );
    `);

    if (oldEnumExists[0].exists) {
      // Convert published back to active, in_review back to under_review
      await queryRunner.query(`
        ALTER TABLE policies ALTER COLUMN status TYPE text;
      `);
      await queryRunner.query(`
        UPDATE policies SET status = 'active' WHERE status = 'published';
      `);
      await queryRunner.query(`
        UPDATE policies SET status = 'under_review' WHERE status = 'in_review';
      `);
      await queryRunner.query(`
        ALTER TABLE policies 
        ALTER COLUMN status TYPE policies_status_enum 
        USING status::text::policies_status_enum;
      `);
      console.log('Reverted to policies_status_enum');
    } else {
      console.log('WARNING: policies_status_enum does not exist. Cannot rollback.');
    }
  }
}

