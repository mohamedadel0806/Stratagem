"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTasksTable1700000000003 = void 0;
const typeorm_1 = require("typeorm");
class CreateTasksTable1700000000003 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'tasks',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'title',
                    type: 'varchar',
                    length: '255',
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'task_type',
                    type: 'enum',
                    enum: ['policy_review', 'risk_mitigation', 'compliance_requirement', 'audit', 'vendor_assessment'],
                    default: "'compliance_requirement'",
                },
                {
                    name: 'priority',
                    type: 'enum',
                    enum: ['critical', 'high', 'medium', 'low'],
                    default: "'medium'",
                },
                {
                    name: 'status',
                    type: 'enum',
                    enum: ['todo', 'in_progress', 'review', 'completed', 'cancelled'],
                    default: "'todo'",
                },
                {
                    name: 'due_date',
                    type: 'timestamp',
                    isNullable: true,
                },
                {
                    name: 'assigned_to_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'related_entity_type',
                    type: 'varchar',
                    length: '50',
                    isNullable: true,
                },
                {
                    name: 'related_entity_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'organization_id',
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
                    onUpdate: 'CURRENT_TIMESTAMP',
                },
            ],
        }), true);
        const table = await queryRunner.getTable('tasks');
        const foreignKeyExists = table === null || table === void 0 ? void 0 : table.foreignKeys.find((fk) => fk.columnNames.includes('assigned_to_id') && fk.referencedTableName === 'users');
        if (!foreignKeyExists) {
            await queryRunner.createForeignKey('tasks', new typeorm_1.TableForeignKey({
                columnNames: ['assigned_to_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'SET NULL',
            }));
        }
    }
    async down(queryRunner) {
        await queryRunner.dropTable('tasks');
    }
}
exports.CreateTasksTable1700000000003 = CreateTasksTable1700000000003;
//# sourceMappingURL=1700000000003-CreateTasksTable.js.map