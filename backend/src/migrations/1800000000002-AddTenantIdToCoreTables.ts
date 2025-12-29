import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey, TableIndex } from 'typeorm';

export class AddTenantIdToCoreTables1800000000002 implements MigrationInterface {
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
            // Check if table exists (some might not have been created yet or have different names)
            const tableExists = await queryRunner.hasTable(tableName);
            if (!tableExists) continue;

            // Add tenant_id column
            await queryRunner.addColumn(
                tableName,
                new TableColumn({
                    name: 'tenant_id',
                    type: 'uuid',
                    isNullable: true, // Nullable for initial migration
                }),
            );

            // Add index for tenant_id
            await queryRunner.createIndex(
                tableName,
                new TableIndex({
                    name: `idx_${tableName}_tenant_id`,
                    columnNames: ['tenant_id'],
                }),
            );

            // Add foreign key constraint
            await queryRunner.createForeignKey(
                tableName,
                new TableForeignKey({
                    columnNames: ['tenant_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: 'tenants',
                    onDelete: 'CASCADE',
                }),
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        for (const tableName of this.tables) {
            const tableExists = await queryRunner.hasTable(tableName);
            if (!tableExists) continue;

            // Drop foreign key
            const table = await queryRunner.getTable(tableName);
            const foreignKey = table?.foreignKeys.find((fk) => fk.columnNames.indexOf('tenant_id') !== -1);
            if (foreignKey) {
                await queryRunner.dropForeignKey(tableName, foreignKey);
            }

            // Drop index
            await queryRunner.dropIndex(tableName, `idx_${tableName}_tenant_id`);

            // Drop column
            await queryRunner.dropColumn(tableName, 'tenant_id');
        }
    }
}
