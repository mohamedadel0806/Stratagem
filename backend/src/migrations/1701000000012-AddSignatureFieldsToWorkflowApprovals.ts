import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddSignatureFieldsToWorkflowApprovals1701000000012 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('workflow_approvals', [
      new TableColumn({
        name: 'signature_data',
        type: 'text',
        isNullable: true,
      }),
      new TableColumn({
        name: 'signature_timestamp',
        type: 'timestamp',
        isNullable: true,
      }),
      new TableColumn({
        name: 'signature_method',
        type: 'varchar',
        length: '20',
        isNullable: true,
      }),
      new TableColumn({
        name: 'signature_metadata',
        type: 'jsonb',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('workflow_approvals', [
      'signature_data',
      'signature_timestamp',
      'signature_method',
      'signature_metadata',
    ]);
  }
}