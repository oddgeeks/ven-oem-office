import { MigrationInterface, QueryRunner } from 'typeorm';
import { DB_MAIN_DATABASE as DB_NAME } from '../../environments';

export class setCompanyFix1659460603637 implements MigrationInterface {
  name = 'setCompanyFix1659460603637';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos_users" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos_quotes" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_contacts" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_contacts" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos_contacts" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_materials" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_materials" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos_materials" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_users_viewed_vendos_quotes" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_hierarchy_levels" DROP CONSTRAINT "FK_d44357927326764ec69336fa2cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_hierarchy_levels" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_hierarchies" DROP CONSTRAINT "FK_1629c814fc24d7c3b85b8f364a6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_hierarchies" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos" DROP CONSTRAINT "FK_1e5cf2d8d1c1fb0731361dbb60f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendo_approval_queues" DROP CONSTRAINT "FK_51048a498eb46f2bb44ad77d33a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendo_approval_queues" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_approval_queue_priorities" DROP CONSTRAINT "FK_ca8d1018341aeb51998565a81c4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_approval_queue_priorities" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quote_approval_queues" DROP CONSTRAINT "FK_0f31c77043511f53795baedbf3a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quote_approval_queues" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_notifications" DROP CONSTRAINT "FK_25c9e6831f309eb607f22422a27"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_notifications" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_users" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_licensing_programs" DROP CONSTRAINT "FK_997f11267d8885b0f826e393642"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_licensing_programs" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_deal_partners" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" DROP CONSTRAINT "FK_0fe22bb3526f24501c6bbd50903"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_shading_rules" DROP CONSTRAINT "FK_2145b22898d173eb4baa09a693f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_shading_rules" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_price_tiers" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_unit_tiers" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
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
      `ALTER TABLE "oem"."oem_pricing_models" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_workflow_rules" DROP CONSTRAINT "FK_9626685ffa8340165fe40c5b015"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_workflow_rules" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vacation_rules" DROP CONSTRAINT "FK_7b3b942111796a60a0ac2124cfb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vacation_rules" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_visible_product_fields" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles_visible_product_fields" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles" DROP CONSTRAINT "FK_a067e45b1d138a2d2804536952d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_discount_priorities" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_discounts" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_discounts_discounts_rules" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_discount_rules" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_users" DROP CONSTRAINT "FK_95598311afd09290acc5dbaaf3a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_users" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products_relationships" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_products" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_products" ALTER COLUMN "quantity" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_customer_products" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" ALTER COLUMN "quantity" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_addresses" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_addresses" DROP CONSTRAINT "FK_cfe0bcdbd1fa9de9f2f7a08fe95"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_addresses" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_hierarchy_levels" ADD CONSTRAINT "FK_d44357927326764ec69336fa2cd" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_hierarchies" ADD CONSTRAINT "FK_1629c814fc24d7c3b85b8f364a6" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "oem"."oem_notifications" ADD CONSTRAINT "FK_25c9e6831f309eb607f22422a27" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_licensing_programs" ADD CONSTRAINT "FK_997f11267d8885b0f826e393642" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ADD CONSTRAINT "FK_0fe22bb3526f24501c6bbd50903" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_shading_rules" ADD CONSTRAINT "FK_2145b22898d173eb4baa09a693f" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_pricing_models" ADD CONSTRAINT "FK_e87a13cefe49077059dc9eba56a" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_workflow_rules" ADD CONSTRAINT "FK_9626685ffa8340165fe40c5b015" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vacation_rules" ADD CONSTRAINT "FK_7b3b942111796a60a0ac2124cfb" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles" ADD CONSTRAINT "FK_a067e45b1d138a2d2804536952d" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_users" ADD CONSTRAINT "FK_95598311afd09290acc5dbaaf3a" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_addresses" ADD CONSTRAINT "FK_cfe0bcdbd1fa9de9f2f7a08fe95" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    // await queryRunner.query(
    //   `create table if not exists public.session ( id integer, expire date, sess text, sid text );`,
    // );
    // await queryRunner.query(
    //   `create unique index if not exists session_sid_uindex on public.session (sid);`,
    // );
    // await queryRunner.query(
    //   `create unique index if not exists session_sess_uindex on public.session (sess);`,
    // );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`drop table if exists public.session cascade;`);
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_addresses" DROP CONSTRAINT "FK_cfe0bcdbd1fa9de9f2f7a08fe95"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_users" DROP CONSTRAINT "FK_95598311afd09290acc5dbaaf3a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles" DROP CONSTRAINT "FK_a067e45b1d138a2d2804536952d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vacation_rules" DROP CONSTRAINT "FK_7b3b942111796a60a0ac2124cfb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_workflow_rules" DROP CONSTRAINT "FK_9626685ffa8340165fe40c5b015"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_pricing_models" DROP CONSTRAINT "FK_e87a13cefe49077059dc9eba56a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_shading_rules" DROP CONSTRAINT "FK_2145b22898d173eb4baa09a693f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" DROP CONSTRAINT "FK_0fe22bb3526f24501c6bbd50903"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_licensing_programs" DROP CONSTRAINT "FK_997f11267d8885b0f826e393642"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_notifications" DROP CONSTRAINT "FK_25c9e6831f309eb607f22422a27"`,
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
      `ALTER TABLE "oem"."oem_hierarchies" DROP CONSTRAINT "FK_1629c814fc24d7c3b85b8f364a6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_hierarchy_levels" DROP CONSTRAINT "FK_d44357927326764ec69336fa2cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_addresses" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_addresses" ADD CONSTRAINT "FK_cfe0bcdbd1fa9de9f2f7a08fe95" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_addresses" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" ALTER COLUMN "quantity" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_customer_products" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_products" ALTER COLUMN "quantity" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_products" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_products_relationships" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_users" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_users" ADD CONSTRAINT "FK_95598311afd09290acc5dbaaf3a" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_discount_rules" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_discounts_discounts_rules" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_discounts" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_discount_priorities" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles" ADD CONSTRAINT "FK_a067e45b1d138a2d2804536952d" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles_visible_product_fields" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_visible_product_fields" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vacation_rules" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vacation_rules" ADD CONSTRAINT "FK_7b3b942111796a60a0ac2124cfb" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_workflow_rules" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_workflow_rules" ADD CONSTRAINT "FK_9626685ffa8340165fe40c5b015" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_pricing_models" ALTER COLUMN "company_id" DROP DEFAULT`,
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
      `ALTER TABLE "oem"."oem_unit_tiers" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_price_tiers" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_shading_rules" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_shading_rules" ADD CONSTRAINT "FK_2145b22898d173eb4baa09a693f" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ADD CONSTRAINT "FK_0fe22bb3526f24501c6bbd50903" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_deal_partners" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_licensing_programs" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_licensing_programs" ADD CONSTRAINT "FK_997f11267d8885b0f826e393642" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_users" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_notifications" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_notifications" ADD CONSTRAINT "FK_25c9e6831f309eb607f22422a27" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quote_approval_queues" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quote_approval_queues" ADD CONSTRAINT "FK_0f31c77043511f53795baedbf3a" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_approval_queue_priorities" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_approval_queue_priorities" ADD CONSTRAINT "FK_ca8d1018341aeb51998565a81c4" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendo_approval_queues" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendo_approval_queues" ADD CONSTRAINT "FK_51048a498eb46f2bb44ad77d33a" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos" ADD CONSTRAINT "FK_1e5cf2d8d1c1fb0731361dbb60f" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_hierarchies" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_hierarchies" ADD CONSTRAINT "FK_1629c814fc24d7c3b85b8f364a6" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_hierarchy_levels" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_hierarchy_levels" ADD CONSTRAINT "FK_d44357927326764ec69336fa2cd" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_users_viewed_vendos_quotes" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos_materials" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_materials" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_materials" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos_contacts" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_contacts" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_contacts" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos_quotes" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos_users" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
  }
}
