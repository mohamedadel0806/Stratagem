"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateControlMappingsTables1701000000006 = void 0;
const typeorm_1 = require("typeorm");
class CreateControlMappingsTables1701000000006 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'framework_control_mappings',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'framework_requirement_id',
                    type: 'uuid',
                    isNullable: false,
                },
                {
                    name: 'unified_control_id',
                    type: 'uuid',
                    isNullable: false,
                },
                {
                    name: 'coverage_level',
                    type: 'mapping_coverage_enum',
                    default: "'full'",
                },
                {
                    name: 'mapping_notes',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'mapped_by',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'mapped_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }), true);
        await queryRunner.createForeignKey('framework_control_mappings', new typeorm_1.TableForeignKey({
            columnNames: ['framework_requirement_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'framework_requirements',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('framework_control_mappings', new typeorm_1.TableForeignKey({
            columnNames: ['unified_control_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'unified_controls',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createIndex('framework_control_mappings', new typeorm_1.TableIndex({ columnNames: ['framework_requirement_id'] }));
        await queryRunner.createIndex('framework_control_mappings', new typeorm_1.TableIndex({ columnNames: ['unified_control_id'] }));
        await queryRunner.createIndex('framework_control_mappings', new typeorm_1.TableIndex({ columnNames: ['coverage_level'] }));
        await queryRunner.query(`
      ALTER TABLE framework_control_mappings
      ADD CONSTRAINT unique_framework_control UNIQUE (framework_requirement_id, unified_control_id);
    `);
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'control_dependencies',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'source_control_id',
                    type: 'uuid',
                    isNullable: false,
                },
                {
                    name: 'target_control_id',
                    type: 'uuid',
                    isNullable: false,
                },
                {
                    name: 'relationship_type',
                    type: 'control_relationship_type_enum',
                    isNullable: false,
                },
                {
                    name: 'description',
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
        await queryRunner.createForeignKey('control_dependencies', new typeorm_1.TableForeignKey({
            columnNames: ['source_control_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'unified_controls',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('control_dependencies', new typeorm_1.TableForeignKey({
            columnNames: ['target_control_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'unified_controls',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createIndex('control_dependencies', new typeorm_1.TableIndex({ columnNames: ['source_control_id'] }));
        await queryRunner.createIndex('control_dependencies', new typeorm_1.TableIndex({ columnNames: ['target_control_id'] }));
        await queryRunner.createIndex('control_dependencies', new typeorm_1.TableIndex({ columnNames: ['relationship_type'] }));
        await queryRunner.query(`
      ALTER TABLE control_dependencies
      ADD CONSTRAINT unique_control_dependency UNIQUE (source_control_id, target_control_id, relationship_type);
    `);
        await queryRunner.query(`
      ALTER TABLE control_dependencies
      ADD CONSTRAINT no_self_dependency CHECK (source_control_id != target_control_id);
    `);
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'control_asset_mappings',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'unified_control_id',
                    type: 'uuid',
                    isNullable: false,
                },
                {
                    name: 'asset_type',
                    type: 'varchar',
                    length: '100',
                    isNullable: false,
                },
                {
                    name: 'asset_id',
                    type: 'uuid',
                    isNullable: false,
                },
                {
                    name: 'implementation_date',
                    type: 'date',
                    isNullable: true,
                },
                {
                    name: 'implementation_status',
                    type: 'implementation_status_enum',
                    default: "'not_implemented'",
                },
                {
                    name: 'implementation_notes',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'last_test_date',
                    type: 'date',
                    isNullable: true,
                },
                {
                    name: 'last_test_result',
                    type: 'varchar',
                    length: '100',
                    isNullable: true,
                },
                {
                    name: 'effectiveness_score',
                    type: 'integer',
                    isNullable: true,
                },
                {
                    name: 'is_automated',
                    type: 'boolean',
                    default: false,
                },
                {
                    name: 'mapped_by',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'mapped_at',
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
        await queryRunner.createForeignKey('control_asset_mappings', new typeorm_1.TableForeignKey({
            columnNames: ['unified_control_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'unified_controls',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createIndex('control_asset_mappings', new typeorm_1.TableIndex({ columnNames: ['unified_control_id'] }));
        await queryRunner.createIndex('control_asset_mappings', new typeorm_1.TableIndex({ columnNames: ['asset_type', 'asset_id'] }));
        await queryRunner.createIndex('control_asset_mappings', new typeorm_1.TableIndex({ columnNames: ['implementation_status'] }));
        await queryRunner.query(`
      ALTER TABLE control_asset_mappings
      ADD CONSTRAINT unique_control_asset UNIQUE (unified_control_id, asset_type, asset_id);
    `);
        await queryRunner.query(`
      ALTER TABLE control_asset_mappings
      ADD CONSTRAINT effectiveness_score_range CHECK (effectiveness_score IS NULL OR (effectiveness_score >= 1 AND effectiveness_score <= 5));
    `);
    }
    async down(queryRunner) {
        await queryRunner.dropTable('control_asset_mappings', true);
        await queryRunner.dropTable('control_dependencies', true);
        await queryRunner.dropTable('framework_control_mappings', true);
    }
}
exports.CreateControlMappingsTables1701000000006 = CreateControlMappingsTables1701000000006;
//# sourceMappingURL=1701000000006-CreateControlMappingsTables.js.map