import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateControlObjectiveUnifiedControlMappingsTable1701000000021 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'control_objective_unified_controls',
        columns: [
          {
            name: 'control_objective_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'unified_control_id',
            type: 'uuid',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Create indexes
    await queryRunner.createIndex(
      'control_objective_unified_controls',
      new TableIndex({
        name: 'idx_co_uc_mappings_co',
        columnNames: ['control_objective_id'],
      }),
    );

    await queryRunner.createIndex(
      'control_objective_unified_controls',
      new TableIndex({
        name: 'idx_co_uc_mappings_uc',
        columnNames: ['unified_control_id'],
      }),
    );

    await queryRunner.createIndex(
      'control_objective_unified_controls',
      new TableIndex({
        name: 'idx_co_uc_mappings_unique',
        columnNames: ['control_objective_id', 'unified_control_id'],
        isUnique: true,
      }),
    );

    // Create foreign keys
    await queryRunner.createForeignKey(
      'control_objective_unified_controls',
      new TableForeignKey({
        columnNames: ['control_objective_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'control_objectives',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'control_objective_unified_controls',
      new TableForeignKey({
        columnNames: ['unified_control_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'unified_controls',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('control_objective_unified_controls');
    if (table) {
      const foreignKeys = table.foreignKeys;
      for (const fk of foreignKeys) {
        await queryRunner.dropForeignKey('control_objective_unified_controls', fk);
      }
    }

    await queryRunner.dropTable('control_objective_unified_controls');
  }
}


