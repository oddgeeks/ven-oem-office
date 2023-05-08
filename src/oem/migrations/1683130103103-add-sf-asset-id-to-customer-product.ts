import { MigrationInterface, QueryRunner } from 'typeorm';

export class addSfAssetIdToCustomerProduct1683130103103
  implements MigrationInterface
{
  name = 'addSfAssetIdToCustomerProduct1683130103103';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" ADD "sf_parent_asset_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" ADD "sf_asset_id" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" DROP COLUMN "sf_asset_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" DROP COLUMN "sf_parent_asset_id"`,
    );
  }
}
