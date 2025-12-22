import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreatePolicyAssignmentsTable1701000000015 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('policy_assignments');
    
    if (!tableExists) {
      await queryRunner.createTable(
        new Table({
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
              isNullable: true, // Nullable because we can assign to roles/BUs
            },
            {
              name: 'role',
              type: 'varchar',
              length: '50',
              isNullable: true, // Nullable because we can assign to users/BUs
            },
            {
              name: 'business_unit_id',
              type: 'uuid',
              isNullable: true, // Nullable because we can assign to users/roles
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
        }),
        true,
      );

      // Foreign keys
      await queryRunner.createForeignKey(
        'policy_assignments',
        new TableForeignKey({
          columnNames: ['policy_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'policies',
          onDelete: 'CASCADE',
        }),
      );

      await queryRunner.createForeignKey(
        'policy_assignments',
        new TableForeignKey({
          columnNames: ['user_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete: 'CASCADE',
        }),
      );

      await queryRunner.createForeignKey(
        'policy_assignments',
        new TableForeignKey({
          columnNames: ['business_unit_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'business_units',
          onDelete: 'CASCADE',
        }),
      );

      await queryRunner.createForeignKey(
        'policy_assignments',
        new TableForeignKey({
          columnNames: ['assigned_by'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete: 'SET NULL',
        }),
      );

      // Indexes
      await queryRunner.createIndex(
        'policy_assignments',
        new TableIndex({ columnNames: ['policy_id'] }),
      );

      await queryRunner.createIndex(
        'policy_assignments',
        new TableIndex({ columnNames: ['user_id'] }),
      );

      await queryRunner.createIndex(
        'policy_assignments',
        new TableIndex({ columnNames: ['role'] }),
      );

      await queryRunner.createIndex(
        'policy_assignments',
        new TableIndex({ columnNames: ['business_unit_id'] }),
      );

      await queryRunner.createIndex(
        'policy_assignments',
        new TableIndex({ columnNames: ['acknowledged'] }),
      );

      // Composite index for user assignments
      await queryRunner.createIndex(
        'policy_assignments',
        new TableIndex({ columnNames: ['user_id', 'policy_id'] }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('policy_assignments', true);
  }
}


