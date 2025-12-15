import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateComplianceAssessmentTables1700000000016 implements MigrationInterface {
  name = 'CreateComplianceAssessmentTables1700000000016';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create compliance_status_enum
    await queryRunner.query(`
      CREATE TYPE "compliance_status_enum" AS ENUM (
        'not_assessed',
        'compliant',
        'non_compliant',
        'partially_compliant',
        'not_applicable',
        'requires_review'
      )
    `);

    // Create assessment_type_enum
    await queryRunner.query(`
      CREATE TYPE "assessment_type_enum" AS ENUM (
        'automatic',
        'manual',
        'scheduled'
      )
    `);

    // Create asset_requirement_mapping table
    await queryRunner.createTable(
      new Table({
        name: 'asset_requirement_mapping',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'asset_type',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'asset_id',
            type: 'uuid',
          },
          {
            name: 'requirement_id',
            type: 'uuid',
          },
          {
            name: 'compliance_status',
            type: 'compliance_status_enum',
            default: "'not_assessed'",
          },
          {
            name: 'last_assessed_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'assessed_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'evidence_urls',
            type: 'jsonb',
            default: "'[]'",
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'auto_assessed',
            type: 'boolean',
            default: false,
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

    // Create unique constraint on asset_type, asset_id, requirement_id
    // Note: Column names in database will be snake_case
    await queryRunner.createIndex(
      'asset_requirement_mapping',
      new TableIndex({
        name: 'IDX_asset_requirement_mapping_unique',
        columnNames: ['asset_type', 'asset_id', 'requirement_id'],
        isUnique: true,
      }),
    );

    // Create foreign key to compliance_requirements (check if exists first)
    const requirementFkExists = await queryRunner.query(`
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'FK_fb87c3c3323bde3d47e25d57aea' 
      AND table_name = 'asset_requirement_mapping'
    `);
    
    if (requirementFkExists.length === 0) {
      await queryRunner.createForeignKey(
        'asset_requirement_mapping',
        new TableForeignKey({
          columnNames: ['requirement_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'compliance_requirements',
          onDelete: 'CASCADE',
        }),
      );
    }

    // Create foreign key to users (assessed_by)
    const assessedByFkExists = await queryRunner.query(`
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name LIKE 'FK_%' 
      AND table_name = 'asset_requirement_mapping'
      AND constraint_type = 'FOREIGN KEY'
      AND constraint_name IN (
        SELECT constraint_name FROM information_schema.key_column_usage 
        WHERE table_name = 'asset_requirement_mapping' 
        AND column_name = 'assessed_by'
      )
    `);
    
    if (assessedByFkExists.length === 0) {
      await queryRunner.createForeignKey(
        'asset_requirement_mapping',
        new TableForeignKey({
          columnNames: ['assessed_by'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete: 'SET NULL',
        }),
      );
    }

    // Create indexes
    await queryRunner.createIndex(
      'asset_requirement_mapping',
      new TableIndex({
        name: 'IDX_asset_requirement_mapping_asset',
        columnNames: ['asset_type', 'asset_id'],
      }),
    );

    await queryRunner.createIndex(
      'asset_requirement_mapping',
      new TableIndex({
        name: 'IDX_asset_requirement_mapping_requirement',
        columnNames: ['requirement_id'],
      }),
    );

    await queryRunner.createIndex(
      'asset_requirement_mapping',
      new TableIndex({
        name: 'IDX_asset_requirement_mapping_status',
        columnNames: ['compliance_status'],
      }),
    );

    // Create compliance_validation_rules table
    await queryRunner.createTable(
      new Table({
        name: 'compliance_validation_rules',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'requirement_id',
            type: 'uuid',
          },
          {
            name: 'asset_type',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'rule_name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'rule_description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'validation_logic',
            type: 'jsonb',
          },
          {
            name: 'priority',
            type: 'integer',
            default: 0,
          },
          {
            name: 'is_active',
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

    // Create foreign key to compliance_requirements (check if exists first)
    const validationRuleFkExists = await queryRunner.query(`
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'FK_7a48c3d3689c10fe5d8aa5f3b2d' 
      AND table_name = 'compliance_validation_rules'
    `);
    
    if (validationRuleFkExists.length === 0) {
      await queryRunner.createForeignKey(
        'compliance_validation_rules',
        new TableForeignKey({
          columnNames: ['requirement_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'compliance_requirements',
          onDelete: 'CASCADE',
        }),
      );
    }

    // Create foreign key to users (created_by)
    const validationRuleCreatedByFkExists = await queryRunner.query(`
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name LIKE 'FK_%' 
      AND table_name = 'compliance_validation_rules'
      AND constraint_type = 'FOREIGN KEY'
      AND constraint_name IN (
        SELECT constraint_name FROM information_schema.key_column_usage 
        WHERE table_name = 'compliance_validation_rules' 
        AND column_name = 'created_by'
      )
    `);
    
    if (validationRuleCreatedByFkExists.length === 0) {
      await queryRunner.createForeignKey(
        'compliance_validation_rules',
        new TableForeignKey({
          columnNames: ['created_by'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete: 'SET NULL',
        }),
      );
    }

    // Create indexes
    await queryRunner.createIndex(
      'compliance_validation_rules',
      new TableIndex({
        name: 'IDX_validation_rules_requirement',
        columnNames: ['requirement_id'],
      }),
    );

    await queryRunner.createIndex(
      'compliance_validation_rules',
      new TableIndex({
        name: 'IDX_validation_rules_asset_type',
        columnNames: ['asset_type'],
      }),
    );

    await queryRunner.createIndex(
      'compliance_validation_rules',
      new TableIndex({
        name: 'IDX_validation_rules_active',
        columnNames: ['is_active'],
      }),
    );

    // Create compliance_assessments table (history)
    await queryRunner.createTable(
      new Table({
        name: 'compliance_assessments',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'asset_type',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'asset_id',
            type: 'uuid',
          },
          {
            name: 'requirement_id',
            type: 'uuid',
          },
          {
            name: 'assessment_type',
            type: 'assessment_type_enum',
            default: "'automatic'",
          },
          {
            name: 'previous_status',
            type: 'compliance_status_enum',
            isNullable: true,
          },
          {
            name: 'new_status',
            type: 'compliance_status_enum',
          },
          {
            name: 'validation_results',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'assessed_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'assessed_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Create foreign key to compliance_requirements (check if exists first)
    const assessmentFkExists = await queryRunner.query(`
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name LIKE 'FK_%' 
      AND table_name = 'compliance_assessments'
      AND constraint_type = 'FOREIGN KEY'
      AND constraint_name IN (
        SELECT constraint_name FROM information_schema.key_column_usage 
        WHERE table_name = 'compliance_assessments' 
        AND column_name = 'requirement_id'
      )
    `);
    
    if (assessmentFkExists.length === 0) {
      await queryRunner.createForeignKey(
        'compliance_assessments',
        new TableForeignKey({
          columnNames: ['requirement_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'compliance_requirements',
          onDelete: 'CASCADE',
        }),
      );
    }

    // Create foreign key to users (assessed_by)
    const assessmentAssessedByFkExists = await queryRunner.query(`
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name LIKE 'FK_%' 
      AND table_name = 'compliance_assessments'
      AND constraint_type = 'FOREIGN KEY'
      AND constraint_name IN (
        SELECT constraint_name FROM information_schema.key_column_usage 
        WHERE table_name = 'compliance_assessments' 
        AND column_name = 'assessed_by'
      )
    `);
    
    if (assessmentAssessedByFkExists.length === 0) {
      await queryRunner.createForeignKey(
        'compliance_assessments',
        new TableForeignKey({
          columnNames: ['assessed_by'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete: 'SET NULL',
        }),
      );
    }

    // Create indexes
    await queryRunner.createIndex(
      'compliance_assessments',
      new TableIndex({
        name: 'IDX_assessments_asset',
        columnNames: ['asset_type', 'asset_id'],
      }),
    );

    await queryRunner.createIndex(
      'compliance_assessments',
      new TableIndex({
        name: 'IDX_assessments_requirement',
        columnNames: ['requirement_id'],
      }),
    );

    await queryRunner.createIndex(
      'compliance_assessments',
      new TableIndex({
        name: 'IDX_assessments_date',
        columnNames: ['assessed_at'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.dropIndex('compliance_assessments', 'IDX_assessments_date');
    await queryRunner.dropIndex('compliance_assessments', 'IDX_assessments_requirement');
    await queryRunner.dropIndex('compliance_assessments', 'IDX_assessments_asset');

    // Drop tables
    await queryRunner.dropTable('compliance_assessments');
    await queryRunner.dropTable('compliance_validation_rules');
    await queryRunner.dropTable('asset_requirement_mapping');

    // Drop enums
    await queryRunner.query(`DROP TYPE "assessment_type_enum"`);
    await queryRunner.query(`DROP TYPE "compliance_status_enum"`);
  }
}

