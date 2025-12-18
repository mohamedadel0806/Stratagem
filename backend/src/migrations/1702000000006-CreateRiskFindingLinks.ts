import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateRiskFindingLinks1702000000006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create risk_finding_links table
    await queryRunner.createTable(
      new Table({
        name: 'risk_finding_links',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'risk_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'finding_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'relationship_type',
            type: 'varchar',
            length: '50',
            isNullable: true,
            comment: 'How the finding relates to the risk: identified, contributes_to, mitigates, etc.',
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'linked_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'linked_at',
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

    // Add foreign keys for risk_finding_links
    await queryRunner.createForeignKey(
      'risk_finding_links',
      new TableForeignKey({
        columnNames: ['risk_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'risks',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'risk_finding_links',
      new TableForeignKey({
        columnNames: ['finding_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'findings',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'risk_finding_links',
      new TableForeignKey({
        columnNames: ['linked_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    // Create indexes for risk_finding_links
    await queryRunner.createIndex('risk_finding_links', new TableIndex({ columnNames: ['risk_id'] }));
    await queryRunner.createIndex('risk_finding_links', new TableIndex({ columnNames: ['finding_id'] }));
    await queryRunner.createIndex('risk_finding_links', new TableIndex({ columnNames: ['relationship_type'] }));
    await queryRunner.query(`
      ALTER TABLE risk_finding_links
      ADD CONSTRAINT unique_risk_finding_link UNIQUE (risk_id, finding_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('risk_finding_links', true);
  }
}

