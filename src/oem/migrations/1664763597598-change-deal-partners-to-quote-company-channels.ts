import { MigrationInterface, QueryRunner } from 'typeorm';
import { DB_MAIN_DATABASE as DB_NAME } from '../../environments';

export class changeDealPartnersToQuoteCompanyChannels1664763597598
  implements MigrationInterface
{
  name = 'changeDealPartnersToQuoteCompanyChannels1664763597598';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" DROP CONSTRAINT "FK_36f212b923905c0f743ba7bf65c"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_quotes_deal_partner_id_idx"`,
    );
    await queryRunner.query(
      `CREATE TABLE "oem"."oem_quote_company_channels" ("quote_id" integer NOT NULL, "company_channel_id" integer NOT NULL, "company_id" integer NOT NULL DEFAULT current_setting('${DB_NAME}.current_tenant')::int, "is_active" boolean NOT NULL DEFAULT true, "is_enabled" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_e1dd931cc9a935c1f983d11ab56" PRIMARY KEY ("quote_id", "company_channel_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_quote_company_channels_company_channel_id_idx" ON "oem"."oem_quote_company_channels" ("company_channel_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_quote_company_channels_quote_id_idx" ON "oem"."oem_quote_company_channels" ("quote_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" DROP COLUMN "deal_partner_id"`,
    );
    await queryRunner.query(`DROP TABLE "oem"."oem_deal_partners"`);
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" ADD "licensing_program_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" ADD CONSTRAINT "UQ_f0f0dacddcebe12214e3205c149" UNIQUE ("licensing_program_id")`,
    );
    await queryRunner.query(
      `ALTER TYPE "oem"."oem_licensing_programs_licensing_program_type_enum" RENAME TO "oem_licensing_programs_licensing_program_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_licensing_programs_licensing_program_type_enum" AS ENUM('Customer', 'Reseller', 'Distributor')`,
    );
    const licensingProgramDeleteResult = await queryRunner.query(
      `DELETE FROM "oem"."oem_licensing_programs" WHERE licensing_program_type = 'Partner'`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_licensing_programs" ALTER COLUMN "licensing_program_type" TYPE "oem"."oem_licensing_programs_licensing_program_type_enum" USING "licensing_program_type"::"text"::"oem"."oem_licensing_programs_licensing_program_type_enum"`,
    );
    if (licensingProgramDeleteResult && licensingProgramDeleteResult[1]) {
      await queryRunner.query(
        `INSERT INTO "oem"."oem_licensing_programs"(licensing_program_id, licensing_program_type, licensing_program_name, company_id, discount) VALUES(2, 'Reseller', 'reseller', 1, 0.15)`,
      );
    }
    await queryRunner.query(
      `DROP TYPE "oem"."oem_licensing_programs_licensing_program_type_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TYPE "oem"."oem_company_channels_channel_type_enum" RENAME TO "oem_company_channels_channel_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_company_channels_channel_type_enum" AS ENUM('Reseller', 'Distributor')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" ALTER COLUMN "channel_type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `UPDATE "oem"."oem_users" SET company_channel_id = NULL WHERE company_channel_id IS NOT NULL`,
    );
    const companyChannelDeleteResult = await queryRunner.query(
      `DELETE FROM "oem"."oem_company_channels" WHERE channel_type = 'Partner'`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" ALTER COLUMN "channel_type" TYPE "oem"."oem_company_channels_channel_type_enum" USING "channel_type"::"text"::"oem"."oem_company_channels_channel_type_enum"`,
    );
    if (companyChannelDeleteResult && companyChannelDeleteResult[1]) {
      await queryRunner.query(
        `INSERT INTO "oem"."oem_company_channels"(company_channel_id, company_id, channel_id, geo_hierarchy_id, company_program_id, channel_type) VALUES(1, 1, 1, 1, 1, 'Reseller')`,
      );
    }
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" ALTER COLUMN "channel_type" SET DEFAULT 'Reseller'`,
    );
    await queryRunner.query(
      `DROP TYPE "oem"."oem_company_channels_channel_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_company_channels_licensing_program_id_idx" ON "oem"."oem_company_channels" ("licensing_program_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quote_company_channels" ADD CONSTRAINT "FK_c76163612cfc01af972c4574dca" FOREIGN KEY ("quote_id") REFERENCES "oem"."oem_quotes"("quote_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quote_company_channels" ADD CONSTRAINT "FK_bad85b9168fe6756475baa74563" FOREIGN KEY ("company_channel_id") REFERENCES "oem"."oem_company_channels"("company_channel_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quote_company_channels" DROP CONSTRAINT "FK_bad85b9168fe6756475baa74563"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quote_company_channels" DROP CONSTRAINT "FK_c76163612cfc01af972c4574dca"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_company_channels_licensing_program_id_idx"`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_company_channels_channel_type_enum_old" AS ENUM('Partner', 'Distributer')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" ALTER COLUMN "channel_type" DROP DEFAULT`,
    );
    const companyChannelDeleteResult = await queryRunner.query(
      `DELETE FROM "oem"."oem_company_channels" WHERE channel_type = 'Reseller'`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" ALTER COLUMN "channel_type" TYPE "oem"."oem_company_channels_channel_type_enum_old" USING "channel_type"::"text"::"oem"."oem_company_channels_channel_type_enum_old"`,
    );
    if (companyChannelDeleteResult && companyChannelDeleteResult[1]) {
      await queryRunner.query(
        `INSERT INTO "oem"."oem_company_channels"(company_channel_id, company_id, channel_id, geo_hierarchy_id, company_program_id, channel_type) VALUES(1, 1, 1, 1, 1, 'Partner')`,
      );
    }
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" ALTER COLUMN "channel_type" SET DEFAULT 'Partner'`,
    );
    await queryRunner.query(
      `DROP TYPE "oem"."oem_company_channels_channel_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "oem"."oem_company_channels_channel_type_enum_old" RENAME TO "oem_company_channels_channel_type_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_licensing_programs_licensing_program_type_enum_old" AS ENUM('Customer', 'Partner', 'Distributor')`,
    );
    const licensingProgramDeleteResult = await queryRunner.query(
      `DELETE FROM "oem"."oem_licensing_programs" WHERE licensing_program_type = 'Reseller'`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_licensing_programs" ALTER COLUMN "licensing_program_type" TYPE "oem"."oem_licensing_programs_licensing_program_type_enum_old" USING "licensing_program_type"::"text"::"oem"."oem_licensing_programs_licensing_program_type_enum_old"`,
    );
    if (licensingProgramDeleteResult && licensingProgramDeleteResult[1]) {
      await queryRunner.query(
        `INSERT INTO "oem"."oem_licensing_programs"(licensing_program_id, licensing_program_type, licensing_program_name, company_id, discount) VALUES(2, 'Partner', 'reseller', 1, 0.15)`,
      );
    }
    await queryRunner.query(
      `DROP TYPE "oem"."oem_licensing_programs_licensing_program_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "oem"."oem_licensing_programs_licensing_program_type_enum_old" RENAME TO "oem_licensing_programs_licensing_program_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" DROP CONSTRAINT "UQ_f0f0dacddcebe12214e3205c149"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" DROP COLUMN "licensing_program_id"`,
    );
    await queryRunner.query(
      `CREATE TABLE "oem"."oem_deal_partners" ("deal_partner_id" SERIAL NOT NULL, "distributor_licensing_program_id" integer NOT NULL, "reseller_licensing_program_id" integer NOT NULL, "distributor_name" character varying(128) NOT NULL, "reseller_name" character varying(128) NOT NULL, "is_enabled" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_4f5efaa7acfdd588c6dbb20aaa6" PRIMARY KEY ("deal_partner_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_deal_partners_reseller_licensing_program_id_idx" ON "oem"."oem_deal_partners" ("reseller_licensing_program_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_deal_partners_distributor_licensing_program_id_idx" ON "oem"."oem_deal_partners" ("distributor_licensing_program_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "oem_deal_partners_pkey" ON "oem"."oem_deal_partners" ("deal_partner_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_deal_partners" ADD CONSTRAINT "FK_d4255fa71d57c25ab40f68cf602" FOREIGN KEY ("distributor_licensing_program_id") REFERENCES "oem"."oem_licensing_programs"("licensing_program_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_deal_partners" ADD CONSTRAINT "FK_270d6ca78f6b564f07cbefb60bf" FOREIGN KEY ("reseller_licensing_program_id") REFERENCES "oem"."oem_licensing_programs"("licensing_program_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ADD "deal_partner_id" integer`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_quote_company_channels_quote_id_idx"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_quote_company_channels_company_channel_id_idx"`,
    );
    await queryRunner.query(`DROP TABLE "oem"."oem_quote_company_channels"`);
    await queryRunner.query(
      `CREATE INDEX "oem_quotes_deal_partner_id_idx" ON "oem"."oem_quotes" ("deal_partner_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ADD CONSTRAINT "FK_36f212b923905c0f743ba7bf65c" FOREIGN KEY ("deal_partner_id") REFERENCES "oem"."oem_deal_partners"("deal_partner_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }
}
