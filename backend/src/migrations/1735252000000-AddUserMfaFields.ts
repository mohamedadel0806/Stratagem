import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserMfaFields1735252000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "mfa_enabled" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" ADD "mfa_secret" varchar`);
        await queryRunner.query(`ALTER TABLE "users" ADD "mfa_recovery_codes" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "mfa_recovery_codes"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "mfa_secret"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "mfa_enabled"`);
    }
}
