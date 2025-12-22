import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateSOPFeedbackTable1705699999003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sop_feedback',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'sop_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'submitted_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'sentiment',
            type: 'varchar',
            length: '50',
            default: "'neutral'",
          },
          {
            name: 'effectiveness_rating',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'clarity_rating',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'completeness_rating',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'comments',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'improvement_suggestions',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'tagged_issues',
            type: 'varchar[]',
            isNullable: true,
          },
          {
            name: 'follow_up_required',
            type: 'boolean',
            default: 'false',
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
    await queryRunner.createIndex('sop_feedback', new TableIndex({ columnNames: ['sop_id'] }));
    await queryRunner.createIndex('sop_feedback', new TableIndex({ columnNames: ['submitted_by'] }));
    await queryRunner.createIndex('sop_feedback', new TableIndex({ columnNames: ['created_at'] }));
    await queryRunner.createIndex('sop_feedback', new TableIndex({ columnNames: ['sentiment'] }));

    // Create foreign keys
    await queryRunner.createForeignKey(
      'sop_feedback',
      new TableForeignKey({
        columnNames: ['sop_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'sops',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'sop_feedback',
      new TableForeignKey({
        columnNames: ['submitted_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'sop_feedback',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'sop_feedback',
      new TableForeignKey({
        columnNames: ['updated_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sop_feedback', true);
  }
}
