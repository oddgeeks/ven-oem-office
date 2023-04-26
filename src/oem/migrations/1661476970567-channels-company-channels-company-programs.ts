import { MigrationInterface, QueryRunner } from 'typeorm';
import { DB_MAIN_DATABASE as DB_NAME } from '../../environments';
import { DB_MAIN_USERNAME as DB_USER } from '../../environments';

export class channelsCompanyChannelsCompanyPrograms1661476970567
  implements MigrationInterface
{
  name = 'channelsCompanyChannelsCompanyPrograms1661476970567';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "oem"."oem_company_programs" ("company_program_id" SERIAL NOT NULL, "company_id" integer NOT NULL DEFAULT current_setting('${DB_NAME}.current_tenant')::int, "channel_id" integer NOT NULL, "name" character varying(128) NOT NULL, "is_enabled" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_83cef497764e8cb144d959b6e58" PRIMARY KEY ("company_program_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_company_programs_is_enabled_idx" ON "oem"."oem_company_programs" ("is_enabled") `,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_company_programs_channel_id_idx" ON "oem"."oem_company_programs" ("channel_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_company_programs_company_id_idx" ON "oem"."oem_company_programs" ("company_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "oem_company_programs_pkey" ON "oem"."oem_company_programs" ("company_program_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "oem"."oem_channels" ("channel_id" SERIAL NOT NULL, "logo_url" character varying(256), "name" character varying(128) NOT NULL, "website" character varying(256), "contact_name" character varying(128) NOT NULL, "contact_email" character varying(128) NOT NULL, "contact_phone" character varying(24), "is_active" boolean NOT NULL DEFAULT true, "is_enabled" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_4161ce251aaf1e23ad072dfc8bb" UNIQUE ("name"), CONSTRAINT "PK_e59feaa4111fe76d64192364e89" PRIMARY KEY ("channel_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_channels_is_enabled_idx" ON "oem"."oem_channels" ("is_enabled") `,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_channels_is_active_idx" ON "oem"."oem_channels" ("is_active") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "oem_channels_pkey" ON "oem"."oem_channels" ("channel_id") `,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_company_channels_channel_type_enum" AS ENUM('Partner', 'Distributer')`,
    );
    await queryRunner.query(
      `CREATE TABLE "oem"."oem_company_channels" ("company_channel_id" SERIAL NOT NULL, "company_id" integer NOT NULL DEFAULT current_setting('${DB_NAME}.current_tenant')::int, "channel_id" integer NOT NULL, "geo_hierarchy_id" integer NOT NULL, "company_program_id" integer NOT NULL, "channel_type" "oem"."oem_company_channels_channel_type_enum" NOT NULL DEFAULT 'Partner', "is_active" boolean NOT NULL DEFAULT true, "is_enabled" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "REL_5111ccd6df0946844b9422b9b0" UNIQUE ("company_program_id"), CONSTRAINT "PK_d8b51295651194e6c2c95277b6b" PRIMARY KEY ("company_channel_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_company_channels_is_enabled_idx" ON "oem"."oem_company_channels" ("is_enabled") `,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_company_channels_is_active_idx" ON "oem"."oem_company_channels" ("is_active") `,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_company_channels_company_program_id_idx" ON "oem"."oem_company_channels" ("company_program_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_company_channels_geo_hierarchy_id_idx" ON "oem"."oem_company_channels" ("geo_hierarchy_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_company_channels_channel_id_idx" ON "oem"."oem_company_channels" ("channel_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_company_channels_company_id_idx" ON "oem"."oem_company_channels" ("company_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "oem_company_channels_pkey" ON "oem"."oem_company_channels" ("company_channel_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_programs" ADD CONSTRAINT "FK_94cd4d42abc977df4bb44485b54" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_programs" ADD CONSTRAINT "FK_a215935e86f16bbbb9d2bc43bbd" FOREIGN KEY ("channel_id") REFERENCES "oem"."oem_channels"("channel_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" ADD CONSTRAINT "FK_92d17119739056d2abf91f79d23" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" ADD CONSTRAINT "FK_d3565f3c55493d73c47281e2bb0" FOREIGN KEY ("channel_id") REFERENCES "oem"."oem_channels"("channel_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" ADD CONSTRAINT "FK_94e89832dccb361cdb8d5a866d6" FOREIGN KEY ("geo_hierarchy_id") REFERENCES "oem"."oem_hierarchies"("hierarchy_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" ADD CONSTRAINT "FK_5111ccd6df0946844b9422b9b0f" FOREIGN KEY ("company_program_id") REFERENCES "oem"."oem_company_programs"("company_program_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA oem TO "${DB_USER}";`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" DROP CONSTRAINT "FK_5111ccd6df0946844b9422b9b0f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" DROP CONSTRAINT "FK_94e89832dccb361cdb8d5a866d6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" DROP CONSTRAINT "FK_d3565f3c55493d73c47281e2bb0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" DROP CONSTRAINT "FK_92d17119739056d2abf91f79d23"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_programs" DROP CONSTRAINT "FK_a215935e86f16bbbb9d2bc43bbd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_programs" DROP CONSTRAINT "FK_94cd4d42abc977df4bb44485b54"`,
    );
    await queryRunner.query(`DROP INDEX "oem"."oem_company_channels_pkey"`);
    await queryRunner.query(
      `DROP INDEX "oem"."oem_company_channels_company_id_idx"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_company_channels_channel_id_idx"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_company_channels_geo_hierarchy_id_idx"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_company_channels_company_program_id_idx"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_company_channels_is_active_idx"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_company_channels_is_enabled_idx"`,
    );
    await queryRunner.query(`DROP TABLE "oem"."oem_company_channels"`);
    await queryRunner.query(
      `DROP TYPE "oem"."oem_company_channels_channel_type_enum"`,
    );
    await queryRunner.query(`DROP INDEX "oem"."oem_channels_pkey"`);
    await queryRunner.query(`DROP INDEX "oem"."oem_channels_is_active_idx"`);
    await queryRunner.query(`DROP INDEX "oem"."oem_channels_is_enabled_idx"`);
    await queryRunner.query(`DROP TABLE "oem"."oem_channels"`);
    await queryRunner.query(`DROP INDEX "oem"."oem_company_programs_pkey"`);
    await queryRunner.query(
      `DROP INDEX "oem"."oem_company_programs_company_id_idx"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_company_programs_channel_id_idx"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_company_programs_is_enabled_idx"`,
    );
    await queryRunner.query(`DROP TABLE "oem"."oem_company_programs"`);
  }
}
