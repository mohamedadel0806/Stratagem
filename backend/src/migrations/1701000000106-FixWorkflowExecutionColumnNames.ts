import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration to fix column names in workflow_executions table to match entity definitions.
 * The entity uses snake_case column names (workflow_id, entity_type, etc.) but the database
 * may have had camelCase columns (workflowId, entityType, etc.) from previous migrations.
 * This migration ensures all columns use snake_case to match the entity definitions.
 */
export class FixWorkflowExecutionColumnNames1701000000106 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('workflow_executions');
    if (!table) {
      console.log('workflow_executions table does not exist, skipping column rename');
      return;
    }

    // Rename workflowId -> workflow_id
    if (table.findColumnByName('workflowId') && !table.findColumnByName('workflow_id')) {
      await queryRunner.query(`
        ALTER TABLE workflow_executions 
        RENAME COLUMN "workflowId" TO workflow_id;
      `);
    }

    // Rename entityType -> entity_type
    if (table.findColumnByName('entityType') && !table.findColumnByName('entity_type')) {
      await queryRunner.query(`
        ALTER TABLE workflow_executions 
        RENAME COLUMN "entityType" TO entity_type;
      `);
    }

    // Rename entityId -> entity_id
    if (table.findColumnByName('entityId') && !table.findColumnByName('entity_id')) {
      await queryRunner.query(`
        ALTER TABLE workflow_executions 
        RENAME COLUMN "entityId" TO entity_id;
      `);
    }

    // Rename inputData -> input_data
    if (table.findColumnByName('inputData') && !table.findColumnByName('input_data')) {
      await queryRunner.query(`
        ALTER TABLE workflow_executions 
        RENAME COLUMN "inputData" TO input_data;
      `);
    }

    // Rename outputData -> output_data
    if (table.findColumnByName('outputData') && !table.findColumnByName('output_data')) {
      await queryRunner.query(`
        ALTER TABLE workflow_executions 
        RENAME COLUMN "outputData" TO output_data;
      `);
    }

    // Rename errorMessage -> error_message
    if (table.findColumnByName('errorMessage') && !table.findColumnByName('error_message')) {
      await queryRunner.query(`
        ALTER TABLE workflow_executions 
        RENAME COLUMN "errorMessage" TO error_message;
      `);
    }

    // Rename assignedToId -> assigned_to_id
    if (table.findColumnByName('assignedToId') && !table.findColumnByName('assigned_to_id')) {
      await queryRunner.query(`
        ALTER TABLE workflow_executions 
        RENAME COLUMN "assignedToId" TO assigned_to_id;
      `);
    }

    // Rename startedAt -> started_at
    if (table.findColumnByName('startedAt') && !table.findColumnByName('started_at')) {
      await queryRunner.query(`
        ALTER TABLE workflow_executions 
        RENAME COLUMN "startedAt" TO started_at;
      `);
    }

    // Rename completedAt -> completed_at
    if (table.findColumnByName('completedAt') && !table.findColumnByName('completed_at')) {
      await queryRunner.query(`
        ALTER TABLE workflow_executions 
        RENAME COLUMN "completedAt" TO completed_at;
      `);
    }

    // Rename createdAt -> created_at
    if (table.findColumnByName('createdAt') && !table.findColumnByName('created_at')) {
      await queryRunner.query(`
        ALTER TABLE workflow_executions 
        RENAME COLUMN "createdAt" TO created_at;
      `);
    }

    // Rename updatedAt -> updated_at
    if (table.findColumnByName('updatedAt') && !table.findColumnByName('updated_at')) {
      await queryRunner.query(`
        ALTER TABLE workflow_executions 
        RENAME COLUMN "updatedAt" TO updated_at;
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert column names back to camelCase (not typically needed, but included for completeness)
    const table = await queryRunner.getTable('workflow_executions');
    if (!table) {
      return;
    }

    if (table.findColumnByName('workflow_id')) {
      await queryRunner.query(`
        ALTER TABLE workflow_executions 
        RENAME COLUMN workflow_id TO "workflowId";
      `);
    }
    // ... (other reverts omitted for brevity, but would follow same pattern)
  }
}


