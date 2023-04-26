import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeUniqnessForCompanyChannel1676040827045
  implements MigrationInterface
{
  name = 'removeUniqnessForCompanyChannel1676040827045';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "oem"."oem_customers_products_pkey"`);

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_programs" DROP CONSTRAINT "FK_94cd4d42abc977df4bb44485b54"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_companies" ALTER COLUMN "default_quote_expiration" SET DEFAULT '90'`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_companies" ALTER COLUMN "settings" SET DEFAULT '{"companyPrimaryColor":{"a":1,"b":187,"g":137,"r":74},"customListPriceName":"List Price","customCustomerPriceName":"Price To Customer"}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" DROP CONSTRAINT IF EXISTS "FK_92d17119739056d2abf91f79d23"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" DROP CONSTRAINT IF EXISTS "FK_5111ccd6df0946844b9422b9b0f"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" DROP CONSTRAINT IF EXISTS "REL_5111ccd6df0946844b9422b9b0"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channel_settings" DROP CONSTRAINT IF EXISTS "UQ_4acac686dd0626b8f26a38b7130"`,
    );

    await queryRunner.query(
      `CREATE INDEX "oem_customers_products_pkey" ON "oem"."oem_customers_products" ("customer_product_id") `,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_programs" ADD CONSTRAINT "FK_94cd4d42abc977df4bb44485b54" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" ADD CONSTRAINT "FK_92d17119739056d2abf91f79d23" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" ADD CONSTRAINT "FK_5111ccd6df0946844b9422b9b0f" FOREIGN KEY ("company_program_id") REFERENCES "oem"."oem_company_programs"("company_program_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" DROP CONSTRAINT "FK_5111ccd6df0946844b9422b9b0f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" DROP CONSTRAINT "FK_92d17119739056d2abf91f79d23"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_programs" DROP CONSTRAINT "FK_94cd4d42abc977df4bb44485b54"`,
    );

    await queryRunner.query(`DROP INDEX "oem"."oem_customers_products_pkey"`);

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channel_settings" ADD CONSTRAINT "UQ_4acac686dd0626b8f26a38b7130" UNIQUE ("name")`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" ADD CONSTRAINT "REL_5111ccd6df0946844b9422b9b0" UNIQUE ("company_program_id")`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" ADD CONSTRAINT "FK_5111ccd6df0946844b9422b9b0f" FOREIGN KEY ("company_program_id") REFERENCES "oem"."oem_company_programs"("company_program_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" ADD CONSTRAINT "FK_92d17119739056d2abf91f79d23" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_companies" ALTER COLUMN "settings" SET DEFAULT '{"companyPrimaryColor": {"a": 1, "b": 187, "g": 137, "r": 74}, "customListPriceName": "List Price", "customCustomerPriceName": "Price To Customer"}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_companies" ALTER COLUMN "default_quote_expiration" DROP DEFAULT`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_programs" ADD CONSTRAINT "FK_94cd4d42abc977df4bb44485b54" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `CREATE UNIQUE INDEX "oem_customers_products_pkey" ON "oem"."oem_customers_products" ("customer_product_id") `,
    );
  }
}
