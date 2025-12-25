"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddEscalationFieldsToAlertsTable1766432400002 = void 0;
const typeorm_1 = require("typeorm");
class AddEscalationFieldsToAlertsTable1766432400002 {
    async up(queryRunner) {
        await queryRunner.addColumn('alerts', new typeorm_1.TableColumn({
            name: 'escalation_chain_id',
            type: 'uuid',
            isNullable: true,
        }));
        await queryRunner.addColumn('alerts', new typeorm_1.TableColumn({
            name: 'has_escalation',
            type: 'boolean',
            default: false,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('alerts', 'has_escalation');
        await queryRunner.dropColumn('alerts', 'escalation_chain_id');
    }
}
exports.AddEscalationFieldsToAlertsTable1766432400002 = AddEscalationFieldsToAlertsTable1766432400002;
//# sourceMappingURL=1766432400002-AddEscalationFieldsToAlertsTable.js.map