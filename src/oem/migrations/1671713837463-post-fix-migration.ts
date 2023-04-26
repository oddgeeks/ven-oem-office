import { MigrationInterface, QueryRunner } from 'typeorm';

export class postFixMigration1671713837463 implements MigrationInterface {
  name = 'postFixMigration1671713837463';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const existingRecords = await queryRunner.query(
      `SELECT * FROM "oem"."oem_action_logs"`,
    );
    const existingRecordValues = existingRecords.map((r) => {
      return {
        id: r.action_log_id,
        type: r.type,
        action: r.action,
      };
    });

    // May need to comment these out when deploying live:
    // await queryRunner.query(`ALTER TABLE "oem"."oem_contacts" RENAME COLUMN "company_name" TO "company_organisation_name"`);
    // await queryRunner.query(`ALTER TABLE "oem"."oem_users" ADD "company_organisation_name" character varying(64)`);

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
      `ALTER TABLE "oem"."oem_quotes_products" ALTER COLUMN "quantity" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_hierarchy_levels" DROP CONSTRAINT "FK_d44357927326764ec69336fa2cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_contacts" ALTER COLUMN "company_organisation_name" DROP NOT NULL`,
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
      `ALTER TABLE "oem"."oem_customers_products" ALTER COLUMN "quantity" TYPE numeric`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_notifications" DROP CONSTRAINT "FK_25c9e6831f309eb607f22422a27"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" DROP CONSTRAINT "FK_0fe22bb3526f24501c6bbd50903"`,
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
      `ALTER TABLE "oem"."oem_notification_preferences" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_saved_alert_rules" DROP CONSTRAINT "FK_0f888ce595cd4ee5a65d3c1f1e8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_saved_alert_rules" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_users" DROP CONSTRAINT "FK_95598311afd09290acc5dbaaf3a"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_users" DROP COLUMN "password_encrypted"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_users" ADD "password_encrypted" character varying(60)`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles" DROP CONSTRAINT "FK_a067e45b1d138a2d2804536952d"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles" DROP CONSTRAINT "UQ_5d20494ee7c8fea5d28699c1ea0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_workflow_rules" DROP CONSTRAINT "FK_9626685ffa8340165fe40c5b015"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quote_and_vendo_uuids" DROP CONSTRAINT "FK_1d091dd76b7dd1d2728bc248c6b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quote_and_vendo_uuids" ALTER COLUMN "company_id" DROP DEFAULT`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_addresses" DROP CONSTRAINT "FK_cfe0bcdbd1fa9de9f2f7a08fe95"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_addresses" ADD CONSTRAINT "UQ_cfe0bcdbd1fa9de9f2f7a08fe95" UNIQUE ("company_id")`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" ALTER COLUMN "company_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TYPE "oem"."oem_action_logs_type_enum" RENAME TO "oem_action_logs_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_action_logs_type_enum" AS ENUM('Vendo', 'Quote', 'Role', 'ShadingRule', 'WorkflowRule', 'CompanyChannel', 'Company', 'DiscountRule', 'Discount', 'ProductsRelationships', 'PricingModel')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" ALTER COLUMN "type" TYPE "oem"."oem_action_logs_type_enum" USING "type"::"text"::"oem"."oem_action_logs_type_enum"`,
    );
    await queryRunner.query(`DROP TYPE "oem"."oem_action_logs_type_enum_old"`);
    await queryRunner.query(
      `ALTER TYPE "oem"."oem_action_logs_action_enum" RENAME TO "oem_action_logs_action_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_action_logs_action_enum" AS ENUM('Create', 'Update', 'Delete', 'Submit', 'Reject', 'Approve', 'Transact', 'Expire', 'Attach')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" ALTER COLUMN "action" TYPE "oem"."oem_action_logs_action_enum" USING "action"::"text"::"oem"."oem_action_logs_action_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "oem"."oem_action_logs_action_enum_old"`,
    );
    await queryRunner.query(
      `Update "oem"."oem_action_logs" SET type = 'Discount', action = 'Expire'`,
    );

    let actionLogsUpdate = '';
    existingRecordValues.map((r) => {
      r.action = r.action.replace(/ |s$/g, '');
      r.type = r.type.replace(/ |s$/g, '');

      // console.log('Updated Values', r.action, r.type);

      actionLogsUpdate = `UPDATE oem.oem_action_logs SET action = '${r.action}', type = '${r.type}' WHERE action_log_id = '${r.id}';`;

      return r;
    });
    await queryRunner.query(actionLogsUpdate);

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
      `ALTER TABLE "oem"."oem_company_channels" ADD CONSTRAINT "FK_f0f0dacddcebe12214e3205c149" FOREIGN KEY ("licensing_program_id") REFERENCES "oem"."oem_licensing_programs"("licensing_program_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_hierarchies" ADD CONSTRAINT "FK_1629c814fc24d7c3b85b8f364a6" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_notifications" ADD CONSTRAINT "FK_25c9e6831f309eb607f22422a27" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
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
      `ALTER TABLE "oem"."oem_customer_addresses" ADD CONSTRAINT "FK_25f5d9f8dd9ee3abc3d83a21a5a" FOREIGN KEY ("address_id") REFERENCES "oem"."oem_addresses"("address_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customer_addresses" ADD CONSTRAINT "FK_fc71632334333ce59b620a8dca7" FOREIGN KEY ("customer_id") REFERENCES "oem"."oem_customers"("customer_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_addresses" ADD CONSTRAINT "FK_cfe0bcdbd1fa9de9f2f7a08fe95" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_addresses" DROP CONSTRAINT "FK_cfe0bcdbd1fa9de9f2f7a08fe95"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customer_addresses" DROP CONSTRAINT "FK_fc71632334333ce59b620a8dca7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customer_addresses" DROP CONSTRAINT "FK_25f5d9f8dd9ee3abc3d83a21a5a"`,
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
      `ALTER TABLE "oem"."oem_notifications" DROP CONSTRAINT "FK_25c9e6831f309eb607f22422a27"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_hierarchies" DROP CONSTRAINT "FK_1629c814fc24d7c3b85b8f364a6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" DROP CONSTRAINT "FK_f0f0dacddcebe12214e3205c149"`,
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
      `CREATE TYPE "oem"."oem_action_logs_action_enum_old" AS ENUM('Approve', 'Attach', 'Change', 'Delete', 'Reject', 'Submit', 'Transact', 'Update')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" ALTER COLUMN "action" TYPE "oem"."oem_action_logs_action_enum_old" USING "action"::"text"::"oem"."oem_action_logs_action_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "oem"."oem_action_logs_action_enum"`);
    await queryRunner.query(
      `ALTER TYPE "oem"."oem_action_logs_action_enum_old" RENAME TO "oem_action_logs_action_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_action_logs_type_enum_old" AS ENUM('Company Channels', 'Quote Changes', 'Shading Rules', 'Vendo Changes', 'Workflow Rules')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" ALTER COLUMN "type" TYPE "oem"."oem_action_logs_type_enum_old" USING "type"::"text"::"oem"."oem_action_logs_type_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "oem"."oem_action_logs_type_enum"`);
    await queryRunner.query(
      `ALTER TYPE "oem"."oem_action_logs_type_enum_old" RENAME TO "oem_action_logs_type_enum"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_addresses" DROP CONSTRAINT "UQ_cfe0bcdbd1fa9de9f2f7a08fe95"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_addresses" ADD CONSTRAINT "FK_cfe0bcdbd1fa9de9f2f7a08fe95" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quote_and_vendo_uuids" ADD CONSTRAINT "FK_1d091dd76b7dd1d2728bc248c6b" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_workflow_rules" ADD CONSTRAINT "FK_9626685ffa8340165fe40c5b015" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles" ADD CONSTRAINT "UQ_5d20494ee7c8fea5d28699c1ea0" UNIQUE ("role_name")`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles" ADD CONSTRAINT "FK_a067e45b1d138a2d2804536952d" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_users" DROP COLUMN "password_encrypted"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_users" ADD "password_encrypted" character varying(256)`,
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
      `ALTER TABLE "oem"."oem_quotes" ADD CONSTRAINT "FK_0fe22bb3526f24501c6bbd50903" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_notifications" ADD CONSTRAINT "FK_25c9e6831f309eb607f22422a27" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" ALTER COLUMN "quantity" TYPE numeric`,
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
      `ALTER TABLE "oem"."oem_contacts" ALTER COLUMN "company_organisation_name" SET NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_hierarchy_levels" ADD CONSTRAINT "FK_d44357927326764ec69336fa2cd" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_products" ALTER COLUMN "quantity" TYPE numeric`,
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
      `ALTER TABLE "oem"."oem_users" DROP COLUMN "company_organisation_name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_contacts" RENAME COLUMN "company_organisation_name" TO "company_name"`,
    );
  }
}
