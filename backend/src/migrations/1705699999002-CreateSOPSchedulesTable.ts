import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateSOPSchedulesTable1705699999002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sop_schedules',
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
            isNullable: false,
          },
          {
            name: 'frequency',
            type: 'varchar',
            length: '50',
            default: "'monthly'",
          },
          {
            name: 'day_of_week',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'day_of_month',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'execution_time',
            type: 'varchar',
            length: '10',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
            default: "'active'",
          },
          {
            name: 'next_execution_date',
            type: 'timestamptz',
            isNullable: true,
          },
          {
            name: 'last_execution_date',
            type: 'timestamptz',
            isNullable: true,
          },
          {
            name: 'execution_count',
            type: 'integer',
            default: 0,
          },
          {
            name: 'assigned_user_ids',
            type: 'uuid[]',
            isNullable: true,
          },
          {
            name: 'assigned_role_ids',
            type: 'uuid[]',
            isNullable: true,
          },
          {
            name: 'reminder_template',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'reminder_days_before',
            type: 'integer',
            default: 7,
          },
          {
            name: 'send_reminders',
            type: 'boolean',
            default: 'true',
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
    await queryRunner.createIndex('sop_schedules', new TableIndex({ columnNames: ['sop_id'] }));
    await queryRunner.createIndex('sop_schedules', new TableIndex({ columnNames: ['status'] }));
    await queryRunner.createIndex('sop_schedules', new TableIndex({ columnNames: ['next_execution_date'] }));
    await queryRunner.createIndex('sop_schedules', new TableIndex({ columnNames: ['created_by'] }));

    // Create foreign keys
    await queryRunner.createForeignKey(
      'sop_schedules',
      new TableForeignKey({
        columnNames: ['sop_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'sops',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'sop_schedules',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'sop_schedules',
      new TableForeignKey({
        columnNames: ['updated_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sop_schedules', true);
  }
}
