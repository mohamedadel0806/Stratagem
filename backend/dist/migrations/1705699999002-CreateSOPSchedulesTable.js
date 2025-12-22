"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSOPSchedulesTable1705699999002 = void 0;
const typeorm_1 = require("typeorm");
class CreateSOPSchedulesTable1705699999002 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'sop_schedules',
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
                    isNullable: false,
                },
                {
                    name: 'frequency',
                    type: 'varchar',
                    length: '50',
                    default: "'monthly'",
                },
                {
                    name: 'day_of_week',
                    type: 'integer',
                    isNullable: true,
                },
                {
                    name: 'day_of_month',
                    type: 'integer',
                    isNullable: true,
                },
                {
                    name: 'execution_time',
                    type: 'varchar',
                    length: '10',
                    isNullable: true,
                },
                {
                    name: 'status',
                    type: 'varchar',
                    length: '50',
                    default: "'active'",
                },
                {
                    name: 'next_execution_date',
                    type: 'timestamptz',
                    isNullable: true,
                },
                {
                    name: 'last_execution_date',
                    type: 'timestamptz',
                    isNullable: true,
                },
                {
                    name: 'execution_count',
                    type: 'integer',
                    default: 0,
                },
                {
                    name: 'assigned_user_ids',
                    type: 'uuid[]',
                    isNullable: true,
                },
                {
                    name: 'assigned_role_ids',
                    type: 'uuid[]',
                    isNullable: true,
                },
                {
                    name: 'reminder_template',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'reminder_days_before',
                    type: 'integer',
                    default: 7,
                },
                {
                    name: 'send_reminders',
                    type: 'boolean',
                    default: 'true',
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
        await queryRunner.createIndex('sop_schedules', new typeorm_1.TableIndex({ columnNames: ['sop_id'] }));
        await queryRunner.createIndex('sop_schedules', new typeorm_1.TableIndex({ columnNames: ['status'] }));
        await queryRunner.createIndex('sop_schedules', new typeorm_1.TableIndex({ columnNames: ['next_execution_date'] }));
        await queryRunner.createIndex('sop_schedules', new typeorm_1.TableIndex({ columnNames: ['created_by'] }));
        await queryRunner.createForeignKey('sop_schedules', new typeorm_1.TableForeignKey({
            columnNames: ['sop_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'sops',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('sop_schedules', new typeorm_1.TableForeignKey({
            columnNames: ['created_by'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createForeignKey('sop_schedules', new typeorm_1.TableForeignKey({
            columnNames: ['updated_by'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('sop_schedules', true);
    }
}
exports.CreateSOPSchedulesTable1705699999002 = CreateSOPSchedulesTable1705699999002;
//# sourceMappingURL=1705699999002-CreateSOPSchedulesTable.js.map