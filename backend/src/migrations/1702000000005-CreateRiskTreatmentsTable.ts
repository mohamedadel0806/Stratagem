import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateRiskTreatmentsTable1702000000005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enums for risk treatments
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE treatment_strategy_enum AS ENUM ('mitigate', 'transfer', 'avoid', 'accept');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE treatment_status_enum AS ENUM ('planned', 'in_progress', 'completed', 'deferred', 'cancelled');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE treatment_priority_enum AS ENUM ('critical', 'high', 'medium', 'low');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create risk_treatments table
    await queryRunner.createTable(
      new Table({
        name: 'risk_treatments',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'treatment_id',
            type: 'varchar',
            length: '20',
            isUnique: true,
            isNullable: true,
          },
          {
            name: 'risk_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'strategy',
            type: 'treatment_strategy_enum',
            isNullable: false,
          },
          {
            name: 'title',
            type: 'varchar',
            length: '300',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'treatment_owner_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'treatment_status_enum',
            default: "'planned'",
          },
          {
            name: 'priority',
            type: 'treatment_priority_enum',
            default: "'medium'",
          },
          {
            name: 'start_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'target_completion_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'actual_completion_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'estimated_cost',
            type: 'decimal',
            precision: 15,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'actual_cost',
            type: 'decimal',
            precision: 15,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'expected_risk_reduction',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'residual_likelihood',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'residual_impact',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'residual_risk_score',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'progress_percentage',
            type: 'integer',
            default: 0,
          },
          {
            name: 'progress_notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'implementation_notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'linked_control_ids',
            type: 'uuid[]',
            isNullable: true,
            comment: 'Controls created or enhanced as part of this treatment',
          },
          {
            name: 'attachments',
            type: 'jsonb',
            isNullable: true,
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
            name: 'updated_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Create treatment_tasks table for sub-tasks
    await queryRunner.createTable(
      new Table({
        name: 'treatment_tasks',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'treatment_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'title',
            type: 'varchar',
            length: '300',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'assignee_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
            default: "'pending'",
          },
          {
            name: 'due_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'completed_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'display_order',
            type: 'integer',
            default: 0,
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
      'risk_treatments',
      new TableForeignKey({
        columnNames: ['risk_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'risks',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'risk_treatments',
      new TableForeignKey({
        columnNames: ['treatment_owner_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'treatment_tasks',
      new TableForeignKey({
        columnNames: ['treatment_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'risk_treatments',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'treatment_tasks',
      new TableForeignKey({
        columnNames: ['assignee_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    // Create indexes
    await queryRunner.createIndex('risk_treatments', new TableIndex({ columnNames: ['risk_id'] }));
    await queryRunner.createIndex('risk_treatments', new TableIndex({ columnNames: ['treatment_id'] }));
    await queryRunner.createIndex('risk_treatments', new TableIndex({ columnNames: ['status'] }));
    await queryRunner.createIndex('risk_treatments', new TableIndex({ columnNames: ['treatment_owner_id'] }));
    await queryRunner.createIndex('risk_treatments', new TableIndex({ columnNames: ['target_completion_date'] }));
    await queryRunner.createIndex('risk_treatments', new TableIndex({ columnNames: ['priority'] }));
    
    await queryRunner.createIndex('treatment_tasks', new TableIndex({ columnNames: ['treatment_id'] }));
    await queryRunner.createIndex('treatment_tasks', new TableIndex({ columnNames: ['status'] }));

    // Create sequence for treatment_id generation
    await queryRunner.query(`
      CREATE SEQUENCE IF NOT EXISTS treatment_id_seq START WITH 1;
    `);

    // Create trigger to auto-generate treatment_id
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION generate_treatment_id()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.treatment_id IS NULL THEN
          NEW.treatment_id := 'TRT-' || LPAD(nextval('treatment_id_seq')::TEXT, 4, '0');
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER trigger_generate_treatment_id
      BEFORE INSERT ON risk_treatments
      FOR EACH ROW
      EXECUTE FUNCTION generate_treatment_id();
    `);

    // Create trigger to calculate residual risk score
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION calculate_treatment_residual_score()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.residual_likelihood IS NOT NULL AND NEW.residual_impact IS NOT NULL THEN
          NEW.residual_risk_score := NEW.residual_likelihood * NEW.residual_impact;
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER trigger_calculate_treatment_residual
      BEFORE INSERT OR UPDATE ON risk_treatments
      FOR EACH ROW
      EXECUTE FUNCTION calculate_treatment_residual_score();
    `);

    // Create trigger to update treatment progress based on tasks
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_treatment_progress()
      RETURNS TRIGGER AS $$
      DECLARE
        total_tasks INTEGER;
        completed_tasks INTEGER;
        progress INTEGER;
      BEGIN
        SELECT COUNT(*), COUNT(*) FILTER (WHERE status = 'completed')
        INTO total_tasks, completed_tasks
        FROM treatment_tasks
        WHERE treatment_id = COALESCE(NEW.treatment_id, OLD.treatment_id);
        
        IF total_tasks > 0 THEN
          progress := (completed_tasks * 100 / total_tasks);
        ELSE
          progress := 0;
        END IF;
        
        UPDATE risk_treatments
        SET progress_percentage = progress,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = COALESCE(NEW.treatment_id, OLD.treatment_id);
        
        RETURN COALESCE(NEW, OLD);
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER trigger_update_treatment_progress
      AFTER INSERT OR UPDATE OR DELETE ON treatment_tasks
      FOR EACH ROW
      EXECUTE FUNCTION update_treatment_progress();
    `);

    // Create view for treatment summary
    await queryRunner.query(`
      CREATE OR REPLACE VIEW vw_treatment_summary AS
      SELECT 
        rt.id,
        rt.treatment_id,
        rt.title,
        rt.strategy,
        rt.status,
        rt.priority,
        rt.progress_percentage,
        rt.target_completion_date,
        rt.actual_completion_date,
        rt.risk_id,
        r.risk_id AS risk_identifier,
        r.title AS risk_title,
        r.current_risk_level,
        u.id AS owner_id,
        u.first_name || ' ' || u.last_name AS owner_name,
        CASE 
          WHEN rt.status = 'completed' THEN 'completed'
          WHEN rt.target_completion_date < CURRENT_DATE AND rt.status NOT IN ('completed', 'cancelled') THEN 'overdue'
          WHEN rt.target_completion_date <= CURRENT_DATE + INTERVAL '7 days' THEN 'due_soon'
          ELSE 'on_track'
        END AS due_status,
        (SELECT COUNT(*) FROM treatment_tasks WHERE treatment_id = rt.id) AS total_tasks,
        (SELECT COUNT(*) FROM treatment_tasks WHERE treatment_id = rt.id AND status = 'completed') AS completed_tasks
      FROM risk_treatments rt
      JOIN risks r ON rt.risk_id = r.id
      LEFT JOIN users u ON rt.treatment_owner_id = u.id
      WHERE rt.deleted_at IS NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW IF EXISTS vw_treatment_summary;`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_update_treatment_progress ON treatment_tasks;`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_calculate_treatment_residual ON risk_treatments;`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_generate_treatment_id ON risk_treatments;`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_treatment_progress();`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS calculate_treatment_residual_score();`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS generate_treatment_id();`);
    await queryRunner.query(`DROP SEQUENCE IF EXISTS treatment_id_seq;`);
    
    await queryRunner.dropTable('treatment_tasks', true);
    await queryRunner.dropTable('risk_treatments', true);
    
    await queryRunner.query(`DROP TYPE IF EXISTS treatment_priority_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS treatment_status_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS treatment_strategy_enum;`);
  }
}





