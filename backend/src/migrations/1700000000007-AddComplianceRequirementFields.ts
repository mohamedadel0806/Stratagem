import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddComplianceRequirementFields1700000000007 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'compliance_requirements',
      new TableColumn({
        name: 'category',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'compliance_requirements',
      new TableColumn({
        name: 'compliance_deadline',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'compliance_requirements',
      new TableColumn({
        name: 'applicability',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('compliance_requirements', 'applicability');
    await queryRunner.dropColumn('compliance_requirements', 'compliance_deadline');
    await queryRunner.dropColumn('compliance_requirements', 'category');
  }
}

