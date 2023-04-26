import { MigrationInterface, QueryRunner } from 'typeorm';

export class companyUniquenessUpdate1678141472796
  implements MigrationInterface
{
  name = 'companyUniquenessUpdate1678141472796';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_pricing_models" DROP CONSTRAINT "FK_e87a13cefe49077059dc9eba56a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_hierarchy_levels" DROP CONSTRAINT "FK_d44357927326764ec69336fa2cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_hierarchy_levels" DROP CONSTRAINT "UQ_b696fdcf589397223d912a07a92"`,
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
      `alter table oem.oem_quotes_customer_products drop constraint IF EXISTS "UQ_a1ba06e4a54a88e0c21fd0e3581"; ALTER TABLE "oem"."oem_quotes_customer_products" ADD CONSTRAINT "UQ_a1ba06e4a54a88e0c21fd0e3581" UNIQUE ("customer_product_uuid")`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers" DROP CONSTRAINT "UQ_2789a0ce1cf0546ec39ff18e97c"`,
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
      `ALTER TABLE "oem"."oem_quotes" DROP CONSTRAINT "UQ_54880fb42ae75c726aad0455b0d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_shading_rules" DROP CONSTRAINT "FK_2145b22898d173eb4baa09a693f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vacation_rules" DROP CONSTRAINT "FK_7b3b942111796a60a0ac2124cfb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_notification_preferences" DROP CONSTRAINT "FK_86353525ec76a6bdd0d5caaa685"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_saved_alert_rules" DROP CONSTRAINT "FK_0f888ce595cd4ee5a65d3c1f1e8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_users" DROP CONSTRAINT "FK_95598311afd09290acc5dbaaf3a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles" DROP CONSTRAINT "FK_a067e45b1d138a2d2804536952d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_workflow_rules" DROP CONSTRAINT "FK_9626685ffa8340165fe40c5b015"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quote_and_vendo_uuids" DROP CONSTRAINT "FK_1d091dd76b7dd1d2728bc248c6b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customer_addresses" DROP CONSTRAINT "FK_c5e0fafa9da276bdfe502349e23"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_addresses" DROP CONSTRAINT "FK_cfe0bcdbd1fa9de9f2f7a08fe95"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_pricing_models" ADD CONSTRAINT "FK_e87a13cefe49077059dc9eba56a" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "oem"."oem_notification_preferences" ADD CONSTRAINT "FK_86353525ec76a6bdd0d5caaa685" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_saved_alert_rules" ADD CONSTRAINT "FK_0f888ce595cd4ee5a65d3c1f1e8" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "oem"."oem_quote_and_vendo_uuids" ADD CONSTRAINT "FK_1d091dd76b7dd1d2728bc248c6b" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customer_addresses" ADD CONSTRAINT "FK_c5e0fafa9da276bdfe502349e23" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_addresses" ADD CONSTRAINT "FK_cfe0bcdbd1fa9de9f2f7a08fe95" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_bundles_products" DROP CONSTRAINT IF EXISTS "FK_1e1948cb335f18bcdca36508a16"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_bundles_products" DROP CONSTRAINT IF EXISTS "FK_d1c768475d04f9282c7ae961ec1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_addresses" DROP CONSTRAINT "FK_cfe0bcdbd1fa9de9f2f7a08fe95"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customer_addresses" DROP CONSTRAINT "FK_c5e0fafa9da276bdfe502349e23"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quote_and_vendo_uuids" DROP CONSTRAINT "FK_1d091dd76b7dd1d2728bc248c6b"`,
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
      `ALTER TABLE "oem"."oem_saved_alert_rules" DROP CONSTRAINT "FK_0f888ce595cd4ee5a65d3c1f1e8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_notification_preferences" DROP CONSTRAINT "FK_86353525ec76a6bdd0d5caaa685"`,
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
      `ALTER TABLE "oem"."oem_pricing_models" DROP CONSTRAINT "FK_e87a13cefe49077059dc9eba56a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_addresses" ADD CONSTRAINT "FK_cfe0bcdbd1fa9de9f2f7a08fe95" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customer_addresses" ADD CONSTRAINT "FK_c5e0fafa9da276bdfe502349e23" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quote_and_vendo_uuids" ADD CONSTRAINT "FK_1d091dd76b7dd1d2728bc248c6b" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_workflow_rules" ADD CONSTRAINT "FK_9626685ffa8340165fe40c5b015" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles" ADD CONSTRAINT "FK_a067e45b1d138a2d2804536952d" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_users" ADD CONSTRAINT "FK_95598311afd09290acc5dbaaf3a" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_saved_alert_rules" ADD CONSTRAINT "FK_0f888ce595cd4ee5a65d3c1f1e8" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_notification_preferences" ADD CONSTRAINT "FK_86353525ec76a6bdd0d5caaa685" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vacation_rules" ADD CONSTRAINT "FK_7b3b942111796a60a0ac2124cfb" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_shading_rules" ADD CONSTRAINT "FK_2145b22898d173eb4baa09a693f" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ADD CONSTRAINT "UQ_54880fb42ae75c726aad0455b0d" UNIQUE ("quote_uuid")`,
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
      `ALTER TABLE "oem"."oem_customers" ADD CONSTRAINT "UQ_2789a0ce1cf0546ec39ff18e97c" UNIQUE ("customer_email")`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_customer_products" DROP CONSTRAINT "UQ_a1ba06e4a54a88e0c21fd0e3581"`,
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
      `ALTER TABLE "oem"."oem_hierarchy_levels" ADD CONSTRAINT "UQ_b696fdcf589397223d912a07a92" UNIQUE ("level_name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_hierarchy_levels" ADD CONSTRAINT "FK_d44357927326764ec69336fa2cd" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_pricing_models" ADD CONSTRAINT "FK_e87a13cefe49077059dc9eba56a" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "oem_quote_and_vendo_uuid_pkey" ON "oem"."oem_quote_and_vendo_uuids" ("quote_and_vendo_uuid_type") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "oem_notification_preferences_pkey" ON "oem"."oem_notification_preferences" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "oem_discount_rules_pkey" ON "oem"."oem_discount_rules" ("discount_rule_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "oem_quotes_quote_uuid_key" ON "oem"."oem_quotes" ("quote_uuid") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "oem_customers_customer_email_key" ON "oem"."oem_customers" ("customer_email") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "oem_quotes_customer_products_pkey" ON "oem"."oem_quotes_customer_products" ("quote_customer_product_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_company_programs_channel_id_idx" ON "oem"."oem_company_programs" ("channel_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "oem_vendos_vendo_uuid_key" ON "oem"."oem_vendos" ("vendo_uuid") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "oem_product_hierarchy_levels_level_name_level_key" ON "oem"."oem_hierarchy_levels" ("level_name", "level", "company_id") `,
    );
  }
}
