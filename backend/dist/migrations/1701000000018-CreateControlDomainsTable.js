"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateControlDomainsTable1701000000018 = void 0;
const typeorm_1 = require("typeorm");
class CreateControlDomainsTable1701000000018 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'control_domains',
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
                    length: '200',
                    isNullable: false,
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'parent_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'owner_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'code',
                    type: 'varchar',
                    length: '100',
                    isNullable: true,
                },
                {
                    name: 'display_order',
                    type: 'integer',
                    default: 0,
                },
                {
                    name: 'is_active',
                    type: 'boolean',
                    default: true,
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
                {
                    name: 'updated_by',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'deleted_at',
                    type: 'timestamp',
                    isNullable: true,
                },
            ],
        }), true);
        await queryRunner.createIndex('control_domains', new typeorm_1.TableIndex({
            name: 'idx_control_domains_parent_id',
            columnNames: ['parent_id'],
        }));
        await queryRunner.createIndex('control_domains', new typeorm_1.TableIndex({
            name: 'idx_control_domains_owner_id',
            columnNames: ['owner_id'],
        }));
        await queryRunner.createIndex('control_domains', new typeorm_1.TableIndex({
            name: 'idx_control_domains_name',
            columnNames: ['name'],
        }));
        await queryRunner.createForeignKey('control_domains', new typeorm_1.TableForeignKey({
            columnNames: ['parent_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'control_domains',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createForeignKey('control_domains', new typeorm_1.TableForeignKey({
            columnNames: ['owner_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createForeignKey('control_domains', new typeorm_1.TableForeignKey({
            columnNames: ['created_by'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createForeignKey('control_domains', new typeorm_1.TableForeignKey({
            columnNames: ['updated_by'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
    }
    async down(queryRunner) {
        const table = await queryRunner.getTable('control_domains');
        if (table) {
            const foreignKeys = table.foreignKeys;
            for (const fk of foreignKeys) {
                await queryRunner.dropForeignKey('control_domains', fk);
            }
        }
        await queryRunner.dropTable('control_domains');
    }
}
exports.CreateControlDomainsTable1701000000018 = CreateControlDomainsTable1701000000018;
//# sourceMappingURL=1701000000018-CreateControlDomainsTable.js.map