import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateRiskAssessmentsTable1702000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enums for risk assessments
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE assessment_type_enum AS ENUM ('inherent', 'current', 'target');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE impact_level_enum AS ENUM ('negligible', 'minor', 'moderate', 'major', 'catastrophic');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE confidence_level_enum AS ENUM ('high', 'medium', 'low');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create risk_assessments table
    await queryRunner.createTable(
      new Table({
        name: 'risk_assessments',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'risk_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'assessment_type',
            type: 'assessment_type_enum',
            isNullable: false,
          },
          {
            name: 'likelihood',
            type: 'integer',
            isNullable: false,
            comment: '1-5 scale',
          },
          {
            name: 'impact',
            type: 'integer',
            isNullable: false,
            comment: '1-5 scale',
          },
          {
            name: 'risk_score',
            type: 'integer',
            isNullable: true,
            comment: 'Calculated: likelihood * impact',
          },
          {
            name: 'risk_level',
            type: 'risk_level_enum',
            isNullable: true,
          },
          {
            name: 'financial_impact',
            type: 'impact_level_enum',
            isNullable: true,
          },
          {
            name: 'financial_impact_amount',
            type: 'decimal',
            precision: 15,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'operational_impact',
            type: 'impact_level_enum',
            isNullable: true,
          },
          {
            name: 'reputational_impact',
            type: 'impact_level_enum',
            isNullable: true,
          },
          {
            name: 'compliance_impact',
            type: 'impact_level_enum',
            isNullable: true,
          },
          {
            name: 'safety_impact',
            type: 'impact_level_enum',
            isNullable: true,
          },
          {
            name: 'assessment_date',
            type: 'date',
            default: 'CURRENT_DATE',
          },
          {
            name: 'assessor_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'assessment_method',
            type: 'varchar',
            length: '100',
            default: "'qualitative_5x5'",
          },
          {
            name: 'assessment_notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'assumptions',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'confidence_level',
            type: 'confidence_level_enum',
            default: "'medium'",
          },
          {
            name: 'evidence_attachments',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'is_latest',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Add foreign keys
    await queryRunner.createForeignKey(
      'risk_assessments',
      new TableForeignKey({
        columnNames: ['risk_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'risks',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'risk_assessments',
      new TableForeignKey({
        columnNames: ['assessor_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    // Create indexes
    await queryRunner.createIndex('risk_assessments', new TableIndex({ columnNames: ['risk_id'] }));
    await queryRunner.createIndex('risk_assessments', new TableIndex({ columnNames: ['assessment_type'] }));
    await queryRunner.createIndex('risk_assessments', new TableIndex({ columnNames: ['assessment_date'] }));
    await queryRunner.createIndex('risk_assessments', new TableIndex({ columnNames: ['risk_level'] }));
    await queryRunner.createIndex('risk_assessments', new TableIndex({ 
      columnNames: ['risk_id', 'assessment_type', 'is_latest'],
      where: 'is_latest = true',
    }));

    // Create trigger to calculate risk score
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION calculate_assessment_risk_score()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.risk_score := NEW.likelihood * NEW.impact;
        NEW.risk_level := calculate_risk_level(NEW.risk_score);
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER trigger_calculate_assessment_risk_score
      BEFORE INSERT OR UPDATE ON risk_assessments
      FOR EACH ROW
      EXECUTE FUNCTION calculate_assessment_risk_score();
    `);

    // Create trigger to mark previous assessments as not latest
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION mark_previous_assessments_not_latest()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.is_latest = true THEN
          UPDATE risk_assessments
          SET is_latest = false
          WHERE risk_id = NEW.risk_id
            AND assessment_type = NEW.assessment_type
            AND id != NEW.id
            AND is_latest = true;
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER trigger_mark_previous_assessments
      AFTER INSERT ON risk_assessments
      FOR EACH ROW
      EXECUTE FUNCTION mark_previous_assessments_not_latest();
    `);

    // Create trigger to update risk table with latest assessment values
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION sync_risk_assessment_values()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.is_latest = true THEN
          IF NEW.assessment_type = 'inherent' THEN
            UPDATE risks
            SET inherent_likelihood = NEW.likelihood,
                inherent_impact = NEW.impact,
                inherent_risk_score = NEW.risk_score,
                inherent_risk_level = NEW.risk_level,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = NEW.risk_id;
          ELSIF NEW.assessment_type = 'current' THEN
            UPDATE risks
            SET current_likelihood = NEW.likelihood,
                current_impact = NEW.impact,
                current_risk_score = NEW.risk_score,
                current_risk_level = NEW.risk_level,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = NEW.risk_id;
          ELSIF NEW.assessment_type = 'target' THEN
            UPDATE risks
            SET target_likelihood = NEW.likelihood,
                target_impact = NEW.impact,
                target_risk_score = NEW.risk_score,
                target_risk_level = NEW.risk_level,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = NEW.risk_id;
          END IF;
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER trigger_sync_risk_assessment
      AFTER INSERT OR UPDATE ON risk_assessments
      FOR EACH ROW
      EXECUTE FUNCTION sync_risk_assessment_values();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_sync_risk_assessment ON risk_assessments;`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_mark_previous_assessments ON risk_assessments;`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_calculate_assessment_risk_score ON risk_assessments;`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS sync_risk_assessment_values();`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS mark_previous_assessments_not_latest();`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS calculate_assessment_risk_score();`);
    
    await queryRunner.dropTable('risk_assessments', true);
    
    await queryRunner.query(`DROP TYPE IF EXISTS confidence_level_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS impact_level_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS assessment_type_enum;`);
  }
}







