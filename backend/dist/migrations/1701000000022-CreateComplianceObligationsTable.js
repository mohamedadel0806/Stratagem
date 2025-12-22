"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateComplianceObligationsTable1701000000022 = void 0;
const typeorm_1 = require("typeorm");
class CreateComplianceObligationsTable1701000000022 {
    async up(queryRunner) {
        const tableExists = await queryRunner.hasTable('compliance_obligations');
        if (!tableExists) {
            await queryRunner.createTable(new typeorm_1.Table({
                name: 'compliance_obligations',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'obligation_identifier',
                        type: 'varchar',
                        length: '100',
                        isUnique: true,
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                        length: '500',
                    },
                    {
                        name: 'description',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'influencer_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'source_reference',
                        type: 'varchar',
                        length: '200',
                        isNullable: true,
                    },
                    {
                        name: 'owner_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'business_unit_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'status',
                        type: 'enum',
                        enum: ['not_started', 'in_progress', 'met', 'partially_met', 'not_met', 'not_applicable', 'overdue'],
                        default: "'not_started'",
                    },
                    {
                        name: 'priority',
                        type: 'enum',
                        enum: ['critical', 'high', 'medium', 'low'],
                        default: "'medium'",
                    },
                    {
                        name: 'due_date',
                        type: 'date',
                        isNullable: true,
                    },
                    {
                        name: 'completion_date',
                        type: 'date',
                        isNullable: true,
                    },
                    {
                        name: 'evidence_summary',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'custom_fields',
                        type: 'jsonb',
                        isNullable: true,
                    },
                    {
                        name: 'created_by',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamptz',
                        default: 'now()',
                    },
                    {
                        name: 'updated_by',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamptz',
                        default: 'now()',
                    },
                    {
                        name: 'deleted_at',
                        type: 'timestamptz',
                        isNullable: true,
                    },
                ],
            }), true);
            await queryRunner.createIndex('compliance_obligations', new typeorm_1.TableIndex({
                columnNames: ['influencer_id'],
            }));
            await queryRunner.createIndex('compliance_obligations', new typeorm_1.TableIndex({
                columnNames: ['owner_id'],
            }));
            await queryRunner.createIndex('compliance_obligations', new typeorm_1.TableIndex({
                columnNames: ['business_unit_id'],
            }));
            await queryRunner.createForeignKey('compliance_obligations', new typeorm_1.TableForeignKey({
                columnNames: ['influencer_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'influencers',
                onDelete: 'SET NULL',
            }));
            await queryRunner.createForeignKey('compliance_obligations', new typeorm_1.TableForeignKey({
                columnNames: ['owner_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'SET NULL',
            }));
            await queryRunner.createForeignKey('compliance_obligations', new typeorm_1.TableForeignKey({
                columnNames: ['business_unit_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'business_units',
                onDelete: 'SET NULL',
            }));
        }
    }
    async down(queryRunner) {
        await queryRunner.dropTable('compliance_obligations');
    }
}
exports.CreateComplianceObligationsTable1701000000022 = CreateComplianceObligationsTable1701000000022;
//# sourceMappingURL=1701000000022-CreateComplianceObligationsTable.js.map