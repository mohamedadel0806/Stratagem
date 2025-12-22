import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class AddInfluencerRevisionTracking1701000000019 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add revision_notes and review_frequency_days to influencers table
    // Using separate statements for better reliability with IF NOT EXISTS
    await queryRunner.query(`
      ALTER TABLE influencers 
      ADD COLUMN IF NOT EXISTS revision_notes TEXT;
    `);
    
    await queryRunner.query(`
      ALTER TABLE influencers 
      ADD COLUMN IF NOT EXISTS review_frequency_days INTEGER;
    `);

    // Create revision_type enum
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE revision_type_enum AS ENUM (
          'created',
          'updated',
          'status_changed',
          'applicability_changed',
          'reviewed',
          'archived'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create influencer_revisions table
    await queryRunner.createTable(
      new Table({
        name: 'influencer_revisions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'influencer_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'revision_type',
            type: 'revision_type_enum',
            isNullable: false,
          },
          {
            name: 'revision_notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'revision_date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'changes_summary',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'impact_assessment',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'reviewed_by',
            type: 'uuid',
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

    // Create indexes
    await queryRunner.createIndex(
      'influencer_revisions',
      new TableIndex({
        name: 'idx_influencer_revisions_influencer_id',
        columnNames: ['influencer_id'],
      }),
    );

    await queryRunner.createIndex(
      'influencer_revisions',
      new TableIndex({
        name: 'idx_influencer_revisions_revision_date',
        columnNames: ['revision_date'],
      }),
    );

    await queryRunner.createIndex(
      'influencer_revisions',
      new TableIndex({
        name: 'idx_influencer_revisions_revision_type',
        columnNames: ['revision_type'],
      }),
    );

    // Create foreign keys
    await queryRunner.createForeignKey(
      'influencer_revisions',
      new TableForeignKey({
        columnNames: ['influencer_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'influencers',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'influencer_revisions',
      new TableForeignKey({
        columnNames: ['reviewed_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'influencer_revisions',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('influencer_revisions');
    if (table) {
      const foreignKeys = table.foreignKeys;
      for (const fk of foreignKeys) {
        await queryRunner.dropForeignKey('influencer_revisions', fk);
      }
    }

    await queryRunner.dropTable('influencer_revisions');
    await queryRunner.query(`DROP TYPE IF EXISTS revision_type_enum;`);

    await queryRunner.query(`
      ALTER TABLE influencers 
      DROP COLUMN IF EXISTS revision_notes,
      DROP COLUMN IF EXISTS review_frequency_days;
    `);
  }
}


