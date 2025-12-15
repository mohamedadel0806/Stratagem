import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateTasksTable1700000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tasks',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'task_type',
            type: 'enum',
            enum: ['policy_review', 'risk_mitigation', 'compliance_requirement', 'audit', 'vendor_assessment'],
            default: "'compliance_requirement'",
          },
          {
            name: 'priority',
            type: 'enum',
            enum: ['critical', 'high', 'medium', 'low'],
            default: "'medium'",
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['todo', 'in_progress', 'review', 'completed', 'cancelled'],
            default: "'todo'",
          },
          {
            name: 'due_date',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'assigned_to_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'related_entity_type',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'related_entity_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'organization_id',
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
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Check if foreign key already exists before creating
    const table = await queryRunner.getTable('tasks');
    const foreignKeyExists = table?.foreignKeys.find(
      (fk) => fk.columnNames.includes('assigned_to_id') && fk.referencedTableName === 'users',
    );

    if (!foreignKeyExists) {
      await queryRunner.createForeignKey(
        'tasks',
        new TableForeignKey({
          columnNames: ['assigned_to_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete: 'SET NULL',
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tasks');
  }
}

