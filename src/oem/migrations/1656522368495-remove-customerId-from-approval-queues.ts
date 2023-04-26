import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeCustomerIdFromApprovalQueues1656522368495
  implements MigrationInterface
{
  name = 'removeCustomerIdFromApprovalQueues1656522368495';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendo_approval_queues" DROP CONSTRAINT "FK_816c4bd7526037374c7cc1a89c7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quote_approval_queues" DROP CONSTRAINT "FK_422ef17d862a8da93935bb38908"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_vendo_approval_queues_customer_id_idx"`,
    );
    await queryRunner.query(
      `DROP INDEX "oem"."oem_quote_approval_queues_customer_id_idx"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendo_approval_queues" DROP COLUMN "customer_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quote_approval_queues" DROP COLUMN "customer_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos" ALTER COLUMN "is_locked" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TYPE "oem"."oem_vendo_approval_queues_target_type_enum" RENAME TO "oem_vendo_approval_queues_target_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_vendo_approval_queues_target_type_enum" AS ENUM('User', 'Customer', 'Internal', 'External')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendo_approval_queues" ALTER COLUMN "target_type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendo_approval_queues" ALTER COLUMN "target_type" TYPE "oem"."oem_vendo_approval_queues_target_type_enum" USING "target_type"::"text"::"oem"."oem_vendo_approval_queues_target_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendo_approval_queues" ALTER COLUMN "target_type" SET DEFAULT 'User'`,
    );
    await queryRunner.query(
      `DROP TYPE "oem"."oem_vendo_approval_queues_target_type_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TYPE "oem"."oem_quote_approval_queues_target_type_enum" RENAME TO "oem_quote_approval_queues_target_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_quote_approval_queues_target_type_enum" AS ENUM('User', 'Customer', 'Internal', 'External')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quote_approval_queues" ALTER COLUMN "target_type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quote_approval_queues" ALTER COLUMN "target_type" TYPE "oem"."oem_quote_approval_queues_target_type_enum" USING "target_type"::"text"::"oem"."oem_quote_approval_queues_target_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quote_approval_queues" ALTER COLUMN "target_type" SET DEFAULT 'User'`,
    );
    await queryRunner.query(
      `DROP TYPE "oem"."oem_quote_approval_queues_target_type_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_unit_tiers" ALTER COLUMN "start_range" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_unit_tiers" ALTER COLUMN "end_range" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_products" ALTER COLUMN "quantity" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" ALTER COLUMN "quantity" TYPE numeric`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" ALTER COLUMN "quantity" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_products" ALTER COLUMN "quantity" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_unit_tiers" ALTER COLUMN "end_range" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_unit_tiers" ALTER COLUMN "start_range" TYPE numeric`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_quote_approval_queues_target_type_enum_old" AS ENUM('User', 'Customer', 'Internal', 'Exteral')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quote_approval_queues" ALTER COLUMN "target_type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quote_approval_queues" ALTER COLUMN "target_type" TYPE "oem"."oem_quote_approval_queues_target_type_enum_old" USING "target_type"::"text"::"oem"."oem_quote_approval_queues_target_type_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quote_approval_queues" ALTER COLUMN "target_type" SET DEFAULT 'User'`,
    );
    await queryRunner.query(
      `DROP TYPE "oem"."oem_quote_approval_queues_target_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "oem"."oem_quote_approval_queues_target_type_enum_old" RENAME TO "oem_quote_approval_queues_target_type_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_vendo_approval_queues_target_type_enum_old" AS ENUM('User', 'Customer')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendo_approval_queues" ALTER COLUMN "target_type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendo_approval_queues" ALTER COLUMN "target_type" TYPE "oem"."oem_vendo_approval_queues_target_type_enum_old" USING "target_type"::"text"::"oem"."oem_vendo_approval_queues_target_type_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendo_approval_queues" ALTER COLUMN "target_type" SET DEFAULT 'User'`,
    );
    await queryRunner.query(
      `DROP TYPE "oem"."oem_vendo_approval_queues_target_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "oem"."oem_vendo_approval_queues_target_type_enum_old" RENAME TO "oem_vendo_approval_queues_target_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos" ALTER COLUMN "is_locked" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quote_approval_queues" ADD "customer_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendo_approval_queues" ADD "customer_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_quote_approval_queues_customer_id_idx" ON "oem"."oem_quote_approval_queues" ("customer_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_vendo_approval_queues_customer_id_idx" ON "oem"."oem_vendo_approval_queues" ("customer_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quote_approval_queues" ADD CONSTRAINT "FK_422ef17d862a8da93935bb38908" FOREIGN KEY ("customer_id") REFERENCES "oem"."oem_customers"("customer_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendo_approval_queues" ADD CONSTRAINT "FK_816c4bd7526037374c7cc1a89c7" FOREIGN KEY ("customer_id") REFERENCES "oem"."oem_customers"("customer_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
