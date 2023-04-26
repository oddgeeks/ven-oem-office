import { MigrationInterface, QueryRunner } from 'typeorm';

export class addSfOpportunityProductId1682017543270
  implements MigrationInterface
{
  name = 'addSfOpportunityProductId1682017543270';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_products" ADD "sf_opportunity_product_id" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_products" DROP COLUMN "sf_opportunity_product_id"`,
    );
  }
}
