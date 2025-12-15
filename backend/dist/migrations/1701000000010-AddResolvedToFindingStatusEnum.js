"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddResolvedToFindingStatusEnum1701000000010 = void 0;
class AddResolvedToFindingStatusEnum1701000000010 {
    async up(queryRunner) {
        await queryRunner.query(`
      DO $$ 
      BEGIN
        -- Check if 'resolved' already exists in the enum
        IF NOT EXISTS (
          SELECT 1 
          FROM pg_enum 
          WHERE enumlabel = 'resolved' 
          AND enumtypid = (
            SELECT oid 
            FROM pg_type 
            WHERE typname = 'finding_status_enum'
          )
        ) THEN
          -- Add 'resolved' to the enum
          ALTER TYPE finding_status_enum ADD VALUE 'resolved';
        END IF;
      END $$;
    `);
    }
    async down(queryRunner) {
    }
}
exports.AddResolvedToFindingStatusEnum1701000000010 = AddResolvedToFindingStatusEnum1701000000010;
//# sourceMappingURL=1701000000010-AddResolvedToFindingStatusEnum.js.map