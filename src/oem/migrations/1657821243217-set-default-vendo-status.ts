import { MigrationInterface, QueryRunner } from 'typeorm';

export class setDefaultVendoStatus1657821243217 implements MigrationInterface {
  name = 'setDefaultVendoStatus1657821243217';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos" ALTER COLUMN "vendo_status" SET DEFAULT 'Draft'`,
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
      `ALTER TABLE "oem"."oem_vendos" ALTER COLUMN "vendo_status" DROP DEFAULT`,
    );
  }
}
