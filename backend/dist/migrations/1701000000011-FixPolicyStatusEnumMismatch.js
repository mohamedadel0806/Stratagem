"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixPolicyStatusEnumMismatch1701000000011 = void 0;
class FixPolicyStatusEnumMismatch1701000000011 {
    async up(queryRunner) {
        const policiesTableExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'policies'
      );
    `);
        if (!policiesTableExists[0].exists) {
            console.log('Policies table does not exist, skipping migration');
            return;
        }
        const columnInfo = await queryRunner.query(`
      SELECT udt_name 
      FROM information_schema.columns 
      WHERE table_name = 'policies' 
      AND column_name = 'status';
    `);
        if (columnInfo.length === 0) {
            console.log('Status column not found in policies table, skipping migration');
            return;
        }
        const currentEnumType = columnInfo[0].udt_name;
        console.log(`Current enum type for policies.status: ${currentEnumType}`);
        if (currentEnumType === 'policy_status_enum') {
            console.log('Policies table already uses policy_status_enum, skipping migration');
            return;
        }
        const oldEnumExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'policies_status_enum'
      );
    `);
        const newEnumExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'policy_status_enum'
      );
    `);
        if (!newEnumExists[0].exists) {
            console.log('ERROR: policy_status_enum does not exist. Cannot migrate.');
            throw new Error('policy_status_enum must exist before migration');
        }
        const statusCounts = await queryRunner.query(`
      SELECT status::text as status, COUNT(*) as count 
      FROM policies 
      GROUP BY status
      ORDER BY count DESC;
    `);
        console.log('Current policy status distribution:', statusCounts);
        const activeCount = await queryRunner.query(`
      SELECT COUNT(*) as count 
      FROM policies 
      WHERE status::text = 'active';
    `);
        const underReviewCount = await queryRunner.query(`
      SELECT COUNT(*) as count 
      FROM policies 
      WHERE status::text = 'under_review';
    `);
        console.log(`Found ${activeCount[0].count} policies with 'active' status`);
        console.log(`Found ${underReviewCount[0].count} policies with 'under_review' status`);
        console.log('Converting status column to text for migration...');
        await queryRunner.query(`
      ALTER TABLE policies ALTER COLUMN status TYPE text;
    `);
        if (activeCount[0].count > 0) {
            console.log(`Migrating ${activeCount[0].count} policies from 'active' to 'published'`);
            await queryRunner.query(`
        UPDATE policies SET status = 'published' WHERE status = 'active';
      `);
        }
        if (underReviewCount[0].count > 0) {
            console.log(`Migrating ${underReviewCount[0].count} policies from 'under_review' to 'in_review'`);
            await queryRunner.query(`
        UPDATE policies SET status = 'in_review' WHERE status = 'under_review';
      `);
        }
        console.log('Changing status column type to policy_status_enum');
        await queryRunner.query(`
      ALTER TABLE policies 
      ALTER COLUMN status DROP DEFAULT;
    `);
        await queryRunner.query(`
      ALTER TABLE policies 
      ALTER COLUMN status TYPE policy_status_enum 
      USING status::text::policy_status_enum;
    `);
        await queryRunner.query(`
      ALTER TABLE policies 
      ALTER COLUMN status SET DEFAULT 'draft'::policy_status_enum;
    `);
        console.log('Policy status enum migration completed successfully');
        console.log('Note: Old enum type policies_status_enum is kept for safety. Can be dropped later if confirmed unused.');
    }
    async down(queryRunner) {
        console.log('Rollback: Reverting to policies_status_enum (if exists)');
        const oldEnumExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'policies_status_enum'
      );
    `);
        if (oldEnumExists[0].exists) {
            await queryRunner.query(`
        ALTER TABLE policies ALTER COLUMN status TYPE text;
      `);
            await queryRunner.query(`
        UPDATE policies SET status = 'active' WHERE status = 'published';
      `);
            await queryRunner.query(`
        UPDATE policies SET status = 'under_review' WHERE status = 'in_review';
      `);
            await queryRunner.query(`
        ALTER TABLE policies 
        ALTER COLUMN status TYPE policies_status_enum 
        USING status::text::policies_status_enum;
      `);
            console.log('Reverted to policies_status_enum');
        }
        else {
            console.log('WARNING: policies_status_enum does not exist. Cannot rollback.');
        }
    }
}
exports.FixPolicyStatusEnumMismatch1701000000011 = FixPolicyStatusEnumMismatch1701000000011;
//# sourceMappingURL=1701000000011-FixPolicyStatusEnumMismatch.js.map