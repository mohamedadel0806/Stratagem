import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameRemainingCamelCaseColumns1700000000019 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Rename all remaining camelCase columns in physical_assets to snake_case
    // Only rename if the target column doesn't already exist
    const physicalColumns = [
      { from: 'criticalityLevel', to: 'criticality_level' },
      { from: 'connectivityStatus', to: 'connectivity_status' },
      { from: 'networkApprovalStatus', to: 'network_approval_status' },
      { from: 'macAddresses', to: 'mac_addresses' },
      { from: 'ipAddresses', to: 'ip_addresses' },
      { from: 'serialNumber', to: 'serial_number' },
      { from: 'purchaseDate', to: 'purchase_date' },
      { from: 'complianceRequirements', to: 'compliance_requirements' },
      { from: 'createdAt', to: 'created_at' },
      { from: 'updatedAt', to: 'updated_at' },
      { from: 'deletedAt', to: 'deleted_at' },
      { from: 'createdById', to: 'created_by' },
      { from: 'updatedById', to: 'updated_by' },
      { from: 'deletedById', to: 'deleted_by' },
      { from: 'ownerId', to: 'owner_id' },
      { from: 'warrantyExpiryDate', to: 'warranty_expiry' },
      { from: 'networkApprovalDate', to: 'network_approval_date' },
    ];

    for (const col of physicalColumns) {
      await queryRunner.query(`
        DO $$ BEGIN
          -- Only rename if source exists and target doesn't
          IF EXISTS (SELECT 1 FROM information_schema.columns 
                     WHERE table_name = 'physical_assets' AND column_name = '${col.from}')
             AND NOT EXISTS (SELECT 1 FROM information_schema.columns 
                             WHERE table_name = 'physical_assets' AND column_name = '${col.to}') THEN
            ALTER TABLE physical_assets RENAME COLUMN "${col.from}" TO ${col.to};
          END IF;
        END $$;
      `);
    }

    // Handle businessUnit separately - it's a varchar, not a foreign key
    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'physical_assets' AND column_name = 'businessUnit')
           AND NOT EXISTS (SELECT 1 FROM information_schema.columns 
                           WHERE table_name = 'physical_assets' AND column_name = 'business_unit') THEN
          -- Drop the old varchar column if business_unit_id exists
          IF EXISTS (SELECT 1 FROM information_schema.columns 
                     WHERE table_name = 'physical_assets' AND column_name = 'business_unit_id') THEN
            ALTER TABLE physical_assets DROP COLUMN IF EXISTS "businessUnit";
          ELSE
            ALTER TABLE physical_assets RENAME COLUMN "businessUnit" TO business_unit;
          END IF;
        END IF;
      END $$;
    `);

    // Drop columns that are no longer needed
    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'physical_assets' AND column_name = 'isDeleted') THEN
          ALTER TABLE physical_assets DROP COLUMN IF EXISTS "isDeleted";
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'physical_assets' AND column_name = 'containsPII') THEN
          ALTER TABLE physical_assets DROP COLUMN IF EXISTS "containsPII";
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'physical_assets' AND column_name = 'containsPHI') THEN
          ALTER TABLE physical_assets DROP COLUMN IF EXISTS "containsPHI";
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'physical_assets' AND column_name = 'containsFinancialData') THEN
          ALTER TABLE physical_assets DROP COLUMN IF EXISTS "containsFinancialData";
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'physical_assets' AND column_name = 'dataClassification') THEN
          ALTER TABLE physical_assets DROP COLUMN IF EXISTS "dataClassification";
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'physical_assets' AND column_name = 'customAttributes') THEN
          ALTER TABLE physical_assets DROP COLUMN IF EXISTS "customAttributes";
        END IF;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverse the renames (simplified - would need full list)
    const physicalColumns = [
      { from: 'criticality_level', to: 'criticalityLevel' },
      { from: 'connectivity_status', to: 'connectivityStatus' },
      { from: 'network_approval_status', to: 'networkApprovalStatus' },
      { from: 'mac_addresses', to: 'macAddresses' },
      { from: 'ip_addresses', to: 'ipAddresses' },
      { from: 'serial_number', to: 'serialNumber' },
      { from: 'purchase_date', to: 'purchaseDate' },
      { from: 'compliance_requirements', to: 'complianceRequirements' },
      { from: 'created_at', to: 'createdAt' },
      { from: 'updated_at', to: 'updatedAt' },
      { from: 'deleted_at', to: 'deletedAt' },
    ];

    for (const col of physicalColumns) {
      await queryRunner.query(`
        DO $$ BEGIN
          IF EXISTS (SELECT 1 FROM information_schema.columns 
                     WHERE table_name = 'physical_assets' AND column_name = '${col.from}') THEN
            ALTER TABLE physical_assets RENAME COLUMN ${col.from} TO "${col.to}";
          END IF;
        END $$;
      `);
    }
  }
}

