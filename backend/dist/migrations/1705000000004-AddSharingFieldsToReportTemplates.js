"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddSharingFieldsToReportTemplates1705000000004 = void 0;
const typeorm_1 = require("typeorm");
class AddSharingFieldsToReportTemplates1705000000004 {
    async up(queryRunner) {
        await queryRunner.addColumn('report_templates', new typeorm_1.TableColumn({
            name: 'version',
            type: 'integer',
            default: 1,
            isNullable: false,
        }));
        await queryRunner.addColumn('report_templates', new typeorm_1.TableColumn({
            name: 'is_shared',
            type: 'boolean',
            default: false,
            isNullable: false,
        }));
        await queryRunner.addColumn('report_templates', new typeorm_1.TableColumn({
            name: 'shared_with_user_ids',
            type: 'jsonb',
            isNullable: true,
            default: "'[]'",
        }));
        await queryRunner.addColumn('report_templates', new typeorm_1.TableColumn({
            name: 'shared_with_team_ids',
            type: 'jsonb',
            isNullable: true,
            default: "'[]'",
        }));
        await queryRunner.addColumn('report_templates', new typeorm_1.TableColumn({
            name: 'is_organization_wide',
            type: 'boolean',
            default: false,
            isNullable: false,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('report_templates', 'is_organization_wide');
        await queryRunner.dropColumn('report_templates', 'shared_with_team_ids');
        await queryRunner.dropColumn('report_templates', 'shared_with_user_ids');
        await queryRunner.dropColumn('report_templates', 'is_shared');
        await queryRunner.dropColumn('report_templates', 'version');
    }
}
exports.AddSharingFieldsToReportTemplates1705000000004 = AddSharingFieldsToReportTemplates1705000000004;
//# sourceMappingURL=1705000000004-AddSharingFieldsToReportTemplates.js.map