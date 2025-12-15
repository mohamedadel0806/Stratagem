"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateGovernanceMetricSnapshotsTable1701000000101 = void 0;
const typeorm_1 = require("typeorm");
class CreateGovernanceMetricSnapshotsTable1701000000101 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'governance_metric_snapshots',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'snapshot_date',
                    type: 'date',
                    isNullable: false,
                    isUnique: true,
                },
                {
                    name: 'compliance_rate',
                    type: 'double precision',
                    default: 0,
                },
                {
                    name: 'implemented_controls',
                    type: 'integer',
                    default: 0,
                },
                {
                    name: 'total_controls',
                    type: 'integer',
                    default: 0,
                },
                {
                    name: 'open_findings',
                    type: 'integer',
                    default: 0,
                },
                {
                    name: 'critical_findings',
                    type: 'integer',
                    default: 0,
                },
                {
                    name: 'assessment_completion_rate',
                    type: 'double precision',
                    default: 0,
                },
                {
                    name: 'risk_closure_rate',
                    type: 'double precision',
                    default: 0,
                },
                {
                    name: 'completed_assessments',
                    type: 'integer',
                    default: 0,
                },
                {
                    name: 'total_assessments',
                    type: 'integer',
                    default: 0,
                },
                {
                    name: 'approved_evidence',
                    type: 'integer',
                    default: 0,
                },
                {
                    name: 'metadata',
                    type: 'jsonb',
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
        }));
        await queryRunner.createIndex('governance_metric_snapshots', new typeorm_1.TableIndex({
            name: 'IDX_governance_metric_snapshots_date',
            columnNames: ['snapshot_date'],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropIndex('governance_metric_snapshots', 'IDX_governance_metric_snapshots_date');
        await queryRunner.dropTable('governance_metric_snapshots');
    }
}
exports.CreateGovernanceMetricSnapshotsTable1701000000101 = CreateGovernanceMetricSnapshotsTable1701000000101;
//# sourceMappingURL=1701000000101-CreateGovernanceMetricSnapshotsTable.js.map