import { MigrationInterface, QueryRunner } from "typeorm";

export class FixBusinessUnitUniqueConstraint1800000000004 implements MigrationInterface {
    name = 'FixBusinessUnitUniqueConstraint1800000000004'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop the old global unique constraint
        // The name comes from the error message: duplicate key value violates unique constraint "UQ_875d522984844abe7b6f2d9c976"
        await queryRunner.query(`ALTER TABLE "business_units" DROP CONSTRAINT IF EXISTS "UQ_875d522984844abe7b6f2d9c976"`);

        // Also try dropping indexes that TypeORM might have created
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_875d522984844abe7b6f2d9c976"`);

        // Create the new scoped unique index
        // We add WHERE deleted_at IS NULL to allow reusing codes if a BU is soft-deleted
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_business_units_tenant_code" ON "business_units" ("tenant_id", "code")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_business_units_tenant_code"`);
        await queryRunner.query(`ALTER TABLE "business_units" ADD CONSTRAINT "UQ_875d522984844abe7b6f2d9c976" UNIQUE ("code")`);
    }
}
