import { MigrationInterface, QueryRunner } from 'typeorm';

export class repairMissing1659032520102 implements MigrationInterface {
  name = 'repairMissing1659032520102';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_addresses" ADD "is_enabled" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos_users" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos_quotes" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_contacts" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_contacts" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos_contacts" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_materials" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_materials" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos_materials" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_users_viewed_vendos_quotes" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_users" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_deal_partners" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_price_tiers" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_unit_tiers" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_unit_tiers" ALTER COLUMN "start_range" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_unit_tiers" ALTER COLUMN "end_range" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_companies" ALTER COLUMN "subdomain" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles_visible_product_fields" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_discount_priorities" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_discounts_discounts_rules" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products_relationships" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_products" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_products" ALTER COLUMN "quantity" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_customer_products" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" ALTER COLUMN "quantity" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_addresses" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" ALTER COLUMN "association" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" ALTER COLUMN "subject" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" ALTER COLUMN "action" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" ALTER COLUMN "action" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" ALTER COLUMN "subject" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" ALTER COLUMN "association" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_addresses" ALTER COLUMN "company_id" SET DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers" ALTER COLUMN "company_id" SET DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" ALTER COLUMN "quantity" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" ALTER COLUMN "company_id" SET DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_customer_products" ALTER COLUMN "company_id" SET DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ALTER COLUMN "company_id" SET DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_products" ALTER COLUMN "quantity" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_products" ALTER COLUMN "company_id" SET DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products_relationships" ALTER COLUMN "company_id" SET DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_discounts_discounts_rules" ALTER COLUMN "company_id" SET DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_discount_priorities" ALTER COLUMN "company_id" SET DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles_visible_product_fields" ALTER COLUMN "company_id" SET DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_companies" ALTER COLUMN "subdomain" SET DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_unit_tiers" ALTER COLUMN "end_range" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_unit_tiers" ALTER COLUMN "start_range" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_unit_tiers" ALTER COLUMN "company_id" SET DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_price_tiers" ALTER COLUMN "company_id" SET DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_deal_partners" ALTER COLUMN "company_id" SET DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_users" ALTER COLUMN "company_id" SET DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_users_viewed_vendos_quotes" ALTER COLUMN "company_id" SET DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos_materials" ALTER COLUMN "company_id" SET DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_materials" ALTER COLUMN "company_id" SET DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_materials" ALTER COLUMN "company_id" SET DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos_contacts" ALTER COLUMN "company_id" SET DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_contacts" ALTER COLUMN "company_id" SET DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_contacts" ALTER COLUMN "company_id" SET DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos_quotes" ALTER COLUMN "company_id" SET DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos_users" ALTER COLUMN "company_id" SET DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_addresses" DROP COLUMN "is_enabled"`,
    );
  }
}
