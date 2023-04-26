import { MigrationInterface, QueryRunner } from 'typeorm';

export class addCustomBilllingFrequency1677770968922
  implements MigrationInterface
{
  name = 'addCustomBilllingFrequency1677770968922';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ADD "custom_billing_frequency_settings" jsonb NOT NULL DEFAULT '[]'`,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_products_pricing_model_id_idx" ON "oem"."oem_products" ("pricing_model_id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "oem"."oem_products_pricing_model_id_idx"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" DROP COLUMN "custom_billing_frequency_settings"`,
    );
  }
}
