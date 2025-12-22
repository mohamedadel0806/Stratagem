"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddAcknowledgedColumnsToSOPAssignments1766429000000 = void 0;
const typeorm_1 = require("typeorm");
class AddAcknowledgedColumnsToSOPAssignments1766429000000 {
    async up(queryRunner) {
        await queryRunner.addColumns('sop_assignments', [
            new typeorm_1.TableColumn({
                name: 'business_unit_id',
                type: 'uuid',
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'notification_sent',
                type: 'boolean',
                default: false,
            }),
            new typeorm_1.TableColumn({
                name: 'notification_sent_at',
                type: 'timestamp',
                isNullable: true,
            }),
            new typeorm_1.TableColumn({
                name: 'acknowledged',
                type: 'boolean',
                default: false,
            }),
            new typeorm_1.TableColumn({
                name: 'acknowledged_at',
                type: 'timestamp',
                isNullable: true,
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('sop_assignments', 'acknowledged_at');
        await queryRunner.dropColumn('sop_assignments', 'acknowledged');
        await queryRunner.dropColumn('sop_assignments', 'notification_sent_at');
        await queryRunner.dropColumn('sop_assignments', 'notification_sent');
        await queryRunner.dropColumn('sop_assignments', 'business_unit_id');
    }
}
exports.AddAcknowledgedColumnsToSOPAssignments1766429000000 = AddAcknowledgedColumnsToSOPAssignments1766429000000;
//# sourceMappingURL=1766429000000-AddAcknowledgedColumnsToSOPAssignments.js.map