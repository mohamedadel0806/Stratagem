import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateGovernancePermissionsTables1701000000016 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create governance_permissions table
    const permissionsTableExists = await queryRunner.hasTable('governance_permissions');
    
    if (!permissionsTableExists) {
      await queryRunner.createTable(
        new Table({
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
              isNullable: true, // For row-level security conditions
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
        }),
        true,
      );

      // Indexes
      await queryRunner.createIndex(
        'governance_permissions',
        new TableIndex({ columnNames: ['role'] }),
      );

      await queryRunner.createIndex(
        'governance_permissions',
        new TableIndex({ columnNames: ['module'] }),
      );

      await queryRunner.createIndex(
        'governance_permissions',
        new TableIndex({ columnNames: ['role', 'module', 'action'] }),
      );

      // Unique constraint
      await queryRunner.query(`
        ALTER TABLE governance_permissions
        ADD CONSTRAINT unique_role_module_action 
        UNIQUE (role, module, action, resource_type);
      `);
    }

    // Create governance_role_assignments table for custom roles
    const roleAssignmentsTableExists = await queryRunner.hasTable('governance_role_assignments');
    
    if (!roleAssignmentsTableExists) {
      await queryRunner.createTable(
        new Table({
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
              isNullable: true, // For row-level security
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
        }),
        true,
      );

      // Foreign keys
      await queryRunner.createForeignKey(
        'governance_role_assignments',
        new TableForeignKey({
          columnNames: ['user_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete: 'CASCADE',
        }),
      );

      await queryRunner.createForeignKey(
        'governance_role_assignments',
        new TableForeignKey({
          columnNames: ['business_unit_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'business_units',
          onDelete: 'CASCADE',
        }),
      );

      await queryRunner.createForeignKey(
        'governance_role_assignments',
        new TableForeignKey({
          columnNames: ['assigned_by'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete: 'SET NULL',
        }),
      );

      // Indexes
      await queryRunner.createIndex(
        'governance_role_assignments',
        new TableIndex({ columnNames: ['user_id'] }),
      );

      await queryRunner.createIndex(
        'governance_role_assignments',
        new TableIndex({ columnNames: ['role'] }),
      );

      await queryRunner.createIndex(
        'governance_role_assignments',
        new TableIndex({ columnNames: ['business_unit_id'] }),
      );

      await queryRunner.createIndex(
        'governance_role_assignments',
        new TableIndex({ columnNames: ['user_id', 'role'] }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('governance_role_assignments', true);
    await queryRunner.dropTable('governance_permissions', true);
  }
}
