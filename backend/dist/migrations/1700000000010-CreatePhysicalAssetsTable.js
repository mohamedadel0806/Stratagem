"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePhysicalAssetsTable1700000000010 = void 0;
const typeorm_1 = require("typeorm");
class CreatePhysicalAssetsTable1700000000010 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'physical_assets',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'asset_identifier',
                    type: 'varchar',
                    length: '255',
                    isUnique: true,
                },
                {
                    name: 'asset_description',
                    type: 'varchar',
                    length: '255',
                },
                {
                    name: 'asset_type',
                    type: 'enum',
                    enum: ['server', 'workstation', 'network_device', 'mobile_device', 'iot_device', 'printer', 'storage_device', 'other'],
                    default: "'other'",
                },
                {
                    name: 'manufacturer',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                {
                    name: 'model',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                {
                    name: 'serial_number',
                    type: 'varchar',
                    length: '100',
                    isNullable: true,
                },
                {
                    name: 'location',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                {
                    name: 'building',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                {
                    name: 'floor',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                {
                    name: 'room',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                {
                    name: 'ip_addresses',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'mac_addresses',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'connectivity_status',
                    type: 'enum',
                    enum: ['connected', 'disconnected', 'unknown'],
                    default: "'unknown'",
                },
                {
                    name: 'network_approval_status',
                    type: 'enum',
                    enum: ['approved', 'pending', 'rejected', 'not_required'],
                    default: "'not_required'",
                },
                {
                    name: 'network_approval_date',
                    type: 'timestamp',
                    isNullable: true,
                },
                {
                    name: 'owner_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'business_unit',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                {
                    name: 'department',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                {
                    name: 'criticality_level',
                    type: 'enum',
                    enum: ['critical', 'high', 'medium', 'low'],
                    default: "'medium'",
                },
                {
                    name: 'compliance_requirements',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'data_classification',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                {
                    name: 'contains_pii',
                    type: 'boolean',
                    default: false,
                },
                {
                    name: 'contains_phi',
                    type: 'boolean',
                    default: false,
                },
                {
                    name: 'contains_financial_data',
                    type: 'boolean',
                    default: false,
                },
                {
                    name: 'purchase_date',
                    type: 'date',
                    isNullable: true,
                },
                {
                    name: 'warranty_expiry_date',
                    type: 'date',
                    isNullable: true,
                },
                {
                    name: 'vendor',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                {
                    name: 'notes',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'custom_attributes',
                    type: 'jsonb',
                    isNullable: true,
                },
                {
                    name: 'is_deleted',
                    type: 'boolean',
                    default: false,
                },
                {
                    name: 'deleted_at',
                    type: 'timestamp',
                    isNullable: true,
                },
                {
                    name: 'deleted_by_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'created_by_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'updated_by_id',
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
                },
            ],
        }), true);
        await queryRunner.createForeignKey('physical_assets', new typeorm_1.TableForeignKey({
            columnNames: ['owner_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createForeignKey('physical_assets', new typeorm_1.TableForeignKey({
            columnNames: ['created_by_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createForeignKey('physical_assets', new typeorm_1.TableForeignKey({
            columnNames: ['updated_by_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createForeignKey('physical_assets', new typeorm_1.TableForeignKey({
            columnNames: ['deleted_by_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createIndex('physical_assets', new typeorm_1.TableIndex({
            name: 'IDX_PHYSICAL_ASSETS_IDENTIFIER',
            columnNames: ['asset_identifier'],
            isUnique: true,
        }));
        await queryRunner.createIndex('physical_assets', new typeorm_1.TableIndex({
            name: 'IDX_PHYSICAL_ASSETS_OWNER',
            columnNames: ['owner_id'],
        }));
        await queryRunner.createIndex('physical_assets', new typeorm_1.TableIndex({
            name: 'IDX_PHYSICAL_ASSETS_BUSINESS_UNIT',
            columnNames: ['business_unit'],
        }));
        await queryRunner.createIndex('physical_assets', new typeorm_1.TableIndex({
            name: 'IDX_PHYSICAL_ASSETS_CRITICALITY',
            columnNames: ['criticality_level'],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('physical_assets', true);
    }
}
exports.CreatePhysicalAssetsTable1700000000010 = CreatePhysicalAssetsTable1700000000010;
//# sourceMappingURL=1700000000010-CreatePhysicalAssetsTable.js.map