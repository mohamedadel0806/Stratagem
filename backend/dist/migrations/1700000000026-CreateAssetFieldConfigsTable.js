"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAssetFieldConfigsTable1700000000026 = void 0;
const typeorm_1 = require("typeorm");
class CreateAssetFieldConfigsTable1700000000026 {
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TYPE asset_type_enum AS ENUM (
        'physical',
        'information',
        'application',
        'software',
        'supplier'
      );
    `);
        await queryRunner.query(`
      CREATE TYPE field_type_enum AS ENUM (
        'text',
        'number',
        'date',
        'boolean',
        'select',
        'multi_select',
        'textarea',
        'email',
        'url'
      );
    `);
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'asset_field_configs',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'asset_type',
                    type: 'asset_type_enum',
                },
                {
                    name: 'field_name',
                    type: 'varchar',
                    length: '100',
                },
                {
                    name: 'display_name',
                    type: 'varchar',
                    length: '200',
                },
                {
                    name: 'field_type',
                    type: 'field_type_enum',
                },
                {
                    name: 'is_required',
                    type: 'boolean',
                    default: false,
                },
                {
                    name: 'is_enabled',
                    type: 'boolean',
                    default: true,
                },
                {
                    name: 'display_order',
                    type: 'int',
                    isNullable: true,
                },
                {
                    name: 'validation_rule',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'validation_message',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'select_options',
                    type: 'jsonb',
                    isNullable: true,
                },
                {
                    name: 'default_value',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'help_text',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'field_dependencies',
                    type: 'jsonb',
                    isNullable: true,
                },
                {
                    name: 'created_by_id',
                    type: 'uuid',
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
                },
            ],
        }), true);
        await queryRunner.createForeignKey('asset_field_configs', new typeorm_1.TableForeignKey({
            columnNames: ['created_by_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createIndex('asset_field_configs', new typeorm_1.TableIndex({
            name: 'IDX_FIELD_CONFIG_UNIQUE',
            columnNames: ['asset_type', 'field_name'],
            isUnique: true,
        }));
        await queryRunner.createIndex('asset_field_configs', new typeorm_1.TableIndex({
            name: 'IDX_FIELD_CONFIG_ASSET_TYPE',
            columnNames: ['asset_type'],
        }));
        await queryRunner.createIndex('asset_field_configs', new typeorm_1.TableIndex({
            name: 'IDX_FIELD_CONFIG_ENABLED',
            columnNames: ['asset_type', 'is_enabled'],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('asset_field_configs', true);
        await queryRunner.query('DROP TYPE IF EXISTS asset_type_enum');
        await queryRunner.query('DROP TYPE IF EXISTS field_type_enum');
    }
}
exports.CreateAssetFieldConfigsTable1700000000026 = CreateAssetFieldConfigsTable1700000000026;
//# sourceMappingURL=1700000000026-CreateAssetFieldConfigsTable.js.map