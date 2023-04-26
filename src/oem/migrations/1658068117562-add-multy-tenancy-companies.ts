import { MigrationInterface, QueryRunner } from 'typeorm';

export class addMultyTenancyCompanies1658068117562
  implements MigrationInterface
{
  name = 'addMultyTenancyCompanies1658068117562';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "oem"."oem_quote_approval_queues_target_type_idx"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos_users" ADD "company_id" integer NOT NULL DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos_quotes" ADD "company_id" integer NOT NULL DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_contacts" ADD "company_id" integer NOT NULL DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_contacts" ADD "company_id" integer NOT NULL DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos_contacts" ADD "company_id" integer NOT NULL DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_materials" ADD "company_id" integer NOT NULL DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_materials" ADD "company_id" integer NOT NULL DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos_materials" ADD "company_id" integer NOT NULL DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_users_viewed_vendos_quotes" ADD "company_id" integer NOT NULL DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_users" ADD "company_id" integer NOT NULL DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_deal_partners" ADD "company_id" integer NOT NULL DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_price_tiers" ADD "company_id" integer NOT NULL DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_unit_tiers" ADD "company_id" integer NOT NULL DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_companies" ADD "subdomain" character varying(128) NOT NULL DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_companies" ADD CONSTRAINT "UQ_b90dfeb457229ccecdd3e581929" UNIQUE ("subdomain")`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles_visible_product_fields" ADD "company_id" integer NOT NULL DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_discount_priorities" ADD "company_id" integer NOT NULL DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_discounts_discounts_rules" ADD "company_id" integer NOT NULL DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products_relationships" ADD "company_id" integer NOT NULL DEFAULT 1`,
    );
    // await queryRunner.query(
    //   `ALTER TABLE "oem"."oem_quotes_products" ADD "company_id" integer NOT NULL DEFAULT 1`,
    // );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ADD "company_id" integer NOT NULL DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_customer_products" ADD "company_id" integer NOT NULL DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" ADD "company_id" integer NOT NULL DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers" ADD "company_id" integer NOT NULL DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_addresses" ADD "company_id" integer NOT NULL DEFAULT 1`,
    );
    // await queryRunner.query(
    //   `CREATE TYPE "oem"."oem_action_logs_type_enum" AS ENUM('Vendo Changes', 'Quote Changes', 'Shading Rules')`,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE "oem"."oem_action_logs" ADD "type" "oem"."oem_action_logs_type_enum"`,
    // );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos" ALTER COLUMN "is_locked" SET DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_unit_tiers" ALTER COLUMN "start_range" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_unit_tiers" ALTER COLUMN "end_range" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_discounts" ALTER COLUMN "priority" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_products" ALTER COLUMN "quantity" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" ALTER COLUMN "quantity" TYPE numeric`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_action_logs_association_idx"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" DROP COLUMN "association"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" ADD "association" jsonb`,
    );
    await queryRunner.query(`DROP INDEX "oem"."oem_action_logs_subject_idx"`);
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" DROP COLUMN "subject"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" ADD "subject" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" DROP COLUMN "action"`,
    );
    await queryRunner.query(`DROP TYPE "oem"."oem_action_logs_action_enum"`);
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_action_logs_action_enum" AS ENUM('Submit', 'Reject', 'Approve', 'Transact', 'Update', 'Attach', 'Delete', 'Change')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" ADD "action" "oem"."oem_action_logs_action_enum"`,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_action_logs_subject_idx" ON "oem"."oem_action_logs" ("subject") `,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_action_logs_association_idx" ON "oem"."oem_action_logs" ("association") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "oem"."oem_action_logs_association_idx"`,
    );
    await queryRunner.query(`DROP INDEX "oem"."oem_action_logs_subject_idx"`);
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" DROP COLUMN "action"`,
    );
    await queryRunner.query(`DROP TYPE "oem"."oem_action_logs_action_enum"`);
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" ADD "action" character varying(128) NOT NULL DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" DROP COLUMN "subject"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" ADD "subject" integer NOT NULL DEFAULT 1`,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_action_logs_subject_idx" ON "oem"."oem_action_logs" ("subject") `,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" DROP COLUMN "association"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" ADD "association" integer NOT NULL DEFAULT 1`,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_action_logs_association_idx" ON "oem"."oem_action_logs" ("association") `,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" ALTER COLUMN "quantity" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_products" ALTER COLUMN "quantity" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_discounts" ALTER COLUMN "priority" SET NOT NULL DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_unit_tiers" ALTER COLUMN "end_range" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_unit_tiers" ALTER COLUMN "start_range" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos" ALTER COLUMN "is_locked" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" DROP COLUMN "type"`,
    );
    await queryRunner.query(`DROP TYPE "oem"."oem_action_logs_type_enum"`);
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_addresses" DROP COLUMN "company_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers" DROP COLUMN "company_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" DROP COLUMN "company_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_customer_products" DROP COLUMN "company_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" DROP COLUMN "company_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_products" DROP COLUMN "company_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products_relationships" DROP COLUMN "company_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_discounts_discounts_rules" DROP COLUMN "company_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_discount_priorities" DROP COLUMN "company_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles_visible_product_fields" DROP COLUMN "company_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_companies" DROP CONSTRAINT "UQ_b90dfeb457229ccecdd3e581929"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_companies" DROP COLUMN "subdomain"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_unit_tiers" DROP COLUMN "company_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_price_tiers" DROP COLUMN "company_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_deal_partners" DROP COLUMN "company_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_users" DROP COLUMN "company_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_users_viewed_vendos_quotes" DROP COLUMN "company_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos_materials" DROP COLUMN "company_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_materials" DROP COLUMN "company_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_materials" DROP COLUMN "company_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos_contacts" DROP COLUMN "company_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_contacts" DROP COLUMN "company_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_contacts" DROP COLUMN "company_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos_quotes" DROP COLUMN "company_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos_users" DROP COLUMN "company_id"`,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_quote_approval_queues_target_type_idx" ON "oem"."oem_quote_approval_queues" ("target_type") `,
    );
  }
}
