"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateGovernanceIntegrationsTables1701000000028 = void 0;
const typeorm_1 = require("typeorm");
class CreateGovernanceIntegrationsTables1701000000028 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'governance_integration_hooks',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'uuid',
                },
                {
                    name: 'name',
                    type: 'varchar',
                    length: '255',
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'type',
                    type: 'enum',
                    enum: ['siem', 'vulnerability_scanner', 'cloud_monitor', 'custom'],
                    default: "'custom'",
                },
                {
                    name: 'action',
                    type: 'enum',
                    enum: ['create_evidence', 'create_finding', 'update_control_status'],
                    default: "'create_evidence'",
                },
                {
                    name: 'secret_key',
                    type: 'varchar',
                    length: '128',
                    isUnique: true,
                },
                {
                    name: 'config',
                    type: 'jsonb',
                    isNullable: true,
                },
                {
                    name: 'isActive',
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
                    type: 'timestamptz',
                    default: 'now()',
                },
                {
                    name: 'updated_at',
                    type: 'timestamptz',
                    default: 'now()',
                },
                {
                    name: 'deleted_at',
                    type: 'timestamptz',
                    isNullable: true,
                },
            ],
        }), true);
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'governance_integration_logs',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'uuid',
                },
                {
                    name: 'hook_id',
                    type: 'uuid',
                },
                {
                    name: 'status',
                    type: 'varchar',
                    length: '50',
                },
                {
                    name: 'payload',
                    type: 'jsonb',
                    isNullable: true,
                },
                {
                    name: 'result',
                    type: 'jsonb',
                    isNullable: true,
                },
                {
                    name: 'errorMessage',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'ipAddress',
                    type: 'varchar',
                    length: '50',
                    isNullable: true,
                },
                {
                    name: 'created_at',
                    type: 'timestamptz',
                    default: 'now()',
                },
            ],
        }), true);
        await queryRunner.createIndex('governance_integration_hooks', new typeorm_1.TableIndex({ columnNames: ['type'] }));
        await queryRunner.createIndex('governance_integration_hooks', new typeorm_1.TableIndex({ columnNames: ['isActive'] }));
        await queryRunner.createIndex('governance_integration_logs', new typeorm_1.TableIndex({ columnNames: ['hook_id'] }));
        await queryRunner.createIndex('governance_integration_logs', new typeorm_1.TableIndex({ columnNames: ['status'] }));
        await queryRunner.createForeignKey('governance_integration_hooks', new typeorm_1.TableForeignKey({
            columnNames: ['created_by'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createForeignKey('governance_integration_logs', new typeorm_1.TableForeignKey({
            columnNames: ['hook_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'governance_integration_hooks',
            onDelete: 'CASCADE',
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('governance_integration_logs');
        await queryRunner.dropTable('governance_integration_hooks');
    }
}
exports.CreateGovernanceIntegrationsTables1701000000028 = CreateGovernanceIntegrationsTables1701000000028;
//# sourceMappingURL=1701000000028-CreateGovernanceIntegrationsTables.js.map