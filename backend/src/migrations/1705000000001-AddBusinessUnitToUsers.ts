import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey, TableIndex } from 'typeorm';

export class AddBusinessUnitToUsers1705000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add business_unit_id column to users table
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'business_unit_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    // Index to speed up lookups by business unit
    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'idx_users_business_unit',
        columnNames: ['business_unit_id'],
      }),
    );

    // Optional FK to business_units (matches how assets are modeled)
    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        columnNames: ['business_unit_id'],
        referencedTableName: 'business_units',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('users');
    if (!table) return;

    // Drop FK if it exists
    const fk = table.foreignKeys.find((fk) => fk.columnNames.includes('business_unit_id'));
    if (fk) {
      await queryRunner.dropForeignKey('users', fk);
    }

    // Drop index if it exists
    const index = table.indices.find((idx) => idx.columnNames.includes('business_unit_id'));
    if (index) {
      await queryRunner.dropIndex('users', index);
    }

    // Drop column if it exists
    const hasColumn = table.columns.find((col) => col.name === 'business_unit_id');
    if (hasColumn) {
      await queryRunner.dropColumn('users', 'business_unit_id');
    }
  }
}

