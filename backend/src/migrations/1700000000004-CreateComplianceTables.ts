import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateComplianceTables1700000000004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create compliance_frameworks table
    await queryRunner.createTable(
      new Table({
        name: 'compliance_frameworks',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'code',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'region',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'organization_id',
            type: 'uuid',
            isNullable: true,
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
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create unique index on name
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_compliance_frameworks_name" ON "compliance_frameworks" ("name");
    `);

    // Create compliance_requirements table
    await queryRunner.createTable(
      new Table({
        name: 'compliance_requirements',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'requirement_code',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'framework_id',
            type: 'uuid',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['not_started', 'in_progress', 'compliant', 'non_compliant', 'partially_compliant'],
            default: "'not_started'",
          },
          {
            name: 'organization_id',
            type: 'uuid',
            isNullable: true,
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
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'compliance_requirements',
      new TableForeignKey({
        columnNames: ['framework_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'compliance_frameworks',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('compliance_requirements');
    await queryRunner.dropTable('compliance_frameworks');
  }
}

