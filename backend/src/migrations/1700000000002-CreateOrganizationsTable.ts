import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateOrganizationsTable1700000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum type
    await queryRunner.query(`
      CREATE TYPE org_status AS ENUM (
        'active',
        'inactive',
        'suspended',
        'trial'
      );
    `);

    // Create organizations table
    await queryRunner.createTable(
      new Table({
        name: 'organizations',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'legal_name',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'registration_number',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'tax_id',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'country',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'state_province',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'city',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'address',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'postal_code',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'website',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'industry',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'company_size',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'logo_url',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'timezone',
            type: 'varchar',
            length: '50',
            default: "'UTC'",
          },
          {
            name: 'language',
            type: 'varchar',
            length: '10',
            default: "'en'",
          },
          {
            name: 'status',
            type: 'org_status',
            default: "'active'",
          },
          {
            name: 'subscription_plan',
            type: 'varchar',
            length: '50',
            default: "'trial'",
          },
          {
            name: 'subscription_expires_at',
            type: 'timestamp',
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

    // Create indexes
    await queryRunner.createIndex(
      'organizations',
      new TableIndex({
        name: 'idx_organizations_country',
        columnNames: ['country'],
      }),
    );

    await queryRunner.createIndex(
      'organizations',
      new TableIndex({
        name: 'idx_organizations_industry',
        columnNames: ['industry'],
      }),
    );

    await queryRunner.createIndex(
      'organizations',
      new TableIndex({
        name: 'idx_organizations_status',
        columnNames: ['status'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('organizations');
    await queryRunner.query('DROP TYPE IF EXISTS org_status');
  }
}

