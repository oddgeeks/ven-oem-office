import { MigrationInterface, QueryRunner } from 'typeorm';

export class addComapnyIdToQuoteProducts1657128788224
  implements MigrationInterface
{
  name = 'addComapnyIdToQuoteProducts1657128788224';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_products" ADD "company_id" integer NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_action_logs_type_enum" AS ENUM('Vendo Changes', 'Quote Changes', 'Shading Rules')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" ADD "type" "oem"."oem_action_logs_type_enum" NOT NULL`,
    );
    await queryRunner.query(
      `Update "oem"."oem_vendos" SET "is_locked" = true WHERE "is_locked" = NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos" ALTER COLUMN "is_locked" SET NOT NULL`,
    );
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
      `ALTER TABLE "oem"."oem_action_logs" ADD "association" jsonb NOT NULL`,
    );
    await queryRunner.query(`DROP INDEX "oem"."oem_action_logs_subject_idx"`);
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" DROP COLUMN "subject"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" ADD "subject" jsonb NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" DROP COLUMN "action"`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_action_logs_action_enum" AS ENUM('Submit', 'Reject', 'Approve', 'Transact', 'Update', 'Attach', 'Delete', 'Change')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" ADD "action" "oem"."oem_action_logs_action_enum" NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_quotes_products_company_id_idx" ON "oem"."oem_quotes_products" ("company_id") `,
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
      `DROP INDEX "oem"."oem_quotes_products_company_id_idx"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" DROP COLUMN "action"`,
    );
    await queryRunner.query(`DROP TYPE "oem"."oem_action_logs_action_enum"`);
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" ADD "action" character varying(128) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" DROP COLUMN "subject"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" ADD "subject" integer NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_action_logs_subject_idx" ON "oem"."oem_action_logs" ("subject") `,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" DROP COLUMN "association"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" ADD "association" integer NOT NULL`,
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
      `ALTER TABLE "oem"."oem_discounts" ALTER COLUMN "priority" SET NOT NULL`,
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
      `ALTER TABLE "oem"."oem_vendos" ALTER COLUMN "is_locked" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" DROP COLUMN "type"`,
    );
    await queryRunner.query(`DROP TYPE "oem"."oem_action_logs_type_enum"`);
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_products" DROP COLUMN "company_id"`,
    );
  }
}
