import { MigrationInterface, QueryRunner } from 'typeorm';

import { DB_MAIN_DATABASE as DB_NAME } from '../../environments';

export class addRuleUniques1682545929805 implements MigrationInterface {
  name = 'addRuleUniques1682545929805';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_shading_rules" DROP CONSTRAINT "FK_2145b22898d173eb4baa09a693f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_shading_rules" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_shading_rules" ALTER COLUMN "start_date" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_shading_rules" ALTER COLUMN "start_date" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_shading_rules" ALTER COLUMN "end_date" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_shading_rules" ALTER COLUMN "end_date" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vacation_rules" DROP CONSTRAINT "FK_7b3b942111796a60a0ac2124cfb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vacation_rules" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_discounts_discounts_rules" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_discount_rules" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_discount_rules" ALTER COLUMN "start_date" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_discount_rules" ALTER COLUMN "start_date" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_discount_rules" ALTER COLUMN "end_date" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_discount_rules" ALTER COLUMN "end_date" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_saved_alert_rules" ALTER COLUMN "start_date" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_saved_alert_rules" ALTER COLUMN "start_date" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_saved_alert_rules" ALTER COLUMN "end_date" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_saved_alert_rules" ALTER COLUMN "end_date" DROP DEFAULT`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_workflow_rules" DROP CONSTRAINT "FK_9626685ffa8340165fe40c5b015"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_workflow_rules" ALTER COLUMN "company_id" SET DEFAULT current_setting('${DB_NAME}.current_tenant')::int`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_workflow_rules" ALTER COLUMN "start_date" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_workflow_rules" ALTER COLUMN "start_date" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_workflow_rules" ALTER COLUMN "end_date" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_workflow_rules" ALTER COLUMN "end_date" DROP DEFAULT`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "oem_shading_rules_rule_name_idx" ON "oem"."oem_shading_rules" ("shading_rule_name", "company_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "oem_vacation_rule_rule_name_idx" ON "oem"."oem_vacation_rules" ("name", "company_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "oem_discount_rules_discount_rule_name_idx" ON "oem"."oem_discount_rules" ("discount_rule_name", "company_id") `,
    );
    await queryRunner.query(`DROP INDEX "oem"."oem_discount_rules_pkey"`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "oem_discount_rules_pkey" ON "oem"."oem_discount_rules" ("discount_rule_id", "company_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "oem_saved_alert_rules_rule_name_idx" ON "oem"."oem_saved_alert_rules" ("name", "company_id") `,
    );

    await queryRunner.query(
      `CREATE UNIQUE INDEX "oem_workflow_rules_rule_name_idx" ON "oem"."oem_workflow_rules" ("workflow_rule_name", "company_id") `,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_shading_rules" ADD CONSTRAINT "FK_2145b22898d173eb4baa09a693f" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vacation_rules" ADD CONSTRAINT "FK_7b3b942111796a60a0ac2124cfb" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_workflow_rules" ADD CONSTRAINT "FK_9626685ffa8340165fe40c5b015" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_workflow_rules" DROP CONSTRAINT "FK_9626685ffa8340165fe40c5b015"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vacation_rules" DROP CONSTRAINT "FK_7b3b942111796a60a0ac2124cfb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_shading_rules" DROP CONSTRAINT "FK_2145b22898d173eb4baa09a693f"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_workflow_rules_rule_name_idx"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_saved_alert_rules_rule_name_idx"`,
    );

    await queryRunner.query(`DROP INDEX "oem"."oem_discount_rules_pkey"`);
    await queryRunner.query(
      `DROP INDEX "oem"."oem_discount_rules_discount_rule_name_idx"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_vacation_rule_rule_name_idx"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_shading_rules_rule_name_idx"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_workflow_rules" ALTER COLUMN "end_date" SET DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_workflow_rules" ALTER COLUMN "end_date" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_workflow_rules" ALTER COLUMN "start_date" SET DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_workflow_rules" ALTER COLUMN "start_date" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_workflow_rules" ALTER COLUMN "company_id" SET DEFAULT (current_setting('${DB_NAME}.current_tenant'))`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_workflow_rules" ADD CONSTRAINT "FK_9626685ffa8340165fe40c5b015" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_saved_alert_rules" ALTER COLUMN "end_date" SET DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_saved_alert_rules" ALTER COLUMN "end_date" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_saved_alert_rules" ALTER COLUMN "start_date" SET DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_saved_alert_rules" ALTER COLUMN "start_date" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_discount_rules" ALTER COLUMN "end_date" SET DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_discount_rules" ALTER COLUMN "end_date" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_discount_rules" ALTER COLUMN "start_date" SET DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_discount_rules" ALTER COLUMN "start_date" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_discount_rules" ALTER COLUMN "company_id" SET DEFAULT (current_setting('${DB_NAME}.current_tenant'))`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vacation_rules" ALTER COLUMN "company_id" SET DEFAULT (current_setting('${DB_NAME}.current_tenant'))`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vacation_rules" ADD CONSTRAINT "FK_7b3b942111796a60a0ac2124cfb" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_shading_rules" ALTER COLUMN "end_date" SET DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_shading_rules" ALTER COLUMN "end_date" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_shading_rules" ALTER COLUMN "start_date" SET DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_shading_rules" ALTER COLUMN "start_date" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_shading_rules" ALTER COLUMN "company_id" SET DEFAULT (current_setting('${DB_NAME}.current_tenant'))`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_shading_rules" ADD CONSTRAINT "FK_2145b22898d173eb4baa09a693f" FOREIGN KEY ("company_id") REFERENCES "oem"."oem_companies"("company_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "oem_discount_rules_pkey" ON "oem"."oem_discount_rules" ("discount_rule_id") `,
    );
  }
}
