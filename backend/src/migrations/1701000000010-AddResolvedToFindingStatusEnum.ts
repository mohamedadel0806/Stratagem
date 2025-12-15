import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddResolvedToFindingStatusEnum1701000000010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add 'resolved' value to finding_status_enum
    // PostgreSQL doesn't support removing enum values easily, so we need to check if it exists first
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

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Note: PostgreSQL doesn't support removing enum values directly
    // This would require recreating the enum type, which is complex
    // For now, we'll leave it as a no-op
    // If you need to remove it, you would need to:
    // 1. Create a new enum without 'resolved'
    // 2. Update all columns to use the new enum
    // 3. Drop the old enum
    // 4. Rename the new enum
  }
}

