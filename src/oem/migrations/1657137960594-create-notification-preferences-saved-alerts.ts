import { MigrationInterface, QueryRunner } from 'typeorm';

export class createNotificationPreferencesSavedAlerts1657137960594
  implements MigrationInterface
{
  name = 'createNotificationPreferencesSavedAlerts1657137960594';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "oem"."oem_saved_alert_rules" ("saved_alert_rule_id" SERIAL NOT NULL, "company_id" integer NOT NULL, "user_id" integer NOT NULL, "name" character varying(256) NOT NULL, "rule_logic" jsonb NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "is_catch_all" boolean NOT NULL DEFAULT false, "is_enabled" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_f25200240b09658e91145dd8b73" PRIMARY KEY ("saved_alert_rule_id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "oem_saved_alert_rules_pkey" ON "oem"."oem_saved_alert_rules" ("saved_alert_rule_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_saved_alert_rules_user_id_idx" ON "oem"."oem_saved_alert_rules" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_saved_alert_rules_company_id_idx" ON "oem"."oem_saved_alert_rules" ("company_id") `,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_notification_preferences_change_frequency_type_enum" AS ENUM('Never', 'Immediately', 'Daily', 'Weekly', 'Monthly')`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_notification_preferences_approval_frequency_type_enum" AS ENUM('Never', 'Immediately', 'Daily', 'Weekly', 'Monthly')`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_notification_preferences_transaction_frequency_type_enum" AS ENUM('Never', 'Immediately', 'Daily', 'Weekly', 'Monthly')`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_notification_preferences_submission_frequency_type_enum" AS ENUM('Never', 'Immediately', 'Daily', 'Weekly', 'Monthly')`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_notification_preferences_weekly_frequency_value_enum" AS ENUM('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_notification_preferences_monthly_frequency_value_enum" AS ENUM('1st day of Month', '15th day of Month', 'Last day of Month')`,
    );
    await queryRunner.query(
      `CREATE TABLE "oem"."oem_notification_preferences" ("user_id" integer NOT NULL, "company_id" integer NOT NULL, "change_frequency_type" "oem"."oem_notification_preferences_change_frequency_type_enum" NOT NULL DEFAULT 'Immediately', "approval_frequency_type" "oem"."oem_notification_preferences_approval_frequency_type_enum" NOT NULL DEFAULT 'Immediately', "transaction_frequency_type" "oem"."oem_notification_preferences_transaction_frequency_type_enum" NOT NULL DEFAULT 'Immediately', "submission_frequency_type" "oem"."oem_notification_preferences_submission_frequency_type_enum" NOT NULL DEFAULT 'Immediately', "daily_frequency_value" character varying(8) NOT NULL DEFAULT '12:00 AM', "weekly_frequency_value" "oem"."oem_notification_preferences_weekly_frequency_value_enum" NOT NULL DEFAULT 'Monday', "monthly_frequency_value" "oem"."oem_notification_preferences_monthly_frequency_value_enum" NOT NULL DEFAULT '1st day of Month', "is_active" boolean NOT NULL DEFAULT true, "is_enabled" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "REL_38d194211b55e13e69fbe0371c" UNIQUE ("user_id"), CONSTRAINT "PK_38d194211b55e13e69fbe0371c1" PRIMARY KEY ("user_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_notification_preferences_company_id_idx" ON "oem"."oem_notification_preferences" ("company_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "oem_notification_preferences_pkey" ON "oem"."oem_notification_preferences" ("user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_unit_tiers" ALTER COLUMN "start_range" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_unit_tiers" ALTER COLUMN "end_range" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_products" ALTER COLUMN "quantity" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" ALTER COLUMN "quantity" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_saved_alert_rules" ADD CONSTRAINT "FK_0f888ce595cd4ee5a65d3c1f1e8" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_saved_alert_rules" ADD CONSTRAINT "FK_1d194e145ca362b5e050dddbc0f" FOREIGN KEY ("user_id") REFERENCES "oem"."oem_users"("user_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_notification_preferences" ADD CONSTRAINT "FK_86353525ec76a6bdd0d5caaa685" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_notification_preferences" ADD CONSTRAINT "FK_38d194211b55e13e69fbe0371c1" FOREIGN KEY ("user_id") REFERENCES "oem"."oem_users"("user_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_notification_preferences" DROP CONSTRAINT "FK_38d194211b55e13e69fbe0371c1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_notification_preferences" DROP CONSTRAINT "FK_86353525ec76a6bdd0d5caaa685"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_saved_alert_rules" DROP CONSTRAINT "FK_1d194e145ca362b5e050dddbc0f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_saved_alert_rules" DROP CONSTRAINT "FK_0f888ce595cd4ee5a65d3c1f1e8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" ALTER COLUMN "quantity" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_products" ALTER COLUMN "quantity" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_unit_tiers" ALTER COLUMN "end_range" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_unit_tiers" ALTER COLUMN "start_range" TYPE numeric`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_notification_preferences_pkey"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_notification_preferences_company_id_idx"`,
    );
    await queryRunner.query(`DROP TABLE "oem"."oem_notification_preferences"`);
    await queryRunner.query(
      `DROP TYPE "oem"."oem_notification_preferences_monthly_frequency_value_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "oem"."oem_notification_preferences_weekly_frequency_value_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "oem"."oem_notification_preferences_submission_frequency_type_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "oem"."oem_notification_preferences_transaction_frequency_type_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "oem"."oem_notification_preferences_approval_frequency_type_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "oem"."oem_notification_preferences_change_frequency_type_enum"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_saved_alert_rules_company_id_idx"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_saved_alert_rules_user_id_idx"`,
    );
    await queryRunner.query(`DROP INDEX "oem"."oem_saved_alert_rules_pkey"`);
    await queryRunner.query(`DROP TABLE "oem"."oem_saved_alert_rules"`);
  }
}
