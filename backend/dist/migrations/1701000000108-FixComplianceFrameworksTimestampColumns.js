"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixComplianceFrameworksTimestampColumns1701000000108 = void 0;
class FixComplianceFrameworksTimestampColumns1701000000108 {
    async up(queryRunner) {
        const table = await queryRunner.getTable('compliance_frameworks');
        if (!table) {
            return;
        }
        const createdAtCamel = table.findColumnByName('createdAt');
        const createdAtSnake = table.findColumnByName('created_at');
        if (createdAtCamel && createdAtSnake) {
            await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        DROP COLUMN IF EXISTS "createdAt";
      `);
        }
        else if (createdAtCamel && !createdAtSnake) {
            await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        RENAME COLUMN "createdAt" TO created_at;
      `);
        }
        else if (!createdAtSnake) {
            await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
      `);
        }
        const updatedAtCamel = table.findColumnByName('updatedAt');
        const updatedAtSnake = table.findColumnByName('updated_at');
        if (updatedAtCamel && updatedAtSnake) {
            await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        DROP COLUMN IF EXISTS "updatedAt";
      `);
        }
        else if (updatedAtCamel && !updatedAtSnake) {
            await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        RENAME COLUMN "updatedAt" TO updated_at;
      `);
        }
        else if (!updatedAtSnake) {
            await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
      `);
        }
    }
    async down(queryRunner) {
    }
}
exports.FixComplianceFrameworksTimestampColumns1701000000108 = FixComplianceFrameworksTimestampColumns1701000000108;
//# sourceMappingURL=1701000000108-FixComplianceFrameworksTimestampColumns.js.map