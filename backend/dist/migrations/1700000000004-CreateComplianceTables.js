"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateComplianceTables1700000000004 = void 0;
const typeorm_1 = require("typeorm");
class CreateComplianceTables1700000000004 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'compliance_frameworks',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'name',
                    type: 'varchar',
                    length: '100',
                },
                {
                    name: 'code',
                    type: 'varchar',
                    length: '50',
                    isNullable: true,
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'region',
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
        await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_compliance_frameworks_name" ON "compliance_frameworks" ("name");
    `);
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'compliance_requirements',
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
                    name: 'requirement_code',
                    type: 'varchar',
                    length: '50',
                    isNullable: true,
                },
                {
                    name: 'framework_id',
                    type: 'uuid',
                },
                {
                    name: 'status',
                    type: 'enum',
                    enum: ['not_started', 'in_progress', 'compliant', 'non_compliant', 'partially_compliant'],
                    default: "'not_started'",
                },
                {
                    name: 'organization_id',
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
        await queryRunner.createForeignKey('compliance_requirements', new typeorm_1.TableForeignKey({
            columnNames: ['framework_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'compliance_frameworks',
            onDelete: 'CASCADE',
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('compliance_requirements');
        await queryRunner.dropTable('compliance_frameworks');
    }
}
exports.CreateComplianceTables1700000000004 = CreateComplianceTables1700000000004;
//# sourceMappingURL=1700000000004-CreateComplianceTables.js.map