import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration to fix timestamp column names in compliance_frameworks table.
 * The table may have both createdAt (camelCase) and created_at (snake_case),
 * but the entity expects created_at. This migration ensures only snake_case exists.
 */
export class FixComplianceFrameworksTimestampColumns1701000000108 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('compliance_frameworks');
    if (!table) {
      return;
    }

    // Fix created_at/createdAt mismatch
    const createdAtCamel = table.findColumnByName('createdAt');
    const createdAtSnake = table.findColumnByName('created_at');
    
    if (createdAtCamel && createdAtSnake) {
      // Both exist - drop the camelCase one (data should be in snake_case)
      await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        DROP COLUMN IF EXISTS "createdAt";
      `);
    } else if (createdAtCamel && !createdAtSnake) {
      // Only camelCase exists - rename it
      await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        RENAME COLUMN "createdAt" TO created_at;
      `);
    } else if (!createdAtSnake) {
      // Neither exists - add it
      await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
      `);
    }

    // Fix updated_at/updatedAt mismatch
    const updatedAtCamel = table.findColumnByName('updatedAt');
    const updatedAtSnake = table.findColumnByName('updated_at');
    
    if (updatedAtCamel && updatedAtSnake) {
      // Both exist - drop the camelCase one
      await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        DROP COLUMN IF EXISTS "updatedAt";
      `);
    } else if (updatedAtCamel && !updatedAtSnake) {
      // Only camelCase exists - rename it
      await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        RENAME COLUMN "updatedAt" TO updated_at;
      `);
    } else if (!updatedAtSnake) {
      // Neither exists - add it
      await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Rollback would rename back, but not needed
  }
}


