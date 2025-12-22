"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAlertSystemTables1766424737102 = void 0;
class CreateAlertSystemTables1766424737102 {
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "alerts" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying(255) NOT NULL,
                "description" text NOT NULL,
                "type" character varying(50) NOT NULL CHECK (type IN ('policy_review_overdue', 'control_assessment_past_due', 'sop_execution_failure', 'audit_finding', 'compliance_violation', 'risk_threshold_exceeded', 'custom')),
                "severity" character varying(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
                "status" character varying(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved', 'dismissed')),
                "metadata" jsonb,
                "related_entity_id" uuid,
                "related_entity_type" character varying(100),
                "created_by_id" uuid NOT NULL,
                "acknowledged_by_id" uuid,
                "acknowledged_at" TIMESTAMP,
                "resolved_by_id" uuid,
                "resolved_at" TIMESTAMP,
                "resolution_notes" text,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_alerts" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "alert_rules" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(255) NOT NULL,
                "description" text,
                "is_active" boolean NOT NULL DEFAULT true,
                "trigger_type" character varying(20) NOT NULL CHECK (trigger_type IN ('time_based', 'threshold_based', 'status_change', 'custom_condition')),
                "entity_type" character varying(100) NOT NULL,
                "field_name" character varying(100),
                "condition" character varying(20) NOT NULL CHECK (condition IN ('equals', 'not_equals', 'greater_than', 'less_than', 'contains', 'not_contains', 'is_null', 'is_not_null', 'days_overdue', 'status_equals')),
                "condition_value" text,
                "threshold_value" integer,
                "severity_score" integer NOT NULL DEFAULT 1,
                "alert_message" character varying(500),
                "filters" jsonb,
                "created_by_id" uuid NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_alert_rules" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "alert_subscriptions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "user_id" uuid NOT NULL,
                "alert_type" character varying(50) CHECK (alert_type IN ('policy_review_overdue', 'control_assessment_past_due', 'sop_execution_failure', 'audit_finding', 'compliance_violation', 'risk_threshold_exceeded', 'custom')),
                "severity" character varying(20) CHECK (severity IN ('low', 'medium', 'high', 'critical')),
                "channels" text NOT NULL,
                "frequency" character varying(20) NOT NULL DEFAULT 'immediate' CHECK (frequency IN ('immediate', 'daily', 'weekly')),
                "is_active" boolean NOT NULL DEFAULT true,
                "filters" jsonb,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_alert_subscriptions" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "alert_logs" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "alert_id" uuid NOT NULL,
                "action" character varying(20) NOT NULL CHECK (action IN ('created', 'acknowledged', 'resolved', 'dismissed', 'escalated', 'notified')),
                "user_id" uuid,
                "details" text,
                "metadata" jsonb,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_alert_logs" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "alert_subscriptions"
            ADD CONSTRAINT "UQ_alert_subscriptions_user_type_severity"
            UNIQUE ("user_id", "alert_type", "severity")
        `);
        await queryRunner.query(`
            ALTER TABLE "alerts"
            ADD CONSTRAINT "FK_alerts_created_by_id"
            FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "alerts"
            ADD CONSTRAINT "FK_alerts_acknowledged_by_id"
            FOREIGN KEY ("acknowledged_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "alerts"
            ADD CONSTRAINT "FK_alerts_resolved_by_id"
            FOREIGN KEY ("resolved_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "alert_rules"
            ADD CONSTRAINT "FK_alert_rules_created_by_id"
            FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "alert_subscriptions"
            ADD CONSTRAINT "FK_alert_subscriptions_user_id"
            FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "alert_logs"
            ADD CONSTRAINT "FK_alert_logs_alert_id"
            FOREIGN KEY ("alert_id") REFERENCES "alerts"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "alert_logs"
            ADD CONSTRAINT "FK_alert_logs_user_id"
            FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "alert_logs"`);
        await queryRunner.query(`DROP TABLE "alert_subscriptions"`);
        await queryRunner.query(`DROP TABLE "alert_rules"`);
        await queryRunner.query(`DROP TABLE "alerts"`);
    }
}
exports.CreateAlertSystemTables1766424737102 = CreateAlertSystemTables1766424737102;
//# sourceMappingURL=1766424737102-CreateAlertSystemTables.js.map