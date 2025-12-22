import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateWorkflowTriggerRulesTable1701000000026 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'workflow_trigger_rules',
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
            name: 'entityType',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'trigger',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'conditions',
            type: 'jsonb',
          },
          {
            name: 'workflow_id',
            type: 'uuid',
          },
          {
            name: 'priority',
            type: 'integer',
            default: 0,
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

    // Create indexes
    await queryRunner.createIndex('workflow_trigger_rules', new TableIndex({ columnNames: ['entityType', 'trigger'] }));
    await queryRunner.createIndex('workflow_trigger_rules', new TableIndex({ columnNames: ['isActive'] }));

    // Foreign Keys
    await queryRunner.createForeignKey(
      'workflow_trigger_rules',
      new TableForeignKey({
        columnNames: ['workflow_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'workflows',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'workflow_trigger_rules',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('workflow_trigger_rules');
  }
}


