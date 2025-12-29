import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddTenantTrialFields1735235000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns("tenants", [
            new TableColumn({
                name: "trial_started_at",
                type: "timestamp",
                isNullable: true,
            }),
            new TableColumn({
                name: "trial_ends_at",
                type: "timestamp",
                isNullable: true,
            }),
        ]);

        // For existing trial tenants, set trial_started_at to created_at
        // and trial_ends_at to created_at + 14 days
        await queryRunner.query(`
            UPDATE tenants 
            SET trial_started_at = created_at,
                trial_ends_at = created_at + INTERVAL '14 days'
            WHERE status = 'trial'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("tenants", "trial_ends_at");
        await queryRunner.dropColumn("tenants", "trial_started_at");
    }
}
