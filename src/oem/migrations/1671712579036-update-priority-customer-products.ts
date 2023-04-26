import { MigrationInterface, QueryRunner } from 'typeorm';

export class updatePriorityCustomerProducts implements MigrationInterface {
  name = 'updatePriorityCustomerProducts1671712579036';

  public async up(queryRunner: QueryRunner): Promise<void> {
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
      `ALTER TABLE "oem"."oem_roles" DROP COLUMN "priority"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles" ADD "priority" SERIAL NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles" DROP COLUMN "priority"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles" ADD "priority" NOT NULL`,
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
  }
}
