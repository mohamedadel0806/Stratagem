import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateAssetAuditLogsTable1700000000014 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create asset_audit_logs table
    await queryRunner.createTable(
      new Table({
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
      }),
      true,
    );

    // Add indexes for performance
    await queryRunner.createIndex(
      'asset_audit_logs',
      new TableIndex({
        name: 'IDX_AUDIT_ASSET',
        columnNames: ['asset_type', 'asset_id'],
      }),
    );

    await queryRunner.createIndex(
      'asset_audit_logs',
      new TableIndex({
        name: 'IDX_AUDIT_ACTION',
        columnNames: ['action'],
      }),
    );

    await queryRunner.createIndex(
      'asset_audit_logs',
      new TableIndex({
        name: 'IDX_AUDIT_CHANGED_BY',
        columnNames: ['changed_by_id'],
      }),
    );

    await queryRunner.createIndex(
      'asset_audit_logs',
      new TableIndex({
        name: 'IDX_AUDIT_CREATED_AT',
        columnNames: ['created_at'],
      }),
    );

    // Add foreign key for changed_by (only if it doesn't exist)
    const table = await queryRunner.getTable('asset_audit_logs');
    const foreignKeyExists = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('changed_by_id') !== -1,
    );
    if (!foreignKeyExists) {
      await queryRunner.createForeignKey(
        'asset_audit_logs',
        new TableForeignKey({
          columnNames: ['changed_by_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete: 'SET NULL',
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('asset_audit_logs', true);
  }
}

