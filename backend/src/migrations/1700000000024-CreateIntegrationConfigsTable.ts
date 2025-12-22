import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateIntegrationConfigsTable1700000000024 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum types
    await queryRunner.query(`
      CREATE TYPE integration_type AS ENUM (
        'cmdb',
        'asset_management_system',
        'rest_api',
        'webhook'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE integration_status AS ENUM (
        'active',
        'inactive',
        'error'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE authentication_type AS ENUM (
        'api_key',
        'bearer_token',
        'basic_auth',
        'oauth2'
      );
    `);

    // Create integration_configs table
    await queryRunner.createTable(
      new Table({
        name: 'integration_configs',
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
            length: '100',
          },
          {
            name: 'integration_type',
            type: 'integration_type',
          },
          {
            name: 'endpoint_url',
            type: 'varchar',
            length: '500',
          },
          {
            name: 'authentication_type',
            type: 'authentication_type',
          },
          {
            name: 'api_key',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'bearer_token',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'username',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'password',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'field_mapping',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'sync_interval',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'integration_status',
            default: "'inactive'",
          },
          {
            name: 'last_sync_error',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'last_sync_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'next_sync_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'created_by_id',
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
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Add foreign key
    await queryRunner.createForeignKey(
      'integration_configs',
      new TableForeignKey({
        columnNames: ['created_by_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    // Add indexes
    await queryRunner.createIndex(
      'integration_configs',
      new TableIndex({
        name: 'IDX_INTEGRATION_CONFIG_TYPE',
        columnNames: ['integration_type'],
      }),
    );

    await queryRunner.createIndex(
      'integration_configs',
      new TableIndex({
        name: 'IDX_INTEGRATION_CONFIG_STATUS',
        columnNames: ['status'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('integration_configs', true);
    await queryRunner.query('DROP TYPE IF EXISTS integration_type');
    await queryRunner.query('DROP TYPE IF EXISTS integration_status');
    await queryRunner.query('DROP TYPE IF EXISTS authentication_type');
  }
}











