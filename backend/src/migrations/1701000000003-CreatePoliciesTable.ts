import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey, TableColumn } from 'typeorm';

export class CreatePoliciesTable1701000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if policies table exists
    const tableExists = await queryRunner.hasTable('policies');
    
    if (tableExists) {
      // Alter existing policies table to add Governance fields
      const columnsToAdd = [
        { name: 'version_number', type: 'integer', default: 1 },
        { name: 'content', type: 'text', isNullable: true },
        { name: 'purpose', type: 'text', isNullable: true },
        { name: 'scope', type: 'text', isNullable: true },
        { name: 'business_units', type: 'uuid[]', isNullable: true },
        { name: 'approval_date', type: 'date', isNullable: true },
        { name: 'review_frequency', type: 'review_frequency_enum', default: "'annual'", isNullable: true },
        { name: 'next_review_date', type: 'date', isNullable: true },
        { name: 'published_date', type: 'date', isNullable: true },
        { name: 'linked_influencers', type: 'uuid[]', isNullable: true },
        { name: 'supersedes_policy_id', type: 'uuid', isNullable: true },
        { name: 'attachments', type: 'jsonb', isNullable: true },
        { name: 'tags', type: 'varchar[]', isNullable: true },
        { name: 'custom_fields', type: 'jsonb', isNullable: true },
        { name: 'requires_acknowledgment', type: 'boolean', default: true },
        { name: 'acknowledgment_due_days', type: 'integer', default: 30 },
        { name: 'created_by', type: 'uuid', isNullable: true },
        { name: 'updated_by', type: 'uuid', isNullable: true },
        { name: 'deleted_at', type: 'timestamp', isNullable: true },
      ];

      for (const col of columnsToAdd) {
        const columnExists = await queryRunner.hasColumn('policies', col.name);
        if (!columnExists) {
          const column = new TableColumn(col);
          await queryRunner.addColumn('policies', column);
        }
      }

      // Add foreign keys if they don't exist
      const foreignKeys = [
        { columnNames: ['supersedes_policy_id'], referencedTableName: 'policies', referencedColumnNames: ['id'] },
        { columnNames: ['created_by'], referencedTableName: 'users', referencedColumnNames: ['id'] },
        { columnNames: ['updated_by'], referencedTableName: 'users', referencedColumnNames: ['id'] },
      ];

      for (const fk of foreignKeys) {
        const fkExists = await queryRunner.getTable('policies').then(table => 
          table?.foreignKeys.some(existingFk => 
            existingFk.columnNames[0] === fk.columnNames[0]
          )
        );
        if (!fkExists) {
          await queryRunner.createForeignKey('policies', new TableForeignKey(fk));
        }
      }

      // Create indexes
      await queryRunner.createIndex('policies', new TableIndex({ columnNames: ['next_review_date'], where: 'next_review_date IS NOT NULL AND deleted_at IS NULL' }));
      await queryRunner.query(`
        CREATE INDEX IF NOT EXISTS idx_policies_linked_influencers ON policies USING gin(linked_influencers);
      `);
      await queryRunner.query(`
        CREATE INDEX IF NOT EXISTS idx_policies_search ON policies USING gin(
          to_tsvector('english', 
            coalesce(title, '') || ' ' || 
            coalesce(content, '')
          )
        );
      `);

      // Don't return - continue to create policy_acknowledgments table
    } else {
      // Create policies table if it doesn't exist
    await queryRunner.createTable(
      new Table({
        name: 'policies',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'policy_type',
            type: 'varchar',
            length: '200',
            isNullable: false,
          },
          {
            name: 'title',
            type: 'varchar',
            length: '500',
            isNullable: false,
          },
          {
            name: 'version',
            type: 'varchar',
            length: '50',
            default: "'1.0'",
          },
          {
            name: 'version_number',
            type: 'integer',
            default: 1,
          },
          {
            name: 'content',
            type: 'text',
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
            name: 'owner_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'business_units',
            type: 'uuid[]',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'policy_status_enum',
            default: "'draft'",
          },
          {
            name: 'approval_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'effective_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'review_frequency',
            type: 'review_frequency_enum',
            default: "'annual'",
          },
          {
            name: 'next_review_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'published_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'linked_influencers',
            type: 'uuid[]',
            isNullable: true,
          },
          {
            name: 'supersedes_policy_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'attachments',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'tags',
            type: 'varchar[]',
            isNullable: true,
          },
          {
            name: 'custom_fields',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'requires_acknowledgment',
            type: 'boolean',
            default: true,
          },
          {
            name: 'acknowledgment_due_days',
            type: 'integer',
            default: 30,
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

    // Create foreign keys
    await queryRunner.createForeignKey(
      'policies',
      new TableForeignKey({
        columnNames: ['owner_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'policies',
      new TableForeignKey({
        columnNames: ['supersedes_policy_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'policies',
        onDelete: 'SET NULL',
      }),
    );

    // Create indexes
    await queryRunner.createIndex('policies', new TableIndex({ columnNames: ['policy_type'] }));
    await queryRunner.createIndex('policies', new TableIndex({ columnNames: ['status'] }));
    await queryRunner.createIndex('policies', new TableIndex({ columnNames: ['owner_id'] }));
    await queryRunner.createIndex(
      'policies',
      new TableIndex({
        columnNames: ['next_review_date'],
        where: 'next_review_date IS NOT NULL AND deleted_at IS NULL',
      }),
    );
    await queryRunner.createIndex('policies', new TableIndex({ columnNames: ['title', 'version_number'] }));

    // Create full-text search index
    await queryRunner.query(`
      CREATE INDEX idx_policies_search ON policies USING gin(
        to_tsvector('english', 
          coalesce(title, '') || ' ' || 
          coalesce(content, '')
        )
      );
    `);

      // Create GIN index for linked_influencers
      await queryRunner.query(`
        CREATE INDEX idx_policies_linked_influencers ON policies USING gin(linked_influencers);
      `);
    }

    // Create policy_acknowledgments table (always create this, regardless of whether policies table existed)
    const acknowledgmentsTableExists = await queryRunner.hasTable('policy_acknowledgments');
    if (!acknowledgmentsTableExists) {
      await queryRunner.createTable(
      new Table({
        name: 'policy_acknowledgments',
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
            isNullable: false,
          },
          {
            name: 'policy_version',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'acknowledged_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'ip_address',
            type: 'inet',
            isNullable: true,
          },
          {
            name: 'user_agent',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'assigned_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'due_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'reminder_sent_count',
            type: 'integer',
            default: 0,
          },
          {
            name: 'last_reminder_sent',
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

    await queryRunner.createForeignKey(
      'policy_acknowledgments',
      new TableForeignKey({
        columnNames: ['policy_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'policies',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'policy_acknowledgments',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex('policy_acknowledgments', new TableIndex({ columnNames: ['policy_id'] }));
    await queryRunner.createIndex('policy_acknowledgments', new TableIndex({ columnNames: ['user_id'] }));
    await queryRunner.createIndex(
      'policy_acknowledgments',
      new TableIndex({
        columnNames: ['policy_id', 'user_id'],
        where: 'acknowledged_at IS NULL',
      }),
    );

      // Create unique constraint
      await queryRunner.query(`
        ALTER TABLE policy_acknowledgments
        ADD CONSTRAINT unique_policy_user_version UNIQUE (policy_id, user_id, policy_version);
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('policy_acknowledgments', true);
    // Note: We don't drop the policies table as it existed before this migration
  }
}
