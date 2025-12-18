"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateGovernancePermissionsTables1701000000016 = void 0;
const typeorm_1 = require("typeorm");
class CreateGovernancePermissionsTables1701000000016 {
    async up(queryRunner) {
        const permissionsTableExists = await queryRunner.hasTable('governance_permissions');
        if (!permissionsTableExists) {
            await queryRunner.createTable(new typeorm_1.Table({
                name: 'governance_permissions',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'role',
                        type: 'varchar',
                        length: '50',
                        isNullable: false,
                    },
                    {
                        name: 'module',
                        type: 'varchar',
                        length: '100',
                        isNullable: false,
                    },
                    {
                        name: 'action',
                        type: 'varchar',
                        length: '50',
                        isNullable: false,
                    },
                    {
                        name: 'resource_type',
                        type: 'varchar',
                        length: '100',
                        isNullable: true,
                    },
                    {
                        name: 'conditions',
                        type: 'jsonb',
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
            await queryRunner.createIndex('governance_permissions', new typeorm_1.TableIndex({ columnNames: ['role'] }));
            await queryRunner.createIndex('governance_permissions', new typeorm_1.TableIndex({ columnNames: ['module'] }));
            await queryRunner.createIndex('governance_permissions', new typeorm_1.TableIndex({ columnNames: ['role', 'module', 'action'] }));
            await queryRunner.query(`
        ALTER TABLE governance_permissions
        ADD CONSTRAINT unique_role_module_action 
        UNIQUE (role, module, action, resource_type);
      `);
        }
        const roleAssignmentsTableExists = await queryRunner.hasTable('governance_role_assignments');
        if (!roleAssignmentsTableExists) {
            await queryRunner.createTable(new typeorm_1.Table({
                name: 'governance_role_assignments',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'user_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'role',
                        type: 'varchar',
                        length: '50',
                        isNullable: false,
                    },
                    {
                        name: 'business_unit_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'assigned_by',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'assigned_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'expires_at',
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
            await queryRunner.createForeignKey('governance_role_assignments', new typeorm_1.TableForeignKey({
                columnNames: ['user_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'CASCADE',
            }));
            await queryRunner.createForeignKey('governance_role_assignments', new typeorm_1.TableForeignKey({
                columnNames: ['business_unit_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'business_units',
                onDelete: 'CASCADE',
            }));
            await queryRunner.createForeignKey('governance_role_assignments', new typeorm_1.TableForeignKey({
                columnNames: ['assigned_by'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'SET NULL',
            }));
            await queryRunner.createIndex('governance_role_assignments', new typeorm_1.TableIndex({ columnNames: ['user_id'] }));
            await queryRunner.createIndex('governance_role_assignments', new typeorm_1.TableIndex({ columnNames: ['role'] }));
            await queryRunner.createIndex('governance_role_assignments', new typeorm_1.TableIndex({ columnNames: ['business_unit_id'] }));
            await queryRunner.createIndex('governance_role_assignments', new typeorm_1.TableIndex({ columnNames: ['user_id', 'role'] }));
        }
    }
    async down(queryRunner) {
        await queryRunner.dropTable('governance_role_assignments', true);
        await queryRunner.dropTable('governance_permissions', true);
    }
}
exports.CreateGovernancePermissionsTables1701000000016 = CreateGovernancePermissionsTables1701000000016;
//# sourceMappingURL=1701000000016-CreateGovernancePermissionsTables.js.map