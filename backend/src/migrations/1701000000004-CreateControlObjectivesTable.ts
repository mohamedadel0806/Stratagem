import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateControlObjectivesTable1701000000004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'control_objectives',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'objective_identifier',
            type: 'varchar',
            length: '100',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'policy_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'statement',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'rationale',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'domain',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
          {
            name: 'priority',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'mandatory',
            type: 'boolean',
            default: true,
          },
          {
            name: 'responsible_party_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'implementation_status',
            type: 'implementation_status_enum',
            default: "'not_implemented'",
          },
          {
            name: 'target_implementation_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'actual_implementation_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'linked_influencers',
            type: 'uuid[]',
            isNullable: true,
          },
          {
            name: 'display_order',
            type: 'integer',
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
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'control_objectives',
      new TableForeignKey({
        columnNames: ['policy_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'policies',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex('control_objectives', new TableIndex({ columnNames: ['policy_id'] }));
    await queryRunner.createIndex('control_objectives', new TableIndex({ columnNames: ['objective_identifier'] }));
    await queryRunner.createIndex('control_objectives', new TableIndex({ columnNames: ['domain'] }));
    await queryRunner.createIndex('control_objectives', new TableIndex({ columnNames: ['responsible_party_id'] }));
    await queryRunner.createIndex('control_objectives', new TableIndex({ columnNames: ['implementation_status'] }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('control_objectives', true);
  }
}







