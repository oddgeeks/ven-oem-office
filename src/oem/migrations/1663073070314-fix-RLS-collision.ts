import { MigrationInterface, QueryRunner } from 'typeorm';

export class fixRLSCollision1663073070314 implements MigrationInterface {
  name = 'fixRLSCollision1663073070314';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_hierarchy_levels" DROP CONSTRAINT "FK_d44357927326764ec69336fa2cd"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_programs" DROP CONSTRAINT "FK_94cd4d42abc977df4bb44485b54"`,
    );

    /*
        await queryRunner.query(
          `ALTER TABLE "oem"."oem_channels" DROP COLUMN "contact_email"`,
        );
        await queryRunner.query(
          `ALTER TABLE "oem"."oem_channels" ADD "contact_email" character varying(256) NOT NULL`,
        );
        */
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_channels" ALTER COLUMN "contact_email" TYPE character varying(256)`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" DROP CONSTRAINT "FK_92d17119739056d2abf91f79d23"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_hierarchies" DROP CONSTRAINT "FK_1629c814fc24d7c3b85b8f364a6"`,
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
      `ALTER TYPE "oem"."oem_quote_approval_queues_status_enum" RENAME TO "oem_quote_approval_queues_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_quote_approval_queues_status_enum" AS ENUM('Transacted', 'Pending', 'Approved', 'Expired', 'Rejected')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quote_approval_queues" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quote_approval_queues" ALTER COLUMN "status" TYPE "oem"."oem_quote_approval_queues_status_enum" USING "status"::"text"::"oem"."oem_quote_approval_queues_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quote_approval_queues" ALTER COLUMN "status" SET DEFAULT 'Pending'`,
    );
    await queryRunner.query(
      `DROP TYPE "oem"."oem_quote_approval_queues_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_notifications" DROP CONSTRAINT "FK_25c9e6831f309eb607f22422a27"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_licensing_programs" DROP CONSTRAINT "FK_997f11267d8885b0f826e393642"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_products" ALTER COLUMN "quantity" TYPE numeric`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" DROP CONSTRAINT "FK_0fe22bb3526f24501c6bbd50903"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_shading_rules" DROP CONSTRAINT "FK_2145b22898d173eb4baa09a693f"`,
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
      `ALTER TABLE "oem"."oem_workflow_rules" DROP CONSTRAINT "FK_9626685ffa8340165fe40c5b015"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vacation_rules" DROP CONSTRAINT "FK_7b3b942111796a60a0ac2124cfb"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_companies" ADD CONSTRAINT "UQ_d841e398b10978b6833e5882e95" UNIQUE ("email_domain")`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_companies" ALTER COLUMN "email_domain" DROP DEFAULT`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles" DROP CONSTRAINT "FK_a067e45b1d138a2d2804536952d"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_users" DROP CONSTRAINT "FK_95598311afd09290acc5dbaaf3a"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" ALTER COLUMN "quantity" TYPE numeric`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_addresses" DROP CONSTRAINT "FK_cfe0bcdbd1fa9de9f2f7a08fe95"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_hierarchy_levels" ADD CONSTRAINT "FK_d44357927326764ec69336fa2cd" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_programs" ADD CONSTRAINT "FK_94cd4d42abc977df4bb44485b54" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" ADD CONSTRAINT "FK_92d17119739056d2abf91f79d23" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
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
      `ALTER TABLE "oem"."oem_quotes_products" ADD CONSTRAINT "FK_168bcd4c02abe3729cfd77c4ee1" FOREIGN KEY ("quote_id") REFERENCES "oem"."oem_quotes"("quote_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_customer_products" ADD CONSTRAINT "FK_64e5c27b6080a49b87cce340b81" FOREIGN KEY ("quote_id") REFERENCES "oem"."oem_quotes"("quote_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
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
      `ALTER TABLE "oem"."oem_users" ADD CONSTRAINT "FK_7e2546ae63fc189b5e3c4e80e34" FOREIGN KEY ("company_channel_id") REFERENCES "oem"."oem_company_channels"("company_channel_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "oem"."oem_users" DROP CONSTRAINT "FK_7e2546ae63fc189b5e3c4e80e34"`,
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
      `ALTER TABLE "oem"."oem_quotes_customer_products" DROP CONSTRAINT "FK_64e5c27b6080a49b87cce340b81"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_products" DROP CONSTRAINT "FK_168bcd4c02abe3729cfd77c4ee1"`,
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
      `ALTER TABLE "oem"."oem_company_channels" DROP CONSTRAINT "FK_92d17119739056d2abf91f79d23"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_programs" DROP CONSTRAINT "FK_94cd4d42abc977df4bb44485b54"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_hierarchy_levels" DROP CONSTRAINT "FK_d44357927326764ec69336fa2cd"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_addresses" ADD CONSTRAINT "FK_cfe0bcdbd1fa9de9f2f7a08fe95" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" ALTER COLUMN "quantity" TYPE numeric`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_users" ADD CONSTRAINT "FK_95598311afd09290acc5dbaaf3a" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles" ADD CONSTRAINT "FK_a067e45b1d138a2d2804536952d" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_companies" ALTER COLUMN "email_domain" SET DEFAULT 'bloodandtreasure,vendori'`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_companies" DROP CONSTRAINT "UQ_d841e398b10978b6833e5882e95"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vacation_rules" ADD CONSTRAINT "FK_7b3b942111796a60a0ac2124cfb" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_workflow_rules" ADD CONSTRAINT "FK_9626685ffa8340165fe40c5b015" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "oem"."oem_shading_rules" ADD CONSTRAINT "FK_2145b22898d173eb4baa09a693f" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ADD CONSTRAINT "FK_0fe22bb3526f24501c6bbd50903" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_products" ALTER COLUMN "quantity" TYPE numeric`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_licensing_programs" ADD CONSTRAINT "FK_997f11267d8885b0f826e393642" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_notifications" ADD CONSTRAINT "FK_25c9e6831f309eb607f22422a27" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_quote_approval_queues_status_enum_old" AS ENUM('Pending', 'Approved', 'Expired', 'Rejected')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quote_approval_queues" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quote_approval_queues" ALTER COLUMN "status" TYPE "oem"."oem_quote_approval_queues_status_enum_old" USING "status"::"text"::"oem"."oem_quote_approval_queues_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quote_approval_queues" ALTER COLUMN "status" SET DEFAULT 'Pending'`,
    );
    await queryRunner.query(
      `DROP TYPE "oem"."oem_quote_approval_queues_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "oem"."oem_quote_approval_queues_status_enum_old" RENAME TO "oem_quote_approval_queues_status_enum"`,
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
      `ALTER TABLE "oem"."oem_hierarchies" ADD CONSTRAINT "FK_1629c814fc24d7c3b85b8f364a6" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" ADD CONSTRAINT "FK_92d17119739056d2abf91f79d23" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    /*
        await queryRunner.query(
          `ALTER TABLE "oem"."oem_channels" DROP COLUMN "contact_email"`,
        );
        await queryRunner.query(
          `ALTER TABLE "oem"."oem_channels" ADD "contact_email" character varying(128) NOT NULL`,
        );
        */
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_channels" ALTER COLUMN "contact_email" TYPE character varying(128)`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_programs" ADD CONSTRAINT "FK_94cd4d42abc977df4bb44485b54" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_hierarchy_levels" ADD CONSTRAINT "FK_d44357927326764ec69336fa2cd" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
