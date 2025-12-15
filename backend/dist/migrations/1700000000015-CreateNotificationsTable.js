"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateNotificationsTable1700000000015 = void 0;
const typeorm_1 = require("typeorm");
class CreateNotificationsTable1700000000015 {
    constructor() {
        this.name = 'CreateNotificationsTable1700000000015';
    }
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TYPE "notification_type_enum" AS ENUM (
        'workflow_approval_required',
        'workflow_approved',
        'workflow_rejected',
        'workflow_completed',
        'task_assigned',
        'task_due_soon',
        'deadline_approaching',
        'deadline_passed',
        'risk_escalated',
        'policy_review_required',
        'general'
      )
    `);
        await queryRunner.query(`
      CREATE TYPE "notification_priority_enum" AS ENUM (
        'low',
        'medium',
        'high',
        'urgent'
      )
    `);
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'notifications',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'userId',
                    type: 'uuid',
                },
                {
                    name: 'type',
                    type: 'notification_type_enum',
                    default: "'general'",
                },
                {
                    name: 'priority',
                    type: 'notification_priority_enum',
                    default: "'medium'",
                },
                {
                    name: 'title',
                    type: 'varchar',
                    length: '255',
                },
                {
                    name: 'message',
                    type: 'text',
                },
                {
                    name: 'isRead',
                    type: 'boolean',
                    default: false,
                },
                {
                    name: 'entityType',
                    type: 'varchar',
                    length: '100',
                    isNullable: true,
                },
                {
                    name: 'entityId',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'actionUrl',
                    type: 'varchar',
                    length: '500',
                    isNullable: true,
                },
                {
                    name: 'metadata',
                    type: 'jsonb',
                    isNullable: true,
                },
                {
                    name: 'readAt',
                    type: 'timestamp',
                    isNullable: true,
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'updatedAt',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }), true);
        await queryRunner.createForeignKey('notifications', new typeorm_1.TableForeignKey({
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createIndex('notifications', new typeorm_1.TableIndex({
            name: 'IDX_notifications_userId',
            columnNames: ['userId'],
        }));
        await queryRunner.createIndex('notifications', new typeorm_1.TableIndex({
            name: 'IDX_notifications_userId_isRead',
            columnNames: ['userId', 'isRead'],
        }));
        await queryRunner.createIndex('notifications', new typeorm_1.TableIndex({
            name: 'IDX_notifications_createdAt',
            columnNames: ['createdAt'],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropIndex('notifications', 'IDX_notifications_createdAt');
        await queryRunner.dropIndex('notifications', 'IDX_notifications_userId_isRead');
        await queryRunner.dropIndex('notifications', 'IDX_notifications_userId');
        await queryRunner.dropTable('notifications');
        await queryRunner.query(`DROP TYPE "notification_priority_enum"`);
        await queryRunner.query(`DROP TYPE "notification_type_enum"`);
    }
}
exports.CreateNotificationsTable1700000000015 = CreateNotificationsTable1700000000015;
//# sourceMappingURL=1700000000015-CreateNotificationsTable.js.map