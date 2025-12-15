"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateWorkflowTables1700000000009 = void 0;
const typeorm_1 = require("typeorm");
class CreateWorkflowTables1700000000009 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'workflows',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'name',
                    type: 'varchar',
                    length: '255',
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'type',
                    type: 'enum',
                    enum: ['approval', 'notification', 'escalation', 'status_change', 'deadline_reminder'],
                },
                {
                    name: 'status',
                    type: 'enum',
                    enum: ['active', 'inactive', 'archived'],
                    default: "'active'",
                },
                {
                    name: 'trigger',
                    type: 'enum',
                    enum: ['manual', 'on_create', 'on_update', 'on_status_change', 'on_deadline_approaching', 'on_deadline_passed', 'scheduled'],
                },
                {
                    name: 'entity_type',
                    type: 'enum',
                    enum: ['risk', 'policy', 'compliance_requirement', 'task'],
                },
                {
                    name: 'conditions',
                    type: 'jsonb',
                    isNullable: true,
                },
                {
                    name: 'actions',
                    type: 'jsonb',
                    isNullable: true,
                },
                {
                    name: 'days_before_deadline',
                    type: 'int',
                    isNullable: true,
                },
                {
                    name: 'organization_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'created_by_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }), true);
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'workflow_executions',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'workflow_id',
                    type: 'uuid',
                },
                {
                    name: 'entity_type',
                    type: 'varchar',
                    length: '255',
                },
                {
                    name: 'entity_id',
                    type: 'uuid',
                },
                {
                    name: 'status',
                    type: 'enum',
                    enum: ['pending', 'in_progress', 'completed', 'failed', 'cancelled'],
                    default: "'pending'",
                },
                {
                    name: 'input_data',
                    type: 'jsonb',
                    isNullable: true,
                },
                {
                    name: 'output_data',
                    type: 'jsonb',
                    isNullable: true,
                },
                {
                    name: 'error_message',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'assigned_to_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'started_at',
                    type: 'timestamp',
                    isNullable: true,
                },
                {
                    name: 'completed_at',
                    type: 'timestamp',
                    isNullable: true,
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }), true);
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'workflow_approvals',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'workflow_execution_id',
                    type: 'uuid',
                },
                {
                    name: 'approver_id',
                    type: 'uuid',
                },
                {
                    name: 'status',
                    type: 'enum',
                    enum: ['pending', 'approved', 'rejected', 'cancelled'],
                    default: "'pending'",
                },
                {
                    name: 'comments',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'step_order',
                    type: 'int',
                },
                {
                    name: 'responded_at',
                    type: 'timestamp',
                    isNullable: true,
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }), true);
        await queryRunner.createForeignKey('workflows', new typeorm_1.TableForeignKey({
            columnNames: ['created_by_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createForeignKey('workflow_executions', new typeorm_1.TableForeignKey({
            columnNames: ['workflow_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'workflows',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('workflow_executions', new typeorm_1.TableForeignKey({
            columnNames: ['assigned_to_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createForeignKey('workflow_approvals', new typeorm_1.TableForeignKey({
            columnNames: ['workflow_execution_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'workflow_executions',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('workflow_approvals', new typeorm_1.TableForeignKey({
            columnNames: ['approver_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createIndex('workflows', new typeorm_1.TableIndex({
            name: 'IDX_WORKFLOWS_TYPE_STATUS',
            columnNames: ['type', 'status'],
        }));
        await queryRunner.createIndex('workflows', new typeorm_1.TableIndex({
            name: 'IDX_WORKFLOWS_ENTITY_TYPE',
            columnNames: ['entity_type'],
        }));
        await queryRunner.createIndex('workflow_executions', new typeorm_1.TableIndex({
            name: 'IDX_WORKFLOW_EXECUTIONS_ENTITY',
            columnNames: ['entity_type', 'entity_id'],
        }));
        await queryRunner.createIndex('workflow_executions', new typeorm_1.TableIndex({
            name: 'IDX_WORKFLOW_EXECUTIONS_STATUS',
            columnNames: ['status'],
        }));
        await queryRunner.createIndex('workflow_approvals', new typeorm_1.TableIndex({
            name: 'IDX_WORKFLOW_APPROVALS_STATUS',
            columnNames: ['status'],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('workflow_approvals', true);
        await queryRunner.dropTable('workflow_executions', true);
        await queryRunner.dropTable('workflows', true);
    }
}
exports.CreateWorkflowTables1700000000009 = CreateWorkflowTables1700000000009;
//# sourceMappingURL=1700000000009-CreateWorkflowTables.js.map