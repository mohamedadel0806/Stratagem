import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateImportLogsTable1700000000011 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
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
      }),
      true,
    );

    // Add foreign key
    await queryRunner.createForeignKey(
      'import_logs',
      new TableForeignKey({
        columnNames: ['imported_by_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    // Add indexes
    await queryRunner.createIndex(
      'import_logs',
      new TableIndex({
        name: 'IDX_IMPORT_LOGS_STATUS',
        columnNames: ['status'],
      }),
    );

    await queryRunner.createIndex(
      'import_logs',
      new TableIndex({
        name: 'IDX_IMPORT_LOGS_ASSET_TYPE',
        columnNames: ['asset_type'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('import_logs', true);
  }
}

