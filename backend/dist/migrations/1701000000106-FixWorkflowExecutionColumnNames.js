"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixWorkflowExecutionColumnNames1701000000106 = void 0;
class FixWorkflowExecutionColumnNames1701000000106 {
    async up(queryRunner) {
        const table = await queryRunner.getTable('workflow_executions');
        if (!table) {
            console.log('workflow_executions table does not exist, skipping column rename');
            return;
        }
        if (table.findColumnByName('workflowId') && !table.findColumnByName('workflow_id')) {
            await queryRunner.query(`
        ALTER TABLE workflow_executions 
        RENAME COLUMN "workflowId" TO workflow_id;
      `);
        }
        if (table.findColumnByName('entityType') && !table.findColumnByName('entity_type')) {
            await queryRunner.query(`
        ALTER TABLE workflow_executions 
        RENAME COLUMN "entityType" TO entity_type;
      `);
        }
        if (table.findColumnByName('entityId') && !table.findColumnByName('entity_id')) {
            await queryRunner.query(`
        ALTER TABLE workflow_executions 
        RENAME COLUMN "entityId" TO entity_id;
      `);
        }
        if (table.findColumnByName('inputData') && !table.findColumnByName('input_data')) {
            await queryRunner.query(`
        ALTER TABLE workflow_executions 
        RENAME COLUMN "inputData" TO input_data;
      `);
        }
        if (table.findColumnByName('outputData') && !table.findColumnByName('output_data')) {
            await queryRunner.query(`
        ALTER TABLE workflow_executions 
        RENAME COLUMN "outputData" TO output_data;
      `);
        }
        if (table.findColumnByName('errorMessage') && !table.findColumnByName('error_message')) {
            await queryRunner.query(`
        ALTER TABLE workflow_executions 
        RENAME COLUMN "errorMessage" TO error_message;
      `);
        }
        if (table.findColumnByName('assignedToId') && !table.findColumnByName('assigned_to_id')) {
            await queryRunner.query(`
        ALTER TABLE workflow_executions 
        RENAME COLUMN "assignedToId" TO assigned_to_id;
      `);
        }
        if (table.findColumnByName('startedAt') && !table.findColumnByName('started_at')) {
            await queryRunner.query(`
        ALTER TABLE workflow_executions 
        RENAME COLUMN "startedAt" TO started_at;
      `);
        }
        if (table.findColumnByName('completedAt') && !table.findColumnByName('completed_at')) {
            await queryRunner.query(`
        ALTER TABLE workflow_executions 
        RENAME COLUMN "completedAt" TO completed_at;
      `);
        }
        if (table.findColumnByName('createdAt') && !table.findColumnByName('created_at')) {
            await queryRunner.query(`
        ALTER TABLE workflow_executions 
        RENAME COLUMN "createdAt" TO created_at;
      `);
        }
        if (table.findColumnByName('updatedAt') && !table.findColumnByName('updated_at')) {
            await queryRunner.query(`
        ALTER TABLE workflow_executions 
        RENAME COLUMN "updatedAt" TO updated_at;
      `);
        }
    }
    async down(queryRunner) {
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
    }
}
exports.FixWorkflowExecutionColumnNames1701000000106 = FixWorkflowExecutionColumnNames1701000000106;
//# sourceMappingURL=1701000000106-FixWorkflowExecutionColumnNames.js.map