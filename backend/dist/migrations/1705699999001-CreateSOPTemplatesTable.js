"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSOPTemplatesTable1705699999001 = void 0;
const typeorm_1 = require("typeorm");
class CreateSOPTemplatesTable1705699999001 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'sop_templates',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'uuid',
                },
                {
                    name: 'template_key',
                    type: 'varchar',
                    length: '255',
                    isUnique: true,
                    isNullable: false,
                },
                {
                    name: 'title',
                    type: 'varchar',
                    length: '255',
                    isNullable: false,
                },
                {
                    name: 'category',
                    type: 'varchar',
                    length: '100',
                    isNullable: true,
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'purpose_template',
                    type: 'text',
                    isNullable: false,
                },
                {
                    name: 'scope_template',
                    type: 'text',
                    isNullable: false,
                },
                {
                    name: 'content_template',
                    type: 'text',
                    isNullable: false,
                },
                {
                    name: 'success_criteria_template',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'status',
                    type: 'varchar',
                    length: '50',
                    default: "'draft'",
                },
                {
                    name: 'version_number',
                    type: 'integer',
                    default: 1,
                },
                {
                    name: 'owner_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'tags',
                    type: 'varchar[]',
                    isNullable: true,
                },
                {
                    name: 'metadata',
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
        await queryRunner.createIndex('sop_templates', new typeorm_1.TableIndex({ columnNames: ['template_key'] }));
        await queryRunner.createIndex('sop_templates', new typeorm_1.TableIndex({ columnNames: ['status'] }));
        await queryRunner.createIndex('sop_templates', new typeorm_1.TableIndex({ columnNames: ['category'] }));
        await queryRunner.createForeignKey('sop_templates', new typeorm_1.TableForeignKey({
            columnNames: ['owner_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createForeignKey('sop_templates', new typeorm_1.TableForeignKey({
            columnNames: ['created_by'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createForeignKey('sop_templates', new typeorm_1.TableForeignKey({
            columnNames: ['updated_by'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('sop_templates', true);
    }
}
exports.CreateSOPTemplatesTable1705699999001 = CreateSOPTemplatesTable1705699999001;
//# sourceMappingURL=1705699999001-CreateSOPTemplatesTable.js.map