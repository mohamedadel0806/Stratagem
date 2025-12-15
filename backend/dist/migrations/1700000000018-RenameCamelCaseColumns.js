"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenameCamelCaseColumns1700000000018 = void 0;
class RenameCamelCaseColumns1700000000018 {
    async up(queryRunner) {
        await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'physical_assets' AND column_name = 'assetDescription') THEN
          ALTER TABLE physical_assets RENAME COLUMN "assetDescription" TO asset_description;
        END IF;
      END $$;
    `);
        await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'physical_assets' AND column_name = 'assetIdentifier') THEN
          ALTER TABLE physical_assets RENAME COLUMN "assetIdentifier" TO unique_identifier;
        END IF;
      END $$;
    `);
        await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'physical_assets' AND column_name = 'assetType') THEN
          -- assetType enum column - drop if asset_type_id exists
          IF EXISTS (SELECT 1 FROM information_schema.columns 
                     WHERE table_name = 'physical_assets' AND column_name = 'asset_type_id') THEN
            ALTER TABLE physical_assets DROP COLUMN IF EXISTS "assetType";
          END IF;
        END IF;
      END $$;
    `);
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
        ];
        for (const col of physicalColumns) {
            await queryRunner.query(`
        DO $$ BEGIN
          IF EXISTS (SELECT 1 FROM information_schema.columns 
                     WHERE table_name = 'physical_assets' AND column_name = '${col.from}') THEN
            ALTER TABLE physical_assets RENAME COLUMN "${col.from}" TO ${col.to};
          END IF;
        END $$;
      `);
        }
    }
    async down(queryRunner) {
        await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'physical_assets' AND column_name = 'asset_description') THEN
          ALTER TABLE physical_assets RENAME COLUMN asset_description TO "assetDescription";
        END IF;
      END $$;
    `);
        await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'physical_assets' AND column_name = 'unique_identifier') THEN
          ALTER TABLE physical_assets RENAME COLUMN unique_identifier TO "assetIdentifier";
        END IF;
      END $$;
    `);
    }
}
exports.RenameCamelCaseColumns1700000000018 = RenameCamelCaseColumns1700000000018;
//# sourceMappingURL=1700000000018-RenameCamelCaseColumns.js.map