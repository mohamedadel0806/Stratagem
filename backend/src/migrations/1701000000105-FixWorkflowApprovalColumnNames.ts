import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration to fix column name mismatches in workflow_approvals table.
 * The migration created columns with snake_case (workflow_execution_id, approver_id, etc.)
 * but the entity explicitly specifies camelCase names (workflowExecutionId, approverId, etc.).
 * This migration renames columns to match the entity definitions.
 */
export class FixWorkflowApprovalColumnNames1701000000105 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('workflow_approvals');
    if (!table) {
      console.log('workflow_approvals table does not exist, skipping column rename');
      return;
    }

    // Check and rename workflow_execution_id to workflowExecutionId
    const oldExecutionIdColumn = table.findColumnByName('workflow_execution_id');
    const newExecutionIdColumn = table.findColumnByName('workflowExecutionId');
    
    if (oldExecutionIdColumn && !newExecutionIdColumn) {
      await queryRunner.query(`
        ALTER TABLE workflow_approvals 
        RENAME COLUMN workflow_execution_id TO "workflowExecutionId";
      `);
    }

    // Check and rename approver_id to approverId
    const oldApproverIdColumn = table.findColumnByName('approver_id');
    const newApproverIdColumn = table.findColumnByName('approverId');
    
    if (oldApproverIdColumn && !newApproverIdColumn) {
      await queryRunner.query(`
        ALTER TABLE workflow_approvals 
        RENAME COLUMN approver_id TO "approverId";
      `);
    }

    // Check and rename step_order to stepOrder
    const oldStepOrderColumn = table.findColumnByName('step_order');
    const newStepOrderColumn = table.findColumnByName('stepOrder');
    
    if (oldStepOrderColumn && !newStepOrderColumn) {
      await queryRunner.query(`
        ALTER TABLE workflow_approvals 
        RENAME COLUMN step_order TO "stepOrder";
      `);
    }

    // Check and rename responded_at to respondedAt
    const oldRespondedAtColumn = table.findColumnByName('responded_at');
    const newRespondedAtColumn = table.findColumnByName('respondedAt');
    
    if (oldRespondedAtColumn && !newRespondedAtColumn) {
      await queryRunner.query(`
        ALTER TABLE workflow_approvals 
        RENAME COLUMN responded_at TO "respondedAt";
      `);
    }

    // Check and rename created_at to createdAt
    const oldCreatedAtColumn = table.findColumnByName('created_at');
    const newCreatedAtColumn = table.findColumnByName('createdAt');
    
    if (oldCreatedAtColumn && !newCreatedAtColumn) {
      await queryRunner.query(`
        ALTER TABLE workflow_approvals 
        RENAME COLUMN created_at TO "createdAt";
      `);
    }

    // Check and rename updated_at to updatedAt
    const oldUpdatedAtColumn = table.findColumnByName('updated_at');
    const newUpdatedAtColumn = table.findColumnByName('updatedAt');
    
    if (oldUpdatedAtColumn && !newUpdatedAtColumn) {
      await queryRunner.query(`
        ALTER TABLE workflow_approvals 
        RENAME COLUMN updated_at TO "updatedAt";
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('workflow_approvals');
    if (!table) {
      return;
    }

    // Revert column names back to snake_case
    if (table.findColumnByName('workflowExecutionId')) {
      await queryRunner.query(`
        ALTER TABLE workflow_approvals 
        RENAME COLUMN "workflowExecutionId" TO workflow_execution_id;
      `);
    }

    if (table.findColumnByName('approverId')) {
      await queryRunner.query(`
        ALTER TABLE workflow_approvals 
        RENAME COLUMN "approverId" TO approver_id;
      `);
    }

    if (table.findColumnByName('stepOrder')) {
      await queryRunner.query(`
        ALTER TABLE workflow_approvals 
        RENAME COLUMN "stepOrder" TO step_order;
      `);
    }

    if (table.findColumnByName('respondedAt')) {
      await queryRunner.query(`
        ALTER TABLE workflow_approvals 
        RENAME COLUMN "respondedAt" TO responded_at;
      `);
    }

    if (table.findColumnByName('createdAt')) {
      await queryRunner.query(`
        ALTER TABLE workflow_approvals 
        RENAME COLUMN "createdAt" TO created_at;
      `);
    }

    if (table.findColumnByName('updatedAt')) {
      await queryRunner.query(`
        ALTER TABLE workflow_approvals 
        RENAME COLUMN "updatedAt" TO updated_at;
      `);
    }
  }
}


