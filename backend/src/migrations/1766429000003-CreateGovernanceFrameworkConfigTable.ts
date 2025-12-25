import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateGovernanceFrameworkConfigTable1766429000003
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum type for framework_type
    await queryRunner.query(`
      CREATE TYPE governance_framework_config_framework_type_enum AS ENUM(
        'iso27001',
        'nist_cybersecurity',
        'nist_privacy',
        'pci_dss',
        'gdpr',
        'nca_ecc',
        'soc2',
        'hipaa',
        'custom'
      );
    `);

    await queryRunner.createTable(
      new Table({
        name: 'governance_framework_configs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'framework_type',
            type: 'enum',
            enum: [
              'iso27001',
              'nist_cybersecurity',
              'nist_privacy',
              'pci_dss',
              'gdpr',
              'nca_ecc',
              'soc2',
              'hipaa',
              'custom',
            ],
            default: "'custom'",
          },
          {
            name: 'scope',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'linked_framework_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'metadata',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'created_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
        indices: [
          {
            name: 'idx_governance_framework_configs_framework_type',
            columnNames: ['framework_type'],
          },
          {
            name: 'idx_governance_framework_configs_is_active',
            columnNames: ['is_active'],
          },
          {
            name: 'idx_governance_framework_configs_created_by',
            columnNames: ['created_by'],
          },
          {
            name: 'idx_governance_framework_configs_linked_framework_id',
            columnNames: ['linked_framework_id'],
          },
        ],
        foreignKeys: [
          {
            name: 'fk_governance_framework_configs_linked_framework_id',
            columnNames: ['linked_framework_id'],
            referencedTableName: 'compliance_frameworks',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
          {
            name: 'fk_governance_framework_configs_created_by',
            columnNames: ['created_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
          {
            name: 'fk_governance_framework_configs_updated_by',
            columnNames: ['updated_by'],
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
    await queryRunner.dropTable('governance_framework_configs');
    await queryRunner.query(
      `DROP TYPE IF EXISTS governance_framework_config_framework_type_enum;`,
    );
  }
}
