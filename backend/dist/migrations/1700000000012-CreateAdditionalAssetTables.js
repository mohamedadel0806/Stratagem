"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAdditionalAssetTables1700000000012 = void 0;
const typeorm_1 = require("typeorm");
class CreateAdditionalAssetTables1700000000012 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'information_assets',
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
                    name: 'asset_name',
                    type: 'varchar',
                    length: '255',
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'data_classification',
                    type: 'enum',
                    enum: ['public', 'internal', 'confidential', 'restricted', 'top_secret'],
                    default: "'internal'",
                },
                {
                    name: 'classification_date',
                    type: 'date',
                    isNullable: true,
                },
                {
                    name: 'reclassification_date',
                    type: 'date',
                    isNullable: true,
                },
                {
                    name: 'owner_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'custodian_id',
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
                    name: 'contains_intellectual_property',
                    type: 'boolean',
                    default: false,
                },
                {
                    name: 'storage_location',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                {
                    name: 'storage_type',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                {
                    name: 'retention_policy',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'retention_expiry_date',
                    type: 'date',
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
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'business_applications',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'application_identifier',
                    type: 'varchar',
                    length: '255',
                    isUnique: true,
                },
                {
                    name: 'application_name',
                    type: 'varchar',
                    length: '255',
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'application_type',
                    type: 'enum',
                    enum: ['web_application', 'mobile_app', 'desktop_app', 'api_service', 'database', 'cloud_service', 'other'],
                    default: "'other'",
                },
                {
                    name: 'version',
                    type: 'varchar',
                    length: '100',
                    isNullable: true,
                },
                {
                    name: 'patch_level',
                    type: 'varchar',
                    length: '100',
                    isNullable: true,
                },
                {
                    name: 'vendor',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                {
                    name: 'vendor_contact',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                {
                    name: 'vendor_email',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                {
                    name: 'vendor_phone',
                    type: 'varchar',
                    length: '50',
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
                    name: 'status',
                    type: 'enum',
                    enum: ['active', 'inactive', 'deprecated', 'planned'],
                    default: "'active'",
                },
                {
                    name: 'criticality_level',
                    type: 'enum',
                    enum: ['critical', 'high', 'medium', 'low'],
                    default: "'medium'",
                },
                {
                    name: 'data_types_processed',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'processes_pii',
                    type: 'boolean',
                    default: false,
                },
                {
                    name: 'processes_phi',
                    type: 'boolean',
                    default: false,
                },
                {
                    name: 'processes_financial_data',
                    type: 'boolean',
                    default: false,
                },
                {
                    name: 'hosting_location',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                {
                    name: 'technology_stack',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                {
                    name: 'url',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'compliance_requirements',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'deployment_date',
                    type: 'date',
                    isNullable: true,
                },
                {
                    name: 'last_update_date',
                    type: 'date',
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
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'software_assets',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'software_identifier',
                    type: 'varchar',
                    length: '255',
                    isUnique: true,
                },
                {
                    name: 'software_name',
                    type: 'varchar',
                    length: '255',
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'software_type',
                    type: 'enum',
                    enum: ['operating_system', 'application_software', 'development_tool', 'database_software', 'security_software', 'utility', 'other'],
                    default: "'other'",
                },
                {
                    name: 'version',
                    type: 'varchar',
                    length: '100',
                    isNullable: true,
                },
                {
                    name: 'patch_level',
                    type: 'varchar',
                    length: '100',
                    isNullable: true,
                },
                {
                    name: 'vendor',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                {
                    name: 'vendor_contact',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                {
                    name: 'vendor_email',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                {
                    name: 'vendor_phone',
                    type: 'varchar',
                    length: '50',
                    isNullable: true,
                },
                {
                    name: 'license_type',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                {
                    name: 'license_key',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                {
                    name: 'number_of_licenses',
                    type: 'int',
                    isNullable: true,
                },
                {
                    name: 'licenses_in_use',
                    type: 'int',
                    isNullable: true,
                },
                {
                    name: 'license_expiry_date',
                    type: 'date',
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
                    name: 'criticality_level',
                    type: 'enum',
                    enum: ['critical', 'high', 'medium', 'low'],
                    default: "'medium'",
                },
                {
                    name: 'installed_on_assets',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'compliance_requirements',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'purchase_date',
                    type: 'date',
                    isNullable: true,
                },
                {
                    name: 'installation_date',
                    type: 'date',
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
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'suppliers',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'supplier_identifier',
                    type: 'varchar',
                    length: '255',
                    isUnique: true,
                },
                {
                    name: 'supplier_name',
                    type: 'varchar',
                    length: '255',
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'supplier_type',
                    type: 'enum',
                    enum: ['vendor', 'consultant', 'service_provider', 'contractor', 'partner', 'other'],
                    default: "'other'",
                },
                {
                    name: 'primary_contact_name',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                {
                    name: 'primary_contact_email',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                {
                    name: 'primary_contact_phone',
                    type: 'varchar',
                    length: '50',
                    isNullable: true,
                },
                {
                    name: 'address',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                {
                    name: 'city',
                    type: 'varchar',
                    length: '100',
                    isNullable: true,
                },
                {
                    name: 'country',
                    type: 'varchar',
                    length: '100',
                    isNullable: true,
                },
                {
                    name: 'postal_code',
                    type: 'varchar',
                    length: '50',
                    isNullable: true,
                },
                {
                    name: 'website',
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
                    name: 'business_unit',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                {
                    name: 'contract_reference',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                {
                    name: 'contract_start_date',
                    type: 'date',
                    isNullable: true,
                },
                {
                    name: 'contract_end_date',
                    type: 'date',
                    isNullable: true,
                },
                {
                    name: 'goods_or_services_provided',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'compliance_requirements',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'has_data_access',
                    type: 'boolean',
                    default: false,
                },
                {
                    name: 'requires_nda',
                    type: 'boolean',
                    default: false,
                },
                {
                    name: 'has_security_assessment',
                    type: 'boolean',
                    default: false,
                },
                {
                    name: 'additional_contacts',
                    type: 'text',
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
        await queryRunner.createForeignKey('information_assets', new typeorm_1.TableForeignKey({
            columnNames: ['owner_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createForeignKey('information_assets', new typeorm_1.TableForeignKey({
            columnNames: ['custodian_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createForeignKey('business_applications', new typeorm_1.TableForeignKey({
            columnNames: ['owner_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createForeignKey('software_assets', new typeorm_1.TableForeignKey({
            columnNames: ['owner_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createIndex('information_assets', new typeorm_1.TableIndex({
            name: 'IDX_INFO_ASSETS_IDENTIFIER',
            columnNames: ['asset_identifier'],
            isUnique: true,
        }));
        await queryRunner.createIndex('business_applications', new typeorm_1.TableIndex({
            name: 'IDX_APP_IDENTIFIER',
            columnNames: ['application_identifier'],
            isUnique: true,
        }));
        await queryRunner.createIndex('software_assets', new typeorm_1.TableIndex({
            name: 'IDX_SOFTWARE_IDENTIFIER',
            columnNames: ['software_identifier'],
            isUnique: true,
        }));
        await queryRunner.createIndex('suppliers', new typeorm_1.TableIndex({
            name: 'IDX_SUPPLIER_IDENTIFIER',
            columnNames: ['supplier_identifier'],
            isUnique: true,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('suppliers', true);
        await queryRunner.dropTable('software_assets', true);
        await queryRunner.dropTable('business_applications', true);
        await queryRunner.dropTable('information_assets', true);
    }
}
exports.CreateAdditionalAssetTables1700000000012 = CreateAdditionalAssetTables1700000000012;
//# sourceMappingURL=1700000000012-CreateAdditionalAssetTables.js.map