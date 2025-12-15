import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateNotificationsTable1700000000015 implements MigrationInterface {
  name = 'CreateNotificationsTable1700000000015';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create notification type enum
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

    // Create notification priority enum
    await queryRunner.query(`
      CREATE TYPE "notification_priority_enum" AS ENUM (
        'low',
        'medium',
        'high',
        'urgent'
      )
    `);

    // Create notifications table
    await queryRunner.createTable(
      new Table({
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
      }),
      true,
    );

    // Add foreign key to users table
    await queryRunner.createForeignKey(
      'notifications',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    // Create indexes for better query performance
    await queryRunner.createIndex(
      'notifications',
      new TableIndex({
        name: 'IDX_notifications_userId',
        columnNames: ['userId'],
      }),
    );

    await queryRunner.createIndex(
      'notifications',
      new TableIndex({
        name: 'IDX_notifications_userId_isRead',
        columnNames: ['userId', 'isRead'],
      }),
    );

    await queryRunner.createIndex(
      'notifications',
      new TableIndex({
        name: 'IDX_notifications_createdAt',
        columnNames: ['createdAt'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.dropIndex('notifications', 'IDX_notifications_createdAt');
    await queryRunner.dropIndex('notifications', 'IDX_notifications_userId_isRead');
    await queryRunner.dropIndex('notifications', 'IDX_notifications_userId');

    // Drop table
    await queryRunner.dropTable('notifications');

    // Drop enums
    await queryRunner.query(`DROP TYPE "notification_priority_enum"`);
    await queryRunner.query(`DROP TYPE "notification_type_enum"`);
  }
}








