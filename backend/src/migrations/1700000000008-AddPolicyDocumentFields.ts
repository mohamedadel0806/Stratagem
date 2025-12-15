import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPolicyDocumentFields1700000000008 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'policies',
      new TableColumn({
        name: 'document_url',
        type: 'varchar',
        length: '500',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'policies',
      new TableColumn({
        name: 'document_name',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'policies',
      new TableColumn({
        name: 'document_mime_type',
        type: 'varchar',
        length: '50',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('policies', 'document_mime_type');
    await queryRunner.dropColumn('policies', 'document_name');
    await queryRunner.dropColumn('policies', 'document_url');
  }
}

