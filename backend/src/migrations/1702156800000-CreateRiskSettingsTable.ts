import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRiskSettingsTable1702156800000 implements MigrationInterface {
  name = 'CreateRiskSettingsTable1702156800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create risk_settings table
    await queryRunner.query(`
      CREATE TABLE "risk_settings" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "organization_id" uuid,
        "risk_levels" jsonb NOT NULL DEFAULT '[
          {"level": "low", "minScore": 1, "maxScore": 5, "color": "#22c55e", "description": "Acceptable risk - monitor periodically", "responseTime": "90 days", "escalation": false},
          {"level": "medium", "minScore": 6, "maxScore": 11, "color": "#eab308", "description": "Moderate risk - implement controls", "responseTime": "30 days", "escalation": false},
          {"level": "high", "minScore": 12, "maxScore": 19, "color": "#f97316", "description": "Significant risk - prioritize treatment", "responseTime": "7 days", "escalation": true},
          {"level": "critical", "minScore": 20, "maxScore": 25, "color": "#dc2626", "description": "Unacceptable risk - immediate action required", "responseTime": "24 hours", "escalation": true}
        ]'::jsonb,
        "assessment_methods" jsonb NOT NULL DEFAULT '[
          {"id": "qualitative_5x5", "name": "Qualitative 5x5 Matrix", "description": "Standard 5-point scales for likelihood and impact", "likelihoodScale": 5, "impactScale": 5, "isDefault": true, "isActive": true},
          {"id": "qualitative_3x3", "name": "Simplified 3x3 Matrix", "description": "Basic 3-point scales for quick assessments", "likelihoodScale": 3, "impactScale": 3, "isDefault": false, "isActive": true},
          {"id": "bowtie", "name": "Bowtie Analysis", "description": "Cause-consequence analysis with barriers", "likelihoodScale": 5, "impactScale": 5, "isDefault": false, "isActive": false}
        ]'::jsonb,
        "likelihood_scale" jsonb NOT NULL DEFAULT '[
          {"value": 1, "label": "Rare", "description": "Highly unlikely to occur (< 5% chance)"},
          {"value": 2, "label": "Unlikely", "description": "Not expected but possible (5-20% chance)"},
          {"value": 3, "label": "Possible", "description": "Could occur at some point (20-50% chance)"},
          {"value": 4, "label": "Likely", "description": "More likely than not (50-80% chance)"},
          {"value": 5, "label": "Almost Certain", "description": "Expected to occur (> 80% chance)"}
        ]'::jsonb,
        "impact_scale" jsonb NOT NULL DEFAULT '[
          {"value": 1, "label": "Negligible", "description": "Minimal impact on operations or objectives"},
          {"value": 2, "label": "Minor", "description": "Limited impact, easily recoverable"},
          {"value": 3, "label": "Moderate", "description": "Noticeable impact requiring management attention"},
          {"value": 4, "label": "Major", "description": "Significant impact on key objectives"},
          {"value": 5, "label": "Catastrophic", "description": "Severe impact threatening organizational survival"}
        ]'::jsonb,
        "max_acceptable_risk_score" integer NOT NULL DEFAULT 11,
        "risk_acceptance_authority" varchar(50) NOT NULL DEFAULT 'executive',
        "default_review_period_days" integer NOT NULL DEFAULT 90,
        "auto_calculate_risk_score" boolean NOT NULL DEFAULT true,
        "require_assessment_evidence" boolean NOT NULL DEFAULT false,
        "enable_risk_appetite" boolean NOT NULL DEFAULT true,
        "default_assessment_method" varchar(50) NOT NULL DEFAULT 'qualitative_5x5',
        "notify_on_high_risk" boolean NOT NULL DEFAULT true,
        "notify_on_critical_risk" boolean NOT NULL DEFAULT true,
        "notify_on_review_due" boolean NOT NULL DEFAULT true,
        "review_reminder_days" integer NOT NULL DEFAULT 7,
        "version" integer NOT NULL DEFAULT 1,
        "created_by" uuid,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_by" uuid,
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_risk_settings" PRIMARY KEY ("id")
      )
    `);

    // Create unique index on organization_id (only one settings per org)
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_risk_settings_organization" ON "risk_settings" ("organization_id")
    `);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "risk_settings" 
      ADD CONSTRAINT "FK_risk_settings_created_by" 
      FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "risk_settings" 
      ADD CONSTRAINT "FK_risk_settings_updated_by" 
      FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL
    `);

    // Insert default settings (no organization - global defaults)
    await queryRunner.query(`
      INSERT INTO "risk_settings" ("id", "organization_id")
      VALUES (uuid_generate_v4(), NULL)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "risk_settings" DROP CONSTRAINT IF EXISTS "FK_risk_settings_updated_by"
    `);
    
    await queryRunner.query(`
      ALTER TABLE "risk_settings" DROP CONSTRAINT IF EXISTS "FK_risk_settings_created_by"
    `);

    // Drop index
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_risk_settings_organization"
    `);

    // Drop table
    await queryRunner.query(`DROP TABLE IF EXISTS "risk_settings"`);
  }
}





