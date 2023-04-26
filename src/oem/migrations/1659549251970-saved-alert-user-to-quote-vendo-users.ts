import { MigrationInterface, QueryRunner } from 'typeorm';

export class savedAlertUserToQuoteVendoUsers1659549251970
  implements MigrationInterface
{
  name = 'savedAlertUserToQuoteVendoUsers1659549251970';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_vendos_users_approval_status_enum" AS ENUM('Draft', 'Pending', 'Auto-Approved', 'Approved', 'Rejected', 'Expired', 'Transacted')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos_users" ADD "approval_status" "oem"."oem_vendos_users_approval_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos_users" ADD "is_saved_alert_user" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos_users" ADD "is_workflow_user" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_quotes_users_approval_status_enum" AS ENUM('Draft', 'Pending', 'Auto-Approved', 'Approved', 'Rejected', 'Expired', 'Transacted')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_users" ADD "approval_status" "oem"."oem_quotes_users_approval_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_users" ADD "is_saved_alert_user" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_users" ADD "is_workflow_user" boolean NOT NULL DEFAULT true`,
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
      `CREATE INDEX "oem_vendos_users_is_workflow_user_idx" ON "oem"."oem_vendos_users" ("is_workflow_user") `,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_vendos_users_is_saved_alert_user_idx" ON "oem"."oem_vendos_users" ("is_saved_alert_user") `,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_vendos_users_approval_status_idx" ON "oem"."oem_vendos_users" ("approval_status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_quotes_users_is_workflow_user_idx" ON "oem"."oem_quotes_users" ("is_workflow_user") `,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_quotes_users_is_saved_alert_user_idx" ON "oem"."oem_quotes_users" ("is_saved_alert_user") `,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_quotes_users_approval_status_idx" ON "oem"."oem_quotes_users" ("approval_status") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "oem"."oem_quotes_users_approval_status_idx"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_quotes_users_is_saved_alert_user_idx"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_quotes_users_is_workflow_user_idx"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_vendos_users_approval_status_idx"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_vendos_users_is_saved_alert_user_idx"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_vendos_users_is_workflow_user_idx"`,
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
      `ALTER TABLE "oem"."oem_quotes_users" DROP COLUMN "is_workflow_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_users" DROP COLUMN "is_saved_alert_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_users" DROP COLUMN "approval_status"`,
    );
    await queryRunner.query(
      `DROP TYPE "oem"."oem_quotes_users_approval_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos_users" DROP COLUMN "is_workflow_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos_users" DROP COLUMN "is_saved_alert_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos_users" DROP COLUMN "approval_status"`,
    );
    await queryRunner.query(
      `DROP TYPE "oem"."oem_vendos_users_approval_status_enum"`,
    );
  }
}
