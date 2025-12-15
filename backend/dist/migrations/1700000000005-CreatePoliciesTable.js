"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePoliciesTable1700000000005 = void 0;
const typeorm_1 = require("typeorm");
class CreatePoliciesTable1700000000005 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'policies',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'title',
                    type: 'varchar',
                    length: '255',
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'policy_type',
                    type: 'enum',
                    enum: ['security', 'compliance', 'operational', 'it', 'hr', 'finance'],
                    default: "'compliance'",
                },
                {
                    name: 'status',
                    type: 'enum',
                    enum: ['draft', 'active', 'under_review', 'archived'],
                    default: "'draft'",
                },
                {
                    name: 'version',
                    type: 'varchar',
                    length: '50',
                    isNullable: true,
                },
                {
                    name: 'organization_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'owner_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'effective_date',
                    type: 'timestamp',
                    isNullable: true,
                },
                {
                    name: 'review_date',
                    type: 'timestamp',
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
                    onUpdate: 'CURRENT_TIMESTAMP',
                },
            ],
        }), true);
    }
    async down(queryRunner) {
        await queryRunner.dropTable('policies');
    }
}
exports.CreatePoliciesTable1700000000005 = CreatePoliciesTable1700000000005;
//# sourceMappingURL=1700000000005-CreatePoliciesTable.js.map