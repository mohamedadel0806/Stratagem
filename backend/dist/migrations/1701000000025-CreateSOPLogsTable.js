"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSOPLogsTable1701000000025 = void 0;
const typeorm_1 = require("typeorm");
class CreateSOPLogsTable1701000000025 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'sop_logs',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'uuid',
                },
                {
                    name: 'sop_id',
                    type: 'uuid',
                },
                {
                    name: 'execution_date',
                    type: 'date',
                },
                {
                    name: 'start_time',
                    type: 'timestamptz',
                    isNullable: true,
                },
                {
                    name: 'end_time',
                    type: 'timestamptz',
                    isNullable: true,
                },
                {
                    name: 'outcome',
                    type: 'enum',
                    enum: ['successful', 'failed', 'partially_completed'],
                    default: "'successful'",
                },
                {
                    name: 'notes',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'step_results',
                    type: 'jsonb',
                    isNullable: true,
                },
                {
                    name: 'executor_id',
                    type: 'uuid',
                    isNullable: true,
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
                    name: 'updated_by',
                    type: 'uuid',
                    isNullable: true,
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
        await queryRunner.createIndex('sop_logs', new typeorm_1.TableIndex({ columnNames: ['sop_id'] }));
        await queryRunner.createIndex('sop_logs', new typeorm_1.TableIndex({ columnNames: ['executor_id'] }));
        await queryRunner.createIndex('sop_logs', new typeorm_1.TableIndex({ columnNames: ['execution_date'] }));
        await queryRunner.createIndex('sop_logs', new typeorm_1.TableIndex({ columnNames: ['outcome'] }));
        await queryRunner.createForeignKey('sop_logs', new typeorm_1.TableForeignKey({
            columnNames: ['sop_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'sops',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('sop_logs', new typeorm_1.TableForeignKey({
            columnNames: ['executor_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('sop_logs');
    }
}
exports.CreateSOPLogsTable1701000000025 = CreateSOPLogsTable1701000000025;
//# sourceMappingURL=1701000000025-CreateSOPLogsTable.js.map