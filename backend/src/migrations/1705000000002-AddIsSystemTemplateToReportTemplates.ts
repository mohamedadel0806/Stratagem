import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddIsSystemTemplateToReportTemplates1705000000002
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'report_templates',
      new TableColumn({
        name: 'is_system_template',
        type: 'boolean',
        default: false,
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('report_templates', 'is_system_template');
  }
}
