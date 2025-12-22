import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateSOPLogsTable1701000000025 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sop_logs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'sop_id',
            type: 'uuid',
          },
          {
            name: 'execution_date',
            type: 'date',
          },
          {
            name: 'start_time',
            type: 'timestamptz',
            isNullable: true,
          },
          {
            name: 'end_time',
            type: 'timestamptz',
            isNullable: true,
          },
          {
            name: 'outcome',
            type: 'enum',
            enum: ['successful', 'failed', 'partially_completed'],
            default: "'successful'",
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'step_results',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'executor_id',
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
    await queryRunner.createIndex('sop_logs', new TableIndex({ columnNames: ['sop_id'] }));
    await queryRunner.createIndex('sop_logs', new TableIndex({ columnNames: ['executor_id'] }));
    await queryRunner.createIndex('sop_logs', new TableIndex({ columnNames: ['execution_date'] }));
    await queryRunner.createIndex('sop_logs', new TableIndex({ columnNames: ['outcome'] }));

    // Foreign Keys
    await queryRunner.createForeignKey(
      'sop_logs',
      new TableForeignKey({
        columnNames: ['sop_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'sops',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'sop_logs',
      new TableForeignKey({
        columnNames: ['executor_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sop_logs');
  }
}


