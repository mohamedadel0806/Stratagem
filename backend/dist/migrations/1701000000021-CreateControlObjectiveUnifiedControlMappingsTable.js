"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateControlObjectiveUnifiedControlMappingsTable1701000000021 = void 0;
const typeorm_1 = require("typeorm");
class CreateControlObjectiveUnifiedControlMappingsTable1701000000021 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'control_objective_unified_controls',
            columns: [
                {
                    name: 'control_objective_id',
                    type: 'uuid',
                    isNullable: false,
                },
                {
                    name: 'unified_control_id',
                    type: 'uuid',
                    isNullable: false,
                },
            ],
        }), true);
        await queryRunner.createIndex('control_objective_unified_controls', new typeorm_1.TableIndex({
            name: 'idx_co_uc_mappings_co',
            columnNames: ['control_objective_id'],
        }));
        await queryRunner.createIndex('control_objective_unified_controls', new typeorm_1.TableIndex({
            name: 'idx_co_uc_mappings_uc',
            columnNames: ['unified_control_id'],
        }));
        await queryRunner.createIndex('control_objective_unified_controls', new typeorm_1.TableIndex({
            name: 'idx_co_uc_mappings_unique',
            columnNames: ['control_objective_id', 'unified_control_id'],
            isUnique: true,
        }));
        await queryRunner.createForeignKey('control_objective_unified_controls', new typeorm_1.TableForeignKey({
            columnNames: ['control_objective_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'control_objectives',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('control_objective_unified_controls', new typeorm_1.TableForeignKey({
            columnNames: ['unified_control_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'unified_controls',
            onDelete: 'CASCADE',
        }));
    }
    async down(queryRunner) {
        const table = await queryRunner.getTable('control_objective_unified_controls');
        if (table) {
            const foreignKeys = table.foreignKeys;
            for (const fk of foreignKeys) {
                await queryRunner.dropForeignKey('control_objective_unified_controls', fk);
            }
        }
        await queryRunner.dropTable('control_objective_unified_controls');
    }
}
exports.CreateControlObjectiveUnifiedControlMappingsTable1701000000021 = CreateControlObjectiveUnifiedControlMappingsTable1701000000021;
//# sourceMappingURL=1701000000021-CreateControlObjectiveUnifiedControlMappingsTable.js.map