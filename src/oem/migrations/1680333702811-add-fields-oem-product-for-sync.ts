import { MigrationInterface, QueryRunner } from 'typeorm';

export class addFieldsOemProductForSync1680333702811
  implements MigrationInterface
{
  name = 'addFieldsOemProductForSync1680333702811';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ADD "sf_product_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ADD "sf_price_book_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ADD "display_url" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ADD "last_modifier_user_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ADD "product_description" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" DROP COLUMN "product_description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" DROP COLUMN "last_modifier_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" DROP COLUMN "display_url"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" DROP COLUMN "sf_price_book_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" DROP COLUMN "sf_product_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" DROP COLUMN "billing_frequency"`,
    );
  }
}
