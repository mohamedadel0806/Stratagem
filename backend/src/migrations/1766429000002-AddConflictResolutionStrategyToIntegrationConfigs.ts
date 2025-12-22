import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddConflictResolutionStrategyToIntegrationConfigs1766429000002 implements MigrationInterface {
  name = 'AddConflictResolutionStrategyToIntegrationConfigs1766429000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // First create the enum type if it doesn't exist
    await queryRunner.query(`
      CREATE TYPE conflict_resolution_strategy AS ENUM (
        'skip',
        'overwrite',
        'merge'
      );
    `);

    // Add the column to the integration_configs table
    await queryRunner.query(`
      ALTER TABLE "integration_configs"
      ADD COLUMN "conflict_resolution_strategy" conflict_resolution_strategy DEFAULT 'skip';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove the column
    await queryRunner.query(`
      ALTER TABLE "integration_configs"
      DROP COLUMN "conflict_resolution_strategy";
    `);

    // Drop the enum type
    await queryRunner.query('DROP TYPE IF EXISTS conflict_resolution_strategy');
  }
}