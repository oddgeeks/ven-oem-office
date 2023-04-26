import { MigrationInterface, QueryRunner } from 'typeorm';
import { DB_MAIN_DATABASE as DB_NAME } from '../../environments';

export class addBundle1678290440364 implements MigrationInterface {
  name = 'addBundle1678290440364';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" DROP CONSTRAINT "FK_ad976b8b5d2898f834d4a102ee7"`,
    );
    await queryRunner.query(`DROP INDEX "oem"."oem_products_pkey"`);
    await queryRunner.query(`DROP INDEX "oem"."oem_customers_products_pkey"`);
    await queryRunner.query(
      `CREATE TABLE "oem"."oem_bundles_products" ("company_id" integer NOT NULL DEFAULT current_setting($$${DB_NAME}.current_tenant$$)::int, "product_id" integer NOT NULL, "bundle_id" integer NOT NULL, CONSTRAINT "PK_d12ba9cf5764a0d686e6b1ec468" PRIMARY KEY ("company_id", "product_id", "bundle_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ec94be417de8acc5a059e51aa5" ON "oem"."oem_bundles_products" ("company_id", "product_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8c7cfc17f4918d2b27952ae2cd" ON "oem"."oem_bundles_products" ("bundle_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" DROP COLUMN "is_expandable"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" DROP COLUMN "is_upgradable"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" DROP COLUMN "is_downgradable"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" DROP COLUMN "is_renewable"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" DROP COLUMN "term"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" DROP COLUMN "term_type"`,
    );
    await queryRunner.query(`DROP TYPE "oem"."oem_products_term_type_enum"`);
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_products_term_type_enum" AS ENUM('days', 'months', 'weeks', 'years')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" DROP COLUMN "same_unit_price_for_all_tiers"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" DROP COLUMN "billing_frequency"`,
    );
    await queryRunner.query(
      `DROP TYPE "oem"."oem_products_billing_frequency_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_products_billing_frequency_enum" AS ENUM('Annually (Calendar)', 'Bi-weekly', 'Consumption-Based', 'Every 30 Days', 'Every 31 Days', 'Every 365 Days', 'Every 90 Days', 'Monthly (Calendar)', 'Other / Custom', 'Quarterly', 'Semi-Annually', 'Upfront', 'Weekly')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" DROP COLUMN IF EXISTS "custom_billing_frequency_settings"`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_products_eligible_for_enum" AS ENUM('Expansion', 'Extension', 'Renewal', 'Cancellation/Termination', 'Upgradeable', 'Downgradeable')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ADD "eligible_for" "oem"."oem_products_eligible_for_enum" array NOT NULL DEFAULT '{}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ADD "term" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ADD "term_type" "oem"."oem_products_term_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ADD "same_unit_price_for_all_tiers" boolean`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ADD "billing_frequency" "oem"."oem_products_billing_frequency_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ADD "custom_billing_frequency_settings" jsonb DEFAULT '[]'`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ADD "type" character varying NOT NULL DEFAULT 'ProductEntity'`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ADD "bundle_settings" jsonb DEFAULT '[]'`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_products" ADD "bundle_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" ADD "bundle_id" integer`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_hierarchy_levels" DROP CONSTRAINT "FK_d44357927326764ec69336fa2cd"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quote_approval_queues" DROP CONSTRAINT "FK_0f31c77043511f53795baedbf3a"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_approval_queue_priorities" DROP CONSTRAINT "FK_ca8d1018341aeb51998565a81c4"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendo_approval_queues" DROP CONSTRAINT "FK_51048a498eb46f2bb44ad77d33a"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos" DROP CONSTRAINT "FK_1e5cf2d8d1c1fb0731361dbb60f"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_programs" DROP CONSTRAINT "FK_94cd4d42abc977df4bb44485b54"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_licensing_programs" DROP CONSTRAINT "FK_997f11267d8885b0f826e393642"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" DROP CONSTRAINT "FK_92d17119739056d2abf91f79d23"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_hierarchies" DROP CONSTRAINT "FK_1629c814fc24d7c3b85b8f364a6"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" DROP COLUMN "product_availability"`,
    );
    await queryRunner.query(
      `DROP TYPE "oem"."oem_products_product_availability_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_products_product_availability_enum" AS ENUM('Add-On/Upgrade/Downgrade', 'Current', 'Hidden', 'Retired')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ADD "product_availability" "oem"."oem_products_product_availability_enum" array NOT NULL DEFAULT '{Current}'`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_products" DROP CONSTRAINT "FK_9e3bd44b2b0e5b11ce807c0eaf5"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_products" ALTER COLUMN "product_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_products" ALTER COLUMN "quantity" TYPE numeric`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_unit_tiers" ALTER COLUMN "start_range" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_unit_tiers" ALTER COLUMN "end_range" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_pricing_models" DROP CONSTRAINT "FK_e87a13cefe49077059dc9eba56a"`,
    );

    await queryRunner.query(
      `alter table oem.oem_quotes_customer_products drop constraint IF EXISTS "UQ_a1ba06e4a54a88e0c21fd0e3581"; ALTER TABLE "oem"."oem_quotes_customer_products" ADD CONSTRAINT "UQ_a1ba06e4a54a88e0c21fd0e3581" UNIQUE ("customer_product_uuid")`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" DROP CONSTRAINT "FK_6c217f1c8bbfddb2f6b58bfd287"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" ALTER COLUMN "product_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" ALTER COLUMN "quantity" TYPE numeric`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_notifications" DROP CONSTRAINT "FK_25c9e6831f309eb607f22422a27"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_external_users" DROP CONSTRAINT "FK_7179f06982b5c3f5f24907730b8"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" DROP CONSTRAINT "FK_0fe22bb3526f24501c6bbd50903"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ALTER COLUMN "quote_comment_settings" SET DEFAULT '{}'`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_shading_rules" DROP CONSTRAINT "FK_2145b22898d173eb4baa09a693f"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vacation_rules" DROP CONSTRAINT "FK_7b3b942111796a60a0ac2124cfb"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_users" DROP CONSTRAINT "FK_95598311afd09290acc5dbaaf3a"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_users_sso_login_email_phone_key"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles" DROP CONSTRAINT "FK_a067e45b1d138a2d2804536952d"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_workflow_rules" DROP CONSTRAINT "FK_9626685ffa8340165fe40c5b015"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_companies" ALTER COLUMN "settings" SET DEFAULT '{"companyPrimaryColor":{"a":1,"b":187,"g":137,"r":74},"customListPriceName":"List Price","customCustomerPriceName":"Price To Customer"}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customer_addresses" DROP CONSTRAINT "FK_c5e0fafa9da276bdfe502349e23"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_addresses" DROP CONSTRAINT "FK_cfe0bcdbd1fa9de9f2f7a08fe95"`,
    );

    await queryRunner.query(
      `ALTER TYPE "oem"."oem_action_logs_type_enum" RENAME TO "oem_action_logs_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_action_logs_type_enum" AS ENUM('Vendo', 'Quote', 'Role', 'Material', 'Address', 'User', 'ShadingRule', 'WorkflowRule', 'CompanyChannel', 'Company', 'DiscountRule', 'Discount', 'ProductsRelationships', 'PricingModel')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" ALTER COLUMN "type" TYPE "oem"."oem_action_logs_type_enum" USING "type"::"text"::"oem"."oem_action_logs_type_enum"`,
    );
    await queryRunner.query(`DROP TYPE "oem"."oem_action_logs_type_enum_old"`);

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_salesforce_token" DROP COLUMN "instance_url"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_salesforce_token" ADD "instance_url" character varying(1024) NOT NULL`,
    );

    await queryRunner.query(
      `CREATE UNIQUE INDEX "oem_products_pkey" ON "oem"."oem_products" ("product_id", "company_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_08ff7a6d5acc051e5455f27fb8" ON "oem"."oem_products" ("type") `,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_quotes_products_bundle_id_idx" ON "oem"."oem_quotes_products" ("bundle_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "oem_customers_products_pkey" ON "oem"."oem_customers_products" ("customer_product_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_customers_products_bundle_id_idx" ON "oem"."oem_customers_products" ("bundle_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "oem_users_sso_login_email_phone_key" ON "oem"."oem_users" ("phone", "sso_login_email", "company_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_hierarchy_levels" ADD CONSTRAINT "FK_d44357927326764ec69336fa2cd" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quote_approval_queues" ADD CONSTRAINT "FK_0f31c77043511f53795baedbf3a" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_approval_queue_priorities" ADD CONSTRAINT "FK_ca8d1018341aeb51998565a81c4" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendo_approval_queues" ADD CONSTRAINT "FK_51048a498eb46f2bb44ad77d33a" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos" ADD CONSTRAINT "FK_1e5cf2d8d1c1fb0731361dbb60f" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_programs" ADD CONSTRAINT "FK_94cd4d42abc977df4bb44485b54" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_licensing_programs" ADD CONSTRAINT "FK_997f11267d8885b0f826e393642" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" ADD CONSTRAINT "FK_92d17119739056d2abf91f79d23" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_hierarchies" ADD CONSTRAINT "FK_1629c814fc24d7c3b85b8f364a6" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ADD CONSTRAINT "FK_ad976b8b5d2898f834d4a102ee7" FOREIGN KEY ("pricing_model_id") REFERENCES "oem"."oem_pricing_models"("pricing_model_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_products" ADD CONSTRAINT "FK_9e3bd44b2b0e5b11ce807c0eaf5" FOREIGN KEY ("product_id") REFERENCES "oem"."oem_products"("product_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_products" ADD CONSTRAINT "FK_df28754fdc764453c638723b46a" FOREIGN KEY ("bundle_id") REFERENCES "oem"."oem_products"("product_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_pricing_models" ADD CONSTRAINT "FK_e87a13cefe49077059dc9eba56a" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" ADD CONSTRAINT "FK_6c217f1c8bbfddb2f6b58bfd287" FOREIGN KEY ("product_id") REFERENCES "oem"."oem_products"("product_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" ADD CONSTRAINT "FK_8bae2902908b66aca3fc27e1a94" FOREIGN KEY ("bundle_id") REFERENCES "oem"."oem_products"("product_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_notifications" ADD CONSTRAINT "FK_25c9e6831f309eb607f22422a27" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_external_users" ADD CONSTRAINT "FK_7179f06982b5c3f5f24907730b8" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ADD CONSTRAINT "FK_0fe22bb3526f24501c6bbd50903" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_shading_rules" ADD CONSTRAINT "FK_2145b22898d173eb4baa09a693f" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vacation_rules" ADD CONSTRAINT "FK_7b3b942111796a60a0ac2124cfb" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_users" ADD CONSTRAINT "FK_95598311afd09290acc5dbaaf3a" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles" ADD CONSTRAINT "FK_a067e45b1d138a2d2804536952d" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_workflow_rules" ADD CONSTRAINT "FK_9626685ffa8340165fe40c5b015" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customer_addresses" ADD CONSTRAINT "FK_c5e0fafa9da276bdfe502349e23" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_addresses" ADD CONSTRAINT "FK_cfe0bcdbd1fa9de9f2f7a08fe95" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_bundles_products" ADD CONSTRAINT "FK_ec94be417de8acc5a059e51aa54" FOREIGN KEY ("company_id", "product_id") REFERENCES "oem"."oem_products"("company_id","product_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_bundles_products" ADD CONSTRAINT "FK_8c7cfc17f4918d2b27952ae2cd3" FOREIGN KEY ("bundle_id") REFERENCES "oem"."oem_products"("product_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_bundles_products" DROP CONSTRAINT "FK_8c7cfc17f4918d2b27952ae2cd3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_bundles_products" DROP CONSTRAINT "FK_ec94be417de8acc5a059e51aa54"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_addresses" DROP CONSTRAINT "FK_cfe0bcdbd1fa9de9f2f7a08fe95"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customer_addresses" DROP CONSTRAINT "FK_c5e0fafa9da276bdfe502349e23"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_workflow_rules" DROP CONSTRAINT "FK_9626685ffa8340165fe40c5b015"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles" DROP CONSTRAINT "FK_a067e45b1d138a2d2804536952d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_users" DROP CONSTRAINT "FK_95598311afd09290acc5dbaaf3a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vacation_rules" DROP CONSTRAINT "FK_7b3b942111796a60a0ac2124cfb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_shading_rules" DROP CONSTRAINT "FK_2145b22898d173eb4baa09a693f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" DROP CONSTRAINT "FK_0fe22bb3526f24501c6bbd50903"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_external_users" DROP CONSTRAINT "FK_7179f06982b5c3f5f24907730b8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_notifications" DROP CONSTRAINT "FK_25c9e6831f309eb607f22422a27"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" DROP CONSTRAINT "FK_8bae2902908b66aca3fc27e1a94"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" DROP CONSTRAINT "FK_6c217f1c8bbfddb2f6b58bfd287"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_pricing_models" DROP CONSTRAINT "FK_e87a13cefe49077059dc9eba56a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_products" DROP CONSTRAINT "FK_df28754fdc764453c638723b46a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_products" DROP CONSTRAINT "FK_9e3bd44b2b0e5b11ce807c0eaf5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" DROP CONSTRAINT "FK_ad976b8b5d2898f834d4a102ee7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_hierarchies" DROP CONSTRAINT "FK_1629c814fc24d7c3b85b8f364a6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" DROP CONSTRAINT "FK_92d17119739056d2abf91f79d23"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_licensing_programs" DROP CONSTRAINT "FK_997f11267d8885b0f826e393642"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_programs" DROP CONSTRAINT "FK_94cd4d42abc977df4bb44485b54"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos" DROP CONSTRAINT "FK_1e5cf2d8d1c1fb0731361dbb60f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendo_approval_queues" DROP CONSTRAINT "FK_51048a498eb46f2bb44ad77d33a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_approval_queue_priorities" DROP CONSTRAINT "FK_ca8d1018341aeb51998565a81c4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quote_approval_queues" DROP CONSTRAINT "FK_0f31c77043511f53795baedbf3a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_hierarchy_levels" DROP CONSTRAINT "FK_d44357927326764ec69336fa2cd"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_users_sso_login_email_phone_key"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_customers_products_bundle_id_idx"`,
    );
    await queryRunner.query(`DROP INDEX "oem"."oem_customers_products_pkey"`);
    await queryRunner.query(
      `DROP INDEX "oem"."oem_quotes_products_bundle_id_idx"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."IDX_08ff7a6d5acc051e5455f27fb8"`,
    );
    await queryRunner.query(`DROP INDEX "oem"."oem_products_pkey"`);

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_salesforce_token" DROP COLUMN "instance_url"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_salesforce_token" ADD "instance_url" character varying(255) NOT NULL`,
    );

    await queryRunner.query(
      `CREATE TYPE "oem"."oem_action_logs_type_enum_old" AS ENUM('Address', 'Company', 'CompanyChannel', 'Discount', 'DiscountRule', 'Material', 'PricingModel', 'ProductsRelationships', 'Quote', 'Role', 'ShadingRule', 'Vendo', 'WorkflowRule')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" ALTER COLUMN "type" TYPE "oem"."oem_action_logs_type_enum_old" USING "type"::"text"::"oem"."oem_action_logs_type_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "oem"."oem_action_logs_type_enum"`);
    await queryRunner.query(
      `ALTER TYPE "oem"."oem_action_logs_type_enum_old" RENAME TO "oem_action_logs_type_enum"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_addresses" ADD CONSTRAINT "FK_cfe0bcdbd1fa9de9f2f7a08fe95" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customer_addresses" ADD CONSTRAINT "FK_c5e0fafa9da276bdfe502349e23" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_companies" ALTER COLUMN "settings" SET DEFAULT '{"companyPrimaryColor": {"a": 1, "b": 187, "g": 137, "r": 74}, "customListPriceName": "List Price", "customCustomerPriceName": "Price To Customer"}'`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_workflow_rules" ADD CONSTRAINT "FK_9626685ffa8340165fe40c5b015" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles" ADD CONSTRAINT "FK_a067e45b1d138a2d2804536952d" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `CREATE UNIQUE INDEX "oem_users_sso_login_email_phone_key" ON "oem"."oem_users" ("company_id", "sso_login_email", "phone") `,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_users" ADD CONSTRAINT "FK_95598311afd09290acc5dbaaf3a" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vacation_rules" ADD CONSTRAINT "FK_7b3b942111796a60a0ac2124cfb" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_shading_rules" ADD CONSTRAINT "FK_2145b22898d173eb4baa09a693f" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ALTER COLUMN "quote_comment_settings" SET DEFAULT '{"consumptionMessage": "Quoted consumption offerings do not reflect contractually agreed upon delivery or invoice schedules. Displayed pricing is reflective of implied consumption rates and may change depending on product pricing.", "quoteDefaultComment": "This Quote is Valid Until {{expiresAt}}. “Pending” quotes require internal review before approval."}'`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ADD CONSTRAINT "FK_0fe22bb3526f24501c6bbd50903" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_external_users" ADD CONSTRAINT "FK_7179f06982b5c3f5f24907730b8" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_notifications" ADD CONSTRAINT "FK_25c9e6831f309eb607f22422a27" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" ALTER COLUMN "quantity" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" ALTER COLUMN "product_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" ALTER COLUMN "updated_at" SET DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" ALTER COLUMN "created_at" SET DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" ADD CONSTRAINT "FK_6c217f1c8bbfddb2f6b58bfd287" FOREIGN KEY ("product_id") REFERENCES "oem"."oem_products"("product_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_customer_products" DROP CONSTRAINT IF EXISTS "UQ_a1ba06e4a54a88e0c21fd0e3581"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_pricing_models" ADD CONSTRAINT "FK_e87a13cefe49077059dc9eba56a" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_unit_tiers" ALTER COLUMN "end_range" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_unit_tiers" ALTER COLUMN "start_range" TYPE numeric`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_products" ALTER COLUMN "quantity" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_products" ALTER COLUMN "product_id" SET NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_products" ADD CONSTRAINT "FK_9e3bd44b2b0e5b11ce807c0eaf5" FOREIGN KEY ("product_id") REFERENCES "oem"."oem_products"("product_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ALTER COLUMN "updated_at" SET DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ALTER COLUMN "created_at" SET DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" DROP COLUMN "product_availability"`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_products_product_availability_enum" AS ENUM('Add-On / Upgrade / Downgrade Only', 'Current Product', 'Hidden', 'Retired Product')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ADD "product_availability" "oem"."oem_products_product_availability_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ALTER COLUMN "updated_at" SET DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ALTER COLUMN "created_at" SET DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_hierarchies" ADD CONSTRAINT "FK_1629c814fc24d7c3b85b8f364a6" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" ADD CONSTRAINT "FK_92d17119739056d2abf91f79d23" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_licensing_programs" ADD CONSTRAINT "FK_997f11267d8885b0f826e393642" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_programs" ADD CONSTRAINT "FK_94cd4d42abc977df4bb44485b54" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos" ADD CONSTRAINT "FK_1e5cf2d8d1c1fb0731361dbb60f" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendo_approval_queues" ADD CONSTRAINT "FK_51048a498eb46f2bb44ad77d33a" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_approval_queue_priorities" ADD CONSTRAINT "FK_ca8d1018341aeb51998565a81c4" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quote_approval_queues" ADD CONSTRAINT "FK_0f31c77043511f53795baedbf3a" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_hierarchy_levels" ADD CONSTRAINT "FK_d44357927326764ec69336fa2cd" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" DROP COLUMN "bundle_id"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_products" DROP COLUMN "bundle_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" DROP COLUMN "bundle_settings"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" DROP COLUMN "type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" DROP COLUMN "custom_billing_frequency_settings"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" DROP COLUMN "billing_frequency"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" DROP COLUMN "same_unit_price_for_all_tiers"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" DROP COLUMN "term_type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" DROP COLUMN "term"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" DROP COLUMN "eligible_for"`,
    );
    await queryRunner.query(`DROP TYPE "oem"."oem_products_eligible_for_enum"`);
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ADD "custom_billing_frequency_settings" jsonb NOT NULL DEFAULT '[]'`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_products_billing_frequency_enum" AS ENUM('Annually (Calendar)', 'Bi-weekly', 'Consumption-Based', 'Every 30 Days', 'Every 31 Days', 'Every 365 Days', 'Every 90 Days', 'Monthly (Calendar)', 'Other / Custom', 'Quarterly', 'Semi-Annually', 'Upfront', 'Weekly')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ADD "billing_frequency" "oem"."oem_products_billing_frequency_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ADD "same_unit_price_for_all_tiers" boolean NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_products_term_type_enum" AS ENUM('days', 'months', 'weeks', 'years')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ADD "term_type" "oem"."oem_products_term_type_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ADD "term" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ADD "is_renewable" boolean NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ADD "is_downgradable" boolean NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ADD "is_upgradable" boolean NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ADD "is_expandable" boolean NOT NULL`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."IDX_8c7cfc17f4918d2b27952ae2cd"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."IDX_ec94be417de8acc5a059e51aa5"`,
    );
    await queryRunner.query(`DROP TABLE "oem"."oem_bundles_products"`);
    await queryRunner.query(
      `CREATE INDEX "oem_customers_products_pkey" ON "oem"."oem_customers_products" ("customer_product_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "oem_products_pkey" ON "oem"."oem_products" ("product_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ADD CONSTRAINT "FK_ad976b8b5d2898f834d4a102ee7" FOREIGN KEY ("pricing_model_id") REFERENCES "oem"."oem_pricing_models"("pricing_model_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
