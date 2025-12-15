"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixSuppliersColumns1700000000023 = void 0;
class FixSuppliersColumns1700000000023 {
    async up(queryRunner) {
        const supplierColumns = [
            { from: 'supplierIdentifier', to: 'unique_identifier' },
            { from: 'supplierName', to: 'supplier_name' },
            { from: 'supplierType', to: 'type' },
            { from: 'businessPurpose', to: 'business_purpose' },
            { from: 'ownerId', to: 'owner_id' },
            { from: 'businessUnit', to: 'business_unit' },
            { from: 'goodsServicesType', to: 'goods_services_type' },
            { from: 'criticalityLevel', to: 'criticality_level' },
            { from: 'contractReference', to: 'contract_reference' },
            { from: 'contractStartDate', to: 'contract_start_date' },
            { from: 'contractEndDate', to: 'contract_end_date' },
            { from: 'contractValue', to: 'contract_value' },
            { from: 'autoRenewal', to: 'auto_renewal' },
            { from: 'primaryContact', to: 'primary_contact' },
            { from: 'secondaryContact', to: 'secondary_contact' },
            { from: 'taxId', to: 'tax_id' },
            { from: 'registrationNumber', to: 'registration_number' },
            { from: 'riskAssessmentDate', to: 'risk_assessment_date' },
            { from: 'riskLevel', to: 'risk_level' },
            { from: 'complianceCertifications', to: 'compliance_certifications' },
            { from: 'insuranceVerified', to: 'insurance_verified' },
            { from: 'backgroundCheckDate', to: 'background_check_date' },
            { from: 'performanceRating', to: 'performance_rating' },
            { from: 'lastReviewDate', to: 'last_review_date' },
            { from: 'complianceRequirements', to: 'compliance_requirements' },
            { from: 'createdAt', to: 'created_at' },
            { from: 'updatedAt', to: 'updated_at' },
            { from: 'deletedAt', to: 'deleted_at' },
            { from: 'createdById', to: 'created_by' },
            { from: 'updatedById', to: 'updated_by' },
            { from: 'deletedById', to: 'deleted_by' },
        ];
        for (const col of supplierColumns) {
            await queryRunner.query(`
        DO $$ BEGIN
          IF EXISTS (SELECT 1 FROM information_schema.columns 
                     WHERE table_name = 'suppliers' AND column_name = '${col.from}')
             AND NOT EXISTS (SELECT 1 FROM information_schema.columns 
                             WHERE table_name = 'suppliers' AND column_name = '${col.to}') THEN
            ALTER TABLE suppliers RENAME COLUMN "${col.from}" TO ${col.to};
          END IF;
        END $$;
      `);
        }
        const columnsToDrop = [
            'isDeleted',
            'hasDataAccess',
            'requiresNDA',
            'hasSecurityAssessment',
        ];
        for (const col of columnsToDrop) {
            await queryRunner.query(`
        DO $$ BEGIN
          IF EXISTS (SELECT 1 FROM information_schema.columns 
                     WHERE table_name = 'suppliers' AND column_name = '${col}') THEN
            ALTER TABLE suppliers DROP COLUMN IF EXISTS "${col}";
          END IF;
        END $$;
      `);
        }
    }
    async down(queryRunner) {
    }
}
exports.FixSuppliersColumns1700000000023 = FixSuppliersColumns1700000000023;
//# sourceMappingURL=1700000000023-FixSuppliersColumns.js.map