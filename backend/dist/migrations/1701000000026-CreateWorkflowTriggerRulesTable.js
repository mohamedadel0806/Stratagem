"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateWorkflowTriggerRulesTable1701000000026 = void 0;
const typeorm_1 = require("typeorm");
class CreateWorkflowTriggerRulesTable1701000000026 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'workflow_trigger_rules',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'uuid',
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
                    name: 'entityType',
                    type: 'varchar',
                    length: '100',
                },
                {
                    name: 'trigger',
                    type: 'varchar',
                    length: '100',
                },
                {
                    name: 'conditions',
                    type: 'jsonb',
                },
                {
                    name: 'workflow_id',
                    type: 'uuid',
                },
                {
                    name: 'priority',
                    type: 'integer',
                    default: 0,
                },
                {
                    name: 'isActive',
                    type: 'boolean',
                    default: true,
                },
                {
                    name: 'created_by',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'created_at',
                    type: 'timestamptz',
                    default: 'now()',
                },
                {
                    name: 'updated_at',
                    type: 'timestamptz',
                    default: 'now()',
                },
                {
                    name: 'deleted_at',
                    type: 'timestamptz',
                    isNullable: true,
                },
            ],
        }), true);
        await queryRunner.createIndex('workflow_trigger_rules', new typeorm_1.TableIndex({ columnNames: ['entityType', 'trigger'] }));
        await queryRunner.createIndex('workflow_trigger_rules', new typeorm_1.TableIndex({ columnNames: ['isActive'] }));
        await queryRunner.createForeignKey('workflow_trigger_rules', new typeorm_1.TableForeignKey({
            columnNames: ['workflow_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'workflows',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('workflow_trigger_rules', new typeorm_1.TableForeignKey({
            columnNames: ['created_by'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('workflow_trigger_rules');
    }
}
exports.CreateWorkflowTriggerRulesTable1701000000026 = CreateWorkflowTriggerRulesTable1701000000026;
//# sourceMappingURL=1701000000026-CreateWorkflowTriggerRulesTable.js.map