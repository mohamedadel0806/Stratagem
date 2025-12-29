import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTenantIdToGovernanceTables1800000000009 implements MigrationInterface {
    private tables = [
        // Governance Core Tables
        'influencers',
        'influencer_revisions',
        'framework_versions',
        'unified_controls',
        'control_objectives',
        'framework_requirements',
        'framework_control_mappings',
        'control_asset_mappings',
        'control_tests',

        // Policy Tables
        'policy_assignments',
        'policy_exceptions',
        'policy_reviews',
        'policy_approvals',
        'policy_versions',

        // Assessment & Evidence Tables
        'assessments',
        'assessment_results',
        'evidence',
        'evidence_linkages',
        'findings',
        'remediation_trackers',

        // SOP Tables
        'sops',
        'sop_versions',
        'sop_templates',
        'sop_steps',
        'sop_assignments',
        'sop_schedules',
        'sop_logs',
        'sop_feedback',

        // Other Governance Tables
        'standards',
        'baselines',
        'compliance_obligations',
        'compliance_reports',
        'domains',
        'document_templates',
        'integration_hooks',
        'governance_metric_snapshots',
    ];

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Ensure we have a default tenant
        let defaultTenantId = '48c23483-9007-4ef8-bf35-103d13f6436b';

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
            if (!tableExists) {
                console.warn(`Table ${tableName} not found, skipping tenant_id addition.`);
                continue;
            }

            // 2. Check if tenant_id column already exists
            const hasColumn = await queryRunner.query(`
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = '${tableName}' AND column_name = 'tenant_id'
            `);

            if (hasColumn.length === 0) {
                // 3. Add tenant_id column
                await queryRunner.query(`ALTER TABLE "${tableName}" ADD COLUMN "tenant_id" uuid;`);

                // 4. Update existing rows to use default tenant
                await queryRunner.query(`UPDATE "${tableName}" SET "tenant_id" = '${defaultTenantId}' WHERE "tenant_id" IS NULL;`);

                // 5. Add index
                await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_${tableName}_tenant_id" ON "${tableName}" ("tenant_id");`);

                // 6. Add foreign key constraint
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

                console.log(`✓ Added tenant_id to ${tableName}`);
            } else {
                console.log(`✓ tenant_id already exists in ${tableName}, skipping`);
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
