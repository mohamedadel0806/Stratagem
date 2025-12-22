"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixFrameworkCodeColumn1701000000104 = void 0;
class FixFrameworkCodeColumn1701000000104 {
    async up(queryRunner) {
        const table = await queryRunner.getTable('compliance_frameworks');
        const frameworkCodeColumn = table === null || table === void 0 ? void 0 : table.findColumnByName('framework_code');
        if (!frameworkCodeColumn) {
            await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        ADD COLUMN IF NOT EXISTS framework_code VARCHAR(100);
      `);
            const codeColumn = table === null || table === void 0 ? void 0 : table.findColumnByName('code');
            if (codeColumn) {
                await queryRunner.query(`
          UPDATE compliance_frameworks 
          SET framework_code = code 
          WHERE framework_code IS NULL AND code IS NOT NULL;
        `);
            }
            try {
                await queryRunner.query(`
          CREATE UNIQUE INDEX IF NOT EXISTS "IDX_compliance_frameworks_framework_code" 
          ON compliance_frameworks (framework_code) 
          WHERE framework_code IS NOT NULL;
        `);
            }
            catch (error) {
                console.log('Index creation skipped (may already exist)');
            }
        }
    }
    async down(queryRunner) {
        const table = await queryRunner.getTable('compliance_frameworks');
        const frameworkCodeColumn = table === null || table === void 0 ? void 0 : table.findColumnByName('framework_code');
        if (frameworkCodeColumn) {
            await queryRunner.query(`
        DROP INDEX IF EXISTS "IDX_compliance_frameworks_framework_code";
      `);
            await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        DROP COLUMN IF EXISTS framework_code;
      `);
        }
    }
}
exports.FixFrameworkCodeColumn1701000000104 = FixFrameworkCodeColumn1701000000104;
//# sourceMappingURL=1701000000104-FixFrameworkCodeColumn.js.map