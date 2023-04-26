import { MigrationInterface, QueryRunner } from 'typeorm';
import {
  DB_MAIN_DATABASE as DB_NAME,
  DB_MAIN_USERNAME as DB_USER,
} from '../../environments';

export class createSalesforceToken1669695129330 implements MigrationInterface {
  name = 'createSalesforceToken1669695129330';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "oem"."oem_salesforce_token" ("salesforce_token_id" SERIAL NOT NULL, "company_id" integer NOT NULL DEFAULT current_setting('${DB_NAME}.current_tenant')::int, "token" character varying(255) NOT NULL, "instance_url" character varying(255) NOT NULL, "is_enabled" boolean NOT NULL DEFAULT true, "issued_at" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_52bd48f42604c5ef873053f974d" PRIMARY KEY ("salesforce_token_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_salesforce_token_company_id_idx" ON "oem"."oem_salesforce_token" ("company_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "oem_salesforce_token_pkey" ON "oem"."oem_salesforce_token" ("salesforce_token_id") `,
    );

    await queryRunner.query(
      `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA oem TO "${DB_USER}";`,
    );
    await queryRunner.manager.query(
      `GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA oem TO "${DB_USER}";`,
    );
    await queryRunner.query(
      `CREATE POLICY tenant_isolation_policy ON oem.oem_salesforce_token USING (company_id = current_setting($$${DB_NAME}.current_tenant$$)::int);`,
    );
    await queryRunner.query(
      `ALTER TABLE oem.oem_salesforce_token ENABLE ROW LEVEL SECURITY;`,
    );
    await queryRunner.query(
      `ALTER TABLE oem.oem_salesforce_token FORCE ROW LEVEL SECURITY;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "oem"."oem_salesforce_token_pkey"`);
    await queryRunner.query(
      `DROP INDEX "oem"."oem_salesforce_token_company_id_idx"`,
    );
    await queryRunner.query(`DROP TABLE "oem"."oem_salesforce_token"`);
  }
}
