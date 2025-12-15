import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixInformationAssetsColumns1700000000020 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Rename assetName to name if it exists
    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'information_assets' AND column_name = 'assetName')
           AND NOT EXISTS (SELECT 1 FROM information_schema.columns 
                           WHERE table_name = 'information_assets' AND column_name = 'name') THEN
          ALTER TABLE information_assets RENAME COLUMN "assetName" TO name;
        END IF;
      END $$;
    `);

    // Add classification_level column if it doesn't exist (rename from dataClassification if it exists)
    await queryRunner.query(`
      DO $$ BEGIN
        -- If dataClassification exists, rename it to classification_level
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'information_assets' AND column_name = 'dataClassification') THEN
          ALTER TABLE information_assets RENAME COLUMN "dataClassification" TO classification_level;
        -- If classification_level doesn't exist and dataClassification doesn't exist, add it
        ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_name = 'information_assets' AND column_name = 'classification_level') THEN
          ALTER TABLE information_assets ADD COLUMN classification_level VARCHAR(50);
        END IF;
      END $$;
    `);

    // Rename other camelCase columns in information_assets
    const infoColumns = [
      { from: 'assetIdentifier', to: 'unique_identifier' },
      { from: 'classificationDate', to: 'classification_date' },
      { from: 'reclassificationDate', to: 'reclassification_date' },
      { from: 'reclassificationReminderSent', to: 'reclassification_reminder_sent' },
      { from: 'createdAt', to: 'created_at' },
      { from: 'updatedAt', to: 'updated_at' },
      { from: 'deletedAt', to: 'deleted_at' },
      { from: 'createdById', to: 'created_by' },
      { from: 'updatedById', to: 'updated_by' },
      { from: 'deletedById', to: 'deleted_by' },
      { from: 'complianceRequirements', to: 'compliance_requirements' },
    ];

    for (const col of infoColumns) {
      await queryRunner.query(`
        DO $$ BEGIN
          IF EXISTS (SELECT 1 FROM information_schema.columns 
                     WHERE table_name = 'information_assets' AND column_name = '${col.from}')
             AND NOT EXISTS (SELECT 1 FROM information_schema.columns 
                             WHERE table_name = 'information_assets' AND column_name = '${col.to}') THEN
            ALTER TABLE information_assets RENAME COLUMN "${col.from}" TO ${col.to};
          END IF;
        END $$;
      `);
    }

    // Drop columns that are no longer needed
    const columnsToDrop = [
      'isDeleted',
      'containsPII',
      'containsPHI',
      'containsFinancialData',
      'containsIntellectualProperty',
      'dataClassification',
      'customAttributes',
      'businessUnit',
      'department',
    ];

    for (const col of columnsToDrop) {
      await queryRunner.query(`
        DO $$ BEGIN
          IF EXISTS (SELECT 1 FROM information_schema.columns 
                     WHERE table_name = 'information_assets' AND column_name = '${col}') THEN
            ALTER TABLE information_assets DROP COLUMN IF EXISTS "${col}";
          END IF;
        END $$;
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverse operations if needed
  }
}

