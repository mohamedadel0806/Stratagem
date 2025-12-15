"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateIntegrationSyncLogsTable1700000000025 = void 0;
const typeorm_1 = require("typeorm");
class CreateIntegrationSyncLogsTable1700000000025 {
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TYPE sync_status AS ENUM (
        'pending',
        'running',
        'completed',
        'failed',
        'partial'
      );
    `);
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'integration_sync_logs',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'integration_config_id',
                    type: 'uuid',
                },
                {
                    name: 'status',
                    type: 'sync_status',
                    default: "'pending'",
                },
                {
                    name: 'total_records',
                    type: 'int',
                    default: 0,
                },
                {
                    name: 'successful_syncs',
                    type: 'int',
                    default: 0,
                },
                {
                    name: 'failed_syncs',
                    type: 'int',
                    default: 0,
                },
                {
                    name: 'skipped_records',
                    type: 'int',
                    default: 0,
                },
                {
                    name: 'error_message',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'sync_details',
                    type: 'jsonb',
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
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }), true);
        await queryRunner.createForeignKey('integration_sync_logs', new typeorm_1.TableForeignKey({
            columnNames: ['integration_config_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'integration_configs',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createIndex('integration_sync_logs', new typeorm_1.TableIndex({
            name: 'IDX_SYNC_LOG_CONFIG',
            columnNames: ['integration_config_id'],
        }));
        await queryRunner.createIndex('integration_sync_logs', new typeorm_1.TableIndex({
            name: 'IDX_SYNC_LOG_STATUS',
            columnNames: ['status'],
        }));
        await queryRunner.createIndex('integration_sync_logs', new typeorm_1.TableIndex({
            name: 'IDX_SYNC_LOG_COMPLETED',
            columnNames: ['completed_at'],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('integration_sync_logs', true);
        await queryRunner.query('DROP TYPE IF EXISTS sync_status');
    }
}
exports.CreateIntegrationSyncLogsTable1700000000025 = CreateIntegrationSyncLogsTable1700000000025;
//# sourceMappingURL=1700000000025-CreateIntegrationSyncLogsTable.js.map