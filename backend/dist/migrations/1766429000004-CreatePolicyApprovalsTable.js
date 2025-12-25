"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePolicyApprovalsTable1766429000004 = void 0;
const typeorm_1 = require("typeorm");
class CreatePolicyApprovalsTable1766429000004 {
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TYPE policy_approval_approval_status_enum AS ENUM(
        'pending',
        'approved',
        'rejected',
        'revoked'
      );
    `);
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'policy_approvals',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'policy_id',
                    type: 'uuid',
                },
                {
                    name: 'approver_id',
                    type: 'uuid',
                },
                {
                    name: 'approval_status',
                    type: 'enum',
                    enum: ['pending', 'approved', 'rejected', 'revoked'],
                    default: "'pending'",
                },
                {
                    name: 'sequence_order',
                    type: 'integer',
                },
                {
                    name: 'comments',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'approved_at',
                    type: 'timestamp',
                    isNullable: true,
                },
            ],
            indices: [
                {
                    name: 'idx_policy_approvals_policy_id_approval_status',
                    columnNames: ['policy_id', 'approval_status'],
                },
                {
                    name: 'idx_policy_approvals_approver_id',
                    columnNames: ['approver_id'],
                },
                {
                    name: 'idx_policy_approvals_approval_status',
                    columnNames: ['approval_status'],
                },
            ],
            foreignKeys: [
                {
                    name: 'fk_policy_approvals_policy_id',
                    columnNames: ['policy_id'],
                    referencedTableName: 'policies',
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                },
                {
                    name: 'fk_policy_approvals_approver_id',
                    columnNames: ['approver_id'],
                    referencedTableName: 'users',
                    referencedColumnNames: ['id'],
                    onDelete: 'RESTRICT',
                    onUpdate: 'CASCADE',
                },
            ],
        }), true);
    }
    async down(queryRunner) {
        await queryRunner.dropTable('policy_approvals');
        await queryRunner.query(`DROP TYPE IF EXISTS policy_approval_approval_status_enum;`);
    }
}
exports.CreatePolicyApprovalsTable1766429000004 = CreatePolicyApprovalsTable1766429000004;
//# sourceMappingURL=1766429000004-CreatePolicyApprovalsTable.js.map