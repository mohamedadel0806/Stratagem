import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateComplianceReportsTable1766432400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum types for PostgreSQL
    await queryRunner.query(`
      CREATE TYPE compliance_score_enum AS ENUM ('EXCELLENT', 'GOOD', 'FAIR', 'POOR');
    `);

    await queryRunner.query(`
      CREATE TYPE report_period_enum AS ENUM ('WEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUAL', 'CUSTOM');
    `);

    // Create compliance_reports table
    await queryRunner.createTable(
      new Table({
        name: 'compliance_reports',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'report_name',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'report_period',
            type: 'enum',
            enum: ['WEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUAL', 'CUSTOM'],
            default: `'MONTHLY'`,
          },
          {
            name: 'period_start_date',
            type: 'date',
          },
          {
            name: 'period_end_date',
            type: 'date',
          },
          // Overall Compliance Metrics
          {
            name: 'overall_compliance_score',
            type: 'decimal',
            precision: 5,
            scale: 2,
            default: 0,
          },
          {
            name: 'overall_compliance_rating',
            type: 'enum',
            enum: ['EXCELLENT', 'GOOD', 'FAIR', 'POOR'],
          },
          {
            name: 'policies_compliance_score',
            type: 'decimal',
            precision: 5,
            scale: 2,
            default: 0,
          },
          {
            name: 'controls_compliance_score',
            type: 'decimal',
            precision: 5,
            scale: 2,
            default: 0,
          },
          {
            name: 'assets_compliance_score',
            type: 'decimal',
            precision: 5,
            scale: 2,
            default: 0,
          },
          // Policy Metrics
          {
            name: 'total_policies',
            type: 'int',
            default: 0,
          },
          {
            name: 'policies_published',
            type: 'int',
            default: 0,
          },
          {
            name: 'policies_acknowledged',
            type: 'int',
            default: 0,
          },
          {
            name: 'policy_acknowledgment_rate',
            type: 'decimal',
            precision: 5,
            scale: 2,
            default: 0,
          },
          // Control Metrics
          {
            name: 'total_controls',
            type: 'int',
            default: 0,
          },
          {
            name: 'controls_implemented',
            type: 'int',
            default: 0,
          },
          {
            name: 'controls_partial',
            type: 'int',
            default: 0,
          },
          {
            name: 'controls_not_implemented',
            type: 'int',
            default: 0,
          },
          {
            name: 'average_control_effectiveness',
            type: 'decimal',
            precision: 5,
            scale: 2,
            default: 0,
          },
          // Asset Metrics
          {
            name: 'total_assets',
            type: 'int',
            default: 0,
          },
          {
            name: 'assets_compliant',
            type: 'int',
            default: 0,
          },
          {
            name: 'asset_compliance_percentage',
            type: 'decimal',
            precision: 5,
            scale: 2,
            default: 0,
          },
          // Gap Analysis
          {
            name: 'critical_gaps',
            type: 'int',
            default: 0,
          },
          {
            name: 'medium_gaps',
            type: 'int',
            default: 0,
          },
          {
            name: 'low_gaps',
            type: 'int',
            default: 0,
          },
          {
            name: 'gap_details',
            type: 'json',
            isNullable: true,
          },
          // Department Breakdown
          {
            name: 'department_breakdown',
            type: 'json',
            isNullable: true,
          },
          // Trend Data
          {
            name: 'compliance_trend',
            type: 'json',
            isNullable: true,
          },
          // Forecasting Data
          {
            name: 'projected_score_next_period',
            type: 'decimal',
            precision: 5,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'projected_days_to_excellent',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'trend_direction',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          // Executive Summary
          {
            name: 'executive_summary',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'key_findings',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'recommendations',
            type: 'text',
            isNullable: true,
          },
          // Metadata
          {
            name: 'is_final',
            type: 'boolean',
            default: false,
          },
          {
            name: 'is_archived',
            type: 'boolean',
            default: false,
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
          {
            name: 'generated_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['created_by_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
        ],
      })
    );

    // Create indexes
    await queryRunner.createIndex(
      'compliance_reports',
      new TableIndex({
        name: 'idx_compliance_reports_period_date',
        columnNames: ['period_start_date', 'period_end_date'],
      })
    );

    await queryRunner.createIndex(
      'compliance_reports',
      new TableIndex({
        name: 'idx_compliance_reports_overall_score',
        columnNames: ['overall_compliance_score'],
      })
    );

    await queryRunner.createIndex(
      'compliance_reports',
      new TableIndex({
        name: 'idx_compliance_reports_created_at',
        columnNames: ['created_at'],
      })
    );

    await queryRunner.createIndex(
      'compliance_reports',
      new TableIndex({
        name: 'idx_compliance_reports_created_by',
        columnNames: ['created_by_id'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop table
    await queryRunner.dropTable('compliance_reports', true);

    // Drop enum types
    await queryRunner.query('DROP TYPE IF EXISTS compliance_score_enum CASCADE;');
    await queryRunner.query('DROP TYPE IF EXISTS report_period_enum CASCADE;');
  }
}
