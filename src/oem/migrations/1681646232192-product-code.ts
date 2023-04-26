import { MigrationInterface, QueryRunner } from 'typeorm';

export class productCode1681646232192 implements MigrationInterface {
  name = 'productCode1681646232192';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ADD "product_code" character varying(64)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" DROP COLUMN "product_code"`,
    );
  }
}
