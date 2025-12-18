"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixReportTemplateFieldSelection1704000000002 = void 0;
class FixReportTemplateFieldSelection1704000000002 {
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE report_templates 
      ALTER COLUMN field_selection DROP NOT NULL,
      ALTER COLUMN field_selection SET DEFAULT '[]'::jsonb;
    `);
        await queryRunner.query(`
      UPDATE report_templates 
      SET field_selection = '[]'::jsonb 
      WHERE field_selection IS NULL;
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE report_templates 
      ALTER COLUMN field_selection SET NOT NULL;
    `);
    }
}
exports.FixReportTemplateFieldSelection1704000000002 = FixReportTemplateFieldSelection1704000000002;
//# sourceMappingURL=1704000000002-FixReportTemplateFieldSelection.js.map