import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateFindingsTable1701000000008 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create findings table
    await queryRunner.createTable(
      new Table({
        name: 'findings',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'finding_identifier',
            type: 'varchar',
            length: '100',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'assessment_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'assessment_result_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'source_type',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'source_name',
            type: 'varchar',
            length: '300',
            isNullable: true,
          },
          {
            name: 'unified_control_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'asset_type',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'asset_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'title',
            type: 'varchar',
            length: '500',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'severity',
            type: 'finding_severity_enum',
            isNullable: false,
          },
          {
            name: 'finding_date',
            type: 'date',
            default: 'CURRENT_DATE',
          },
          {
            name: 'status',
            type: 'finding_status_enum',
            default: "'open'",
          },
          {
            name: 'remediation_owner_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'remediation_plan',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'remediation_due_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'remediation_completed_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'remediation_evidence',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'risk_accepted_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'risk_acceptance_justification',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'risk_acceptance_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'risk_acceptance_expiry',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'retest_required',
            type: 'boolean',
            default: false,
          },
          {
            name: 'retest_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'retest_result',
            type: 'varchar',
            length: '100',
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

    await queryRunner.createForeignKey(
      'findings',
      new TableForeignKey({
        columnNames: ['assessment_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'assessments',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'findings',
      new TableForeignKey({
        columnNames: ['unified_control_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'unified_controls',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'findings',
      new TableForeignKey({
        columnNames: ['remediation_owner_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'findings',
      new TableForeignKey({
        columnNames: ['risk_accepted_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createIndex('findings', new TableIndex({ columnNames: ['finding_identifier'] }));
    await queryRunner.createIndex('findings', new TableIndex({ columnNames: ['assessment_id'] }));
    await queryRunner.createIndex('findings', new TableIndex({ columnNames: ['unified_control_id'] }));
    await queryRunner.createIndex('findings', new TableIndex({ columnNames: ['asset_type', 'asset_id'] }));
    await queryRunner.createIndex('findings', new TableIndex({ columnNames: ['severity'] }));
    await queryRunner.createIndex('findings', new TableIndex({ columnNames: ['status'] }));
    await queryRunner.createIndex('findings', new TableIndex({ columnNames: ['remediation_owner_id'] }));
    await queryRunner.createIndex(
      'findings',
      new TableIndex({
        columnNames: ['remediation_due_date'],
        where: "status IN ('open', 'in_progress')",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('findings', true);
  }
}





