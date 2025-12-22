"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixWorkflowApprovalColumnNames1701000000105 = void 0;
class FixWorkflowApprovalColumnNames1701000000105 {
    async up(queryRunner) {
        const table = await queryRunner.getTable('workflow_approvals');
        if (!table) {
            console.log('workflow_approvals table does not exist, skipping column rename');
            return;
        }
        const oldExecutionIdColumn = table.findColumnByName('workflow_execution_id');
        const newExecutionIdColumn = table.findColumnByName('workflowExecutionId');
        if (oldExecutionIdColumn && !newExecutionIdColumn) {
            await queryRunner.query(`
        ALTER TABLE workflow_approvals 
        RENAME COLUMN workflow_execution_id TO "workflowExecutionId";
      `);
        }
        const oldApproverIdColumn = table.findColumnByName('approver_id');
        const newApproverIdColumn = table.findColumnByName('approverId');
        if (oldApproverIdColumn && !newApproverIdColumn) {
            await queryRunner.query(`
        ALTER TABLE workflow_approvals 
        RENAME COLUMN approver_id TO "approverId";
      `);
        }
        const oldStepOrderColumn = table.findColumnByName('step_order');
        const newStepOrderColumn = table.findColumnByName('stepOrder');
        if (oldStepOrderColumn && !newStepOrderColumn) {
            await queryRunner.query(`
        ALTER TABLE workflow_approvals 
        RENAME COLUMN step_order TO "stepOrder";
      `);
        }
        const oldRespondedAtColumn = table.findColumnByName('responded_at');
        const newRespondedAtColumn = table.findColumnByName('respondedAt');
        if (oldRespondedAtColumn && !newRespondedAtColumn) {
            await queryRunner.query(`
        ALTER TABLE workflow_approvals 
        RENAME COLUMN responded_at TO "respondedAt";
      `);
        }
        const oldCreatedAtColumn = table.findColumnByName('created_at');
        const newCreatedAtColumn = table.findColumnByName('createdAt');
        if (oldCreatedAtColumn && !newCreatedAtColumn) {
            await queryRunner.query(`
        ALTER TABLE workflow_approvals 
        RENAME COLUMN created_at TO "createdAt";
      `);
        }
        const oldUpdatedAtColumn = table.findColumnByName('updated_at');
        const newUpdatedAtColumn = table.findColumnByName('updatedAt');
        if (oldUpdatedAtColumn && !newUpdatedAtColumn) {
            await queryRunner.query(`
        ALTER TABLE workflow_approvals 
        RENAME COLUMN updated_at TO "updatedAt";
      `);
        }
    }
    async down(queryRunner) {
        const table = await queryRunner.getTable('workflow_approvals');
        if (!table) {
            return;
        }
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
exports.FixWorkflowApprovalColumnNames1701000000105 = FixWorkflowApprovalColumnNames1701000000105;
//# sourceMappingURL=1701000000105-FixWorkflowApprovalColumnNames.js.map