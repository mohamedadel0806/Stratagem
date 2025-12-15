import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGovernanceEnums1701000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Helper function to create enum if not exists
    const createEnumIfNotExists = async (enumName: string, values: string[]) => {
      const enumValues = values.map(v => `'${v}'`).join(',\n        ');
      await queryRunner.query(`
        DO $$ BEGIN
          CREATE TYPE ${enumName} AS ENUM (
            ${enumValues}
          );
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `);
    };

    // Influencer enums
    await createEnumIfNotExists('influencer_category_enum', [
      'internal',
      'contractual',
      'statutory',
      'regulatory',
      'industry_standard'
    ]);

    await createEnumIfNotExists('influencer_status_enum', [
      'active',
      'pending',
      'superseded',
      'retired'
    ]);

    await createEnumIfNotExists('applicability_status_enum', [
      'applicable',
      'not_applicable',
      'under_review'
    ]);

    // Policy enums
    await createEnumIfNotExists('policy_status_enum', [
      'draft',
      'in_review',
      'approved',
      'published',
      'archived'
    ]);

    await createEnumIfNotExists('review_frequency_enum', [
      'annual',
      'biennial',
      'triennial',
      'quarterly',
      'monthly',
      'as_needed'
    ]);

    // Control enums
    await createEnumIfNotExists('control_type_enum', [
      'preventive',
      'detective',
      'corrective',
      'compensating',
      'administrative',
      'technical',
      'physical'
    ]);

    await createEnumIfNotExists('control_complexity_enum', [
      'high',
      'medium',
      'low'
    ]);

    await createEnumIfNotExists('control_cost_impact_enum', [
      'high',
      'medium',
      'low'
    ]);

    await createEnumIfNotExists('control_status_enum', [
      'draft',
      'active',
      'deprecated'
    ]);

    await createEnumIfNotExists('implementation_status_enum', [
      'not_implemented',
      'planned',
      'in_progress',
      'implemented',
      'not_applicable'
    ]);

    // Framework enums
    await createEnumIfNotExists('framework_status_enum', [
      'active',
      'draft',
      'deprecated'
    ]);

    await createEnumIfNotExists('mapping_coverage_enum', [
      'full',
      'partial',
      'not_applicable'
    ]);

    // Assessment enums (assessment_type_enum already exists from migration 1700000000016)
    // Skip creating assessment_type_enum as it already exists
    await createEnumIfNotExists('assessment_status_enum', [
      'not_started',
      'in_progress',
      'under_review',
      'completed',
      'cancelled'
    ]);

    await createEnumIfNotExists('assessment_result_enum', [
      'compliant',
      'non_compliant',
      'partially_compliant',
      'not_applicable',
      'not_tested'
    ]);

    // Finding enums
    await createEnumIfNotExists('finding_severity_enum', [
      'critical',
      'high',
      'medium',
      'low',
      'informational'
    ]);

    await createEnumIfNotExists('finding_status_enum', [
      'open',
      'in_progress',
      'closed',
      'risk_accepted',
      'false_positive'
    ]);

    // Evidence enums
    await createEnumIfNotExists('evidence_type_enum', [
      'policy_document',
      'configuration_screenshot',
      'system_log',
      'scan_report',
      'test_result',
      'certification',
      'training_record',
      'meeting_minutes',
      'email_correspondence',
      'contract',
      'other'
    ]);

    await createEnumIfNotExists('evidence_status_enum', [
      'draft',
      'under_review',
      'approved',
      'expired',
      'rejected'
    ]);

    await createEnumIfNotExists('evidence_link_type_enum', [
      'control',
      'assessment',
      'finding',
      'asset',
      'policy',
      'standard'
    ]);

    // SOP enums
    await createEnumIfNotExists('sop_category_enum', [
      'operational',
      'security',
      'compliance',
      'third_party',
      'incident_response',
      'business_continuity',
      'other'
    ]);

    await createEnumIfNotExists('sop_status_enum', [
      'draft',
      'in_review',
      'approved',
      'published',
      'archived'
    ]);

    await createEnumIfNotExists('execution_outcome_enum', [
      'successful',
      'failed',
      'partially_completed',
      'cancelled'
    ]);

    // Exception enums
    await createEnumIfNotExists('exception_status_enum', [
      'requested',
      'under_review',
      'approved',
      'rejected',
      'expired',
      'revoked'
    ]);

    // Testing enums
    await createEnumIfNotExists('test_frequency_enum', [
      'weekly',
      'monthly',
      'quarterly',
      'semi_annually',
      'annually',
      'ad_hoc'
    ]);

    await createEnumIfNotExists('test_result_enum', [
      'pass',
      'fail',
      'not_tested',
      'inconclusive'
    ]);

    // KCI enums
    await createEnumIfNotExists('kci_data_type_enum', [
      'percentage',
      'count',
      'rating',
      'yes_no',
      'custom'
    ]);

    // Baseline enums
    await createEnumIfNotExists('baseline_compliance_status_enum', [
      'compliant',
      'non_compliant',
      'partially_compliant',
      'not_assessed',
      'exception_approved'
    ]);

    // Obligation enums
    await createEnumIfNotExists('obligation_status_enum', [
      'met',
      'not_met',
      'in_progress',
      'not_applicable'
    ]);

    // Control relationship enums
    await createEnumIfNotExists('control_relationship_type_enum', [
      'depends_on',
      'compensates_for',
      'supports',
      'related_to'
    ]);

    // Standard enums
    await createEnumIfNotExists('standard_status_enum', [
      'draft',
      'in_review',
      'approved',
      'published',
      'archived'
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop enums in reverse order (only if they exist)
    await queryRunner.query(`DROP TYPE IF EXISTS standard_status_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS control_relationship_type_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS obligation_status_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS baseline_compliance_status_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS kci_data_type_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS test_result_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS test_frequency_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS exception_status_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS execution_outcome_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS sop_status_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS sop_category_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS evidence_link_type_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS evidence_status_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS evidence_type_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS finding_status_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS finding_severity_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS assessment_result_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS assessment_status_enum;`);
    // Note: assessment_type_enum is not dropped as it was created in migration 1700000000016
    await queryRunner.query(`DROP TYPE IF EXISTS mapping_coverage_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS framework_status_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS implementation_status_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS control_status_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS control_cost_impact_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS control_complexity_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS control_type_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS review_frequency_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS policy_status_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS applicability_status_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS influencer_status_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS influencer_category_enum;`);
  }
}
