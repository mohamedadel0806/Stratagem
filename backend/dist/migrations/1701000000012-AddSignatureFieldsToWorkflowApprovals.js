"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddSignatureFieldsToWorkflowApprovals1701000000012 = void 0;
const typeorm_1 = require("typeorm");
class AddSignatureFieldsToWorkflowApprovals1701000000012 {
    async up(queryRunner) {
        await queryRunner.addColumns('workflow_approvals', [
            new typeorm_1.TableColumn({
                name: 'signature_data',
                type: 'text',
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'signature_timestamp',
                type: 'timestamp',
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'signature_method',
                type: 'varchar',
                length: '20',
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'signature_metadata',
                type: 'jsonb',
                isNullable: true,
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumns('workflow_approvals', [
            'signature_data',
            'signature_timestamp',
            'signature_method',
            'signature_metadata',
        ]);
    }
}
exports.AddSignatureFieldsToWorkflowApprovals1701000000012 = AddSignatureFieldsToWorkflowApprovals1701000000012;
//# sourceMappingURL=1701000000012-AddSignatureFieldsToWorkflowApprovals.js.map