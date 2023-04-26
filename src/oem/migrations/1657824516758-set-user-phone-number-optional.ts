import { MigrationInterface, QueryRunner } from 'typeorm';

export class setUserPhoneNumberOptional1657824516758
  implements MigrationInterface
{
  name = 'setUserPhoneNumberOptional1657824516758';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_unit_tiers" ALTER COLUMN "start_range" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_unit_tiers" ALTER COLUMN "end_range" TYPE numeric`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_users_sso_login_email_phone_key"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_users" ALTER COLUMN "phone" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_products" ALTER COLUMN "quantity" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" ALTER COLUMN "quantity" TYPE numeric`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "oem_users_sso_login_email_phone_key" ON "oem"."oem_users" ("phone", "sso_login_email") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "oem"."oem_users_sso_login_email_phone_key"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" ALTER COLUMN "quantity" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_products" ALTER COLUMN "quantity" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_users" ALTER COLUMN "phone" SET NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "oem_users_sso_login_email_phone_key" ON "oem"."oem_users" ("sso_login_email", "phone") `,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_unit_tiers" ALTER COLUMN "end_range" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_unit_tiers" ALTER COLUMN "start_range" TYPE numeric`,
    );
  }
}
