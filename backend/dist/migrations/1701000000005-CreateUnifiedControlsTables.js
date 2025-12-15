"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUnifiedControlsTables1701000000005 = void 0;
const typeorm_1 = require("typeorm");
class CreateUnifiedControlsTables1701000000005 {
    async up(queryRunner) {
        const frameworksTableExists = await queryRunner.hasTable('compliance_frameworks');
        if (!frameworksTableExists) {
            await queryRunner.createTable(new typeorm_1.Table({
                name: 'compliance_frameworks',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'framework_code',
                        type: 'varchar',
                        length: '100',
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        length: '300',
                        isNullable: false,
                    },
                    {
                        name: 'version',
                        type: 'varchar',
                        length: '50',
                        isNullable: true,
                    },
                    {
                        name: 'issuing_authority',
                        type: 'varchar',
                        length: '300',
                        isNullable: true,
                    },
                    {
                        name: 'description',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'effective_date',
                        type: 'date',
                        isNullable: true,
                    },
                    {
                        name: 'url',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'status',
                        type: 'framework_status_enum',
                        default: "'active'",
                    },
                    {
                        name: 'structure',
                        type: 'jsonb',
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
            await queryRunner.createIndex('compliance_frameworks', new typeorm_1.TableIndex({ columnNames: ['framework_code'] }));
            await queryRunner.createIndex('compliance_frameworks', new typeorm_1.TableIndex({ columnNames: ['status'] }));
        }
        const requirementsTableExists = await queryRunner.hasTable('framework_requirements');
        if (!requirementsTableExists) {
            await queryRunner.createTable(new typeorm_1.Table({
                name: 'framework_requirements',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'framework_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'requirement_identifier',
                        type: 'varchar',
                        length: '200',
                        isNullable: false,
                    },
                    {
                        name: 'requirement_text',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'domain',
                        type: 'varchar',
                        length: '200',
                        isNullable: true,
                    },
                    {
                        name: 'category',
                        type: 'varchar',
                        length: '200',
                        isNullable: true,
                    },
                    {
                        name: 'sub_category',
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
                        name: 'requirement_type',
                        type: 'varchar',
                        length: '100',
                        isNullable: true,
                    },
                    {
                        name: 'display_order',
                        type: 'integer',
                        isNullable: true,
                    },
                    {
                        name: 'notes',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'reference_links',
                        type: 'text[]',
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
            await queryRunner.createForeignKey('framework_requirements', new typeorm_1.TableForeignKey({
                columnNames: ['framework_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'compliance_frameworks',
                onDelete: 'CASCADE',
            }));
            await queryRunner.createIndex('framework_requirements', new typeorm_1.TableIndex({ columnNames: ['framework_id'] }));
            await queryRunner.createIndex('framework_requirements', new typeorm_1.TableIndex({ columnNames: ['requirement_identifier'] }));
            await queryRunner.createIndex('framework_requirements', new typeorm_1.TableIndex({ columnNames: ['domain', 'category'] }));
            await queryRunner.query(`
        ALTER TABLE framework_requirements
        ADD CONSTRAINT unique_framework_requirement UNIQUE (framework_id, requirement_identifier);
      `);
        }
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'unified_controls',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'control_identifier',
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
                    name: 'control_type',
                    type: 'control_type_enum',
                    isNullable: true,
                },
                {
                    name: 'control_category',
                    type: 'varchar',
                    length: '200',
                    isNullable: true,
                },
                {
                    name: 'domain',
                    type: 'varchar',
                    length: '200',
                    isNullable: true,
                },
                {
                    name: 'complexity',
                    type: 'control_complexity_enum',
                    isNullable: true,
                },
                {
                    name: 'cost_impact',
                    type: 'control_cost_impact_enum',
                    isNullable: true,
                },
                {
                    name: 'status',
                    type: 'control_status_enum',
                    default: "'draft'",
                },
                {
                    name: 'implementation_status',
                    type: 'implementation_status_enum',
                    default: "'not_implemented'",
                },
                {
                    name: 'control_owner_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'control_procedures',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'testing_procedures',
                    type: 'text',
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
        await queryRunner.createForeignKey('unified_controls', new typeorm_1.TableForeignKey({
            columnNames: ['control_owner_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createIndex('unified_controls', new typeorm_1.TableIndex({ columnNames: ['control_identifier'] }));
        await queryRunner.createIndex('unified_controls', new typeorm_1.TableIndex({ columnNames: ['control_type'] }));
        await queryRunner.createIndex('unified_controls', new typeorm_1.TableIndex({ columnNames: ['domain'] }));
        await queryRunner.createIndex('unified_controls', new typeorm_1.TableIndex({ columnNames: ['status'] }));
        await queryRunner.createIndex('unified_controls', new typeorm_1.TableIndex({ columnNames: ['implementation_status'] }));
        await queryRunner.createIndex('unified_controls', new typeorm_1.TableIndex({ columnNames: ['control_owner_id'] }));
        await queryRunner.query(`
      CREATE INDEX idx_unified_controls_search ON unified_controls USING gin(
        to_tsvector('english', 
          coalesce(title, '') || ' ' || 
          coalesce(description, '')
        )
      );
    `);
    }
    async down(queryRunner) {
        await queryRunner.dropTable('unified_controls', true);
        await queryRunner.dropTable('framework_requirements', true);
    }
}
exports.CreateUnifiedControlsTables1701000000005 = CreateUnifiedControlsTables1701000000005;
//# sourceMappingURL=1701000000005-CreateUnifiedControlsTables.js.map