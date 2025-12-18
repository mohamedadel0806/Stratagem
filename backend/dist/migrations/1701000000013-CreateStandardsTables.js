"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateStandardsTables1701000000013 = void 0;
const typeorm_1 = require("typeorm");
class CreateStandardsTables1701000000013 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'standards',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'standard_identifier',
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
                    name: 'policy_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'control_objective_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'content',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'scope',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'applicability',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'compliance_measurement_criteria',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'version',
                    type: 'varchar',
                    length: '50',
                    isNullable: true,
                },
                {
                    name: 'status',
                    type: 'varchar',
                    length: '50',
                    default: "'draft'",
                },
                {
                    name: 'owner_id',
                    type: 'uuid',
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
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'standard_control_objective_mappings',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'standard_id',
                    type: 'uuid',
                    isNullable: false,
                },
                {
                    name: 'control_objective_id',
                    type: 'uuid',
                    isNullable: false,
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }), true);
        await queryRunner.createForeignKey('standards', new typeorm_1.TableForeignKey({
            columnNames: ['policy_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'policies',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createForeignKey('standards', new typeorm_1.TableForeignKey({
            columnNames: ['control_objective_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'control_objectives',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createForeignKey('standards', new typeorm_1.TableForeignKey({
            columnNames: ['owner_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createForeignKey('standard_control_objective_mappings', new typeorm_1.TableForeignKey({
            columnNames: ['standard_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'standards',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('standard_control_objective_mappings', new typeorm_1.TableForeignKey({
            columnNames: ['control_objective_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'control_objectives',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createIndex('standards', new typeorm_1.TableIndex({ columnNames: ['standard_identifier'] }));
        await queryRunner.createIndex('standards', new typeorm_1.TableIndex({ columnNames: ['policy_id'] }));
        await queryRunner.createIndex('standards', new typeorm_1.TableIndex({ columnNames: ['control_objective_id'] }));
        await queryRunner.createIndex('standards', new typeorm_1.TableIndex({ columnNames: ['owner_id'] }));
        await queryRunner.createIndex('standards', new typeorm_1.TableIndex({ columnNames: ['status'] }));
        await queryRunner.createIndex('standard_control_objective_mappings', new typeorm_1.TableIndex({ columnNames: ['standard_id'] }));
        await queryRunner.createIndex('standard_control_objective_mappings', new typeorm_1.TableIndex({ columnNames: ['control_objective_id'] }));
        await queryRunner.createIndex('standard_control_objective_mappings', new typeorm_1.TableIndex({ columnNames: ['standard_id', 'control_objective_id'], isUnique: true }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('standard_control_objective_mappings', true);
        await queryRunner.dropTable('standards', true);
    }
}
exports.CreateStandardsTables1701000000013 = CreateStandardsTables1701000000013;
//# sourceMappingURL=1701000000013-CreateStandardsTables.js.map