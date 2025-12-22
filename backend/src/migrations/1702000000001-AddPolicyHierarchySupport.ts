import { MigrationInterface, QueryRunner, TableColumn, TableIndex, TableForeignKey } from 'typeorm';

export class AddPolicyHierarchySupport1702000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add parent_policy_id column to policies table for hierarchy support
    const table = await queryRunner.getTable('policies');
    
    // Check if column already exists
    if (!table?.findColumnByName('parent_policy_id')) {
      await queryRunner.addColumn(
        'policies',
        new TableColumn({
          name: 'parent_policy_id',
          type: 'uuid',
          isNullable: true,
          comment: 'Foreign key to parent policy for hierarchical relationships (Story 2.1)',
        }),
      );
    }

    // Add foreign key constraint for parent_policy_id
    const hasForeignKey = table?.foreignKeys?.some(
      (fk) => fk.columnNames.includes('parent_policy_id'),
    );

    if (!hasForeignKey) {
      await queryRunner.createForeignKey(
        'policies',
        new TableForeignKey({
          name: 'FK_policy_parent_policy',
          columnNames: ['parent_policy_id'],
          referencedTableName: 'policies',
          referencedColumnNames: ['id'],
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
        }),
      );
    }

    // Add index on parent_policy_id for efficient hierarchy queries
    const hasIndex = table?.indices?.some(
      (idx) => idx.columnNames.includes('parent_policy_id'),
    );

    if (!hasIndex) {
      await queryRunner.createIndex(
        'policies',
        new TableIndex({
          name: 'IDX_policy_parent_id',
          columnNames: ['parent_policy_id'],
        }),
      );
    }

    // Add composite index for efficient hierarchy tree queries
    const hasCompositeIndex = table?.indices?.some(
      (idx) =>
        idx.columnNames.includes('parent_policy_id') &&
        idx.columnNames.includes('status'),
    );

    if (!hasCompositeIndex) {
      await queryRunner.createIndex(
        'policies',
        new TableIndex({
          name: 'IDX_policy_parent_status',
          columnNames: ['parent_policy_id', 'status'],
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove indices
    try {
      await queryRunner.query('DROP INDEX IF EXISTS "IDX_policy_parent_status"');
    } catch (e) {
      // Index may not exist
    }

    try {
      await queryRunner.query('DROP INDEX IF EXISTS "IDX_policy_parent_id"');
    } catch (e) {
      // Index may not exist
    }

    // Remove foreign key
    const table = await queryRunner.getTable('policies');
    if (table) {
      const foreignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.includes('parent_policy_id'),
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('policies', foreignKey);
      }
    }

    // Remove column
    await queryRunner.dropColumn('policies', 'parent_policy_id');
  }
}
