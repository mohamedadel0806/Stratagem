import { MigrationInterface, QueryRunner } from 'typeorm';

export class EnableRLSOnCoreTables1800000000007 implements MigrationInterface {
    private tables = [
        'users',
        'business_units',
        'audit_logs',
        'notifications',
        'tasks',
        'uploaded_files',
        'governance_permissions',
        'governance_role_assignments',
        'workflows',
        'workflow_executions',
        'workflow_approvals',
        'workflow_trigger_rules',
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
            // Use current_setting('app.tenant_id', true) with 'true' to avoid error if setting is not found (returns NULL)
            await queryRunner.query(`
        CREATE POLICY tenant_isolation_policy ON "${tableName}"
        USING (
          tenant_id = current_setting('app.tenant_id', true)::uuid
          OR 
          current_setting('app.bypass_rls', true) = 'on'
        );
      `);

            // 3. Force RLS for all users (including table owners if needed)
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
