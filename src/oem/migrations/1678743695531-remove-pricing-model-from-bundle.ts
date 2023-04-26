import { MigrationInterface, QueryRunner } from 'typeorm';

export class removePricingModelFromBundle1678743695531
  implements MigrationInterface
{
  name = 'removePricingModelFromBundle1678743695531';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" DROP CONSTRAINT "FK_ad976b8b5d2898f834d4a102ee7"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "oem"."oem_products_pricing_model_id_idx"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" DROP COLUMN "pricing_model_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ADD "pricing_model_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_pricing_models" DROP CONSTRAINT "FK_e87a13cefe49077059dc9eba56a"`,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_products_pricing_model_id_idx" ON "oem"."oem_products" ("pricing_model_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ADD CONSTRAINT "FK_ad976b8b5d2898f834d4a102ee7" FOREIGN KEY ("pricing_model_id") REFERENCES "oem"."oem_pricing_models"("pricing_model_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_pricing_models" ADD CONSTRAINT "FK_e87a13cefe49077059dc9eba56a" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_pricing_models" DROP CONSTRAINT "FK_e87a13cefe49077059dc9eba56a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" DROP CONSTRAINT "FK_ad976b8b5d2898f834d4a102ee7"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."IDX_ec94be417de8acc5a059e51aa5"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_products_pricing_model_id_idx"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_pricing_models" ADD CONSTRAINT "FK_e87a13cefe49077059dc9eba56a" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" DROP COLUMN "pricing_model_id"`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "oem_products_pkey" ON "oem"."oem_products" ("product_id", "company_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ADD "pricing_model_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_products_pricing_model_id_idx" ON "oem"."oem_products" ("pricing_model_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ADD CONSTRAINT "FK_ad976b8b5d2898f834d4a102ee7" FOREIGN KEY ("pricing_model_id") REFERENCES "oem"."oem_pricing_models"("pricing_model_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
