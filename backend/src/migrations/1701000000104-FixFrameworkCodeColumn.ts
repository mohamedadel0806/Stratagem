import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration to ensure framework_code column exists in compliance_frameworks table.
 * The table might have been created by an earlier migration (1700000000004) with just 'code',
 * but the entity expects 'framework_code'. This migration ensures the column exists.
 */
export class FixFrameworkCodeColumn1701000000104 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if framework_code column exists
    const table = await queryRunner.getTable('compliance_frameworks');
    const frameworkCodeColumn = table?.findColumnByName('framework_code');

    if (!frameworkCodeColumn) {
      // Add framework_code column if it doesn't exist
      await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        ADD COLUMN IF NOT EXISTS framework_code VARCHAR(100);
      `);

      // If 'code' column exists, copy its data to framework_code, then we can optionally drop 'code' later
      const codeColumn = table?.findColumnByName('code');
      if (codeColumn) {
        await queryRunner.query(`
          UPDATE compliance_frameworks 
          SET framework_code = code 
          WHERE framework_code IS NULL AND code IS NOT NULL;
        `);
      }

      // Make framework_code unique if it's not already
      try {
        await queryRunner.query(`
          CREATE UNIQUE INDEX IF NOT EXISTS "IDX_compliance_frameworks_framework_code" 
          ON compliance_frameworks (framework_code) 
          WHERE framework_code IS NOT NULL;
        `);
      } catch (error) {
        // Index might already exist, ignore
        console.log('Index creation skipped (may already exist)');
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the framework_code column if rollback is needed
    const table = await queryRunner.getTable('compliance_frameworks');
    const frameworkCodeColumn = table?.findColumnByName('framework_code');
    
    if (frameworkCodeColumn) {
      await queryRunner.query(`
        DROP INDEX IF EXISTS "IDX_compliance_frameworks_framework_code";
      `);
      
      await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        DROP COLUMN IF EXISTS framework_code;
      `);
    }
  }
}


