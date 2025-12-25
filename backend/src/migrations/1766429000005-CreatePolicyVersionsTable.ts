import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePolicyVersionsTable1766429000005
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'policy_versions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'policy_id',
            type: 'uuid',
          },
          {
            name: 'version',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'version_number',
            type: 'integer',
          },
          {
            name: 'content',
            type: 'text',
          },
          {
            name: 'change_summary',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'created_by',
            type: 'uuid',
            isNullable: true,
          },
        ],
        indices: [
          {
            name: 'idx_policy_versions_policy_id_version_number',
            columnNames: ['policy_id', 'version_number'],
          },
          {
            name: 'idx_policy_versions_policy_id',
            columnNames: ['policy_id'],
          },
          {
            name: 'idx_policy_versions_created_by',
            columnNames: ['created_by'],
          },
        ],
        foreignKeys: [
          {
            name: 'fk_policy_versions_policy_id',
            columnNames: ['policy_id'],
            referencedTableName: 'policies',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'fk_policy_versions_created_by',
            columnNames: ['created_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('policy_versions');
  }
}
