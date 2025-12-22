import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateRiskAssetAndControlLinks1702000000004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum for asset types in risk context
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE risk_asset_type_enum AS ENUM ('physical', 'information', 'software', 'application', 'supplier');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create risk_asset_links table
    await queryRunner.createTable(
      new Table({
        name: 'risk_asset_links',
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
            name: 'asset_type',
            type: 'risk_asset_type_enum',
            isNullable: false,
          },
          {
            name: 'asset_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'impact_description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'asset_criticality_at_link',
            type: 'varchar',
            length: '50',
            isNullable: true,
            comment: 'Snapshot of asset criticality when linked',
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
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Add foreign keys for risk_asset_links
    await queryRunner.createForeignKey(
      'risk_asset_links',
      new TableForeignKey({
        columnNames: ['risk_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'risks',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'risk_asset_links',
      new TableForeignKey({
        columnNames: ['linked_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    // Create indexes for risk_asset_links
    await queryRunner.createIndex('risk_asset_links', new TableIndex({ columnNames: ['risk_id'] }));
    await queryRunner.createIndex('risk_asset_links', new TableIndex({ columnNames: ['asset_type', 'asset_id'] }));
    await queryRunner.query(`
      ALTER TABLE risk_asset_links
      ADD CONSTRAINT unique_risk_asset_link UNIQUE (risk_id, asset_type, asset_id);
    `);

    // Create risk_control_links table
    await queryRunner.createTable(
      new Table({
        name: 'risk_control_links',
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
            name: 'control_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'effectiveness_rating',
            type: 'integer',
            isNullable: true,
            comment: '1-5 scale or percentage (0-100)',
          },
          {
            name: 'effectiveness_type',
            type: 'varchar',
            length: '20',
            default: "'scale'",
            comment: 'scale (1-5) or percentage (0-100)',
          },
          {
            name: 'control_type_for_risk',
            type: 'varchar',
            length: '50',
            isNullable: true,
            comment: 'How this control mitigates the risk: preventive, detective, corrective',
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
          {
            name: 'last_effectiveness_review',
            type: 'date',
            isNullable: true,
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

    // Add foreign keys for risk_control_links
    await queryRunner.createForeignKey(
      'risk_control_links',
      new TableForeignKey({
        columnNames: ['risk_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'risks',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'risk_control_links',
      new TableForeignKey({
        columnNames: ['control_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'unified_controls',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'risk_control_links',
      new TableForeignKey({
        columnNames: ['linked_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    // Create indexes for risk_control_links
    await queryRunner.createIndex('risk_control_links', new TableIndex({ columnNames: ['risk_id'] }));
    await queryRunner.createIndex('risk_control_links', new TableIndex({ columnNames: ['control_id'] }));
    await queryRunner.createIndex('risk_control_links', new TableIndex({ columnNames: ['effectiveness_rating'] }));
    await queryRunner.query(`
      ALTER TABLE risk_control_links
      ADD CONSTRAINT unique_risk_control_link UNIQUE (risk_id, control_id);
    `);

    // Create trigger to update risk control_effectiveness when links change
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_risk_control_effectiveness()
      RETURNS TRIGGER AS $$
      DECLARE
        avg_effectiveness INTEGER;
        target_risk_id UUID;
      BEGIN
        IF TG_OP = 'DELETE' THEN
          target_risk_id := OLD.risk_id;
        ELSE
          target_risk_id := NEW.risk_id;
        END IF;
        
        SELECT COALESCE(AVG(
          CASE 
            WHEN effectiveness_type = 'scale' THEN effectiveness_rating * 20
            ELSE effectiveness_rating
          END
        )::INTEGER, 0)
        INTO avg_effectiveness
        FROM risk_control_links
        WHERE risk_id = target_risk_id AND effectiveness_rating IS NOT NULL;
        
        UPDATE risks
        SET control_effectiveness = avg_effectiveness,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = target_risk_id;
        
        IF TG_OP = 'DELETE' THEN
          RETURN OLD;
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER trigger_update_risk_control_effectiveness
      AFTER INSERT OR UPDATE OR DELETE ON risk_control_links
      FOR EACH ROW
      EXECUTE FUNCTION update_risk_control_effectiveness();
    `);

    // Create view for risk-asset summary
    await queryRunner.query(`
      CREATE OR REPLACE VIEW vw_risk_asset_summary AS
      SELECT 
        r.id AS risk_id,
        r.risk_id AS risk_identifier,
        r.title AS risk_title,
        COUNT(DISTINCT ral.id) AS total_linked_assets,
        COUNT(DISTINCT CASE WHEN ral.asset_type = 'physical' THEN ral.id END) AS physical_assets,
        COUNT(DISTINCT CASE WHEN ral.asset_type = 'information' THEN ral.id END) AS information_assets,
        COUNT(DISTINCT CASE WHEN ral.asset_type = 'software' THEN ral.id END) AS software_assets,
        COUNT(DISTINCT CASE WHEN ral.asset_type = 'application' THEN ral.id END) AS application_assets,
        COUNT(DISTINCT CASE WHEN ral.asset_type = 'supplier' THEN ral.id END) AS supplier_assets
      FROM risks r
      LEFT JOIN risk_asset_links ral ON r.id = ral.risk_id
      WHERE r.deleted_at IS NULL
      GROUP BY r.id, r.risk_id, r.title;
    `);

    // Create view for risk-control summary
    await queryRunner.query(`
      CREATE OR REPLACE VIEW vw_risk_control_summary AS
      SELECT 
        r.id AS risk_id,
        r.risk_id AS risk_identifier,
        r.title AS risk_title,
        COUNT(DISTINCT rcl.id) AS total_linked_controls,
        COALESCE(AVG(
          CASE 
            WHEN rcl.effectiveness_type = 'scale' THEN rcl.effectiveness_rating * 20
            ELSE rcl.effectiveness_rating
          END
        )::INTEGER, 0) AS average_control_effectiveness,
        CASE
          WHEN COUNT(rcl.id) = 0 THEN 'no_controls'
          WHEN AVG(CASE WHEN rcl.effectiveness_type = 'scale' THEN rcl.effectiveness_rating * 20 ELSE rcl.effectiveness_rating END) >= 80 THEN 'well_controlled'
          WHEN AVG(CASE WHEN rcl.effectiveness_type = 'scale' THEN rcl.effectiveness_rating * 20 ELSE rcl.effectiveness_rating END) >= 50 THEN 'partially_controlled'
          ELSE 'weakly_controlled'
        END AS control_status
      FROM risks r
      LEFT JOIN risk_control_links rcl ON r.id = rcl.risk_id
      WHERE r.deleted_at IS NULL
      GROUP BY r.id, r.risk_id, r.title;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW IF EXISTS vw_risk_control_summary;`);
    await queryRunner.query(`DROP VIEW IF EXISTS vw_risk_asset_summary;`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_update_risk_control_effectiveness ON risk_control_links;`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_risk_control_effectiveness();`);
    
    await queryRunner.dropTable('risk_control_links', true);
    await queryRunner.dropTable('risk_asset_links', true);
    
    await queryRunner.query(`DROP TYPE IF EXISTS risk_asset_type_enum;`);
  }
}







