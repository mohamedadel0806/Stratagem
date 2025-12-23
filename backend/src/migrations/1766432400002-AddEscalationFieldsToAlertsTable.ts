import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddEscalationFieldsToAlertsTable1766432400002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'alerts',
      new TableColumn({
        name: 'escalation_chain_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'alerts',
      new TableColumn({
        name: 'has_escalation',
        type: 'boolean',
        default: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('alerts', 'has_escalation');
    await queryRunner.dropColumn('alerts', 'escalation_chain_id');
  }
}
