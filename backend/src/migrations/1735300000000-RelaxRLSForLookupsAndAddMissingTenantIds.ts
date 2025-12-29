import { MigrationInterface, QueryRunner } from 'typeorm';

export class RelaxRLSForLookupsAndAddMissingTenantIds1735300000000 implements MigrationInterface {
    private lookupTables = [
        'risk_categories',
        'asset_types',
        'compliance_frameworks',
        'compliance_requirements',
        'business_units',
        'control_domains',
        'standards'
    ];

    private missingTenantIdTables = [
        'control_domains',
        'standards',
        'control_objectives',
        'unified_controls',
        'framework_versions',
        'compliance_obligations',
        'secure_baselines',
        'document_templates'
    ];

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Add tenant_id to missing tables
        for (const tableName of this.missingTenantIdTables) {
            const hasColumn = await queryRunner.query(`
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = '${tableName}' AND column_name = 'tenant_id'
            `);

            if (hasColumn.length === 0) {
                await queryRunner.query(`ALTER TABLE "${tableName}" ADD COLUMN "tenant_id" uuid;`);
                await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_${tableName}_tenant_id" ON "${tableName}" ("tenant_id");`);
                await queryRunner.query(`
                    ALTER TABLE "${tableName}" 
                    ADD CONSTRAINT "FK_${tableName}_tenant_id" 
                    FOREIGN KEY ("tenant_id") REFERENCES tenants(id) ON DELETE CASCADE;
                `);
            }

            // Enable RLS if not enabled
            await queryRunner.query(`ALTER TABLE "${tableName}" ENABLE ROW LEVEL SECURITY;`);
            await queryRunner.query(`ALTER TABLE "${tableName}" FORCE ROW LEVEL SECURITY;`);

            // Drop old policy if exists
            await queryRunner.query(`DROP POLICY IF EXISTS tenant_isolation_policy ON "${tableName}";`);

            // Create strict policy by default for these
            await queryRunner.query(`
                CREATE POLICY tenant_isolation_policy ON "${tableName}"
                USING (
                    tenant_id = current_setting('app.tenant_id', true)::uuid
                    OR 
                    current_setting('app.bypass_rls', true) = 'on'
                );
            `);
        }

        // 2. Relax RLS for Lookup tables (allow NULL tenant_id)
        for (const tableName of this.lookupTables) {
            const tableExists = await queryRunner.hasTable(tableName);
            if (!tableExists) continue;

            // Drop existing policy
            await queryRunner.query(`DROP POLICY IF EXISTS tenant_isolation_policy ON "${tableName}";`);

            // Create relaxed policy
            await queryRunner.query(`
                CREATE POLICY tenant_isolation_policy ON "${tableName}"
                USING (
                    tenant_id IS NULL 
                    OR 
                    tenant_id = current_setting('app.tenant_id', true)::uuid
                    OR 
                    current_setting('app.bypass_rls', true) = 'on'
                );
            `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert lookup tables to strict policy
        for (const tableName of this.lookupTables) {
            const tableExists = await queryRunner.hasTable(tableName);
            if (!tableExists) continue;

            await queryRunner.query(`DROP POLICY IF EXISTS tenant_isolation_policy ON "${tableName}";`);
            await queryRunner.query(`
                CREATE POLICY tenant_isolation_policy ON "${tableName}"
                USING (
                    tenant_id = current_setting('app.tenant_id', true)::uuid
                    OR 
                    current_setting('app.bypass_rls', true) = 'on'
                );
            `);
        }
    }
}
