"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSOPStepTable1705699999004 = void 0;
const typeorm_1 = require("typeorm");
class CreateSOPStepTable1705699999004 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'sop_steps',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'uuid',
                },
                {
                    name: 'sop_id',
                    type: 'uuid',
                    isNullable: false,
                },
                {
                    name: 'step_number',
                    type: 'integer',
                    isNullable: false,
                },
                {
                    name: 'title',
                    type: 'varchar',
                    length: '255',
                    isNullable: false,
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'expected_outcome',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'responsible_role',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                {
                    name: 'estimated_duration_minutes',
                    type: 'integer',
                    isNullable: true,
                },
                {
                    name: 'required_evidence',
                    type: 'jsonb',
                    isNullable: true,
                },
                {
                    name: 'is_critical',
                    type: 'boolean',
                    default: 'false',
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
        await queryRunner.createIndex('sop_steps', new typeorm_1.TableIndex({ columnNames: ['sop_id'] }));
        await queryRunner.createIndex('sop_steps', new typeorm_1.TableIndex({ columnNames: ['sop_id', 'step_number'] }));
        await queryRunner.createIndex('sop_steps', new typeorm_1.TableIndex({ columnNames: ['is_critical'] }));
        await queryRunner.createIndex('sop_steps', new typeorm_1.TableIndex({ columnNames: ['created_by'] }));
        await queryRunner.createForeignKey('sop_steps', new typeorm_1.TableForeignKey({
            columnNames: ['sop_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'sops',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('sop_steps', new typeorm_1.TableForeignKey({
            columnNames: ['created_by'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createForeignKey('sop_steps', new typeorm_1.TableForeignKey({
            columnNames: ['updated_by'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('sop_steps', true);
    }
}
exports.CreateSOPStepTable1705699999004 = CreateSOPStepTable1705699999004;
//# sourceMappingURL=1705699999004-CreateSOPStepTable.js.map