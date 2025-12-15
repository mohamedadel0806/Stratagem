"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateInfluencersTable1701000000002 = void 0;
const typeorm_1 = require("typeorm");
class CreateInfluencersTable1701000000002 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'influencers',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'name',
                    type: 'varchar',
                    length: '500',
                    isNullable: false,
                },
                {
                    name: 'category',
                    type: 'influencer_category_enum',
                    isNullable: false,
                },
                {
                    name: 'sub_category',
                    type: 'varchar',
                    length: '200',
                    isNullable: true,
                },
                {
                    name: 'issuing_authority',
                    type: 'varchar',
                    length: '300',
                    isNullable: true,
                },
                {
                    name: 'jurisdiction',
                    type: 'varchar',
                    length: '200',
                    isNullable: true,
                },
                {
                    name: 'reference_number',
                    type: 'varchar',
                    length: '200',
                    isUnique: true,
                    isNullable: true,
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'publication_date',
                    type: 'date',
                    isNullable: true,
                },
                {
                    name: 'effective_date',
                    type: 'date',
                    isNullable: true,
                },
                {
                    name: 'last_revision_date',
                    type: 'date',
                    isNullable: true,
                },
                {
                    name: 'next_review_date',
                    type: 'date',
                    isNullable: true,
                },
                {
                    name: 'status',
                    type: 'influencer_status_enum',
                    default: "'active'",
                },
                {
                    name: 'applicability_status',
                    type: 'applicability_status_enum',
                    default: "'under_review'",
                },
                {
                    name: 'applicability_justification',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'applicability_assessment_date',
                    type: 'date',
                    isNullable: true,
                },
                {
                    name: 'applicability_criteria',
                    type: 'jsonb',
                    isNullable: true,
                },
                {
                    name: 'source_url',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'source_document_path',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'owner_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'business_units_affected',
                    type: 'uuid[]',
                    isNullable: true,
                },
                {
                    name: 'tags',
                    type: 'varchar[]',
                    isNullable: true,
                },
                {
                    name: 'custom_fields',
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
        }), true);
        await queryRunner.createForeignKey('influencers', new typeorm_1.TableForeignKey({
            columnNames: ['owner_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createForeignKey('influencers', new typeorm_1.TableForeignKey({
            columnNames: ['created_by'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createForeignKey('influencers', new typeorm_1.TableForeignKey({
            columnNames: ['updated_by'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createIndex('influencers', new typeorm_1.TableIndex({ columnNames: ['category'] }));
        await queryRunner.createIndex('influencers', new typeorm_1.TableIndex({ columnNames: ['status'] }));
        await queryRunner.createIndex('influencers', new typeorm_1.TableIndex({ columnNames: ['applicability_status'] }));
        await queryRunner.createIndex('influencers', new typeorm_1.TableIndex({ columnNames: ['owner_id'] }));
        await queryRunner.createIndex('influencers', new typeorm_1.TableIndex({ columnNames: ['reference_number'] }));
        await queryRunner.createIndex('influencers', new typeorm_1.TableIndex({
            columnNames: ['next_review_date'],
            where: 'next_review_date IS NOT NULL AND deleted_at IS NULL',
        }));
        await queryRunner.query(`
      CREATE INDEX idx_influencers_tags ON influencers USING gin(tags);
    `);
        await queryRunner.query(`
      CREATE INDEX idx_influencers_search ON influencers USING gin(
        to_tsvector('english', 
          coalesce(name, '') || ' ' || 
          coalesce(issuing_authority, '') || ' ' ||
          coalesce(description, '')
        )
      );
    `);
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'compliance_obligations',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'influencer_id',
                    type: 'uuid',
                    isNullable: false,
                },
                {
                    name: 'obligation_text',
                    type: 'text',
                    isNullable: false,
                },
                {
                    name: 'obligation_category',
                    type: 'varchar',
                    length: '200',
                    isNullable: true,
                },
                {
                    name: 'priority',
                    type: 'varchar',
                    length: '50',
                    isNullable: true,
                },
                {
                    name: 'responsible_party_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'status',
                    type: 'obligation_status_enum',
                    default: "'not_met'",
                },
                {
                    name: 'due_date',
                    type: 'date',
                    isNullable: true,
                },
                {
                    name: 'completion_date',
                    type: 'date',
                    isNullable: true,
                },
                {
                    name: 'notes',
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
        await queryRunner.createForeignKey('compliance_obligations', new typeorm_1.TableForeignKey({
            columnNames: ['influencer_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'influencers',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createIndex('compliance_obligations', new typeorm_1.TableIndex({ columnNames: ['influencer_id'] }));
        await queryRunner.createIndex('compliance_obligations', new typeorm_1.TableIndex({ columnNames: ['status'] }));
        await queryRunner.createIndex('compliance_obligations', new typeorm_1.TableIndex({ columnNames: ['responsible_party_id'] }));
        await queryRunner.createIndex('compliance_obligations', new typeorm_1.TableIndex({ columnNames: ['priority'] }));
        await queryRunner.query(`
      ALTER TABLE influencers
      ADD CONSTRAINT valid_dates CHECK (
        (effective_date IS NULL OR publication_date IS NULL OR effective_date >= publication_date) AND
        (last_revision_date IS NULL OR publication_date IS NULL OR last_revision_date >= publication_date)
      );
    `);
    }
    async down(queryRunner) {
        await queryRunner.dropTable('compliance_obligations', true);
        await queryRunner.dropTable('influencers', true);
    }
}
exports.CreateInfluencersTable1701000000002 = CreateInfluencersTable1701000000002;
//# sourceMappingURL=1701000000002-CreateInfluencersTable.js.map