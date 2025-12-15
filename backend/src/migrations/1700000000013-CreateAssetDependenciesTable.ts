import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateAssetDependenciesTable1700000000013 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create asset_dependencies table
    await queryRunner.createTable(
      new Table({
        name: 'asset_dependencies',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'source_asset_type',
            type: 'enum',
            enum: ['physical', 'information', 'application', 'software', 'supplier'],
          },
          {
            name: 'source_asset_id',
            type: 'uuid',
          },
          {
            name: 'target_asset_type',
            type: 'enum',
            enum: ['physical', 'information', 'application', 'software', 'supplier'],
          },
          {
            name: 'target_asset_id',
            type: 'uuid',
          },
          {
            name: 'relationship_type',
            type: 'enum',
            enum: ['depends_on', 'uses', 'contains', 'hosts', 'processes', 'stores', 'other'],
            default: "'depends_on'",
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_by_id',
            type: 'uuid',
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

    // Add indexes
    await queryRunner.createIndex(
      'asset_dependencies',
      new TableIndex({
        name: 'IDX_DEP_SOURCE',
        columnNames: ['source_asset_type', 'source_asset_id'],
      }),
    );

    await queryRunner.createIndex(
      'asset_dependencies',
      new TableIndex({
        name: 'IDX_DEP_TARGET',
        columnNames: ['target_asset_type', 'target_asset_id'],
      }),
    );

    await queryRunner.createIndex(
      'asset_dependencies',
      new TableIndex({
        name: 'IDX_DEP_RELATIONSHIP',
        columnNames: ['relationship_type'],
      }),
    );

    // Add foreign key for created_by (only if it doesn't exist)
    const table = await queryRunner.getTable('asset_dependencies');
    const foreignKeyExists = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('created_by_id') !== -1,
    );
    if (!foreignKeyExists) {
      await queryRunner.createForeignKey(
        'asset_dependencies',
        new TableForeignKey({
          columnNames: ['created_by_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete: 'SET NULL',
        }),
      );
    }

    // Add unique constraint to prevent duplicate dependencies
    await queryRunner.query(`
      CREATE UNIQUE INDEX IDX_DEP_UNIQUE 
      ON asset_dependencies (source_asset_type, source_asset_id, target_asset_type, target_asset_id)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('asset_dependencies', true);
  }
}

