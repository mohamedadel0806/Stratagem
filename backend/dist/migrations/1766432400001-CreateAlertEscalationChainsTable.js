"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAlertEscalationChainsTable1766432400001 = void 0;
const typeorm_1 = require("typeorm");
class CreateAlertEscalationChainsTable1766432400001 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'alert_escalation_chains',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'alert_id',
                    type: 'uuid',
                    isNullable: false,
                },
                {
                    name: 'alert_rule_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'status',
                    type: 'enum',
                    enum: ['pending', 'in_progress', 'escalated', 'resolved', 'cancelled'],
                    default: "'pending'",
                },
                {
                    name: 'current_level',
                    type: 'int',
                    default: 0,
                },
                {
                    name: 'max_levels',
                    type: 'int',
                    isNullable: false,
                },
                {
                    name: 'escalation_rules',
                    type: 'jsonb',
                    isNullable: false,
                },
                {
                    name: 'next_escalation_at',
                    type: 'timestamp',
                    isNullable: true,
                },
                {
                    name: 'escalation_history',
                    type: 'jsonb',
                    isNullable: true,
                },
                {
                    name: 'workflow_execution_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'escalation_notes',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'resolved_by_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'resolved_at',
                    type: 'timestamp',
                    isNullable: true,
                },
                {
                    name: 'created_by_id',
                    type: 'uuid',
                    isNullable: false,
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
        }), true);
        await queryRunner.createForeignKey('alert_escalation_chains', new typeorm_1.TableForeignKey({
            columnNames: ['alert_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'alerts',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('alert_escalation_chains', new typeorm_1.TableForeignKey({
            columnNames: ['alert_rule_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'alert_rules',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createForeignKey('alert_escalation_chains', new typeorm_1.TableForeignKey({
            columnNames: ['resolved_by_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createForeignKey('alert_escalation_chains', new typeorm_1.TableForeignKey({
            columnNames: ['created_by_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'RESTRICT',
        }));
        await queryRunner.createIndex('alert_escalation_chains', new typeorm_1.TableIndex({
            columnNames: ['alert_id'],
            name: 'idx_escalation_chains_alert_id',
        }));
        await queryRunner.createIndex('alert_escalation_chains', new typeorm_1.TableIndex({
            columnNames: ['status'],
            name: 'idx_escalation_chains_status',
        }));
        await queryRunner.createIndex('alert_escalation_chains', new typeorm_1.TableIndex({
            columnNames: ['next_escalation_at'],
            name: 'idx_escalation_chains_next_escalation',
        }));
        await queryRunner.createIndex('alert_escalation_chains', new typeorm_1.TableIndex({
            columnNames: ['created_at'],
            name: 'idx_escalation_chains_created_at',
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('alert_escalation_chains', true);
    }
}
exports.CreateAlertEscalationChainsTable1766432400001 = CreateAlertEscalationChainsTable1766432400001;
//# sourceMappingURL=1766432400001-CreateAlertEscalationChainsTable.js.map