import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateSecurityTestResultsTable1703000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create test_type enum
    await queryRunner.query(`
      CREATE TYPE test_type_enum AS ENUM (
        'penetration_test',
        'vulnerability_scan',
        'code_review',
        'compliance_audit',
        'security_assessment',
        'other'
      );
    `);

    // Create test_status enum
    await queryRunner.query(`
      CREATE TYPE test_status_enum AS ENUM (
        'scheduled',
        'in_progress',
        'completed',
        'failed',
        'cancelled'
      );
    `);

    // Create severity_level enum
    await queryRunner.query(`
      CREATE TYPE severity_level_enum AS ENUM (
        'critical',
        'high',
        'medium',
        'low',
        'info',
        'passed'
      );
    `);

    // Create security_test_results table
    await queryRunner.createTable(
      new Table({
        name: 'security_test_results',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'asset_type',
            type: 'enum',
            enum: ['application', 'software'],
          },
          {
            name: 'asset_id',
            type: 'uuid',
          },
          {
            name: 'test_type',
            type: 'enum',
            enumName: 'test_type_enum',
          },
          {
            name: 'test_date',
            type: 'date',
          },
          {
            name: 'status',
            type: 'enum',
            enumName: 'test_status_enum',
            default: "'completed'",
          },
          {
            name: 'tester_name',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
          {
            name: 'tester_company',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
          {
            name: 'findings_critical',
            type: 'int',
            default: 0,
          },
          {
            name: 'findings_high',
            type: 'int',
            default: 0,
          },
          {
            name: 'findings_medium',
            type: 'int',
            default: 0,
          },
          {
            name: 'findings_low',
            type: 'int',
            default: 0,
          },
          {
            name: 'findings_info',
            type: 'int',
            default: 0,
          },
          {
            name: 'severity',
            type: 'enum',
            enumName: 'severity_level_enum',
            isNullable: true,
          },
          {
            name: 'overall_score',
            type: 'decimal',
            precision: 5,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'passed',
            type: 'boolean',
            default: false,
          },
          {
            name: 'summary',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'findings',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'recommendations',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'report_file_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'report_url',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'remediation_due_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'remediation_completed',
            type: 'boolean',
            default: false,
          },
          {
            name: 'retest_required',
            type: 'boolean',
            default: false,
          },
          {
            name: 'retest_date',
            type: 'date',
            isNullable: true,
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
      'security_test_results',
      new TableIndex({
        name: 'IDX_SECURITY_TEST_ASSET',
        columnNames: ['asset_type', 'asset_id'],
      }),
    );

    await queryRunner.createIndex(
      'security_test_results',
      new TableIndex({
        name: 'IDX_SECURITY_TEST_DATE',
        columnNames: ['test_date'],
      }),
    );

    await queryRunner.createIndex(
      'security_test_results',
      new TableIndex({
        name: 'IDX_SECURITY_TEST_STATUS',
        columnNames: ['status'],
      }),
    );

    await queryRunner.createIndex(
      'security_test_results',
      new TableIndex({
        name: 'IDX_SECURITY_TEST_SEVERITY',
        columnNames: ['severity'],
      }),
    );

    // Add foreign keys (optional - for referential integrity)
    await queryRunner.createForeignKey(
      'security_test_results',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys
    const table = await queryRunner.getTable('security_test_results');
    if (table) {
      const foreignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('created_by') !== -1);
      if (foreignKey) {
        await queryRunner.dropForeignKey('security_test_results', foreignKey);
      }
    }

    // Drop indexes
    await queryRunner.dropIndex('security_test_results', 'IDX_SECURITY_TEST_ASSET');
    await queryRunner.dropIndex('security_test_results', 'IDX_SECURITY_TEST_DATE');
    await queryRunner.dropIndex('security_test_results', 'IDX_SECURITY_TEST_STATUS');
    await queryRunner.dropIndex('security_test_results', 'IDX_SECURITY_TEST_SEVERITY');

    // Drop table
    await queryRunner.dropTable('security_test_results');

    // Drop enums
    await queryRunner.query('DROP TYPE IF EXISTS severity_level_enum');
    await queryRunner.query('DROP TYPE IF EXISTS test_status_enum');
    await queryRunner.query('DROP TYPE IF EXISTS test_type_enum');
  }
}

