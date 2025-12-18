"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddIsSystemTemplateToReportTemplates1705000000002 = void 0;
const typeorm_1 = require("typeorm");
class AddIsSystemTemplateToReportTemplates1705000000002 {
    async up(queryRunner) {
        await queryRunner.addColumn('report_templates', new typeorm_1.TableColumn({
            name: 'is_system_template',
            type: 'boolean',
            default: false,
            isNullable: false,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('report_templates', 'is_system_template');
    }
}
exports.AddIsSystemTemplateToReportTemplates1705000000002 = AddIsSystemTemplateToReportTemplates1705000000002;
//# sourceMappingURL=1705000000002-AddIsSystemTemplateToReportTemplates.js.map