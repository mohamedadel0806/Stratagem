import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTenantAllowedDomains1735251000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tenants" ADD "allowed_domains" text[] DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tenants" DROP COLUMN "allowed_domains"`);
    }
}
