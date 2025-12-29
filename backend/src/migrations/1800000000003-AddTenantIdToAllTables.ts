import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTenantIdToAllTables1800000000003 implements MigrationInterface {
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
        // 1. Ensure we have a default tenant
        let defaultTenantId = '48c23483-9007-4ef8-bf35-103d13f6436b'; // Use the id we just created manually

        const tenantExists = await queryRunner.query(`SELECT id FROM tenants WHERE id = '${defaultTenantId}'`);
        if (tenantExists.length === 0) {
            await queryRunner.query(`
                INSERT INTO tenants (id, name, code, status) 
                VALUES ('${defaultTenantId}', 'Default Organization', 'default', 'active')
                ON CONFLICT (code) DO UPDATE SET name = 'Default Organization';
            `);
            // If code conflict happened, get the existing id
            const existing = await queryRunner.query(`SELECT id FROM tenants WHERE code = 'default'`);
            defaultTenantId = existing[0].id;
        }

        for (const tableName of this.tables) {
            const tableExists = await queryRunner.hasTable(tableName);
            if (!tableExists) continue;

            // 2. Add tenant_id column if it doesn't exist
            const hasColumn = await queryRunner.query(`
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = '${tableName}' AND column_name = 'tenant_id'
            `);

            if (hasColumn.length === 0) {
                await queryRunner.query(`ALTER TABLE "${tableName}" ADD COLUMN "tenant_id" uuid;`);
            }

            // 3. Update existing rows to use default tenant
            await queryRunner.query(`UPDATE "${tableName}" SET "tenant_id" = '${defaultTenantId}' WHERE "tenant_id" IS NULL;`);

            // 4. Make it NOT NULL (optional, for safety we can keep it nullable for now if we want to be cautious)
            // await queryRunner.query(`ALTER TABLE "${tableName}" ALTER COLUMN "tenant_id" SET NOT NULL;`);

            // 5. Add index and foreign key
            await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_${tableName}_tenant_id" ON "${tableName}" ("tenant_id");`);

            // Check if FK already exists (approximate check)
            const hasFk = await queryRunner.query(`
                SELECT 1 FROM information_schema.table_constraints 
                WHERE table_name = '${tableName}' AND constraint_name = 'FK_${tableName}_tenant_id'
            `);

            if (hasFk.length === 0) {
                await queryRunner.query(`
                    ALTER TABLE "${tableName}" 
                    ADD CONSTRAINT "FK_${tableName}_tenant_id" 
                    FOREIGN KEY ("tenant_id") REFERENCES tenants(id) ON DELETE CASCADE;
                `);
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        for (const tableName of this.tables) {
            const tableExists = await queryRunner.hasTable(tableName);
            if (!tableExists) continue;

            await queryRunner.query(`ALTER TABLE "${tableName}" DROP CONSTRAINT IF EXISTS "FK_${tableName}_tenant_id";`);
            await queryRunner.query(`DROP INDEX IF EXISTS "IDX_${tableName}_tenant_id";`);
            await queryRunner.query(`ALTER TABLE "${tableName}" DROP COLUMN IF EXISTS "tenant_id";`);
        }
    }
}
