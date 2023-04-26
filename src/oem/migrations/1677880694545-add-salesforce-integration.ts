import { MigrationInterface, QueryRunner } from 'typeorm';
import { DB_MAIN_DATABASE as DB_NAME } from '../../environments';

export class addSalesforceIntegration1677880694545
  implements MigrationInterface
{
  name = 'addSalesforceIntegration1677880694545';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "oem"."oem_salesforce_integrations" ("salesforce_integration_id" SERIAL NOT NULL, "salesforce_url" character varying(128) NOT NULL, "company_id" integer NOT NULL DEFAULT current_setting($$${DB_NAME}.current_tenant$$)::int, "salesforce_client_id" character varying(128) NOT NULL, "salesforce_client_secret" character varying(1024) NOT NULL, "salesforce_username" character varying(128) NOT NULL, "salesforce_password" character varying(128) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "is_enabled" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_1c56925d67234fa7c1fac095f37" UNIQUE ("salesforce_url"), CONSTRAINT "UQ_5a30b1ae8b3e8e41cb1f6bafddf" UNIQUE ("salesforce_client_id"), CONSTRAINT "UQ_7e7be0e6b33abc16e0d25db89a0" UNIQUE ("salesforce_client_secret"), CONSTRAINT "UQ_d0c9610f75f9a3705baa908cf36" UNIQUE ("salesforce_username"), CONSTRAINT "UQ_bb52827ffc7eb2936af1b094c32" UNIQUE ("salesforce_password"), CONSTRAINT "PK_ec6e0f7f2d38661717733be7682" PRIMARY KEY ("salesforce_integration_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_salesforce_integration_company_id_idx" ON "oem"."oem_salesforce_integrations" ("company_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "oem_salesforce_integrations_pkey" ON "oem"."oem_salesforce_integrations" ("salesforce_integration_id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "oem"."oem_salesforce_integrations_pkey"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_salesforce_integration_company_id_idx"`,
    );
    await queryRunner.query(`DROP TABLE "oem"."oem_salesforce_integrations"`);
  }
}
