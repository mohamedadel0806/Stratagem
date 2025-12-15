"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateImportLogsTable1700000000011 = void 0;
const typeorm_1 = require("typeorm");
class CreateImportLogsTable1700000000011 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'import_logs',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'file_name',
                    type: 'varchar',
                    length: '255',
                },
                {
                    name: 'file_type',
                    type: 'enum',
                    enum: ['csv', 'excel'],
                },
                {
                    name: 'asset_type',
                    type: 'varchar',
                    length: '50',
                },
                {
                    name: 'status',
                    type: 'enum',
                    enum: ['pending', 'processing', 'completed', 'failed', 'partial'],
                    default: "'pending'",
                },
                {
                    name: 'total_records',
                    type: 'int',
                    default: 0,
                },
                {
                    name: 'successful_imports',
                    type: 'int',
                    default: 0,
                },
                {
                    name: 'failed_imports',
                    type: 'int',
                    default: 0,
                },
                {
                    name: 'error_report',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'field_mapping',
                    type: 'jsonb',
                    isNullable: true,
                },
                {
                    name: 'imported_by_id',
                    type: 'uuid',
                },
                {
                    name: 'notes',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'completed_at',
                    type: 'timestamp',
                    isNullable: true,
                },
            ],
        }), true);
        await queryRunner.createForeignKey('import_logs', new typeorm_1.TableForeignKey({
            columnNames: ['imported_by_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createIndex('import_logs', new typeorm_1.TableIndex({
            name: 'IDX_IMPORT_LOGS_STATUS',
            columnNames: ['status'],
        }));
        await queryRunner.createIndex('import_logs', new typeorm_1.TableIndex({
            name: 'IDX_IMPORT_LOGS_ASSET_TYPE',
            columnNames: ['asset_type'],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('import_logs', true);
    }
}
exports.CreateImportLogsTable1700000000011 = CreateImportLogsTable1700000000011;
//# sourceMappingURL=1700000000011-CreateImportLogsTable.js.map