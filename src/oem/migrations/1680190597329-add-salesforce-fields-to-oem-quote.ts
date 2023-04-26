import { MigrationInterface, QueryRunner } from 'typeorm';

export class addSalesforceFieldsToOemQuote1680190597329
  implements MigrationInterface
{
  name = 'addSalesforceFieldsToOemQuote1680190597329';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ADD "original_user_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ADD "last_modifier_user_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ADD "sf_quote_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ADD "sf_contract_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ADD "gross_margin_percent" numeric(16,2) DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ADD "signed_date" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ADD "approved_date" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ADD "total_discount" numeric(16,2) DEFAULT '0'`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_quotes_delivery_status_enum" AS ENUM('Pending')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ADD "delivery_status" "oem"."oem_quotes_delivery_status_enum" NOT NULL DEFAULT 'Pending'`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ADD "is_auto_renew" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" DROP COLUMN "is_auto_renew"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" DROP COLUMN "delivery_status"`,
    );
    await queryRunner.query(
      `DROP TYPE "oem"."oem_quotes_delivery_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" DROP COLUMN "total_discount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" DROP COLUMN "approved_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" DROP COLUMN "signed_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" DROP COLUMN "gross_margin_percent"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" DROP COLUMN "sf_contract_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" DROP COLUMN "sf_quote_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" DROP COLUMN "last_modifier_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" DROP COLUMN "original_user_id"`,
    );
  }
}
