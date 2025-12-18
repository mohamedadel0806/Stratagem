import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateIntegrationSyncLogsTable1700000000025 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum type
    await queryRunner.query(`
      CREATE TYPE sync_status AS ENUM (
        'pending',
        'running',
        'completed',
        'failed',
        'partial'
      );
    `);

    // Create integration_sync_logs table
    await queryRunner.createTable(
      new Table({
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
      }),
      true,
    );

    // Add foreign key
    await queryRunner.createForeignKey(
      'integration_sync_logs',
      new TableForeignKey({
        columnNames: ['integration_config_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'integration_configs',
        onDelete: 'CASCADE',
      }),
    );

    // Add indexes
    await queryRunner.createIndex(
      'integration_sync_logs',
      new TableIndex({
        name: 'IDX_SYNC_LOG_CONFIG',
        columnNames: ['integration_config_id'],
      }),
    );

    await queryRunner.createIndex(
      'integration_sync_logs',
      new TableIndex({
        name: 'IDX_SYNC_LOG_STATUS',
        columnNames: ['status'],
      }),
    );

    await queryRunner.createIndex(
      'integration_sync_logs',
      new TableIndex({
        name: 'IDX_SYNC_LOG_COMPLETED',
        columnNames: ['completed_at'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('integration_sync_logs', true);
    await queryRunner.query('DROP TYPE IF EXISTS sync_status');
  }
}









