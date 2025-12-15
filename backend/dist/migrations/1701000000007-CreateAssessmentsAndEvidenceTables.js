"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAssessmentsAndEvidenceTables1701000000007 = void 0;
const typeorm_1 = require("typeorm");
class CreateAssessmentsAndEvidenceTables1701000000007 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'assessments',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'assessment_identifier',
                    type: 'varchar',
                    length: '100',
                    isUnique: true,
                    isNullable: false,
                },
                {
                    name: 'name',
                    type: 'varchar',
                    length: '500',
                    isNullable: false,
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'assessment_type',
                    type: 'assessment_type_enum',
                    isNullable: false,
                },
                {
                    name: 'scope_description',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'selected_control_ids',
                    type: 'uuid[]',
                    isNullable: true,
                },
                {
                    name: 'selected_framework_ids',
                    type: 'uuid[]',
                    isNullable: true,
                },
                {
                    name: 'start_date',
                    type: 'date',
                    isNullable: true,
                },
                {
                    name: 'end_date',
                    type: 'date',
                    isNullable: true,
                },
                {
                    name: 'status',
                    type: 'assessment_status_enum',
                    default: "'not_started'",
                },
                {
                    name: 'lead_assessor_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'assessor_ids',
                    type: 'uuid[]',
                    isNullable: true,
                },
                {
                    name: 'controls_assessed',
                    type: 'integer',
                    default: 0,
                },
                {
                    name: 'controls_total',
                    type: 'integer',
                    isNullable: true,
                },
                {
                    name: 'findings_critical',
                    type: 'integer',
                    default: 0,
                },
                {
                    name: 'findings_high',
                    type: 'integer',
                    default: 0,
                },
                {
                    name: 'findings_medium',
                    type: 'integer',
                    default: 0,
                },
                {
                    name: 'findings_low',
                    type: 'integer',
                    default: 0,
                },
                {
                    name: 'overall_score',
                    type: 'decimal',
                    precision: 5,
                    scale: 2,
                    isNullable: true,
                },
                {
                    name: 'assessment_procedures',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'report_path',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'approved_by',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'approval_date',
                    type: 'date',
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
        }), true);
        await queryRunner.createForeignKey('assessments', new typeorm_1.TableForeignKey({
            columnNames: ['lead_assessor_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createIndex('assessments', new typeorm_1.TableIndex({ columnNames: ['assessment_identifier'] }));
        await queryRunner.createIndex('assessments', new typeorm_1.TableIndex({ columnNames: ['assessment_type'] }));
        await queryRunner.createIndex('assessments', new typeorm_1.TableIndex({ columnNames: ['status'] }));
        await queryRunner.createIndex('assessments', new typeorm_1.TableIndex({ columnNames: ['lead_assessor_id'] }));
        await queryRunner.createIndex('assessments', new typeorm_1.TableIndex({ columnNames: ['start_date', 'end_date'] }));
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'assessment_results',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'assessment_id',
                    type: 'uuid',
                    isNullable: false,
                },
                {
                    name: 'unified_control_id',
                    type: 'uuid',
                    isNullable: false,
                },
                {
                    name: 'assessor_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'assessment_date',
                    type: 'date',
                    isNullable: true,
                },
                {
                    name: 'assessment_procedure_followed',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'result',
                    type: 'assessment_result_enum',
                    isNullable: false,
                },
                {
                    name: 'effectiveness_rating',
                    type: 'integer',
                    isNullable: true,
                },
                {
                    name: 'findings',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'observations',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'recommendations',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'evidence_collected',
                    type: 'jsonb',
                    isNullable: true,
                },
                {
                    name: 'requires_remediation',
                    type: 'boolean',
                    default: false,
                },
                {
                    name: 'remediation_due_date',
                    type: 'date',
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
        }), true);
        await queryRunner.createForeignKey('assessment_results', new typeorm_1.TableForeignKey({
            columnNames: ['assessment_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'assessments',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('assessment_results', new typeorm_1.TableForeignKey({
            columnNames: ['unified_control_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'unified_controls',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createIndex('assessment_results', new typeorm_1.TableIndex({ columnNames: ['assessment_id'] }));
        await queryRunner.createIndex('assessment_results', new typeorm_1.TableIndex({ columnNames: ['unified_control_id'] }));
        await queryRunner.createIndex('assessment_results', new typeorm_1.TableIndex({ columnNames: ['result'] }));
        await queryRunner.createIndex('assessment_results', new typeorm_1.TableIndex({ columnNames: ['assessor_id'] }));
        await queryRunner.query(`
      ALTER TABLE assessment_results
      ADD CONSTRAINT effectiveness_rating_range CHECK (effectiveness_rating IS NULL OR (effectiveness_rating >= 1 AND effectiveness_rating <= 5));
    `);
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'evidence',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'evidence_identifier',
                    type: 'varchar',
                    length: '100',
                    isUnique: true,
                    isNullable: false,
                },
                {
                    name: 'title',
                    type: 'varchar',
                    length: '500',
                    isNullable: false,
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'evidence_type',
                    type: 'evidence_type_enum',
                    isNullable: false,
                },
                {
                    name: 'filename',
                    type: 'varchar',
                    length: '500',
                    isNullable: true,
                },
                {
                    name: 'file_path',
                    type: 'text',
                    isNullable: false,
                },
                {
                    name: 'file_size',
                    type: 'bigint',
                    isNullable: true,
                },
                {
                    name: 'mime_type',
                    type: 'varchar',
                    length: '200',
                    isNullable: true,
                },
                {
                    name: 'file_hash',
                    type: 'varchar',
                    length: '128',
                    isNullable: true,
                },
                {
                    name: 'collection_date',
                    type: 'date',
                    default: 'CURRENT_DATE',
                },
                {
                    name: 'valid_from_date',
                    type: 'date',
                    isNullable: true,
                },
                {
                    name: 'valid_until_date',
                    type: 'date',
                    isNullable: true,
                },
                {
                    name: 'collector_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'status',
                    type: 'evidence_status_enum',
                    default: "'draft'",
                },
                {
                    name: 'approved_by',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'approval_date',
                    type: 'date',
                    isNullable: true,
                },
                {
                    name: 'rejection_reason',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'tags',
                    type: 'varchar[]',
                    isNullable: true,
                },
                {
                    name: 'custom_metadata',
                    type: 'jsonb',
                    isNullable: true,
                },
                {
                    name: 'confidential',
                    type: 'boolean',
                    default: false,
                },
                {
                    name: 'restricted_to_roles',
                    type: 'uuid[]',
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
        }), true);
        await queryRunner.createForeignKey('evidence', new typeorm_1.TableForeignKey({
            columnNames: ['collector_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createIndex('evidence', new typeorm_1.TableIndex({ columnNames: ['evidence_identifier'] }));
        await queryRunner.createIndex('evidence', new typeorm_1.TableIndex({ columnNames: ['evidence_type'] }));
        await queryRunner.createIndex('evidence', new typeorm_1.TableIndex({ columnNames: ['status'] }));
        await queryRunner.createIndex('evidence', new typeorm_1.TableIndex({ columnNames: ['collector_id'] }));
        await queryRunner.createIndex('evidence', new typeorm_1.TableIndex({
            columnNames: ['valid_until_date'],
            where: 'valid_until_date IS NOT NULL',
        }));
        await queryRunner.query(`
      CREATE INDEX idx_evidence_search ON evidence USING gin(
        to_tsvector('english', 
          coalesce(title, '') || ' ' || 
          coalesce(description, '')
        )
      );
    `);
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'evidence_linkages',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'evidence_id',
                    type: 'uuid',
                    isNullable: false,
                },
                {
                    name: 'link_type',
                    type: 'evidence_link_type_enum',
                    isNullable: false,
                },
                {
                    name: 'linked_entity_id',
                    type: 'uuid',
                    isNullable: false,
                },
                {
                    name: 'link_description',
                    type: 'text',
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
            ],
        }), true);
        await queryRunner.createForeignKey('evidence_linkages', new typeorm_1.TableForeignKey({
            columnNames: ['evidence_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'evidence',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createIndex('evidence_linkages', new typeorm_1.TableIndex({ columnNames: ['evidence_id'] }));
        await queryRunner.createIndex('evidence_linkages', new typeorm_1.TableIndex({ columnNames: ['link_type', 'linked_entity_id'] }));
        await queryRunner.query(`
      ALTER TABLE evidence_linkages
      ADD CONSTRAINT unique_evidence_link UNIQUE (evidence_id, link_type, linked_entity_id);
    `);
    }
    async down(queryRunner) {
        await queryRunner.dropTable('evidence_linkages', true);
        await queryRunner.dropTable('evidence', true);
        await queryRunner.dropTable('assessment_results', true);
        await queryRunner.dropTable('assessments', true);
    }
}
exports.CreateAssessmentsAndEvidenceTables1701000000007 = CreateAssessmentsAndEvidenceTables1701000000007;
//# sourceMappingURL=1701000000007-CreateAssessmentsAndEvidenceTables.js.map