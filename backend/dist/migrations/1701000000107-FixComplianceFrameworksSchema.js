"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixComplianceFrameworksSchema1701000000107 = void 0;
class FixComplianceFrameworksSchema1701000000107 {
    async up(queryRunner) {
        const table = await queryRunner.getTable('compliance_frameworks');
        if (!table) {
            console.log('compliance_frameworks table does not exist, skipping');
            return;
        }
        if (!table.findColumnByName('framework_code')) {
            await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        ADD COLUMN IF NOT EXISTS framework_code VARCHAR(100);
      `);
            if (table.findColumnByName('code')) {
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
            }
        }
        if (!table.findColumnByName('version')) {
            await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        ADD COLUMN IF NOT EXISTS version VARCHAR(50);
      `);
        }
        if (!table.findColumnByName('issuing_authority')) {
            await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        ADD COLUMN IF NOT EXISTS issuing_authority VARCHAR(300);
      `);
        }
        if (!table.findColumnByName('effective_date')) {
            await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        ADD COLUMN IF NOT EXISTS effective_date DATE;
      `);
        }
        if (!table.findColumnByName('url')) {
            await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        ADD COLUMN IF NOT EXISTS url TEXT;
      `);
        }
        if (!table.findColumnByName('status')) {
            await queryRunner.query(`
        DO $$ 
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'framework_status_enum') THEN
            CREATE TYPE framework_status_enum AS ENUM ('active', 'draft', 'deprecated');
          END IF;
        END $$;
      `);
            await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        ADD COLUMN IF NOT EXISTS status framework_status_enum DEFAULT 'active';
      `);
        }
        if (!table.findColumnByName('structure')) {
            await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        ADD COLUMN IF NOT EXISTS structure JSONB;
      `);
        }
        if (!table.findColumnByName('tags')) {
            await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        ADD COLUMN IF NOT EXISTS tags VARCHAR[];
      `);
        }
        if (!table.findColumnByName('created_by')) {
            await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        ADD COLUMN IF NOT EXISTS created_by UUID;
      `);
        }
        if (!table.findColumnByName('updated_by')) {
            await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        ADD COLUMN IF NOT EXISTS updated_by UUID;
      `);
        }
        if (!table.findColumnByName('deleted_at')) {
            await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
      `);
        }
        const createdAtCamel = table.findColumnByName('createdAt');
        const createdAtSnake = table.findColumnByName('created_at');
        if (createdAtCamel && !createdAtSnake) {
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
        if (updatedAtCamel && !updatedAtSnake) {
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
        if (!table.findColumnByName('organizationId') && !table.findColumnByName('organization_id')) {
            await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        ADD COLUMN IF NOT EXISTS "organizationId" UUID;
      `);
        }
        else if (table.findColumnByName('organization_id') && !table.findColumnByName('organizationId')) {
            await queryRunner.query(`
        ALTER TABLE compliance_frameworks 
        ADD COLUMN IF NOT EXISTS "organizationId" UUID;
      `);
            await queryRunner.query(`
        UPDATE compliance_frameworks 
        SET "organizationId" = organization_id 
        WHERE "organizationId" IS NULL AND organization_id IS NOT NULL;
      `);
        }
        try {
            await queryRunner.query(`
        CREATE INDEX IF NOT EXISTS "IDX_compliance_frameworks_framework_code" 
        ON compliance_frameworks (framework_code) 
        WHERE framework_code IS NOT NULL;
      `);
        }
        catch (error) {
        }
        try {
            await queryRunner.query(`
        CREATE INDEX IF NOT EXISTS "IDX_compliance_frameworks_status" 
        ON compliance_frameworks (status);
      `);
        }
        catch (error) {
        }
    }
    async down(queryRunner) {
        console.log('Rollback not implemented - columns are kept for data safety');
    }
}
exports.FixComplianceFrameworksSchema1701000000107 = FixComplianceFrameworksSchema1701000000107;
//# sourceMappingURL=1701000000107-FixComplianceFrameworksSchema.js.map