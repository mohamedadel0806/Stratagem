"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAssetAuditLogsTable1700000000014 = void 0;
const typeorm_1 = require("typeorm");
class CreateAssetAuditLogsTable1700000000014 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'asset_audit_logs',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'asset_type',
                    type: 'enum',
                    enum: ['physical', 'information', 'application', 'software', 'supplier'],
                },
                {
                    name: 'asset_id',
                    type: 'uuid',
                },
                {
                    name: 'action',
                    type: 'enum',
                    enum: ['create', 'update', 'delete'],
                },
                {
                    name: 'field_name',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                {
                    name: 'old_value',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'new_value',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'changed_by_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'change_reason',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }), true);
        await queryRunner.createIndex('asset_audit_logs', new typeorm_1.TableIndex({
            name: 'IDX_AUDIT_ASSET',
            columnNames: ['asset_type', 'asset_id'],
        }));
        await queryRunner.createIndex('asset_audit_logs', new typeorm_1.TableIndex({
            name: 'IDX_AUDIT_ACTION',
            columnNames: ['action'],
        }));
        await queryRunner.createIndex('asset_audit_logs', new typeorm_1.TableIndex({
            name: 'IDX_AUDIT_CHANGED_BY',
            columnNames: ['changed_by_id'],
        }));
        await queryRunner.createIndex('asset_audit_logs', new typeorm_1.TableIndex({
            name: 'IDX_AUDIT_CREATED_AT',
            columnNames: ['created_at'],
        }));
        const table = await queryRunner.getTable('asset_audit_logs');
        const foreignKeyExists = table === null || table === void 0 ? void 0 : table.foreignKeys.find((fk) => fk.columnNames.indexOf('changed_by_id') !== -1);
        if (!foreignKeyExists) {
            await queryRunner.createForeignKey('asset_audit_logs', new typeorm_1.TableForeignKey({
                columnNames: ['changed_by_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'SET NULL',
            }));
        }
    }
    async down(queryRunner) {
        await queryRunner.dropTable('asset_audit_logs', true);
    }
}
exports.CreateAssetAuditLogsTable1700000000014 = CreateAssetAuditLogsTable1700000000014;
//# sourceMappingURL=1700000000014-CreateAssetAuditLogsTable.js.map