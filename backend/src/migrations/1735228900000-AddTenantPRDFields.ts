import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTenantPRDFields1735228900000 implements MigrationInterface {
    name = 'AddTenantPRDFields1735228900000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add PRD-required fields to tenants table
        await queryRunner.query(`
            ALTER TABLE "tenants" 
            ADD COLUMN "industry" character varying,
            ADD COLUMN "regulatory_scope" text,
            ADD COLUMN "suspension_reason" text,
            ADD COLUMN "last_activity_at" TIMESTAMP,
            ADD COLUMN "user_count" integer DEFAULT 0,
            ADD COLUMN "storage_used_mb" integer DEFAULT 0
        `);

        // Create index on last_activity_at for performance
        await queryRunner.query(`
            CREATE INDEX "IDX_tenants_last_activity_at" 
            ON "tenants" ("last_activity_at")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_tenants_last_activity_at"`);
        await queryRunner.query(`
            ALTER TABLE "tenants" 
            DROP COLUMN "storage_used_mb",
            DROP COLUMN "user_count",
            DROP COLUMN "last_activity_at",
            DROP COLUMN "suspension_reason",
            DROP COLUMN "regulatory_scope",
            DROP COLUMN "industry"
        `);
    }
}
