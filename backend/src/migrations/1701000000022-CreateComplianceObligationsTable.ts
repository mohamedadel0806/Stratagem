import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateComplianceObligationsTable1701000000022 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('compliance_obligations');
    
    if (!tableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'compliance_obligations',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'obligation_identifier',
            type: 'varchar',
            length: '100',
            isUnique: true,
          },
          {
            name: 'title',
            type: 'varchar',
            length: '500',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'influencer_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'source_reference',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
          {
            name: 'owner_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'business_unit_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['not_started', 'in_progress', 'met', 'partially_met', 'not_met', 'not_applicable', 'overdue'],
            default: "'not_started'",
          },
          {
            name: 'priority',
            type: 'enum',
            enum: ['critical', 'high', 'medium', 'low'],
            default: "'medium'",
          },
          {
            name: 'due_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'completion_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'evidence_summary',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'custom_fields',
            type: 'jsonb',
            isNullable: true,
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
            name: 'updated_by',
            type: 'uuid',
            isNullable: true,
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
      }),
      true,
    );

      // Create indexes
      await queryRunner.createIndex(
        'compliance_obligations',
        new TableIndex({
          columnNames: ['influencer_id'],
        }),
      );

      await queryRunner.createIndex(
        'compliance_obligations',
        new TableIndex({
          columnNames: ['owner_id'],
        }),
      );

      await queryRunner.createIndex(
        'compliance_obligations',
        new TableIndex({
          columnNames: ['business_unit_id'],
        }),
      );

      // Foreign keys
      await queryRunner.createForeignKey(
        'compliance_obligations',
        new TableForeignKey({
          columnNames: ['influencer_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'influencers',
          onDelete: 'SET NULL',
        }),
      );

      await queryRunner.createForeignKey(
        'compliance_obligations',
        new TableForeignKey({
          columnNames: ['owner_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete: 'SET NULL',
        }),
      );

      await queryRunner.createForeignKey(
        'compliance_obligations',
        new TableForeignKey({
          columnNames: ['business_unit_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'business_units',
          onDelete: 'SET NULL',
        }),
      );
    }
    // If table already exists, skip - indexes and foreign keys should already be there
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('compliance_obligations');
  }
}


