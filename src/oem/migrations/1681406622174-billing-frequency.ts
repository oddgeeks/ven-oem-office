import { MigrationInterface, QueryRunner } from 'typeorm';

export class billingFrequency1681406622174 implements MigrationInterface {
  name = 'billingFrequency1681406622174';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "oem"."oem_products_billing_frequency_enum" RENAME TO "oem_products_billing_frequency_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_products_billing_frequency_enum" AS ENUM('Bill-As-Consumed', 'Upfront', 'Weekly', 'Monthly (Calendar)', 'Annually (Calendar)', 'Custom')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ALTER COLUMN "billing_frequency" TYPE "oem"."oem_products_billing_frequency_enum" USING "billing_frequency"::"text"::"oem"."oem_products_billing_frequency_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "oem"."oem_products_billing_frequency_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(
    //   `CREATE TYPE "oem"."oem_products_billing_frequency_enum" AS ENUM'Upfront','Weekly','Bi-weekly','Monthly (Calendar)','Quarterly','Semi-Annually','Annually (Calendar)','Consumption-Based','Other / Custom','Every 30 Days','Every 31 Days','Every 90 Days','Every 365 Days',)`,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE "oem"."oem_products" ADD "billing_frequency" "oem"."oem_products_billing_frequency_enum"`,
    // );
  }
}
