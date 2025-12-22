"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSOPFeedbackTable1705699999003 = void 0;
const typeorm_1 = require("typeorm");
class CreateSOPFeedbackTable1705699999003 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'sop_feedback',
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
                    name: 'submitted_by',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'sentiment',
                    type: 'varchar',
                    length: '50',
                    default: "'neutral'",
                },
                {
                    name: 'effectiveness_rating',
                    type: 'integer',
                    isNullable: true,
                },
                {
                    name: 'clarity_rating',
                    type: 'integer',
                    isNullable: true,
                },
                {
                    name: 'completeness_rating',
                    type: 'integer',
                    isNullable: true,
                },
                {
                    name: 'comments',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'improvement_suggestions',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'tagged_issues',
                    type: 'varchar[]',
                    isNullable: true,
                },
                {
                    name: 'follow_up_required',
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
        await queryRunner.createIndex('sop_feedback', new typeorm_1.TableIndex({ columnNames: ['sop_id'] }));
        await queryRunner.createIndex('sop_feedback', new typeorm_1.TableIndex({ columnNames: ['submitted_by'] }));
        await queryRunner.createIndex('sop_feedback', new typeorm_1.TableIndex({ columnNames: ['created_at'] }));
        await queryRunner.createIndex('sop_feedback', new typeorm_1.TableIndex({ columnNames: ['sentiment'] }));
        await queryRunner.createForeignKey('sop_feedback', new typeorm_1.TableForeignKey({
            columnNames: ['sop_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'sops',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('sop_feedback', new typeorm_1.TableForeignKey({
            columnNames: ['submitted_by'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createForeignKey('sop_feedback', new typeorm_1.TableForeignKey({
            columnNames: ['created_by'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createForeignKey('sop_feedback', new typeorm_1.TableForeignKey({
            columnNames: ['updated_by'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('sop_feedback', true);
    }
}
exports.CreateSOPFeedbackTable1705699999003 = CreateSOPFeedbackTable1705699999003;
//# sourceMappingURL=1705699999003-CreateSOPFeedbackTable.js.map