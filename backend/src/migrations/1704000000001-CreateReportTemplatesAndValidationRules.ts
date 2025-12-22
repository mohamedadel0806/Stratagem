import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateReportTemplatesAndValidationRules1704000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create email_distribution_lists table FIRST (before report_templates needs it for FK)
    await queryRunner.createTable(
      new Table({
        name: 'email_distribution_lists',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'name', type: 'varchar', length: '255' },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'email_addresses', type: 'text', isArray: true },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'created_by_id', type: 'uuid' },
          { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'email_distribution_lists',
      new TableForeignKey({
        columnNames: ['created_by_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // Create distribution_list_users junction table
    await queryRunner.createTable(
      new Table({
        name: 'distribution_list_users',
        columns: [
          { name: 'distribution_list_id', type: 'uuid' },
          { name: 'user_id', type: 'uuid' },
        ],
      }),
      true,
    );

    await queryRunner.createPrimaryKey('distribution_list_users', [
      'distribution_list_id',
      'user_id',
    ]);

    await queryRunner.createForeignKey(
      'distribution_list_users',
      new TableForeignKey({
        columnNames: ['distribution_list_id'],
        referencedTableName: 'email_distribution_lists',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'distribution_list_users',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // Create report_templates table
    await queryRunner.createTable(
      new Table({
        name: 'report_templates',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'name', type: 'varchar', length: '255' },
          { name: 'description', type: 'text', isNullable: true },
          {
            name: 'report_type',
            type: 'enum',
            enum: [
              'asset_inventory',
              'compliance_report',
              'security_test_report',
              'software_inventory',
              'contract_expiration',
              'supplier_criticality',
              'custom',
            ],
          },
          {
            name: 'format',
            type: 'enum',
            enum: ['excel', 'pdf', 'csv'],
            default: "'excel'",
          },
          { name: 'field_selection', type: 'jsonb', default: "'[]'" },
          { name: 'filters', type: 'jsonb', isNullable: true },
          { name: 'grouping', type: 'jsonb', isNullable: true },
          { name: 'is_scheduled', type: 'boolean', default: false },
          {
            name: 'schedule_frequency',
            type: 'enum',
            enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'],
            isNullable: true,
          },
          { name: 'schedule_cron', type: 'varchar', length: '50', isNullable: true },
          { name: 'schedule_time', type: 'time', isNullable: true },
          { name: 'distribution_list_id', type: 'uuid', isNullable: true },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'last_run_at', type: 'timestamp', isNullable: true },
          { name: 'next_run_at', type: 'timestamp', isNullable: true },
          { name: 'created_by_id', type: 'uuid' },
          { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'report_templates',
      new TableForeignKey({
        columnNames: ['created_by_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'report_templates',
      new TableForeignKey({
        columnNames: ['distribution_list_id'],
        referencedTableName: 'email_distribution_lists',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    // Create validation_rules table
    await queryRunner.createTable(
      new Table({
        name: 'validation_rules',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'name', type: 'varchar', length: '255' },
          { name: 'description', type: 'text', isNullable: true },
          {
            name: 'asset_type',
            type: 'enum',
            enum: ['physical', 'information', 'application', 'software', 'supplier', 'all'],
          },
          { name: 'field_name', type: 'varchar', length: '255' },
          {
            name: 'validation_type',
            type: 'enum',
            enum: [
              'required',
              'regex',
              'min_length',
              'max_length',
              'min_value',
              'max_value',
              'email',
              'url',
              'date',
              'custom',
            ],
          },
          { name: 'regex_pattern', type: 'text', isNullable: true },
          { name: 'min_length', type: 'integer', isNullable: true },
          { name: 'max_length', type: 'integer', isNullable: true },
          { name: 'min_value', type: 'numeric', isNullable: true },
          { name: 'max_value', type: 'numeric', isNullable: true },
          { name: 'custom_validation_script', type: 'text', isNullable: true },
          { name: 'error_message', type: 'text', isNullable: true },
          {
            name: 'severity',
            type: 'enum',
            enum: ['error', 'warning'],
            default: "'error'",
          },
          { name: 'dependencies', type: 'jsonb', isNullable: true },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'apply_to_import', type: 'boolean', default: false },
          { name: 'created_by_id', type: 'uuid' },
          { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'validation_rules',
      new TableForeignKey({
        columnNames: ['created_by_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'validation_rules',
      new TableIndex({
        name: 'IDX_validation_rules_asset_type',
        columnNames: ['asset_type'],
      }),
    );

    await queryRunner.createIndex(
      'validation_rules',
      new TableIndex({
        name: 'IDX_validation_rules_field_name',
        columnNames: ['field_name'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('validation_rules', true);
    await queryRunner.dropTable('distribution_list_users', true);
    await queryRunner.dropTable('email_distribution_lists', true);
    await queryRunner.dropTable('report_templates', true);
  }
}



