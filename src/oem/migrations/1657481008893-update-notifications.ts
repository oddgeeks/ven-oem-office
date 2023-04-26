import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateNotifications1657481008893 implements MigrationInterface {
  name = 'updateNotifications1657481008893';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_notifications" ADD "batched_at" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_notifications" ALTER COLUMN "subject" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_notifications" ALTER COLUMN "meta_data" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_unit_tiers" ALTER COLUMN "start_range" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_unit_tiers" ALTER COLUMN "end_range" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_notification_preferences" DROP CONSTRAINT "FK_38d194211b55e13e69fbe0371c1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_notification_preferences" ADD CONSTRAINT "UQ_38d194211b55e13e69fbe0371c1" UNIQUE ("user_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_products" ALTER COLUMN "quantity" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" ALTER COLUMN "quantity" TYPE numeric`,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_notifications_notification_type_idx" ON "oem"."oem_notifications" ("notification_type") `,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_notifications_status_idx" ON "oem"."oem_notifications" ("status") `,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_notification_preferences" ADD CONSTRAINT "FK_38d194211b55e13e69fbe0371c1" FOREIGN KEY ("user_id") REFERENCES "oem"."oem_users"("user_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_notification_preferences" DROP CONSTRAINT "FK_38d194211b55e13e69fbe0371c1"`,
    );
    await queryRunner.query(`DROP INDEX "oem"."oem_notifications_status_idx"`);
    await queryRunner.query(
      `DROP INDEX "oem"."oem_notifications_notification_type_idx"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" ALTER COLUMN "quantity" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_products" ALTER COLUMN "quantity" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_notification_preferences" DROP CONSTRAINT "UQ_38d194211b55e13e69fbe0371c1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_notification_preferences" ADD CONSTRAINT "FK_38d194211b55e13e69fbe0371c1" FOREIGN KEY ("user_id") REFERENCES "oem"."oem_users"("user_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_unit_tiers" ALTER COLUMN "end_range" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_unit_tiers" ALTER COLUMN "start_range" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_notifications" ALTER COLUMN "meta_data" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_notifications" ALTER COLUMN "subject" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_notifications" DROP COLUMN "batched_at"`,
    );
  }
}
