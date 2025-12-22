import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateStandardsTables1701000000013 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create standards table
    await queryRunner.createTable(
      new Table({
        name: 'standards',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'standard_identifier',
            type: 'varchar',
            length: '100',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'title',
            type: 'varchar',
            length: '500',
            isNullable: false,
          },
          {
            name: 'policy_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'control_objective_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'content',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'scope',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'applicability',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'compliance_measurement_criteria',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'version',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
            default: "'draft'",
          },
          {
            name: 'owner_id',
            type: 'uuid',
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

    // Create standard_control_objective_mappings table
    await queryRunner.createTable(
      new Table({
        name: 'standard_control_objective_mappings',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'standard_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'control_objective_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create foreign keys
    await queryRunner.createForeignKey(
      'standards',
      new TableForeignKey({
        columnNames: ['policy_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'policies',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'standards',
      new TableForeignKey({
        columnNames: ['control_objective_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'control_objectives',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'standards',
      new TableForeignKey({
        columnNames: ['owner_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'standard_control_objective_mappings',
      new TableForeignKey({
        columnNames: ['standard_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'standards',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'standard_control_objective_mappings',
      new TableForeignKey({
        columnNames: ['control_objective_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'control_objectives',
        onDelete: 'CASCADE',
      }),
    );

    // Create indexes
    await queryRunner.createIndex('standards', new TableIndex({ columnNames: ['standard_identifier'] }));
    await queryRunner.createIndex('standards', new TableIndex({ columnNames: ['policy_id'] }));
    await queryRunner.createIndex('standards', new TableIndex({ columnNames: ['control_objective_id'] }));
    await queryRunner.createIndex('standards', new TableIndex({ columnNames: ['owner_id'] }));
    await queryRunner.createIndex('standards', new TableIndex({ columnNames: ['status'] }));
    await queryRunner.createIndex('standard_control_objective_mappings', new TableIndex({ columnNames: ['standard_id'] }));
    await queryRunner.createIndex('standard_control_objective_mappings', new TableIndex({ columnNames: ['control_objective_id'] }));
    await queryRunner.createIndex('standard_control_objective_mappings', new TableIndex({ columnNames: ['standard_id', 'control_objective_id'], isUnique: true }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('standard_control_objective_mappings', true);
    await queryRunner.dropTable('standards', true);
  }
}


