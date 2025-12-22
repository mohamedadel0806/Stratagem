import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixReportTemplateFieldSelection1704000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Make field_selection nullable and set default
    await queryRunner.query(`
      ALTER TABLE report_templates 
      ALTER COLUMN field_selection DROP NOT NULL,
      ALTER COLUMN field_selection SET DEFAULT '[]'::jsonb;
    `);
    
    // Update any existing NULL values to empty array
    await queryRunner.query(`
      UPDATE report_templates 
      SET field_selection = '[]'::jsonb 
      WHERE field_selection IS NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert to NOT NULL (but this might fail if there are NULLs)
    await queryRunner.query(`
      ALTER TABLE report_templates 
      ALTER COLUMN field_selection SET NOT NULL;
    `);
  }
}



