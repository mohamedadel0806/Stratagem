"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddComplianceRequirementFields1700000000007 = void 0;
const typeorm_1 = require("typeorm");
class AddComplianceRequirementFields1700000000007 {
    async up(queryRunner) {
        await queryRunner.addColumn('compliance_requirements', new typeorm_1.TableColumn({
            name: 'category',
            type: 'varchar',
            length: '255',
            isNullable: true,
        }));
        await queryRunner.addColumn('compliance_requirements', new typeorm_1.TableColumn({
            name: 'compliance_deadline',
            type: 'varchar',
            length: '255',
            isNullable: true,
        }));
        await queryRunner.addColumn('compliance_requirements', new typeorm_1.TableColumn({
            name: 'applicability',
            type: 'varchar',
            length: '255',
            isNullable: true,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('compliance_requirements', 'applicability');
        await queryRunner.dropColumn('compliance_requirements', 'compliance_deadline');
        await queryRunner.dropColumn('compliance_requirements', 'category');
    }
}
exports.AddComplianceRequirementFields1700000000007 = AddComplianceRequirementFields1700000000007;
//# sourceMappingURL=1700000000007-AddComplianceRequirementFields.js.map