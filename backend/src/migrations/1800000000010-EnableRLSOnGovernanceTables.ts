import { MigrationInterface, QueryRunner } from 'typeorm';

export class EnableRLSOnGovernanceTables1800000000010 implements MigrationInterface {
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
        for (const tableName of this.tables) {
            const tableExists = await queryRunner.hasTable(tableName);
            if (!tableExists) {
                console.warn(`Table ${tableName} not found, skipping RLS enablement.`);
                continue;
            }

            // 1. Enable RLS on the table
            await queryRunner.query(`ALTER TABLE "${tableName}" ENABLE ROW LEVEL SECURITY;`);

            // 2. Check if policy already exists
            const policyExists = await queryRunner.query(`
                SELECT 1 FROM pg_policies 
                WHERE tablename = '${tableName}' AND policyname = 'tenant_isolation_policy';
            `);

            if (policyExists.length === 0) {
                // 3. Create the tenant isolation policy
                await queryRunner.query(`
                    CREATE POLICY tenant_isolation_policy ON "${tableName}"
                    USING (
                        tenant_id = current_setting('app.tenant_id', true)::uuid
                        OR 
                        current_setting('app.bypass_rls', true) = 'on'
                    );
                `);
                console.log(`✓ Created RLS policy on ${tableName}`);
            } else {
                console.log(`✓ RLS policy already exists on ${tableName}, skipping`);
            }

            // 4. Force RLS for all users (including table owners if needed)
            await queryRunner.query(`ALTER TABLE "${tableName}" FORCE ROW LEVEL SECURITY;`);

            console.log(`✓ Enabled RLS on ${tableName}`);
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
