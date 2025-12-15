"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRemediationTrackersTable1701000000102 = void 0;
const typeorm_1 = require("typeorm");
class CreateRemediationTrackersTable1701000000102 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'remediation_trackers',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'finding_id',
                    type: 'uuid',
                    isNullable: false,
                },
                {
                    name: 'remediation_priority',
                    type: 'varchar',
                    length: '50',
                    default: "'medium'",
                },
                {
                    name: 'sla_due_date',
                    type: 'date',
                    isNullable: false,
                },
                {
                    name: 'remediation_steps',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'assigned_to_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'progress_percent',
                    type: 'integer',
                    default: 0,
                },
                {
                    name: 'progress_notes',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'completion_date',
                    type: 'date',
                    isNullable: true,
                },
                {
                    name: 'sla_met',
                    type: 'boolean',
                    default: false,
                },
                {
                    name: 'days_to_completion',
                    type: 'integer',
                    isNullable: true,
                },
                {
                    name: 'completion_evidence',
                    type: 'jsonb',
                    isNullable: true,
                },
                {
                    name: 'completion_notes',
                    type: 'text',
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
                    name: 'updated_by',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }));
        await queryRunner.createForeignKey('remediation_trackers', new typeorm_1.TableForeignKey({
            columnNames: ['finding_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'findings',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('remediation_trackers', new typeorm_1.TableForeignKey({
            columnNames: ['assigned_to_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createForeignKey('remediation_trackers', new typeorm_1.TableForeignKey({
            columnNames: ['created_by'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createForeignKey('remediation_trackers', new typeorm_1.TableForeignKey({
            columnNames: ['updated_by'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createIndex('remediation_trackers', new typeorm_1.TableIndex({ columnNames: ['finding_id'] }));
        await queryRunner.createIndex('remediation_trackers', new typeorm_1.TableIndex({ columnNames: ['remediation_priority'] }));
        await queryRunner.createIndex('remediation_trackers', new typeorm_1.TableIndex({ columnNames: ['sla_due_date'] }));
        await queryRunner.createIndex('remediation_trackers', new typeorm_1.TableIndex({ columnNames: ['assigned_to_id'] }));
        await queryRunner.createIndex('remediation_trackers', new typeorm_1.TableIndex({
            name: 'IDX_remediation_trackers_open',
            columnNames: ['completion_date'],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropIndex('remediation_trackers', 'IDX_remediation_trackers_open');
        await queryRunner.dropIndex('remediation_trackers', 'IDX_remediation_trackers_assigned_to_id');
        await queryRunner.dropIndex('remediation_trackers', 'IDX_remediation_trackers_sla_due_date');
        await queryRunner.dropIndex('remediation_trackers', 'IDX_remediation_trackers_remediation_priority');
        await queryRunner.dropIndex('remediation_trackers', 'IDX_remediation_trackers_finding_id');
        await queryRunner.dropForeignKey('remediation_trackers', 'FK_remediation_trackers_updated_by_users_id');
        await queryRunner.dropForeignKey('remediation_trackers', 'FK_remediation_trackers_created_by_users_id');
        await queryRunner.dropForeignKey('remediation_trackers', 'FK_remediation_trackers_assigned_to_id_users_id');
        await queryRunner.dropForeignKey('remediation_trackers', 'FK_remediation_trackers_finding_id_findings_id');
        await queryRunner.dropTable('remediation_trackers');
    }
}
exports.CreateRemediationTrackersTable1701000000102 = CreateRemediationTrackersTable1701000000102;
//# sourceMappingURL=1701000000102-CreateRemediationTrackersTable.js.map