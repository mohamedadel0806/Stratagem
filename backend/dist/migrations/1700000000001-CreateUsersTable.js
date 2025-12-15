"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUsersTable1700000000001 = void 0;
const typeorm_1 = require("typeorm");
class CreateUsersTable1700000000001 {
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TYPE user_role AS ENUM (
        'super_admin',
        'admin',
        'compliance_officer',
        'risk_manager',
        'auditor',
        'user'
      );
    `);
        await queryRunner.query(`
      CREATE TYPE user_status AS ENUM (
        'active',
        'inactive',
        'suspended',
        'pending'
      );
    `);
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'users',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'gen_random_uuid()',
                },
                {
                    name: 'email',
                    type: 'varchar',
                    length: '255',
                    isUnique: true,
                },
                {
                    name: 'first_name',
                    type: 'varchar',
                    length: '100',
                },
                {
                    name: 'last_name',
                    type: 'varchar',
                    length: '100',
                },
                {
                    name: 'phone',
                    type: 'varchar',
                    length: '20',
                    isNullable: true,
                },
                {
                    name: 'avatarUrl',
                    type: 'varchar',
                    length: '500',
                    isNullable: true,
                },
                {
                    name: 'password',
                    type: 'varchar',
                    length: '255',
                },
                {
                    name: 'role',
                    type: 'user_role',
                    default: "'user'",
                },
                {
                    name: 'status',
                    type: 'user_status',
                    default: "'active'",
                },
                {
                    name: 'email_verified',
                    type: 'boolean',
                    default: false,
                },
                {
                    name: 'phone_verified',
                    type: 'boolean',
                    default: false,
                },
                {
                    name: 'last_login_at',
                    type: 'timestamp',
                    isNullable: true,
                },
                {
                    name: 'password_changed_at',
                    type: 'timestamp',
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
                    onUpdate: 'CURRENT_TIMESTAMP',
                },
            ],
        }), true);
        await queryRunner.createIndex('users', new typeorm_1.TableIndex({
            name: 'idx_users_email',
            columnNames: ['email'],
        }));
        await queryRunner.createIndex('users', new typeorm_1.TableIndex({
            name: 'idx_users_role',
            columnNames: ['role'],
        }));
        await queryRunner.createIndex('users', new typeorm_1.TableIndex({
            name: 'idx_users_status',
            columnNames: ['status'],
        }));
        await queryRunner.createIndex('users', new typeorm_1.TableIndex({
            name: 'idx_users_created_at',
            columnNames: ['created_at'],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('users');
        await queryRunner.query('DROP TYPE IF EXISTS user_role');
        await queryRunner.query('DROP TYPE IF EXISTS user_status');
    }
}
exports.CreateUsersTable1700000000001 = CreateUsersTable1700000000001;
//# sourceMappingURL=1700000000001-CreateUsersTable.js.map