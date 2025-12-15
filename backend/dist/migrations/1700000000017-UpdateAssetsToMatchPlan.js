"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAssetsToMatchPlan1700000000017 = void 0;
const typeorm_1 = require("typeorm");
class UpdateAssetsToMatchPlan1700000000017 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'business_units',
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
                    name: 'code',
                    type: 'varchar',
                    length: '50',
                    isUnique: true,
                    isNullable: true,
                },
                {
                    name: 'parent_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'manager_id',
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
                {
                    name: 'deleted_at',
                    type: 'timestamp',
                    isNullable: true,
                },
            ],
        }), true);
        await queryRunner.createForeignKey('business_units', new typeorm_1.TableForeignKey({
            columnNames: ['parent_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'business_units',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createForeignKey('business_units', new typeorm_1.TableForeignKey({
            columnNames: ['manager_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createIndex('business_units', new typeorm_1.TableIndex({
            name: 'idx_business_units_parent',
            columnNames: ['parent_id'],
        }));
        await queryRunner.createIndex('business_units', new typeorm_1.TableIndex({
            name: 'idx_business_units_code',
            columnNames: ['code'],
        }));
        await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE asset_category_enum AS ENUM (
          'physical',
          'information',
          'application',
          'software',
          'supplier'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'asset_types',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'category',
                    type: 'enum',
                    enum: ['physical', 'information', 'application', 'software', 'supplier'],
                    isNullable: false,
                },
                {
                    name: 'name',
                    type: 'varchar',
                    length: '100',
                    isNullable: false,
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'is_active',
                    type: 'boolean',
                    default: true,
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
        await queryRunner.createIndex('asset_types', new typeorm_1.TableIndex({
            name: 'idx_asset_types_category',
            columnNames: ['category'],
        }));
        await queryRunner.query(`
      INSERT INTO asset_types (category, name, description) VALUES
        ('physical', 'Network Equipment', 'Routers, switches, firewalls, and network infrastructure'),
        ('physical', 'IT Hardware', 'Servers, workstations, laptops, and computing devices'),
        ('physical', 'Specialized Equipment', 'IoT devices, printers, storage devices, and specialized hardware'),
        ('information', 'Customer Data', 'Customer PII, contact information, and personal data'),
        ('information', 'Financial Data', 'Financial records, transactions, and accounting data'),
        ('information', 'Intellectual Property', 'Patents, trade secrets, and proprietary information'),
        ('information', 'Health Information', 'PHI and medical records'),
        ('application', 'CRM', 'Customer Relationship Management systems'),
        ('application', 'ERP', 'Enterprise Resource Planning systems'),
        ('application', 'Collaboration', 'Email, chat, and collaboration tools'),
        ('application', 'Database', 'Database management systems'),
        ('application', 'Web Application', 'Web-based applications and services'),
        ('software', 'Operating System', 'OS software and system software'),
        ('software', 'Productivity', 'Office suites, productivity tools'),
        ('software', 'Development Tools', 'IDEs, compilers, and development software'),
        ('software', 'Security Software', 'Antivirus, firewalls, and security tools'),
        ('supplier', 'Vendor', 'Product and service vendors'),
        ('supplier', 'Consultant', 'Consulting services providers'),
        ('supplier', 'Service Provider', 'Managed service providers'),
        ('supplier', 'Contractor', 'Contract workers and contractors');
    `);
        await queryRunner.addColumn('physical_assets', new typeorm_1.TableColumn({
            name: 'asset_type_id',
            type: 'uuid',
            isNullable: true,
        }));
        await queryRunner.addColumn('physical_assets', new typeorm_1.TableColumn({
            name: 'business_unit_id',
            type: 'uuid',
            isNullable: true,
        }));
        await queryRunner.addColumn('physical_assets', new typeorm_1.TableColumn({
            name: 'business_purpose',
            type: 'text',
            isNullable: true,
        }));
        await queryRunner.addColumn('physical_assets', new typeorm_1.TableColumn({
            name: 'physical_location',
            type: 'text',
            isNullable: true,
        }));
        await queryRunner.addColumn('physical_assets', new typeorm_1.TableColumn({
            name: 'installed_software',
            type: 'jsonb',
            isNullable: true,
        }));
        await queryRunner.addColumn('physical_assets', new typeorm_1.TableColumn({
            name: 'active_ports_services',
            type: 'jsonb',
            isNullable: true,
        }));
        await queryRunner.addColumn('physical_assets', new typeorm_1.TableColumn({
            name: 'last_connectivity_check',
            type: 'timestamp',
            isNullable: true,
        }));
        await queryRunner.addColumn('physical_assets', new typeorm_1.TableColumn({
            name: 'asset_tag',
            type: 'varchar',
            length: '100',
            isNullable: true,
        }));
        await queryRunner.addColumn('physical_assets', new typeorm_1.TableColumn({
            name: 'warranty_expiry',
            type: 'date',
            isNullable: true,
        }));
        await queryRunner.addColumn('physical_assets', new typeorm_1.TableColumn({
            name: 'security_test_results',
            type: 'jsonb',
            isNullable: true,
        }));
        await queryRunner.query(`
      DO $$ 
      DECLARE
        col_name text;
      BEGIN
        -- Check for snake_case first
        SELECT column_name INTO col_name
        FROM information_schema.columns 
        WHERE table_name = 'physical_assets' 
          AND (column_name = 'ip_addresses' OR column_name = 'ipAddresses')
        LIMIT 1;
        
        IF col_name IS NOT NULL THEN
          EXECUTE format('ALTER TABLE physical_assets ALTER COLUMN %I TYPE jsonb USING 
            CASE 
              WHEN %I IS NULL OR %I = '''' THEN NULL::jsonb
              ELSE %I::jsonb
            END', col_name, col_name, col_name, col_name);
        END IF;
      END $$;
    `);
        await queryRunner.query(`
      DO $$ 
      DECLARE
        col_name text;
      BEGIN
        -- Check for snake_case first
        SELECT column_name INTO col_name
        FROM information_schema.columns 
        WHERE table_name = 'physical_assets' 
          AND (column_name = 'mac_addresses' OR column_name = 'macAddresses')
        LIMIT 1;
        
        IF col_name IS NOT NULL THEN
          EXECUTE format('ALTER TABLE physical_assets ALTER COLUMN %I TYPE jsonb USING 
            CASE 
              WHEN %I IS NULL OR %I = '''' THEN NULL::jsonb
              ELSE %I::jsonb
            END', col_name, col_name, col_name, col_name);
        END IF;
      END $$;
    `);
        await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'physical_assets' AND column_name = 'compliance_requirements') THEN
          ALTER TABLE physical_assets
          ALTER COLUMN compliance_requirements TYPE jsonb USING 
            CASE 
              WHEN compliance_requirements IS NULL OR compliance_requirements = '' THEN NULL::jsonb
              ELSE compliance_requirements::jsonb
            END;
        END IF;
      END $$;
    `);
        await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE physical_assets RENAME COLUMN warranty_expiry_date TO warranty_expiry;
      EXCEPTION
        WHEN undefined_column THEN null;
      END $$;
    `);
        await queryRunner.createForeignKey('physical_assets', new typeorm_1.TableForeignKey({
            columnNames: ['asset_type_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'asset_types',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createForeignKey('physical_assets', new typeorm_1.TableForeignKey({
            columnNames: ['business_unit_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'business_units',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createIndex('physical_assets', new typeorm_1.TableIndex({
            name: 'idx_physical_assets_type',
            columnNames: ['asset_type_id'],
        }));
        await queryRunner.createIndex('physical_assets', new typeorm_1.TableIndex({
            name: 'idx_physical_assets_unit',
            columnNames: ['business_unit_id'],
        }));
        await queryRunner.createIndex('physical_assets', new typeorm_1.TableIndex({
            name: 'idx_physical_assets_location',
            columnNames: ['physical_location'],
        }));
        await queryRunner.query(`
      DO $$ 
      DECLARE
        col_name text;
      BEGIN
        SELECT column_name INTO col_name
        FROM information_schema.columns 
        WHERE table_name = 'physical_assets' 
          AND (column_name = 'connectivity_status' OR column_name = 'connectivityStatus')
        LIMIT 1;
        
        IF col_name IS NOT NULL THEN
          EXECUTE format('CREATE INDEX IF NOT EXISTS idx_physical_assets_connectivity ON physical_assets(%I)', col_name);
        END IF;
      END $$;
    `);
        await queryRunner.query(`
      DO $$ 
      DECLARE
        col_name text;
        col_type text;
      BEGIN
        SELECT column_name, data_type INTO col_name, col_type
        FROM information_schema.columns 
        WHERE table_name = 'physical_assets' 
          AND (column_name = 'mac_addresses' OR column_name = 'macAddresses')
        LIMIT 1;
        
        IF col_name IS NOT NULL AND col_type = 'jsonb' THEN
          EXECUTE format('CREATE INDEX IF NOT EXISTS idx_physical_assets_mac ON physical_assets USING gin(%I)', col_name);
        END IF;
      END $$;
    `);
        await queryRunner.query(`
      DO $$ 
      DECLARE
        col_name text;
        col_type text;
      BEGIN
        SELECT column_name, data_type INTO col_name, col_type
        FROM information_schema.columns 
        WHERE table_name = 'physical_assets' 
          AND (column_name = 'ip_addresses' OR column_name = 'ipAddresses')
        LIMIT 1;
        
        IF col_name IS NOT NULL AND col_type = 'jsonb' THEN
          EXECUTE format('CREATE INDEX IF NOT EXISTS idx_physical_assets_ip ON physical_assets USING gin(%I)', col_name);
        END IF;
      END $$;
    `);
        await queryRunner.addColumn('information_assets', new typeorm_1.TableColumn({
            name: 'information_type',
            type: 'varchar',
            length: '200',
            isNullable: true,
        }));
        await queryRunner.addColumn('information_assets', new typeorm_1.TableColumn({
            name: 'business_unit_id',
            type: 'uuid',
            isNullable: true,
        }));
        await queryRunner.addColumn('information_assets', new typeorm_1.TableColumn({
            name: 'reclassification_reminder_sent',
            type: 'boolean',
            default: false,
        }));
        await queryRunner.addColumn('information_assets', new typeorm_1.TableColumn({
            name: 'asset_location',
            type: 'text',
            isNullable: true,
        }));
        await queryRunner.addColumn('information_assets', new typeorm_1.TableColumn({
            name: 'storage_medium',
            type: 'varchar',
            length: '200',
            isNullable: true,
        }));
        await queryRunner.addColumn('information_assets', new typeorm_1.TableColumn({
            name: 'retention_period',
            type: 'varchar',
            length: '100',
            isNullable: true,
        }));
        await queryRunner.query(`
      DO $$ BEGIN
        -- Try snake_case first
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'information_assets' AND column_name = 'asset_name') THEN
          ALTER TABLE information_assets RENAME COLUMN asset_name TO name;
        -- Then try camelCase
        ELSIF EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'information_assets' AND column_name = 'assetName') THEN
          ALTER TABLE information_assets RENAME COLUMN "assetName" TO name;
        END IF;
      EXCEPTION
        WHEN undefined_column THEN null;
      END $$;
    `);
        await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE information_assets RENAME COLUMN owner_id TO information_owner_id;
      EXCEPTION
        WHEN undefined_column THEN null;
      END $$;
    `);
        await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE information_assets RENAME COLUMN custodian_id TO asset_custodian_id;
      EXCEPTION
        WHEN undefined_column THEN null;
      END $$;
    `);
        await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE information_assets RENAME COLUMN storage_location TO asset_location;
      EXCEPTION
        WHEN undefined_column THEN null;
      END $$;
    `);
        await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE information_assets RENAME COLUMN storage_type TO storage_medium;
      EXCEPTION
        WHEN undefined_column THEN null;
      END $$;
    `);
        await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE information_assets RENAME COLUMN retention_policy TO retention_period;
      EXCEPTION
        WHEN undefined_column THEN null;
      END $$;
    `);
        await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'information_assets' AND column_name = 'compliance_requirements') THEN
          ALTER TABLE information_assets
          ALTER COLUMN compliance_requirements TYPE jsonb USING 
            CASE 
              WHEN compliance_requirements IS NULL OR compliance_requirements = '' THEN NULL::jsonb
              ELSE compliance_requirements::jsonb
            END;
        END IF;
      END $$;
    `);
        await queryRunner.createForeignKey('information_assets', new typeorm_1.TableForeignKey({
            columnNames: ['business_unit_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'business_units',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createIndex('information_assets', new typeorm_1.TableIndex({
            name: 'idx_info_assets_type',
            columnNames: ['information_type'],
        }));
        await queryRunner.createIndex('information_assets', new typeorm_1.TableIndex({
            name: 'idx_info_assets_owner',
            columnNames: ['information_owner_id'],
        }));
        await queryRunner.createIndex('information_assets', new typeorm_1.TableIndex({
            name: 'idx_info_assets_custodian',
            columnNames: ['asset_custodian_id'],
        }));
        await queryRunner.createIndex('information_assets', new typeorm_1.TableIndex({
            name: 'idx_info_assets_unit',
            columnNames: ['business_unit_id'],
        }));
        await queryRunner.query(`
      DO $$ 
      DECLARE
        col_name text;
      BEGIN
        SELECT column_name INTO col_name
        FROM information_schema.columns 
        WHERE table_name = 'information_assets' 
          AND (column_name = 'reclassification_date' OR column_name = 'reclassificationDate')
        LIMIT 1;
        
        IF col_name IS NOT NULL THEN
          EXECUTE format('CREATE INDEX IF NOT EXISTS idx_info_assets_reclassification ON information_assets(%I) WHERE %I IS NOT NULL', col_name, col_name);
        END IF;
      END $$;
    `);
        await queryRunner.addColumn('business_applications', new typeorm_1.TableColumn({
            name: 'business_unit_id',
            type: 'uuid',
            isNullable: true,
        }));
        await queryRunner.addColumn('business_applications', new typeorm_1.TableColumn({
            name: 'business_purpose',
            type: 'text',
            isNullable: true,
        }));
        await queryRunner.addColumn('business_applications', new typeorm_1.TableColumn({
            name: 'data_processed',
            type: 'jsonb',
            isNullable: true,
        }));
        await queryRunner.addColumn('business_applications', new typeorm_1.TableColumn({
            name: 'data_classification',
            type: 'enum',
            enum: ['public', 'internal', 'confidential', 'restricted', 'secret'],
            isNullable: true,
        }));
        await queryRunner.addColumn('business_applications', new typeorm_1.TableColumn({
            name: 'vendor_name',
            type: 'varchar',
            length: '200',
            isNullable: true,
        }));
        await queryRunner.addColumn('business_applications', new typeorm_1.TableColumn({
            name: 'vendor_contact',
            type: 'jsonb',
            isNullable: true,
        }));
        await queryRunner.addColumn('business_applications', new typeorm_1.TableColumn({
            name: 'license_type',
            type: 'varchar',
            length: '100',
            isNullable: true,
        }));
        await queryRunner.addColumn('business_applications', new typeorm_1.TableColumn({
            name: 'license_count',
            type: 'int',
            isNullable: true,
        }));
        await queryRunner.addColumn('business_applications', new typeorm_1.TableColumn({
            name: 'license_expiry',
            type: 'date',
            isNullable: true,
        }));
        await queryRunner.addColumn('business_applications', new typeorm_1.TableColumn({
            name: 'hosting_type',
            type: 'varchar',
            length: '100',
            isNullable: true,
        }));
        await queryRunner.addColumn('business_applications', new typeorm_1.TableColumn({
            name: 'hosting_location',
            type: 'text',
            isNullable: true,
        }));
        await queryRunner.addColumn('business_applications', new typeorm_1.TableColumn({
            name: 'access_url',
            type: 'text',
            isNullable: true,
        }));
        await queryRunner.addColumn('business_applications', new typeorm_1.TableColumn({
            name: 'security_test_results',
            type: 'jsonb',
            isNullable: true,
        }));
        await queryRunner.addColumn('business_applications', new typeorm_1.TableColumn({
            name: 'last_security_test_date',
            type: 'date',
            isNullable: true,
        }));
        await queryRunner.addColumn('business_applications', new typeorm_1.TableColumn({
            name: 'authentication_method',
            type: 'varchar',
            length: '100',
            isNullable: true,
        }));
        await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE business_applications RENAME COLUMN application_name TO application_name;
      EXCEPTION
        WHEN undefined_column THEN null;
      END $$;
    `);
        await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE business_applications RENAME COLUMN version TO version_number;
      EXCEPTION
        WHEN undefined_column THEN null;
      END $$;
    `);
        await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE business_applications RENAME COLUMN patch_level TO patch_level;
      EXCEPTION
        WHEN undefined_column THEN null;
      END $$;
    `);
        await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'business_applications' AND column_name = 'compliance_requirements') THEN
          ALTER TABLE business_applications
          ALTER COLUMN compliance_requirements TYPE jsonb USING 
            CASE 
              WHEN compliance_requirements IS NULL OR compliance_requirements = '' THEN NULL::jsonb
              ELSE compliance_requirements::jsonb
            END;
        END IF;
      END $$;
    `);
        await queryRunner.createForeignKey('business_applications', new typeorm_1.TableForeignKey({
            columnNames: ['business_unit_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'business_units',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createIndex('business_applications', new typeorm_1.TableIndex({
            name: 'idx_applications_unit',
            columnNames: ['business_unit_id'],
        }));
        await queryRunner.createIndex('business_applications', new typeorm_1.TableIndex({
            name: 'idx_applications_vendor',
            columnNames: ['vendor_name'],
        }));
        await queryRunner.addColumn('software_assets', new typeorm_1.TableColumn({
            name: 'business_unit_id',
            type: 'uuid',
            isNullable: true,
        }));
        await queryRunner.addColumn('software_assets', new typeorm_1.TableColumn({
            name: 'business_purpose',
            type: 'text',
            isNullable: true,
        }));
        await queryRunner.addColumn('software_assets', new typeorm_1.TableColumn({
            name: 'vendor_name',
            type: 'varchar',
            length: '200',
            isNullable: true,
        }));
        await queryRunner.addColumn('software_assets', new typeorm_1.TableColumn({
            name: 'vendor_contact',
            type: 'jsonb',
            isNullable: true,
        }));
        await queryRunner.addColumn('software_assets', new typeorm_1.TableColumn({
            name: 'license_count',
            type: 'int',
            isNullable: true,
        }));
        await queryRunner.addColumn('software_assets', new typeorm_1.TableColumn({
            name: 'license_expiry',
            type: 'date',
            isNullable: true,
        }));
        await queryRunner.addColumn('software_assets', new typeorm_1.TableColumn({
            name: 'installation_count',
            type: 'int',
            default: 0,
        }));
        await queryRunner.addColumn('software_assets', new typeorm_1.TableColumn({
            name: 'security_test_results',
            type: 'jsonb',
            isNullable: true,
        }));
        await queryRunner.addColumn('software_assets', new typeorm_1.TableColumn({
            name: 'last_security_test_date',
            type: 'date',
            isNullable: true,
        }));
        await queryRunner.addColumn('software_assets', new typeorm_1.TableColumn({
            name: 'known_vulnerabilities',
            type: 'jsonb',
            isNullable: true,
        }));
        await queryRunner.addColumn('software_assets', new typeorm_1.TableColumn({
            name: 'support_end_date',
            type: 'date',
            isNullable: true,
        }));
        await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE software_assets RENAME COLUMN software_name TO software_name;
      EXCEPTION
        WHEN undefined_column THEN null;
      END $$;
    `);
        await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE software_assets RENAME COLUMN version TO version_number;
      EXCEPTION
        WHEN undefined_column THEN null;
      END $$;
    `);
        await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE software_assets RENAME COLUMN patch_level TO patch_level;
      EXCEPTION
        WHEN undefined_column THEN null;
      END $$;
    `);
        await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE software_assets RENAME COLUMN license_key TO license_key;
      EXCEPTION
        WHEN undefined_column THEN null;
      END $$;
    `);
        await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE software_assets RENAME COLUMN number_of_licenses TO license_count;
      EXCEPTION
        WHEN undefined_column THEN null;
      END $$;
    `);
        await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE software_assets RENAME COLUMN license_expiry_date TO license_expiry;
      EXCEPTION
        WHEN undefined_column THEN null;
      END $$;
    `);
        await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'software_assets' AND column_name = 'compliance_requirements') THEN
          ALTER TABLE software_assets
          ALTER COLUMN compliance_requirements TYPE jsonb USING 
            CASE 
              WHEN compliance_requirements IS NULL OR compliance_requirements = '' THEN NULL::jsonb
              ELSE compliance_requirements::jsonb
            END;
        END IF;
      END $$;
    `);
        await queryRunner.createForeignKey('software_assets', new typeorm_1.TableForeignKey({
            columnNames: ['business_unit_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'business_units',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createIndex('software_assets', new typeorm_1.TableIndex({
            name: 'idx_software_unit',
            columnNames: ['business_unit_id'],
        }));
        await queryRunner.createIndex('software_assets', new typeorm_1.TableIndex({
            name: 'idx_software_vendor',
            columnNames: ['vendor_name'],
        }));
        await queryRunner.createIndex('software_assets', new typeorm_1.TableIndex({
            name: 'idx_software_license_expiry',
            columnNames: ['license_expiry'],
            where: 'license_expiry IS NOT NULL',
        }));
        await queryRunner.addColumn('suppliers', new typeorm_1.TableColumn({
            name: 'business_unit_id',
            type: 'uuid',
            isNullable: true,
        }));
        await queryRunner.addColumn('suppliers', new typeorm_1.TableColumn({
            name: 'business_purpose',
            type: 'text',
            isNullable: true,
        }));
        await queryRunner.addColumn('suppliers', new typeorm_1.TableColumn({
            name: 'goods_services_type',
            type: 'jsonb',
            isNullable: true,
        }));
        await queryRunner.addColumn('suppliers', new typeorm_1.TableColumn({
            name: 'contract_value',
            type: 'decimal',
            precision: 15,
            scale: 2,
            isNullable: true,
        }));
        await queryRunner.addColumn('suppliers', new typeorm_1.TableColumn({
            name: 'currency',
            type: 'varchar',
            length: '10',
            isNullable: true,
        }));
        await queryRunner.addColumn('suppliers', new typeorm_1.TableColumn({
            name: 'auto_renewal',
            type: 'boolean',
            default: false,
        }));
        await queryRunner.addColumn('suppliers', new typeorm_1.TableColumn({
            name: 'primary_contact',
            type: 'jsonb',
            isNullable: true,
        }));
        await queryRunner.addColumn('suppliers', new typeorm_1.TableColumn({
            name: 'secondary_contact',
            type: 'jsonb',
            isNullable: true,
        }));
        await queryRunner.addColumn('suppliers', new typeorm_1.TableColumn({
            name: 'tax_id',
            type: 'varchar',
            length: '100',
            isNullable: true,
        }));
        await queryRunner.addColumn('suppliers', new typeorm_1.TableColumn({
            name: 'registration_number',
            type: 'varchar',
            length: '100',
            isNullable: true,
        }));
        await queryRunner.addColumn('suppliers', new typeorm_1.TableColumn({
            name: 'risk_assessment_date',
            type: 'date',
            isNullable: true,
        }));
        await queryRunner.addColumn('suppliers', new typeorm_1.TableColumn({
            name: 'risk_level',
            type: 'varchar',
            length: '50',
            isNullable: true,
        }));
        await queryRunner.addColumn('suppliers', new typeorm_1.TableColumn({
            name: 'compliance_certifications',
            type: 'jsonb',
            isNullable: true,
        }));
        await queryRunner.addColumn('suppliers', new typeorm_1.TableColumn({
            name: 'insurance_verified',
            type: 'boolean',
            default: false,
        }));
        await queryRunner.addColumn('suppliers', new typeorm_1.TableColumn({
            name: 'background_check_date',
            type: 'date',
            isNullable: true,
        }));
        await queryRunner.addColumn('suppliers', new typeorm_1.TableColumn({
            name: 'performance_rating',
            type: 'decimal',
            precision: 3,
            scale: 2,
            isNullable: true,
        }));
        await queryRunner.addColumn('suppliers', new typeorm_1.TableColumn({
            name: 'last_review_date',
            type: 'date',
            isNullable: true,
        }));
        await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE suppliers RENAME COLUMN supplier_name TO supplier_name;
      EXCEPTION
        WHEN undefined_column THEN null;
      END $$;
    `);
        await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE suppliers RENAME COLUMN goods_or_services_provided TO goods_services_type;
      EXCEPTION
        WHEN undefined_column THEN null;
      END $$;
    `);
        await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'suppliers' AND column_name = 'compliance_requirements') THEN
          ALTER TABLE suppliers
          ALTER COLUMN compliance_requirements TYPE jsonb USING 
            CASE 
              WHEN compliance_requirements IS NULL OR compliance_requirements = '' THEN NULL::jsonb
              ELSE compliance_requirements::jsonb
            END;
        END IF;
      END $$;
    `);
        await queryRunner.createForeignKey('suppliers', new typeorm_1.TableForeignKey({
            columnNames: ['business_unit_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'business_units',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createIndex('suppliers', new typeorm_1.TableIndex({
            name: 'idx_suppliers_unit',
            columnNames: ['business_unit_id'],
        }));
        await queryRunner.query(`
      DO $$ 
      DECLARE
        col_name text;
      BEGIN
        SELECT column_name INTO col_name
        FROM information_schema.columns 
        WHERE table_name = 'suppliers' 
          AND (column_name = 'contract_end_date' OR column_name = 'contractEndDate')
        LIMIT 1;
        
        IF col_name IS NOT NULL THEN
          EXECUTE format('CREATE INDEX IF NOT EXISTS idx_suppliers_contract_end ON suppliers(%I) WHERE %I IS NOT NULL', col_name, col_name);
        END IF;
      END $$;
    `);
    }
    async down(queryRunner) {
    }
}
exports.UpdateAssetsToMatchPlan1700000000017 = UpdateAssetsToMatchPlan1700000000017;
//# sourceMappingURL=1700000000017-UpdateAssetsToMatchPlan.js.map