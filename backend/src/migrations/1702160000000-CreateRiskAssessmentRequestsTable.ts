import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateRiskAssessmentRequestsTable1702160000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create risk_assessment_requests table
    await queryRunner.createTable(
      new Table({
        name: 'risk_assessment_requests',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'request_identifier',
            type: 'varchar',
            length: '100',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'risk_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'requested_by_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'requested_for_id',
            type: 'uuid',
            isNullable: true,
            comment: 'Assessor/analyst who should perform the assessment',
          },
          {
            name: 'assessment_type',
            type: 'varchar',
            length: '50',
            isNullable: false,
            comment: 'inherent, current, or target',
          },
          {
            name: 'priority',
            type: 'varchar',
            length: '20',
            default: "'medium'",
            comment: 'critical, high, medium, low',
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
            default: "'pending'",
            comment: 'pending, approved, rejected, in_progress, completed, cancelled',
          },
          {
            name: 'due_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'justification',
            type: 'text',
            isNullable: true,
            comment: 'Why this assessment is needed',
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'approval_workflow_id',
            type: 'uuid',
            isNullable: true,
            comment: 'Linked workflow execution for approval',
          },
          {
            name: 'approved_by_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'approved_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'rejected_by_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'rejected_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'rejection_reason',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'completed_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'resulting_assessment_id',
            type: 'uuid',
            isNullable: true,
            comment: 'Link to the risk_assessment created from this request',
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

    // Add foreign keys
    await queryRunner.createForeignKey(
      'risk_assessment_requests',
      new TableForeignKey({
        columnNames: ['risk_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'risks',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'risk_assessment_requests',
      new TableForeignKey({
        columnNames: ['requested_by_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'risk_assessment_requests',
      new TableForeignKey({
        columnNames: ['requested_for_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'risk_assessment_requests',
      new TableForeignKey({
        columnNames: ['approved_by_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'risk_assessment_requests',
      new TableForeignKey({
        columnNames: ['rejected_by_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'risk_assessment_requests',
      new TableForeignKey({
        columnNames: ['resulting_assessment_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'risk_assessments',
        onDelete: 'SET NULL',
      }),
    );

    // Create indexes
    await queryRunner.createIndex(
      'risk_assessment_requests',
      new TableIndex({ columnNames: ['risk_id'] }),
    );
    await queryRunner.createIndex(
      'risk_assessment_requests',
      new TableIndex({ columnNames: ['requested_by_id'] }),
    );
    await queryRunner.createIndex(
      'risk_assessment_requests',
      new TableIndex({ columnNames: ['requested_for_id'] }),
    );
    await queryRunner.createIndex(
      'risk_assessment_requests',
      new TableIndex({ columnNames: ['status'] }),
    );
    await queryRunner.createIndex(
      'risk_assessment_requests',
      new TableIndex({ columnNames: ['assessment_type'] }),
    );
    await queryRunner.createIndex(
      'risk_assessment_requests',
      new TableIndex({ columnNames: ['due_date'] }),
    );
    await queryRunner.createIndex(
      'risk_assessment_requests',
      new TableIndex({ columnNames: ['request_identifier'] }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('risk_assessment_requests', true);
  }
}
