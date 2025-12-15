"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixBusinessApplicationsColumns1700000000021 = void 0;
class FixBusinessApplicationsColumns1700000000021 {
    async up(queryRunner) {
        const appColumns = [
            { from: 'applicationName', to: 'application_name' },
            { from: 'applicationIdentifier', to: 'unique_identifier' },
            { from: 'applicationType', to: 'application_type' },
            { from: 'versionNumber', to: 'version_number' },
            { from: 'patchLevel', to: 'patch_level' },
            { from: 'businessPurpose', to: 'business_purpose' },
            { from: 'ownerId', to: 'owner_id' },
            { from: 'businessUnit', to: 'business_unit' },
            { from: 'dataProcessed', to: 'data_processed' },
            { from: 'dataClassification', to: 'data_classification' },
            { from: 'vendorName', to: 'vendor_name' },
            { from: 'vendorContact', to: 'vendor_contact' },
            { from: 'licenseType', to: 'license_type' },
            { from: 'licenseCount', to: 'license_count' },
            { from: 'licenseExpiry', to: 'license_expiry' },
            { from: 'hostingType', to: 'hosting_type' },
            { from: 'hostingLocation', to: 'hosting_location' },
            { from: 'accessUrl', to: 'access_url' },
            { from: 'securityTestResults', to: 'security_test_results' },
            { from: 'lastSecurityTestDate', to: 'last_security_test_date' },
            { from: 'authenticationMethod', to: 'authentication_method' },
            { from: 'complianceRequirements', to: 'compliance_requirements' },
            { from: 'criticalityLevel', to: 'criticality_level' },
            { from: 'createdAt', to: 'created_at' },
            { from: 'updatedAt', to: 'updated_at' },
            { from: 'deletedAt', to: 'deleted_at' },
            { from: 'createdById', to: 'created_by' },
            { from: 'updatedById', to: 'updated_by' },
            { from: 'deletedById', to: 'deleted_by' },
        ];
        for (const col of appColumns) {
            await queryRunner.query(`
        DO $$ BEGIN
          IF EXISTS (SELECT 1 FROM information_schema.columns 
                     WHERE table_name = 'business_applications' AND column_name = '${col.from}')
             AND NOT EXISTS (SELECT 1 FROM information_schema.columns 
                             WHERE table_name = 'business_applications' AND column_name = '${col.to}') THEN
            ALTER TABLE business_applications RENAME COLUMN "${col.from}" TO ${col.to};
          END IF;
        END $$;
      `);
        }
        const columnsToDrop = [
            'isDeleted',
            'deploymentDate',
            'lastUpdateDate',
            'technologyStack',
        ];
        for (const col of columnsToDrop) {
            await queryRunner.query(`
        DO $$ BEGIN
          IF EXISTS (SELECT 1 FROM information_schema.columns 
                     WHERE table_name = 'business_applications' AND column_name = '${col}') THEN
            ALTER TABLE business_applications DROP COLUMN IF EXISTS "${col}";
          END IF;
        END $$;
      `);
        }
    }
    async down(queryRunner) {
    }
}
exports.FixBusinessApplicationsColumns1700000000021 = FixBusinessApplicationsColumns1700000000021;
//# sourceMappingURL=1700000000021-FixBusinessApplicationsColumns.js.map