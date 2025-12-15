"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhanceRisksTable1702000000002 = void 0;
const typeorm_1 = require("typeorm");
class EnhanceRisksTable1702000000002 {
    async up(queryRunner) {
        await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE risk_status_enum AS ENUM ('active', 'monitoring', 'closed', 'accepted');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
        await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE threat_source_enum AS ENUM ('internal', 'external', 'natural');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
        await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE risk_velocity_enum AS ENUM ('slow', 'medium', 'fast', 'immediate');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
        await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE risk_level_enum AS ENUM ('low', 'medium', 'high', 'critical');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
        await queryRunner.addColumns('risks', [
            new typeorm_1.TableColumn({
                name: 'risk_id',
                type: 'varchar',
                length: '20',
                isNullable: true,
                isUnique: true,
            }),
            new typeorm_1.TableColumn({
                name: 'risk_statement',
                type: 'text',
                isNullable: true,
                comment: 'If [cause], then [event], resulting in [impact]',
            }),
            new typeorm_1.TableColumn({
                name: 'category_id',
                type: 'uuid',
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'sub_category_id',
                type: 'uuid',
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'risk_analyst_id',
                type: 'uuid',
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'date_identified',
                type: 'date',
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'threat_source',
                type: 'threat_source_enum',
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'risk_velocity',
                type: 'risk_velocity_enum',
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'early_warning_signs',
                type: 'text',
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'status_notes',
                type: 'text',
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'tags',
                type: 'varchar[]',
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'business_process',
                type: 'text',
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'version_number',
                type: 'integer',
                default: 1,
            }),
            new typeorm_1.TableColumn({
                name: 'next_review_date',
                type: 'date',
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'last_review_date',
                type: 'date',
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'business_unit_ids',
                type: 'uuid[]',
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'inherent_likelihood',
                type: 'integer',
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'inherent_impact',
                type: 'integer',
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'inherent_risk_score',
                type: 'integer',
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'inherent_risk_level',
                type: 'risk_level_enum',
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'current_likelihood',
                type: 'integer',
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'current_impact',
                type: 'integer',
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'current_risk_score',
                type: 'integer',
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'current_risk_level',
                type: 'risk_level_enum',
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'target_likelihood',
                type: 'integer',
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'target_impact',
                type: 'integer',
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'target_risk_score',
                type: 'integer',
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'target_risk_level',
                type: 'risk_level_enum',
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'control_effectiveness',
                type: 'integer',
                isNullable: true,
                comment: 'Overall control effectiveness percentage (0-100)',
            }),
            new typeorm_1.TableColumn({
                name: 'created_by',
                type: 'uuid',
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'updated_by',
                type: 'uuid',
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'deleted_at',
                type: 'timestamp',
                isNullable: true,
            }),
        ]);
        await queryRunner.createForeignKey('risks', new typeorm_1.TableForeignKey({
            columnNames: ['category_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'risk_categories',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createForeignKey('risks', new typeorm_1.TableForeignKey({
            columnNames: ['sub_category_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'risk_categories',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createForeignKey('risks', new typeorm_1.TableForeignKey({
            columnNames: ['risk_analyst_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createIndex('risks', new typeorm_1.TableIndex({ columnNames: ['risk_id'] }));
        await queryRunner.createIndex('risks', new typeorm_1.TableIndex({ columnNames: ['category_id'] }));
        await queryRunner.createIndex('risks', new typeorm_1.TableIndex({ columnNames: ['current_risk_level'] }));
        await queryRunner.createIndex('risks', new typeorm_1.TableIndex({ columnNames: ['next_review_date'] }));
        await queryRunner.query(`
      CREATE SEQUENCE IF NOT EXISTS risk_id_seq START WITH 1;
    `);
        await queryRunner.query(`
      CREATE OR REPLACE FUNCTION generate_risk_id()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.risk_id IS NULL THEN
          NEW.risk_id := 'RISK-' || LPAD(nextval('risk_id_seq')::TEXT, 4, '0');
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
        await queryRunner.query(`
      DROP TRIGGER IF EXISTS trigger_generate_risk_id ON risks;
      CREATE TRIGGER trigger_generate_risk_id
      BEFORE INSERT ON risks
      FOR EACH ROW
      EXECUTE FUNCTION generate_risk_id();
    `);
        await queryRunner.query(`
      CREATE OR REPLACE FUNCTION calculate_risk_level(score INTEGER)
      RETURNS risk_level_enum AS $$
      BEGIN
        IF score >= 20 THEN
          RETURN 'critical';
        ELSIF score >= 12 THEN
          RETURN 'high';
        ELSIF score >= 6 THEN
          RETURN 'medium';
        ELSE
          RETURN 'low';
        END IF;
      END;
      $$ LANGUAGE plpgsql;
    `);
        await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_risk_scores()
      RETURNS TRIGGER AS $$
      BEGIN
        -- Calculate inherent risk score
        IF NEW.inherent_likelihood IS NOT NULL AND NEW.inherent_impact IS NOT NULL THEN
          NEW.inherent_risk_score := NEW.inherent_likelihood * NEW.inherent_impact;
          NEW.inherent_risk_level := calculate_risk_level(NEW.inherent_risk_score);
        END IF;
        
        -- Calculate current risk score
        IF NEW.current_likelihood IS NOT NULL AND NEW.current_impact IS NOT NULL THEN
          NEW.current_risk_score := NEW.current_likelihood * NEW.current_impact;
          NEW.current_risk_level := calculate_risk_level(NEW.current_risk_score);
        END IF;
        
        -- Calculate target risk score
        IF NEW.target_likelihood IS NOT NULL AND NEW.target_impact IS NOT NULL THEN
          NEW.target_risk_score := NEW.target_likelihood * NEW.target_impact;
          NEW.target_risk_level := calculate_risk_level(NEW.target_risk_score);
        END IF;
        
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
        await queryRunner.query(`
      DROP TRIGGER IF EXISTS trigger_update_risk_scores ON risks;
      CREATE TRIGGER trigger_update_risk_scores
      BEFORE INSERT OR UPDATE ON risks
      FOR EACH ROW
      EXECUTE FUNCTION update_risk_scores();
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_update_risk_scores ON risks;`);
        await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_generate_risk_id ON risks;`);
        await queryRunner.query(`DROP FUNCTION IF EXISTS update_risk_scores();`);
        await queryRunner.query(`DROP FUNCTION IF EXISTS calculate_risk_level(INTEGER);`);
        await queryRunner.query(`DROP FUNCTION IF EXISTS generate_risk_id();`);
        await queryRunner.query(`DROP SEQUENCE IF EXISTS risk_id_seq;`);
        await queryRunner.dropIndex('risks', 'IDX_risks_risk_id');
        await queryRunner.dropIndex('risks', 'IDX_risks_category_id');
        await queryRunner.dropIndex('risks', 'IDX_risks_current_risk_level');
        await queryRunner.dropIndex('risks', 'IDX_risks_next_review_date');
        await queryRunner.dropColumns('risks', [
            'risk_id', 'risk_statement', 'category_id', 'sub_category_id', 'risk_analyst_id',
            'date_identified', 'threat_source', 'risk_velocity', 'early_warning_signs',
            'status_notes', 'tags', 'business_process', 'version_number', 'next_review_date',
            'last_review_date', 'business_unit_ids', 'inherent_likelihood', 'inherent_impact',
            'inherent_risk_score', 'inherent_risk_level', 'current_likelihood', 'current_impact',
            'current_risk_score', 'current_risk_level', 'target_likelihood', 'target_impact',
            'target_risk_score', 'target_risk_level', 'control_effectiveness', 'created_by',
            'updated_by', 'deleted_at',
        ]);
        await queryRunner.query(`DROP TYPE IF EXISTS risk_level_enum;`);
        await queryRunner.query(`DROP TYPE IF EXISTS risk_velocity_enum;`);
        await queryRunner.query(`DROP TYPE IF EXISTS threat_source_enum;`);
        await queryRunner.query(`DROP TYPE IF EXISTS risk_status_enum;`);
    }
}
exports.EnhanceRisksTable1702000000002 = EnhanceRisksTable1702000000002;
//# sourceMappingURL=1702000000002-EnhanceRisksTable.js.map