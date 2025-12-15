"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddAssessmentTypeColumn1702156800001 = void 0;
const typeorm_1 = require("typeorm");
class AddAssessmentTypeColumn1702156800001 {
    async up(queryRunner) {
        const table = await queryRunner.getTable('assessments');
        const columnExists = table === null || table === void 0 ? void 0 : table.columns.some(column => column.name === 'assessment_type');
        if (!columnExists) {
            await queryRunner.query(`
        DO $$ BEGIN
          CREATE TYPE assessment_type_enum AS ENUM (
            'implementation',
            'design_effectiveness',
            'operating_effectiveness',
            'compliance'
          );
        EXCEPTION
          WHEN duplicate_object THEN NULL;
        END $$;
      `);
            await queryRunner.addColumn('assessments', new typeorm_1.TableColumn({
                name: 'assessment_type',
                type: 'assessment_type_enum',
                isNullable: true,
                default: "'compliance'",
            }));
            await queryRunner.query(`CREATE INDEX IDX_assessment_type ON assessments(assessment_type)`);
        }
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX IF EXISTS IDX_assessment_type`);
        const table = await queryRunner.getTable('assessments');
        const columnExists = table === null || table === void 0 ? void 0 : table.columns.some(column => column.name === 'assessment_type');
        if (columnExists) {
            await queryRunner.dropColumn('assessments', 'assessment_type');
        }
        await queryRunner.query(`DROP TYPE IF EXISTS assessment_type_enum`);
    }
}
exports.AddAssessmentTypeColumn1702156800001 = AddAssessmentTypeColumn1702156800001;
//# sourceMappingURL=1702156800001-AddAssessmentTypeColumn.js.map