"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePolicyAssignmentsTable1701000000015 = void 0;
const typeorm_1 = require("typeorm");
class CreatePolicyAssignmentsTable1701000000015 {
    async up(queryRunner) {
        const tableExists = await queryRunner.hasTable('policy_assignments');
        if (!tableExists) {
            await queryRunner.createTable(new typeorm_1.Table({
                name: 'policy_assignments',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'policy_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'user_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'role',
                        type: 'varchar',
                        length: '50',
                        isNullable: true,
                    },
                    {
                        name: 'business_unit_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'assigned_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'assigned_by',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'notification_sent',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'notification_sent_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'acknowledged',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'acknowledged_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }), true);
            await queryRunner.createForeignKey('policy_assignments', new typeorm_1.TableForeignKey({
                columnNames: ['policy_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'policies',
                onDelete: 'CASCADE',
            }));
            await queryRunner.createForeignKey('policy_assignments', new typeorm_1.TableForeignKey({
                columnNames: ['user_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'CASCADE',
            }));
            await queryRunner.createForeignKey('policy_assignments', new typeorm_1.TableForeignKey({
                columnNames: ['business_unit_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'business_units',
                onDelete: 'CASCADE',
            }));
            await queryRunner.createForeignKey('policy_assignments', new typeorm_1.TableForeignKey({
                columnNames: ['assigned_by'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'SET NULL',
            }));
            await queryRunner.createIndex('policy_assignments', new typeorm_1.TableIndex({ columnNames: ['policy_id'] }));
            await queryRunner.createIndex('policy_assignments', new typeorm_1.TableIndex({ columnNames: ['user_id'] }));
            await queryRunner.createIndex('policy_assignments', new typeorm_1.TableIndex({ columnNames: ['role'] }));
            await queryRunner.createIndex('policy_assignments', new typeorm_1.TableIndex({ columnNames: ['business_unit_id'] }));
            await queryRunner.createIndex('policy_assignments', new typeorm_1.TableIndex({ columnNames: ['acknowledged'] }));
            await queryRunner.createIndex('policy_assignments', new typeorm_1.TableIndex({ columnNames: ['user_id', 'policy_id'] }));
        }
    }
    async down(queryRunner) {
        await queryRunner.dropTable('policy_assignments', true);
    }
}
exports.CreatePolicyAssignmentsTable1701000000015 = CreatePolicyAssignmentsTable1701000000015;
//# sourceMappingURL=1701000000015-CreatePolicyAssignmentsTable.js.map