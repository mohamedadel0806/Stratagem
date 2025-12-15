"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixSoftwareAssetsColumns1700000000022 = void 0;
class FixSoftwareAssetsColumns1700000000022 {
    async up(queryRunner) {
        const softwareColumns = [
            { from: 'softwareName', to: 'software_name' },
            { from: 'softwareIdentifier', to: 'unique_identifier' },
            { from: 'softwareType', to: 'software_type' },
            { from: 'versionNumber', to: 'version_number' },
            { from: 'patchLevel', to: 'patch_level' },
            { from: 'businessPurpose', to: 'business_purpose' },
            { from: 'ownerId', to: 'owner_id' },
            { from: 'businessUnit', to: 'business_unit' },
            { from: 'vendorName', to: 'vendor_name' },
            { from: 'vendorContact', to: 'vendor_contact' },
            { from: 'licenseType', to: 'license_type' },
            { from: 'licenseCount', to: 'license_count' },
            { from: 'licenseKey', to: 'license_key' },
            { from: 'licenseExpiry', to: 'license_expiry' },
            { from: 'installationCount', to: 'installation_count' },
            { from: 'securityTestResults', to: 'security_test_results' },
            { from: 'lastSecurityTestDate', to: 'last_security_test_date' },
            { from: 'knownVulnerabilities', to: 'known_vulnerabilities' },
            { from: 'supportEndDate', to: 'support_end_date' },
            { from: 'complianceRequirements', to: 'compliance_requirements' },
            { from: 'createdAt', to: 'created_at' },
            { from: 'updatedAt', to: 'updated_at' },
            { from: 'deletedAt', to: 'deleted_at' },
            { from: 'createdById', to: 'created_by' },
            { from: 'updatedById', to: 'updated_by' },
            { from: 'deletedById', to: 'deleted_by' },
        ];
        for (const col of softwareColumns) {
            await queryRunner.query(`
        DO $$ BEGIN
          IF EXISTS (SELECT 1 FROM information_schema.columns 
                     WHERE table_name = 'software_assets' AND column_name = '${col.from}')
             AND NOT EXISTS (SELECT 1 FROM information_schema.columns 
                             WHERE table_name = 'software_assets' AND column_name = '${col.to}') THEN
            ALTER TABLE software_assets RENAME COLUMN "${col.from}" TO ${col.to};
          END IF;
        END $$;
      `);
        }
        const columnsToDrop = [
            'isDeleted',
            'purchaseDate',
            'installationDate',
            'installedOnAssets',
        ];
        for (const col of columnsToDrop) {
            await queryRunner.query(`
        DO $$ BEGIN
          IF EXISTS (SELECT 1 FROM information_schema.columns 
                     WHERE table_name = 'software_assets' AND column_name = '${col}') THEN
            ALTER TABLE software_assets DROP COLUMN IF EXISTS "${col}";
          END IF;
        END $$;
      `);
        }
    }
    async down(queryRunner) {
    }
}
exports.FixSoftwareAssetsColumns1700000000022 = FixSoftwareAssetsColumns1700000000022;
//# sourceMappingURL=1700000000022-FixSoftwareAssetsColumns.js.map