import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddAssessmentTypeColumn1702156800001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if the column already exists
    const table = await queryRunner.getTable('assessments');
    const columnExists = table?.columns.some(column => column.name === 'assessment_type');

    if (!columnExists) {
      // Create the enum type if it doesn't exist
      await queryRunner.query(`
        DO $$ BEGIN
          CREATE TYPE assessment_type_enum AS ENUM (
            'implementation',
            'design_effectiveness',
            'operating_effectiveness',
            'compliance'
          );
        EXCEPTION
          WHEN duplicate_object THEN NULL;
        END $$;
      `);

      // Add the assessment_type column
      await queryRunner.addColumn(
        'assessments',
        new TableColumn({
          name: 'assessment_type',
          type: 'assessment_type_enum',
          isNullable: true,
          default: "'compliance'",
        }),
      );

      // Create index on assessment_type
      await queryRunner.query(
        `CREATE INDEX IDX_assessment_type ON assessments(assessment_type)`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove the index
    await queryRunner.query(`DROP INDEX IF EXISTS IDX_assessment_type`);

    // Remove the column
    const table = await queryRunner.getTable('assessments');
    const columnExists = table?.columns.some(column => column.name === 'assessment_type');

    if (columnExists) {
      await queryRunner.dropColumn('assessments', 'assessment_type');
    }

    // Drop the enum type
    await queryRunner.query(`DROP TYPE IF EXISTS assessment_type_enum`);
  }
}
