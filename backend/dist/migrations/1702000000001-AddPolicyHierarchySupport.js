"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPolicyHierarchySupport1702000000001 = void 0;
const typeorm_1 = require("typeorm");
class AddPolicyHierarchySupport1702000000001 {
    async up(queryRunner) {
        var _a, _b, _c;
        const table = await queryRunner.getTable('policies');
        if (!(table === null || table === void 0 ? void 0 : table.findColumnByName('parent_policy_id'))) {
            await queryRunner.addColumn('policies', new typeorm_1.TableColumn({
                name: 'parent_policy_id',
                type: 'uuid',
                isNullable: true,
                comment: 'Foreign key to parent policy for hierarchical relationships (Story 2.1)',
            }));
        }
        const hasForeignKey = (_a = table === null || table === void 0 ? void 0 : table.foreignKeys) === null || _a === void 0 ? void 0 : _a.some((fk) => fk.columnNames.includes('parent_policy_id'));
        if (!hasForeignKey) {
            await queryRunner.createForeignKey('policies', new typeorm_1.TableForeignKey({
                name: 'FK_policy_parent_policy',
                columnNames: ['parent_policy_id'],
                referencedTableName: 'policies',
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            }));
        }
        const hasIndex = (_b = table === null || table === void 0 ? void 0 : table.indices) === null || _b === void 0 ? void 0 : _b.some((idx) => idx.columnNames.includes('parent_policy_id'));
        if (!hasIndex) {
            await queryRunner.createIndex('policies', new typeorm_1.TableIndex({
                name: 'IDX_policy_parent_id',
                columnNames: ['parent_policy_id'],
            }));
        }
        const hasCompositeIndex = (_c = table === null || table === void 0 ? void 0 : table.indices) === null || _c === void 0 ? void 0 : _c.some((idx) => idx.columnNames.includes('parent_policy_id') &&
            idx.columnNames.includes('status'));
        if (!hasCompositeIndex) {
            await queryRunner.createIndex('policies', new typeorm_1.TableIndex({
                name: 'IDX_policy_parent_status',
                columnNames: ['parent_policy_id', 'status'],
            }));
        }
    }
    async down(queryRunner) {
        try {
            await queryRunner.query('DROP INDEX IF EXISTS "IDX_policy_parent_status"');
        }
        catch (e) {
        }
        try {
            await queryRunner.query('DROP INDEX IF EXISTS "IDX_policy_parent_id"');
        }
        catch (e) {
        }
        const table = await queryRunner.getTable('policies');
        if (table) {
            const foreignKey = table.foreignKeys.find((fk) => fk.columnNames.includes('parent_policy_id'));
            if (foreignKey) {
                await queryRunner.dropForeignKey('policies', foreignKey);
            }
        }
        await queryRunner.dropColumn('policies', 'parent_policy_id');
    }
}
exports.AddPolicyHierarchySupport1702000000001 = AddPolicyHierarchySupport1702000000001;
//# sourceMappingURL=1702000000001-AddPolicyHierarchySupport.js.map