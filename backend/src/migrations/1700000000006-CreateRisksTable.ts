import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateRisksTable1700000000006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'risks',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'category',
            type: 'enum',
            enum: ['cybersecurity', 'data_privacy', 'compliance', 'operational', 'financial', 'strategic', 'reputational'],
            default: "'compliance'",
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['identified', 'assessed', 'mitigated', 'accepted', 'closed'],
            default: "'identified'",
          },
          {
            name: 'likelihood',
            type: 'enum',
            enum: ['1', '2', '3', '4', '5'],
            default: "'3'",
          },
          {
            name: 'impact',
            type: 'enum',
            enum: ['1', '2', '3', '4', '5'],
            default: "'3'",
          },
          {
            name: 'organization_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'owner_id',
            type: 'uuid',
            isNullable: true,
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
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('risks');
  }
}

