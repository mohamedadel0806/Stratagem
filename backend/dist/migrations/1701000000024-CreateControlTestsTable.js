"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateControlTestsTable1701000000024 = void 0;
const typeorm_1 = require("typeorm");
class CreateControlTestsTable1701000000024 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'control_tests',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'uuid',
                },
                {
                    name: 'unified_control_id',
                    type: 'uuid',
                },
                {
                    name: 'control_asset_mapping_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'test_type',
                    type: 'enum',
                    enum: ['design', 'operating', 'technical', 'management'],
                    default: "'operating'",
                },
                {
                    name: 'test_date',
                    type: 'date',
                },
                {
                    name: 'status',
                    type: 'enum',
                    enum: ['planned', 'in_progress', 'completed', 'cancelled'],
                    default: "'planned'",
                },
                {
                    name: 'result',
                    type: 'enum',
                    enum: ['pass', 'fail', 'inconclusive', 'not_applicable'],
                    isNullable: true,
                },
                {
                    name: 'effectiveness_score',
                    type: 'integer',
                    isNullable: true,
                },
                {
                    name: 'test_procedure',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'observations',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'recommendations',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'evidence_links',
                    type: 'jsonb',
                    isNullable: true,
                },
                {
                    name: 'tester_id',
                    type: 'uuid',
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
        await queryRunner.createIndex('control_tests', new typeorm_1.TableIndex({ columnNames: ['unified_control_id'] }));
        await queryRunner.createIndex('control_tests', new typeorm_1.TableIndex({ columnNames: ['status'] }));
        await queryRunner.createIndex('control_tests', new typeorm_1.TableIndex({ columnNames: ['test_date'] }));
        await queryRunner.createIndex('control_tests', new typeorm_1.TableIndex({ columnNames: ['tester_id'] }));
        await queryRunner.createForeignKey('control_tests', new typeorm_1.TableForeignKey({
            columnNames: ['unified_control_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'unified_controls',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('control_tests', new typeorm_1.TableForeignKey({
            columnNames: ['control_asset_mapping_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'control_asset_mappings',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createForeignKey('control_tests', new typeorm_1.TableForeignKey({
            columnNames: ['tester_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('control_tests');
    }
}
exports.CreateControlTestsTable1701000000024 = CreateControlTestsTable1701000000024;
//# sourceMappingURL=1701000000024-CreateControlTestsTable.js.map