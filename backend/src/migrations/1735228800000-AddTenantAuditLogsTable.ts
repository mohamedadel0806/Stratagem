import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTenantAuditLogsTable1735228800000 implements MigrationInterface {
    name = 'AddTenantAuditLogsTable1735228800000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create tenant_audit_logs table
        await queryRunner.query(`
            CREATE TABLE "tenant_audit_logs" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "tenant_id" uuid NOT NULL,
                "performed_by" uuid NOT NULL,
                "action" character varying NOT NULL,
                "changes" jsonb,
                "description" text,
                "ip_address" character varying,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_tenant_audit_logs" PRIMARY KEY ("id")
            )
        `);

        // Create indexes
        await queryRunner.query(`
            CREATE INDEX "IDX_tenant_audit_logs_tenant_id" 
            ON "tenant_audit_logs" ("tenant_id")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_tenant_audit_logs_created_at" 
            ON "tenant_audit_logs" ("created_at")
        `);

        // Add foreign keys
        await queryRunner.query(`
            ALTER TABLE "tenant_audit_logs" 
            ADD CONSTRAINT "FK_tenant_audit_logs_tenant" 
            FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") 
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "tenant_audit_logs" 
            ADD CONSTRAINT "FK_tenant_audit_logs_user" 
            FOREIGN KEY ("performed_by") REFERENCES "users"("id") 
            ON DELETE SET NULL ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tenant_audit_logs" DROP CONSTRAINT "FK_tenant_audit_logs_user"`);
        await queryRunner.query(`ALTER TABLE "tenant_audit_logs" DROP CONSTRAINT "FK_tenant_audit_logs_tenant"`);
        await queryRunner.query(`DROP INDEX "IDX_tenant_audit_logs_created_at"`);
        await queryRunner.query(`DROP INDEX "IDX_tenant_audit_logs_tenant_id"`);
        await queryRunner.query(`DROP TABLE "tenant_audit_logs"`);
    }
}
