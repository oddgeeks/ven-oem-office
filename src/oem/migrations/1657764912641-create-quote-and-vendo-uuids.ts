import { MigrationInterface, QueryRunner } from 'typeorm';

export class createQuoteAndVendoUuids1657764912641
  implements MigrationInterface
{
  name = 'createQuoteAndVendoUuids1657764912641';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_quote_and_vendo_uuids_quote_and_vendo_uuid_type_enum" AS ENUM('Quote', 'Vendo')`,
    );
    await queryRunner.query(
      `CREATE TABLE "oem"."oem_quote_and_vendo_uuids" ("quote_and_vendo_uuid_type" "oem"."oem_quote_and_vendo_uuids_quote_and_vendo_uuid_type_enum" NOT NULL DEFAULT 'Quote', "company_id" integer NOT NULL, "prefix" character varying NOT NULL DEFAULT 'Q-', "last_uuid" integer NOT NULL DEFAULT '1', "is_enabled" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_1c3d09dc7c17faf33b1e35529e1" PRIMARY KEY ("quote_and_vendo_uuid_type"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_quote_and_vendo_uuid_last_uuid_idx" ON "oem"."oem_quote_and_vendo_uuids" ("last_uuid") `,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_quote_and_vendo_uuid_company_id_idx" ON "oem"."oem_quote_and_vendo_uuids" ("company_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "oem_quote_and_vendo_uuid_pkey" ON "oem"."oem_quote_and_vendo_uuids" ("quote_and_vendo_uuid_type") `,
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
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quote_and_vendo_uuids" ADD CONSTRAINT "FK_1d091dd76b7dd1d2728bc248c6b" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quote_and_vendo_uuids" DROP CONSTRAINT "FK_1d091dd76b7dd1d2728bc248c6b"`,
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
    await queryRunner.query(`DROP INDEX "oem"."oem_quote_and_vendo_uuid_pkey"`);
    await queryRunner.query(
      `DROP INDEX "oem"."oem_quote_and_vendo_uuid_company_id_idx"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_quote_and_vendo_uuid_last_uuid_idx"`,
    );
    await queryRunner.query(`DROP TABLE "oem"."oem_quote_and_vendo_uuids"`);
    await queryRunner.query(
      `DROP TYPE "oem"."oem_quote_and_vendo_uuids_quote_and_vendo_uuid_type_enum"`,
    );
  }
}
