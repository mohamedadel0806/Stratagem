import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateReportTemplateVersionsTable1705000000003
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'report_template_versions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'template_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'version_number',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'report_type',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'format',
            type: 'varchar',
            length: '20',
            isNullable: false,
            default: "'excel'",
          },
          {
            name: 'field_selection',
            type: 'jsonb',
            isNullable: true,
            default: "'[]'",
          },
          {
            name: 'filters',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'grouping',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'is_scheduled',
            type: 'boolean',
            default: false,
          },
          {
            name: 'schedule_frequency',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'schedule_cron',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'schedule_time',
            type: 'time',
            isNullable: true,
          },
          {
            name: 'distribution_list_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'version_comment',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_by_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create foreign key to report_templates
    await queryRunner.createForeignKey(
      'report_template_versions',
      new TableForeignKey({
        columnNames: ['template_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'report_templates',
        onDelete: 'CASCADE',
      }),
    );

    // Create foreign key to users
    await queryRunner.createForeignKey(
      'report_template_versions',
      new TableForeignKey({
        columnNames: ['created_by_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    // Create indexes
    await queryRunner.createIndex(
      'report_template_versions',
      new TableIndex({
        name: 'IDX_report_template_versions_template_id',
        columnNames: ['template_id'],
      }),
    );

    await queryRunner.createIndex(
      'report_template_versions',
      new TableIndex({
        name: 'IDX_report_template_versions_template_version',
        columnNames: ['template_id', 'version_number'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'report_template_versions',
      new TableIndex({
        name: 'IDX_report_template_versions_created_at',
        columnNames: ['created_at'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('report_template_versions');
  }
}


