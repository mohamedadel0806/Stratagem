import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddMissingColumnsToSOPAssignments1766429000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if columns already exist before adding them
    const existingColumns = await queryRunner.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'sop_assignments' AND table_schema = 'public'
    `);

    const columnNames = existingColumns.map((col: any) => col.column_name);

    if (!columnNames.includes('business_unit_id')) {
      await queryRunner.addColumn('sop_assignments', new TableColumn({
        name: 'business_unit_id',
        type: 'uuid',
        isNullable: true,
      }));
    }

    if (!columnNames.includes('notification_sent')) {
      await queryRunner.addColumn('sop_assignments', new TableColumn({
        name: 'notification_sent',
        type: 'boolean',
        default: false,
      }));
    }

    if (!columnNames.includes('notification_sent_at')) {
      await queryRunner.addColumn('sop_assignments', new TableColumn({
        name: 'notification_sent_at',
        type: 'timestamp',
        isNullable: true,
      }));
    }

    if (!columnNames.includes('acknowledged')) {
      await queryRunner.addColumn('sop_assignments', new TableColumn({
        name: 'acknowledged',
        type: 'boolean',
        default: false,
      }));
    }

    if (!columnNames.includes('acknowledged_at')) {
      await queryRunner.addColumn('sop_assignments', new TableColumn({
        name: 'acknowledged_at',
        type: 'timestamp',
        isNullable: true,
      }));
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const existingColumns = await queryRunner.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'sop_assignments' AND table_schema = 'public'
    `);

    const columnNames = existingColumns.map((col: any) => col.column_name);

    if (columnNames.includes('acknowledged_at')) {
      await queryRunner.dropColumn('sop_assignments', 'acknowledged_at');
    }
    if (columnNames.includes('acknowledged')) {
      await queryRunner.dropColumn('sop_assignments', 'acknowledged');
    }
    if (columnNames.includes('notification_sent_at')) {
      await queryRunner.dropColumn('sop_assignments', 'notification_sent_at');
    }
    if (columnNames.includes('notification_sent')) {
      await queryRunner.dropColumn('sop_assignments', 'notification_sent');
    }
    if (columnNames.includes('business_unit_id')) {
      await queryRunner.dropColumn('sop_assignments', 'business_unit_id');
    }
  }
}