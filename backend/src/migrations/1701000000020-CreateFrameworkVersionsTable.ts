import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateFrameworkVersionsTable1701000000020 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'framework_versions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'framework_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'version',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'version_notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'structure',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'effective_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'is_current',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_by',
            type: 'uuid',
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

    // Create indexes
    await queryRunner.createIndex(
      'framework_versions',
      new TableIndex({
        name: 'idx_framework_versions_framework_id',
        columnNames: ['framework_id'],
      }),
    );

    await queryRunner.createIndex(
      'framework_versions',
      new TableIndex({
        name: 'idx_framework_versions_version',
        columnNames: ['version'],
      }),
    );

    await queryRunner.createIndex(
      'framework_versions',
      new TableIndex({
        name: 'idx_framework_versions_framework_version',
        columnNames: ['framework_id', 'version'],
        isUnique: true,
      }),
    );

    // Create foreign keys
    await queryRunner.createForeignKey(
      'framework_versions',
      new TableForeignKey({
        columnNames: ['framework_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'compliance_frameworks',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'framework_versions',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('framework_versions');
    if (table) {
      const foreignKeys = table.foreignKeys;
      for (const fk of foreignKeys) {
        await queryRunner.dropForeignKey('framework_versions', fk);
      }
    }

    await queryRunner.dropTable('framework_versions');
  }
}


