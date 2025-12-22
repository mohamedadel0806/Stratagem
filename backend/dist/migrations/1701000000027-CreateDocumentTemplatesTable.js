"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDocumentTemplatesTable1701000000027 = void 0;
const typeorm_1 = require("typeorm");
class CreateDocumentTemplatesTable1701000000027 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'document_templates',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'uuid',
                },
                {
                    name: 'name',
                    type: 'varchar',
                    length: '255',
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'type',
                    type: 'enum',
                    enum: ['policy', 'sop', 'standard', 'report'],
                },
                {
                    name: 'category',
                    type: 'varchar',
                    length: '100',
                    isNullable: true,
                },
                {
                    name: 'content',
                    type: 'text',
                },
                {
                    name: 'structure',
                    type: 'jsonb',
                    isNullable: true,
                },
                {
                    name: 'version',
                    type: 'varchar',
                    length: '50',
                    default: "'1.0'",
                },
                {
                    name: 'isActive',
                    type: 'boolean',
                    default: true,
                },
                {
                    name: 'restricted_to_roles',
                    type: 'uuid',
                    isArray: true,
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
        await queryRunner.createIndex('document_templates', new typeorm_1.TableIndex({ columnNames: ['type'] }));
        await queryRunner.createIndex('document_templates', new typeorm_1.TableIndex({ columnNames: ['category'] }));
        await queryRunner.createIndex('document_templates', new typeorm_1.TableIndex({ columnNames: ['isActive'] }));
        await queryRunner.createForeignKey('document_templates', new typeorm_1.TableForeignKey({
            columnNames: ['created_by'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('document_templates');
    }
}
exports.CreateDocumentTemplatesTable1701000000027 = CreateDocumentTemplatesTable1701000000027;
//# sourceMappingURL=1701000000027-CreateDocumentTemplatesTable.js.map