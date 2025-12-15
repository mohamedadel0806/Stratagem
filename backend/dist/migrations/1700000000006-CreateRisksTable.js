"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRisksTable1700000000006 = void 0;
const typeorm_1 = require("typeorm");
class CreateRisksTable1700000000006 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'risks',
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
                    name: 'category',
                    type: 'enum',
                    enum: ['cybersecurity', 'data_privacy', 'compliance', 'operational', 'financial', 'strategic', 'reputational'],
                    default: "'compliance'",
                },
                {
                    name: 'status',
                    type: 'enum',
                    enum: ['identified', 'assessed', 'mitigated', 'accepted', 'closed'],
                    default: "'identified'",
                },
                {
                    name: 'likelihood',
                    type: 'enum',
                    enum: ['1', '2', '3', '4', '5'],
                    default: "'3'",
                },
                {
                    name: 'impact',
                    type: 'enum',
                    enum: ['1', '2', '3', '4', '5'],
                    default: "'3'",
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
        await queryRunner.dropTable('risks');
    }
}
exports.CreateRisksTable1700000000006 = CreateRisksTable1700000000006;
//# sourceMappingURL=1700000000006-CreateRisksTable.js.map