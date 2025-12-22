import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateGovernanceIntegrationsTables1701000000028 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create governance_integration_hooks table
    await queryRunner.createTable(
      new Table({
        name: 'governance_integration_hooks',
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
            name: 'type',
            type: 'enum',
            enum: ['siem', 'vulnerability_scanner', 'cloud_monitor', 'custom'],
            default: "'custom'",
          },
          {
            name: 'action',
            type: 'enum',
            enum: ['create_evidence', 'create_finding', 'update_control_status'],
            default: "'create_evidence'",
          },
          {
            name: 'secret_key',
            type: 'varchar',
            length: '128',
            isUnique: true,
          },
          {
            name: 'config',
            type: 'jsonb',
            isNullable: true,
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
      }),
      true,
    );

    // Create governance_integration_logs table
    await queryRunner.createTable(
      new Table({
        name: 'governance_integration_logs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'hook_id',
            type: 'uuid',
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'payload',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'result',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'errorMessage',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'ipAddress',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    // Indexes
    await queryRunner.createIndex('governance_integration_hooks', new TableIndex({ columnNames: ['type'] }));
    await queryRunner.createIndex('governance_integration_hooks', new TableIndex({ columnNames: ['isActive'] }));
    await queryRunner.createIndex('governance_integration_logs', new TableIndex({ columnNames: ['hook_id'] }));
    await queryRunner.createIndex('governance_integration_logs', new TableIndex({ columnNames: ['status'] }));

    // Foreign Keys
    await queryRunner.createForeignKey(
      'governance_integration_hooks',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'governance_integration_logs',
      new TableForeignKey({
        columnNames: ['hook_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'governance_integration_hooks',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('governance_integration_logs');
    await queryRunner.dropTable('governance_integration_hooks');
  }
}


