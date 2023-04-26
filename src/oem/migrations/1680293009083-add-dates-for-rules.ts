import { MigrationInterface, QueryRunner } from 'typeorm';

export class addDatesForRules1680293009083 implements MigrationInterface {
  name = 'addDatesForRules1680293009083';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_shading_rules" ADD "start_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_shading_rules" ADD "end_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_discount_rules" ADD "start_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_discount_rules" ADD "end_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_saved_alert_rules" ADD "start_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_saved_alert_rules" ADD "end_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_workflow_rules" ADD "start_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_workflow_rules" ADD "end_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_workflow_rules" DROP COLUMN "end_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_workflow_rules" DROP COLUMN "start_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_saved_alert_rules" DROP COLUMN "end_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_saved_alert_rules" DROP COLUMN "start_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_discount_rules" DROP COLUMN "end_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_discount_rules" DROP COLUMN "start_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_shading_rules" DROP COLUMN "end_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_shading_rules" DROP COLUMN "start_date"`,
    );
  }
}
