"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddBusinessUnitToUsers1705000000001 = void 0;
const typeorm_1 = require("typeorm");
class AddBusinessUnitToUsers1705000000001 {
    async up(queryRunner) {
        await queryRunner.addColumn('users', new typeorm_1.TableColumn({
            name: 'business_unit_id',
            type: 'uuid',
            isNullable: true,
        }));
        await queryRunner.createIndex('users', new typeorm_1.TableIndex({
            name: 'idx_users_business_unit',
            columnNames: ['business_unit_id'],
        }));
        await queryRunner.createForeignKey('users', new typeorm_1.TableForeignKey({
            columnNames: ['business_unit_id'],
            referencedTableName: 'business_units',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
        }));
    }
    async down(queryRunner) {
        const table = await queryRunner.getTable('users');
        if (!table)
            return;
        const fk = table.foreignKeys.find((fk) => fk.columnNames.includes('business_unit_id'));
        if (fk) {
            await queryRunner.dropForeignKey('users', fk);
        }
        const index = table.indices.find((idx) => idx.columnNames.includes('business_unit_id'));
        if (index) {
            await queryRunner.dropIndex('users', index);
        }
        const hasColumn = table.columns.find((col) => col.name === 'business_unit_id');
        if (hasColumn) {
            await queryRunner.dropColumn('users', 'business_unit_id');
        }
    }
}
exports.AddBusinessUnitToUsers1705000000001 = AddBusinessUnitToUsers1705000000001;
//# sourceMappingURL=1705000000001-AddBusinessUnitToUsers.js.map