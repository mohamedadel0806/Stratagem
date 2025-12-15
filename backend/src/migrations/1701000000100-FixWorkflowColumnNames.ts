import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Fix workflow column naming mismatch
 * Database has camelCase but TypeORM expects snake_case
 */
export class FixWorkflowColumnNames1701000000100 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if columns exist and rename if needed
    const table = await queryRunner.getTable('workflows');
    
    if (!table) {
      // Table doesn't exist, create it with correct naming
      return;
    }

    // Get current column names
    const entityTypeColumn = table.findColumnByName('entityType');
    const entityTypeSnakeColumn = table.findColumnByName('entity_type');
    
    // If camelCase exists but snake_case doesn't, rename it
    if (entityTypeColumn && !entityTypeSnakeColumn) {
      await queryRunner.query(`
        ALTER TABLE workflows 
        RENAME COLUMN "entityType" TO entity_type;
      `);
    }

    // Fix other camelCase columns
    const daysBeforeDeadlineColumn = table.findColumnByName('daysBeforeDeadline');
    const daysBeforeDeadlineSnakeColumn = table.findColumnByName('days_before_deadline');
    
    if (daysBeforeDeadlineColumn && !daysBeforeDeadlineSnakeColumn) {
      await queryRunner.query(`
        ALTER TABLE workflows 
        RENAME COLUMN "daysBeforeDeadline" TO days_before_deadline;
      `);
    }

    const organizationIdColumn = table.findColumnByName('organizationId');
    const organizationIdSnakeColumn = table.findColumnByName('organization_id');
    
    if (organizationIdColumn && !organizationIdSnakeColumn) {
      await queryRunner.query(`
        ALTER TABLE workflows 
        RENAME COLUMN "organizationId" TO organization_id;
      `);
    }

    const createdByIdColumn = table.findColumnByName('createdById');
    const createdByIdSnakeColumn = table.findColumnByName('created_by_id');
    
    if (createdByIdColumn && !createdByIdSnakeColumn) {
      await queryRunner.query(`
        ALTER TABLE workflows 
        RENAME COLUMN "createdById" TO created_by_id;
      `);
    }

    const createdAtColumn = table.findColumnByName('createdAt');
    const createdAtSnakeColumn = table.findColumnByName('created_at');
    
    if (createdAtColumn && !createdAtSnakeColumn) {
      await queryRunner.query(`
        ALTER TABLE workflows 
        RENAME COLUMN "createdAt" TO created_at;
      `);
    }

    const updatedAtColumn = table.findColumnByName('updatedAt');
    const updatedAtSnakeColumn = table.findColumnByName('updated_at');
    
    if (updatedAtColumn && !updatedAtSnakeColumn) {
      await queryRunner.query(`
        ALTER TABLE workflows 
        RENAME COLUMN "updatedAt" TO updated_at;
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverse the changes if needed
    const table = await queryRunner.getTable('workflows');
    if (!table) return;

    // Revert column names back to camelCase
    if (table.findColumnByName('entity_type')) {
      await queryRunner.query(`ALTER TABLE workflows RENAME COLUMN entity_type TO "entityType";`);
    }
    if (table.findColumnByName('days_before_deadline')) {
      await queryRunner.query(`ALTER TABLE workflows RENAME COLUMN days_before_deadline TO "daysBeforeDeadline";`);
    }
    if (table.findColumnByName('organization_id')) {
      await queryRunner.query(`ALTER TABLE workflows RENAME COLUMN organization_id TO "organizationId";`);
    }
    if (table.findColumnByName('created_by_id')) {
      await queryRunner.query(`ALTER TABLE workflows RENAME COLUMN created_by_id TO "createdById";`);
    }
    if (table.findColumnByName('created_at')) {
      await queryRunner.query(`ALTER TABLE workflows RENAME COLUMN created_at TO "createdAt";`);
    }
    if (table.findColumnByName('updated_at')) {
      await queryRunner.query(`ALTER TABLE workflows RENAME COLUMN updated_at TO "updatedAt";`);
    }
  }
}




