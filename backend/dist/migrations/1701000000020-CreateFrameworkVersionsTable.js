"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateFrameworkVersionsTable1701000000020 = void 0;
const typeorm_1 = require("typeorm");
class CreateFrameworkVersionsTable1701000000020 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'framework_versions',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'framework_id',
                    type: 'uuid',
                    isNullable: false,
                },
                {
                    name: 'version',
                    type: 'varchar',
                    length: '50',
                    isNullable: false,
                },
                {
                    name: 'version_notes',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'structure',
                    type: 'jsonb',
                    isNullable: true,
                },
                {
                    name: 'effective_date',
                    type: 'date',
                    isNullable: true,
                },
                {
                    name: 'is_current',
                    type: 'boolean',
                    default: false,
                },
                {
                    name: 'created_by',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }), true);
        await queryRunner.createIndex('framework_versions', new typeorm_1.TableIndex({
            name: 'idx_framework_versions_framework_id',
            columnNames: ['framework_id'],
        }));
        await queryRunner.createIndex('framework_versions', new typeorm_1.TableIndex({
            name: 'idx_framework_versions_version',
            columnNames: ['version'],
        }));
        await queryRunner.createIndex('framework_versions', new typeorm_1.TableIndex({
            name: 'idx_framework_versions_framework_version',
            columnNames: ['framework_id', 'version'],
            isUnique: true,
        }));
        await queryRunner.createForeignKey('framework_versions', new typeorm_1.TableForeignKey({
            columnNames: ['framework_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'compliance_frameworks',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('framework_versions', new typeorm_1.TableForeignKey({
            columnNames: ['created_by'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
    }
    async down(queryRunner) {
        const table = await queryRunner.getTable('framework_versions');
        if (table) {
            const foreignKeys = table.foreignKeys;
            for (const fk of foreignKeys) {
                await queryRunner.dropForeignKey('framework_versions', fk);
            }
        }
        await queryRunner.dropTable('framework_versions');
    }
}
exports.CreateFrameworkVersionsTable1701000000020 = CreateFrameworkVersionsTable1701000000020;
//# sourceMappingURL=1701000000020-CreateFrameworkVersionsTable.js.map