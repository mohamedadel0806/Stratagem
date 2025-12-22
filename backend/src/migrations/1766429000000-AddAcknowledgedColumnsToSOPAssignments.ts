import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddAcknowledgedColumnsToSOPAssignments1766429000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('sop_assignments', [
      new TableColumn({
        name: 'business_unit_id',
        type: 'uuid',
        isNullable: true,
      }),
      new TableColumn({
        name: 'notification_sent',
        type: 'boolean',
        default: false,
      }),
      new TableColumn({
        name: 'notification_sent_at',
        type: 'timestamp',
        isNullable: true,
      }),
      new TableColumn({
        name: 'acknowledged',
        type: 'boolean',
        default: false,
      }),
      new TableColumn({
        name: 'acknowledged_at',
        type: 'timestamp',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('sop_assignments', 'acknowledged_at');
    await queryRunner.dropColumn('sop_assignments', 'acknowledged');
    await queryRunner.dropColumn('sop_assignments', 'notification_sent_at');
    await queryRunner.dropColumn('sop_assignments', 'notification_sent');
    await queryRunner.dropColumn('sop_assignments', 'business_unit_id');
  }
}