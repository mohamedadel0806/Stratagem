import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateKRIsTable1702000000006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enums for KRIs
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE measurement_frequency_enum AS ENUM ('daily', 'weekly', 'monthly', 'quarterly', 'annually');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE kri_status_enum AS ENUM ('green', 'amber', 'red');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE kri_trend_enum AS ENUM ('improving', 'stable', 'worsening');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create kris table
    await queryRunner.createTable(
      new Table({
        name: 'kris',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'kri_id',
            type: 'varchar',
            length: '20',
            isUnique: true,
            isNullable: true,
          },
          {
            name: 'name',
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
            name: 'category_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'measurement_unit',
            type: 'varchar',
            length: '100',
            isNullable: true,
            comment: 'e.g., %, count, days, $',
          },
          {
            name: 'measurement_frequency',
            type: 'measurement_frequency_enum',
            default: "'monthly'",
          },
          {
            name: 'data_source',
            type: 'varchar',
            length: '300',
            isNullable: true,
          },
          {
            name: 'calculation_method',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'threshold_green',
            type: 'decimal',
            precision: 15,
            scale: 4,
            isNullable: true,
            comment: 'Upper bound for green status',
          },
          {
            name: 'threshold_amber',
            type: 'decimal',
            precision: 15,
            scale: 4,
            isNullable: true,
            comment: 'Upper bound for amber status (values above this are red)',
          },
          {
            name: 'threshold_red',
            type: 'decimal',
            precision: 15,
            scale: 4,
            isNullable: true,
            comment: 'Upper bound for red status (optional, for inverted thresholds)',
          },
          {
            name: 'threshold_direction',
            type: 'varchar',
            length: '20',
            default: "'lower_better'",
            comment: 'lower_better or higher_better',
          },
          {
            name: 'current_value',
            type: 'decimal',
            precision: 15,
            scale: 4,
            isNullable: true,
          },
          {
            name: 'current_status',
            type: 'kri_status_enum',
            isNullable: true,
          },
          {
            name: 'trend',
            type: 'kri_trend_enum',
            isNullable: true,
          },
          {
            name: 'kri_owner_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'last_measured_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'next_measurement_due',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'target_value',
            type: 'decimal',
            precision: 15,
            scale: 4,
            isNullable: true,
          },
          {
            name: 'baseline_value',
            type: 'decimal',
            precision: 15,
            scale: 4,
            isNullable: true,
          },
          {
            name: 'tags',
            type: 'varchar[]',
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

    // Create kri_measurements table for historical values
    await queryRunner.createTable(
      new Table({
        name: 'kri_measurements',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'kri_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'measurement_date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'value',
            type: 'decimal',
            precision: 15,
            scale: 4,
            isNullable: false,
          },
          {
            name: 'status',
            type: 'kri_status_enum',
            isNullable: true,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'measured_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'evidence_attachments',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create kri_risk_links junction table
    await queryRunner.createTable(
      new Table({
        name: 'kri_risk_links',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'kri_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'risk_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'relationship_type',
            type: 'varchar',
            length: '50',
            default: "'indicator'",
            comment: 'indicator, leading, lagging',
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'linked_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'linked_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Add foreign keys for kris
    await queryRunner.createForeignKey(
      'kris',
      new TableForeignKey({
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'risk_categories',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'kris',
      new TableForeignKey({
        columnNames: ['kri_owner_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    // Add foreign keys for kri_measurements
    await queryRunner.createForeignKey(
      'kri_measurements',
      new TableForeignKey({
        columnNames: ['kri_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'kris',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'kri_measurements',
      new TableForeignKey({
        columnNames: ['measured_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    // Add foreign keys for kri_risk_links
    await queryRunner.createForeignKey(
      'kri_risk_links',
      new TableForeignKey({
        columnNames: ['kri_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'kris',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'kri_risk_links',
      new TableForeignKey({
        columnNames: ['risk_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'risks',
        onDelete: 'CASCADE',
      }),
    );

    // Create indexes
    await queryRunner.createIndex('kris', new TableIndex({ columnNames: ['kri_id'] }));
    await queryRunner.createIndex('kris', new TableIndex({ columnNames: ['category_id'] }));
    await queryRunner.createIndex('kris', new TableIndex({ columnNames: ['current_status'] }));
    await queryRunner.createIndex('kris', new TableIndex({ columnNames: ['is_active'] }));
    await queryRunner.createIndex('kris', new TableIndex({ columnNames: ['kri_owner_id'] }));
    
    await queryRunner.createIndex('kri_measurements', new TableIndex({ columnNames: ['kri_id'] }));
    await queryRunner.createIndex('kri_measurements', new TableIndex({ columnNames: ['measurement_date'] }));
    await queryRunner.createIndex('kri_measurements', new TableIndex({ columnNames: ['kri_id', 'measurement_date'] }));
    
    await queryRunner.createIndex('kri_risk_links', new TableIndex({ columnNames: ['kri_id'] }));
    await queryRunner.createIndex('kri_risk_links', new TableIndex({ columnNames: ['risk_id'] }));
    await queryRunner.query(`
      ALTER TABLE kri_risk_links
      ADD CONSTRAINT unique_kri_risk_link UNIQUE (kri_id, risk_id);
    `);

    // Create sequence for kri_id generation
    await queryRunner.query(`
      CREATE SEQUENCE IF NOT EXISTS kri_id_seq START WITH 1;
    `);

    // Create trigger to auto-generate kri_id
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION generate_kri_id()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.kri_id IS NULL THEN
          NEW.kri_id := 'KRI-' || LPAD(nextval('kri_id_seq')::TEXT, 4, '0');
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER trigger_generate_kri_id
      BEFORE INSERT ON kris
      FOR EACH ROW
      EXECUTE FUNCTION generate_kri_id();
    `);

    // Create function to calculate KRI status
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION calculate_kri_status(
        p_value DECIMAL,
        p_threshold_green DECIMAL,
        p_threshold_amber DECIMAL,
        p_direction VARCHAR
      )
      RETURNS kri_status_enum AS $$
      BEGIN
        IF p_value IS NULL OR p_threshold_green IS NULL OR p_threshold_amber IS NULL THEN
          RETURN NULL;
        END IF;
        
        IF p_direction = 'lower_better' THEN
          IF p_value <= p_threshold_green THEN
            RETURN 'green';
          ELSIF p_value <= p_threshold_amber THEN
            RETURN 'amber';
          ELSE
            RETURN 'red';
          END IF;
        ELSE -- higher_better
          IF p_value >= p_threshold_green THEN
            RETURN 'green';
          ELSIF p_value >= p_threshold_amber THEN
            RETURN 'amber';
          ELSE
            RETURN 'red';
          END IF;
        END IF;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Create trigger to update KRI status when measurement is added
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_kri_on_measurement()
      RETURNS TRIGGER AS $$
      DECLARE
        kri_record RECORD;
        new_status kri_status_enum;
        prev_value DECIMAL;
        new_trend kri_trend_enum;
      BEGIN
        -- Get KRI details
        SELECT * INTO kri_record FROM kris WHERE id = NEW.kri_id;
        
        -- Calculate status
        new_status := calculate_kri_status(
          NEW.value,
          kri_record.threshold_green,
          kri_record.threshold_amber,
          kri_record.threshold_direction
        );
        
        -- Update measurement status
        NEW.status := new_status;
        
        -- Get previous value for trend calculation
        SELECT value INTO prev_value
        FROM kri_measurements
        WHERE kri_id = NEW.kri_id
          AND measurement_date < NEW.measurement_date
        ORDER BY measurement_date DESC
        LIMIT 1;
        
        -- Calculate trend
        IF prev_value IS NOT NULL THEN
          IF kri_record.threshold_direction = 'lower_better' THEN
            IF NEW.value < prev_value THEN
              new_trend := 'improving';
            ELSIF NEW.value > prev_value THEN
              new_trend := 'worsening';
            ELSE
              new_trend := 'stable';
            END IF;
          ELSE
            IF NEW.value > prev_value THEN
              new_trend := 'improving';
            ELSIF NEW.value < prev_value THEN
              new_trend := 'worsening';
            ELSE
              new_trend := 'stable';
            END IF;
          END IF;
        END IF;
        
        -- Update KRI record
        UPDATE kris
        SET current_value = NEW.value,
            current_status = new_status,
            trend = COALESCE(new_trend, trend),
            last_measured_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.kri_id;
        
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER trigger_update_kri_on_measurement
      BEFORE INSERT ON kri_measurements
      FOR EACH ROW
      EXECUTE FUNCTION update_kri_on_measurement();
    `);

    // Create view for KRI dashboard
    await queryRunner.query(`
      CREATE OR REPLACE VIEW vw_kri_dashboard AS
      SELECT 
        k.id,
        k.kri_id,
        k.name,
        k.description,
        k.measurement_unit,
        k.measurement_frequency,
        k.current_value,
        k.current_status,
        k.trend,
        k.threshold_green,
        k.threshold_amber,
        k.target_value,
        k.last_measured_at,
        k.next_measurement_due,
        rc.name AS category_name,
        u.first_name || ' ' || u.last_name AS owner_name,
        (SELECT COUNT(*) FROM kri_risk_links WHERE kri_id = k.id) AS linked_risks_count,
        CASE 
          WHEN k.next_measurement_due < CURRENT_DATE THEN 'overdue'
          WHEN k.next_measurement_due <= CURRENT_DATE + INTERVAL '7 days' THEN 'due_soon'
          ELSE 'on_track'
        END AS measurement_due_status
      FROM kris k
      LEFT JOIN risk_categories rc ON k.category_id = rc.id
      LEFT JOIN users u ON k.kri_owner_id = u.id
      WHERE k.deleted_at IS NULL AND k.is_active = true;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW IF EXISTS vw_kri_dashboard;`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_update_kri_on_measurement ON kri_measurements;`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_generate_kri_id ON kris;`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_kri_on_measurement();`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS calculate_kri_status(DECIMAL, DECIMAL, DECIMAL, VARCHAR);`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS generate_kri_id();`);
    await queryRunner.query(`DROP SEQUENCE IF EXISTS kri_id_seq;`);
    
    await queryRunner.dropTable('kri_risk_links', true);
    await queryRunner.dropTable('kri_measurements', true);
    await queryRunner.dropTable('kris', true);
    
    await queryRunner.query(`DROP TYPE IF EXISTS kri_trend_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS kri_status_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS measurement_frequency_enum;`);
  }
}







