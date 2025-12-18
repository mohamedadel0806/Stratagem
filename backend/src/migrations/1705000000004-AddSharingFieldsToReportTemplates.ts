import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddSharingFieldsToReportTemplates1705000000004
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add version field first
    await queryRunner.addColumn(
      'report_templates',
      new TableColumn({
        name: 'version',
        type: 'integer',
        default: 1,
        isNullable: false,
      }),
    );

    // Add sharing fields
    await queryRunner.addColumn(
      'report_templates',
      new TableColumn({
        name: 'is_shared',
        type: 'boolean',
        default: false,
        isNullable: false,
      }),
    );

    await queryRunner.addColumn(
      'report_templates',
      new TableColumn({
        name: 'shared_with_user_ids',
        type: 'jsonb',
        isNullable: true,
        default: "'[]'",
      }),
    );

    await queryRunner.addColumn(
      'report_templates',
      new TableColumn({
        name: 'shared_with_team_ids',
        type: 'jsonb',
        isNullable: true,
        default: "'[]'",
      }),
    );

    await queryRunner.addColumn(
      'report_templates',
      new TableColumn({
        name: 'is_organization_wide',
        type: 'boolean',
        default: false,
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('report_templates', 'is_organization_wide');
    await queryRunner.dropColumn('report_templates', 'shared_with_team_ids');
    await queryRunner.dropColumn('report_templates', 'shared_with_user_ids');
    await queryRunner.dropColumn('report_templates', 'is_shared');
    await queryRunner.dropColumn('report_templates', 'version');
  }
}
