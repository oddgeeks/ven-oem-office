import { MigrationInterface, QueryRunner } from 'typeorm';
import { DB_MAIN_DATABASE as DB_NAME } from '../../environments';

export class addCompanyChannelSettings1675737270326
  implements MigrationInterface
{
  name = 'addCompanyChannelSettings1675737270326';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" DROP CONSTRAINT "FK_d3565f3c55493d73c47281e2bb0"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_company_channels_channel_id_idx"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" RENAME COLUMN "channel_id" TO "company_channel_setting_id"`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_external_users_externalusertype_enum" AS ENUM('Distributor Contact', 'Distributor Sales', 'End Customer', 'Internal', 'Other', 'Partner Contact', 'Partner Sales', 'Technical Contact')`,
    );
    await queryRunner.query(
      `CREATE TABLE "oem"."oem_external_users" ("external_user_id" SERIAL NOT NULL, "company_id" integer NOT NULL DEFAULT current_setting('${DB_NAME}.current_tenant')::int, "company_organisation_name" character varying(64), "first_name" character varying(128) NOT NULL, "last_name" character varying(128) NOT NULL, "phone" character varying(36) NOT NULL, "email" character varying(256) NOT NULL, "externalUserType" "oem"."oem_external_users_externalusertype_enum" NOT NULL, "is_enabled" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_20477351201485bcd51578f777f" PRIMARY KEY ("external_user_id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "oem_external_users_pkey" ON "oem"."oem_external_users" ("external_user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_external_users_company_id_idx" ON "oem"."oem_external_users" ("company_id") `,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_quotes_external_users_type_enum" AS ENUM('End Customer', 'Partner Sales', 'Distributor Sales', 'Distributor Contact', 'Partner Contact', 'Technical Contact', 'Internal', 'Other')`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_quotes_external_users_approval_status_enum" AS ENUM('Draft', 'Pending Internal Approval', 'Auto-Approved', 'Approved', 'Sent Externally', 'Rejected', 'Expired', 'Transacted')`,
    );
    await queryRunner.query(
      `CREATE TABLE "oem"."oem_quotes_external_users" ("company_id" integer NOT NULL DEFAULT current_setting('${DB_NAME}.current_tenant')::int, "quote_id" integer NOT NULL, "external_user_id" integer NOT NULL, "type" "oem"."oem_quotes_external_users_type_enum" NOT NULL, "is_owner" boolean NOT NULL DEFAULT false, "is_approver" boolean NOT NULL DEFAULT false, "approval_status" "oem"."oem_quotes_external_users_approval_status_enum", "is_saved_alert_user" boolean NOT NULL DEFAULT false, "is_workflow_user" boolean NOT NULL DEFAULT true, "is_enabled" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_17452263c46ae1dedfd0e7467d3" PRIMARY KEY ("quote_id", "external_user_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_quotes_external_users_is_workflow_user_idx" ON "oem"."oem_quotes_external_users" ("is_workflow_user") `,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_quotes_external_users_is_saved_alert_user_idx" ON "oem"."oem_quotes_external_users" ("is_saved_alert_user") `,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_quotes_external_users_approval_status_idx" ON "oem"."oem_quotes_external_users" ("approval_status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_quotes_external_users_external_user_id_idx" ON "oem"."oem_quotes_external_users" ("external_user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_quotes_external_users_quote_id_idx" ON "oem"."oem_quotes_external_users" ("quote_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "oem"."oem_company_channel_settings" ("company_channel_setting_id" SERIAL NOT NULL, "logo_url" character varying(256), "channel_id" integer NOT NULL, "company_id" integer NOT NULL DEFAULT current_setting('${DB_NAME}.current_tenant')::int, "name" character varying(128) NOT NULL, "website" character varying(256), "contact_name" character varying(128) NOT NULL, "contact_email" character varying(256) NOT NULL, "contact_phone" character varying(24), "is_enabled" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_4acac686dd0626b8f26a38b7130" UNIQUE ("name"), CONSTRAINT "PK_062b6f99a7d321c6d25fefd4084" PRIMARY KEY ("company_channel_setting_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_company_channel_settings_is_enabled_idx" ON "oem"."oem_company_channel_settings" ("is_enabled") `,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_company_channel_settings_channel_id_idx" ON "oem"."oem_company_channel_settings" ("channel_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_company_channel_settings_company_id_idx" ON "oem"."oem_company_channel_settings" ("company_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "oem_company_channel_settings_pkey" ON "oem"."oem_company_channel_settings" ("company_channel_setting_id") `,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_companies" ALTER COLUMN "settings" SET DEFAULT '{"companyPrimaryColor":{"a":1,"b":187,"g":137,"r":74},"customListPriceName":"List Price","customCustomerPriceName":"Price To Customer"}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" DROP CONSTRAINT "FK_92d17119739056d2abf91f79d23"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" ADD CONSTRAINT "UQ_0a151a1de9f66cc588600cc48be" UNIQUE ("company_channel_setting_id")`,
    );

    await queryRunner.query(
      `CREATE INDEX "oem_company_channels_company_channel_setting_id_idx" ON "oem"."oem_company_channels" ("company_channel_setting_id") `,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_external_users" ADD CONSTRAINT "FK_7179f06982b5c3f5f24907730b8" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_external_users" ADD CONSTRAINT "FK_cd8a3c8be61a056f89ff2b0072f" FOREIGN KEY ("quote_id") REFERENCES "oem"."oem_quotes"("quote_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_external_users" ADD CONSTRAINT "FK_17be518f8fd2a0f25add1101aec" FOREIGN KEY ("external_user_id") REFERENCES "oem"."oem_external_users"("external_user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" ADD CONSTRAINT "FK_92d17119739056d2abf91f79d23" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" ADD CONSTRAINT "FK_0a151a1de9f66cc588600cc48be" FOREIGN KEY ("company_channel_setting_id") REFERENCES "oem"."oem_company_channel_settings"("company_channel_setting_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channel_settings" ADD CONSTRAINT "FK_dfcb3133bf24494cdc150f34290" FOREIGN KEY ("channel_id") REFERENCES "oem"."oem_channels"("channel_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channel_settings" DROP CONSTRAINT "FK_dfcb3133bf24494cdc150f34290"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" DROP CONSTRAINT "FK_0a151a1de9f66cc588600cc48be"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" DROP CONSTRAINT "FK_92d17119739056d2abf91f79d23"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_external_users" DROP CONSTRAINT "FK_17be518f8fd2a0f25add1101aec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_external_users" DROP CONSTRAINT "FK_cd8a3c8be61a056f89ff2b0072f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_external_users" DROP CONSTRAINT "FK_7179f06982b5c3f5f24907730b8"`,
    );

    await queryRunner.query(
      `DROP INDEX "oem"."oem_company_channels_company_channel_setting_id_idx"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" DROP CONSTRAINT "UQ_0a151a1de9f66cc588600cc48be"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" ALTER COLUMN "company_id" SET DEFAULT (current_setting('${DB_NAME}.current_tenant'))`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" ADD CONSTRAINT "FK_92d17119739056d2abf91f79d23" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `DROP INDEX "oem"."oem_company_channel_settings_pkey"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_company_channel_settings_company_id_idx"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_company_channel_settings_channel_id_idx"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_company_channel_settings_is_enabled_idx"`,
    );
    await queryRunner.query(`DROP TABLE "oem"."oem_company_channel_settings"`);
    await queryRunner.query(
      `DROP INDEX "oem"."oem_quotes_external_users_quote_id_idx"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_quotes_external_users_external_user_id_idx"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_quotes_external_users_approval_status_idx"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_quotes_external_users_is_saved_alert_user_idx"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_quotes_external_users_is_workflow_user_idx"`,
    );
    await queryRunner.query(`DROP TABLE "oem"."oem_quotes_external_users"`);
    await queryRunner.query(
      `DROP TYPE "oem"."oem_quotes_external_users_approval_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "oem"."oem_quotes_external_users_type_enum"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_external_users_company_id_idx"`,
    );
    await queryRunner.query(`DROP INDEX "oem"."oem_external_users_pkey"`);
    await queryRunner.query(`DROP TABLE "oem"."oem_external_users"`);
    await queryRunner.query(
      `DROP TYPE "oem"."oem_external_users_externalusertype_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" RENAME COLUMN "company_channel_setting_id" TO "channel_id"`,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_company_channels_channel_id_idx" ON "oem"."oem_company_channels" ("channel_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" ADD CONSTRAINT "FK_d3565f3c55493d73c47281e2bb0" FOREIGN KEY ("channel_id") REFERENCES "oem"."oem_channels"("channel_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
