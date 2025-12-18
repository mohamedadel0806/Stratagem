import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateSOPsTables1701000000014 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create sops table
    await queryRunner.createTable(
      new Table({
        name: 'sops',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'sop_identifier',
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
            name: 'category',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'subcategory',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'purpose',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'scope',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'content',
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
            name: 'version_number',
            type: 'integer',
            default: 1,
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
            name: 'review_frequency',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'next_review_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'approval_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'published_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'linked_policies',
            type: 'uuid[]',
            isNullable: true,
          },
          {
            name: 'linked_standards',
            type: 'uuid[]',
            isNullable: true,
          },
          {
            name: 'tags',
            type: 'varchar[]',
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
      }),
      true,
    );

    // Create sop_versions table for version history
    await queryRunner.createTable(
      new Table({
        name: 'sop_versions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'sop_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'version',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'version_number',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'content',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'change_summary',
            type: 'text',
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
        ],
      }),
      true,
    );

    // Create sop_assignments table
    await queryRunner.createTable(
      new Table({
        name: 'sop_assignments',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'sop_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'role_id',
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
        ],
      }),
      true,
    );

    // Create sop_executions table
    await queryRunner.createTable(
      new Table({
        name: 'sop_executions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'sop_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'executed_by',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'execution_date',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'outcome',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'execution_time_minutes',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'deviations',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'quality_checks_completed',
            type: 'boolean',
            default: false,
          },
          {
            name: 'evidence_path',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'ticket_id',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'notes',
            type: 'text',
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

    // Create sop_acknowledgments table
    await queryRunner.createTable(
      new Table({
        name: 'sop_acknowledgments',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'sop_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'acknowledged_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'training_completed',
            type: 'boolean',
            default: false,
          },
          {
            name: 'training_completed_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'expires_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Create sop_control_mappings table
    await queryRunner.createTable(
      new Table({
        name: 'sop_control_mappings',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'sop_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'unified_control_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'purpose',
            type: 'varchar',
            length: '100',
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

    // Create foreign keys
    await queryRunner.createForeignKey(
      'sops',
      new TableForeignKey({
        columnNames: ['owner_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'sop_versions',
      new TableForeignKey({
        columnNames: ['sop_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'sops',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'sop_assignments',
      new TableForeignKey({
        columnNames: ['sop_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'sops',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'sop_executions',
      new TableForeignKey({
        columnNames: ['sop_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'sops',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'sop_acknowledgments',
      new TableForeignKey({
        columnNames: ['sop_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'sops',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'sop_control_mappings',
      new TableForeignKey({
        columnNames: ['sop_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'sops',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'sop_control_mappings',
      new TableForeignKey({
        columnNames: ['unified_control_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'unified_controls',
        onDelete: 'CASCADE',
      }),
    );

    // Create indexes
    await queryRunner.createIndex('sops', new TableIndex({ columnNames: ['sop_identifier'] }));
    await queryRunner.createIndex('sops', new TableIndex({ columnNames: ['category'] }));
    await queryRunner.createIndex('sops', new TableIndex({ columnNames: ['status'] }));
    await queryRunner.createIndex('sops', new TableIndex({ columnNames: ['owner_id'] }));
    await queryRunner.createIndex('sop_versions', new TableIndex({ columnNames: ['sop_id'] }));
    await queryRunner.createIndex('sop_assignments', new TableIndex({ columnNames: ['sop_id'] }));
    await queryRunner.createIndex('sop_assignments', new TableIndex({ columnNames: ['user_id'] }));
    await queryRunner.createIndex('sop_executions', new TableIndex({ columnNames: ['sop_id'] }));
    await queryRunner.createIndex('sop_executions', new TableIndex({ columnNames: ['executed_by'] }));
    await queryRunner.createIndex('sop_acknowledgments', new TableIndex({ columnNames: ['sop_id'] }));
    await queryRunner.createIndex('sop_acknowledgments', new TableIndex({ columnNames: ['user_id'] }));
    await queryRunner.createIndex('sop_control_mappings', new TableIndex({ columnNames: ['sop_id'] }));
    await queryRunner.createIndex('sop_control_mappings', new TableIndex({ columnNames: ['unified_control_id'] }));
    await queryRunner.createIndex('sop_control_mappings', new TableIndex({ columnNames: ['sop_id', 'unified_control_id'], isUnique: true }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sop_control_mappings', true);
    await queryRunner.dropTable('sop_acknowledgments', true);
    await queryRunner.dropTable('sop_executions', true);
    await queryRunner.dropTable('sop_assignments', true);
    await queryRunner.dropTable('sop_versions', true);
    await queryRunner.dropTable('sops', true);
  }
}
