"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateComplianceReportsTable1766432400000 = void 0;
const typeorm_1 = require("typeorm");
class CreateComplianceReportsTable1766432400000 {
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TYPE compliance_score_enum AS ENUM ('EXCELLENT', 'GOOD', 'FAIR', 'POOR');
    `);
        await queryRunner.query(`
      CREATE TYPE report_period_enum AS ENUM ('WEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUAL', 'CUSTOM');
    `);
        await queryRunner.createTable(new typeorm_1.Table({
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
                {
                    name: 'department_breakdown',
                    type: 'json',
                    isNullable: true,
                },
                {
                    name: 'compliance_trend',
                    type: 'json',
                    isNullable: true,
                },
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
        }));
        await queryRunner.createIndex('compliance_reports', new typeorm_1.TableIndex({
            name: 'idx_compliance_reports_period_date',
            columnNames: ['period_start_date', 'period_end_date'],
        }));
        await queryRunner.createIndex('compliance_reports', new typeorm_1.TableIndex({
            name: 'idx_compliance_reports_overall_score',
            columnNames: ['overall_compliance_score'],
        }));
        await queryRunner.createIndex('compliance_reports', new typeorm_1.TableIndex({
            name: 'idx_compliance_reports_created_at',
            columnNames: ['created_at'],
        }));
        await queryRunner.createIndex('compliance_reports', new typeorm_1.TableIndex({
            name: 'idx_compliance_reports_created_by',
            columnNames: ['created_by_id'],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('compliance_reports', true);
        await queryRunner.query('DROP TYPE IF EXISTS compliance_score_enum CASCADE;');
        await queryRunner.query('DROP TYPE IF EXISTS report_period_enum CASCADE;');
    }
}
exports.CreateComplianceReportsTable1766432400000 = CreateComplianceReportsTable1766432400000;
//# sourceMappingURL=1766432400000-CreateComplianceReportsTable.js.map