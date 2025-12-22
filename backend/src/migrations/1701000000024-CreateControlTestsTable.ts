import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateControlTestsTable1701000000024 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'control_tests',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'unified_control_id',
            type: 'uuid',
          },
          {
            name: 'control_asset_mapping_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'test_type',
            type: 'enum',
            enum: ['design', 'operating', 'technical', 'management'],
            default: "'operating'",
          },
          {
            name: 'test_date',
            type: 'date',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['planned', 'in_progress', 'completed', 'cancelled'],
            default: "'planned'",
          },
          {
            name: 'result',
            type: 'enum',
            enum: ['pass', 'fail', 'inconclusive', 'not_applicable'],
            isNullable: true,
          },
          {
            name: 'effectiveness_score',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'test_procedure',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'observations',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'recommendations',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'evidence_links',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'tester_id',
            type: 'uuid',
            isNullable: true,
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
            name: 'updated_by',
            type: 'uuid',
            isNullable: true,
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

    // Create indexes
    await queryRunner.createIndex('control_tests', new TableIndex({ columnNames: ['unified_control_id'] }));
    await queryRunner.createIndex('control_tests', new TableIndex({ columnNames: ['status'] }));
    await queryRunner.createIndex('control_tests', new TableIndex({ columnNames: ['test_date'] }));
    await queryRunner.createIndex('control_tests', new TableIndex({ columnNames: ['tester_id'] }));

    // Foreign Keys
    await queryRunner.createForeignKey(
      'control_tests',
      new TableForeignKey({
        columnNames: ['unified_control_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'unified_controls',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'control_tests',
      new TableForeignKey({
        columnNames: ['control_asset_mapping_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'control_asset_mappings',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'control_tests',
      new TableForeignKey({
        columnNames: ['tester_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('control_tests');
  }
}


