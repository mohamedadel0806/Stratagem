import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDashboardEmailSchedulesTable1766420180715 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "dashboard_email_schedules" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(255) NOT NULL,
                "description" text,
                "frequency" character varying(20) NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly')),
                "day_of_week" character varying(20) CHECK ("day_of_week" IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
                "day_of_month" integer CHECK ("day_of_month" >= 1 AND "day_of_month" <= 31),
                "send_time" TIME NOT NULL,
                "recipient_emails" text NOT NULL,
                "is_active" boolean NOT NULL DEFAULT true,
                "created_by_id" uuid NOT NULL,
                "updated_by_id" uuid,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "last_sent_at" TIMESTAMP,
                CONSTRAINT "PK_dashboard_email_schedules" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "dashboard_email_schedules"
            ADD CONSTRAINT "FK_dashboard_email_schedules_created_by_id"
            FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "dashboard_email_schedules"
            ADD CONSTRAINT "FK_dashboard_email_schedules_updated_by_id"
            FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "dashboard_email_schedules"`);
    }

}
