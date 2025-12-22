import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateSecureBaselinesTables1701000000023 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create secure_baselines table
    await queryRunner.createTable(
      new Table({
        name: 'secure_baselines',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'baseline_identifier',
            type: 'varchar',
            length: '100',
            isUnique: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '500',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'category',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'version',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['draft', 'active', 'deprecated', 'archived'],
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
            type: 'timestamptz',
            default: 'now()',
          },
          {
            name: 'updated_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamptz',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Create baseline_requirements table
    await queryRunner.createTable(
      new Table({
        name: 'baseline_requirements',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'baseline_id',
            type: 'uuid',
          },
          {
            name: 'requirement_identifier',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '500',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'configuration_value',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'validation_method',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'display_order',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    // Create baseline_control_objective_mappings table
    await queryRunner.createTable(
      new Table({
        name: 'baseline_control_objective_mappings',
        columns: [
          {
            name: 'baseline_id',
            type: 'uuid',
          },
          {
            name: 'control_objective_id',
            type: 'uuid',
          },
        ],
      }),
      true,
    );

    // Indexes
    await queryRunner.createIndex('secure_baselines', new TableIndex({ columnNames: ['baseline_identifier'] }));
    await queryRunner.createIndex('baseline_requirements', new TableIndex({ columnNames: ['baseline_id'] }));
    await queryRunner.createIndex('baseline_control_objective_mappings', new TableIndex({ columnNames: ['baseline_id'] }));
    await queryRunner.createIndex('baseline_control_objective_mappings', new TableIndex({ columnNames: ['control_objective_id'] }));

    // Foreign Keys
    await queryRunner.createForeignKey(
      'secure_baselines',
      new TableForeignKey({
        columnNames: ['owner_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'baseline_requirements',
      new TableForeignKey({
        columnNames: ['baseline_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'secure_baselines',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'baseline_control_objective_mappings',
      new TableForeignKey({
        columnNames: ['baseline_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'secure_baselines',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'baseline_control_objective_mappings',
      new TableForeignKey({
        columnNames: ['control_objective_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'control_objectives',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('baseline_control_objective_mappings');
    await queryRunner.dropTable('baseline_requirements');
    await queryRunner.dropTable('secure_baselines');
  }
}


