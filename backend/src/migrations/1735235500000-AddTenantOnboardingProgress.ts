import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddTenantOnboardingProgress1735235500000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("tenants", new TableColumn({
            name: "onboarding_progress",
            type: "jsonb",
            isNullable: true,
        }));

        // Initialize progress for existing tenants
        await queryRunner.query(`
            UPDATE tenants 
            SET onboarding_progress = '{"steps": [], "completed": [], "skipped": []}'::jsonb
            WHERE onboarding_progress IS NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("tenants", "onboarding_progress");
    }
}
