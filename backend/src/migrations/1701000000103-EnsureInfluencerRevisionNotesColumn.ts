import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration to ensure revision_notes and review_frequency_days columns exist in influencers table.
 * This is a safety migration that will add the columns if they don't exist.
 * It's idempotent and safe to run even if the columns already exist.
 */
export class EnsureInfluencerRevisionNotesColumn1701000000103 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Ensure revision_notes column exists (PostgreSQL 9.6+ supports IF NOT EXISTS)
    await queryRunner.query(`
      ALTER TABLE influencers 
      ADD COLUMN IF NOT EXISTS revision_notes TEXT;
    `);

    // Ensure review_frequency_days column exists
    await queryRunner.query(`
      ALTER TABLE influencers 
      ADD COLUMN IF NOT EXISTS review_frequency_days INTEGER;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop columns if they exist (safe rollback)
    await queryRunner.query(`
      ALTER TABLE influencers 
      DROP COLUMN IF EXISTS revision_notes;
    `);

    await queryRunner.query(`
      ALTER TABLE influencers 
      DROP COLUMN IF EXISTS review_frequency_days;
    `);
  }
}


