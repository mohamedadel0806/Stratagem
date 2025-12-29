import { MigrationInterface, QueryRunner } from 'typeorm';

export class EnableRLSOnRiskAndAssetTables1800000000008 implements MigrationInterface {
    private tables = [
        // Governance & Compliance
        'policies',
        'compliance_frameworks',
        'compliance_requirements',
        'compliance_assessments',
        'asset_requirement_mappings',
        'compliance_validation_rules',
        'alerts',
        'alert_rules',
        'alert_logs',
        'alert_subscriptions',
        'alert_escalation_chains',
        'dashboard_email_schedules',
        'governance_framework_configs',

        // Risk Module
        'risks',
        'risk_assessments',
        'risk_treatments',
        'kris',
        'kri_measurements',
        'risk_categories',
        'risk_settings',
        'risk_asset_links',
        'risk_control_links',
        'risk_finding_links',
        'kri_risk_links',
        'treatment_tasks',
        'risk_assessment_requests',

        // Asset Module
        'physical_assets',
        'information_assets',
        'business_applications',
        'software_assets',
        'suppliers',
        'asset_audit_logs',
        'asset_dependencies',
        'asset_field_configs',
        'asset_types',
        'email_distribution_lists',
        'import_logs',
        'integration_configs',
        'integration_sync_logs',
        'report_templates',
        'report_template_versions',
        'security_test_results',
        'validation_rules',
    ];

    public async up(queryRunner: QueryRunner): Promise<void> {
        for (const tableName of this.tables) {
            const tableExists = await queryRunner.hasTable(tableName);
            if (!tableExists) {
                console.warn(`Table ${tableName} not found, skipping RLS enablement.`);
                continue;
            }

            // 1. Enable RLS on the table
            await queryRunner.query(`ALTER TABLE "${tableName}" ENABLE ROW LEVEL SECURITY;`);

            // 2. Create the tenant isolation policy
            await queryRunner.query(`
                CREATE POLICY tenant_isolation_policy ON "${tableName}"
                USING (
                    tenant_id = current_setting('app.tenant_id', true)::uuid
                    OR 
                    current_setting('app.bypass_rls', true) = 'on'
                );
            `);

            // 3. Force RLS for all users
            await queryRunner.query(`ALTER TABLE "${tableName}" FORCE ROW LEVEL SECURITY;`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        for (const tableName of this.tables) {
            const tableExists = await queryRunner.hasTable(tableName);
            if (!tableExists) continue;

            await queryRunner.query(`DROP POLICY IF EXISTS tenant_isolation_policy ON "${tableName}";`);
            await queryRunner.query(`ALTER TABLE "${tableName}" DISABLE ROW LEVEL SECURITY;`);
        }
    }
}
