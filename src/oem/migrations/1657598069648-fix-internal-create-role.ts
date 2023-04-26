import { MigrationInterface, QueryRunner } from 'typeorm';

export class fixInternalCreateRole1657598069648 implements MigrationInterface {
  name = 'fixInternalCreateRole1657598069648';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_unit_tiers" ALTER COLUMN "start_range" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_unit_tiers" ALTER COLUMN "end_range" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TYPE "oem"."oem_roles_create_access_enum" RENAME TO "oem_roles_create_access_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_roles_create_access_enum" AS ENUM('All', 'Internal Create', 'Edit & Approve Only', 'View Only')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles" ALTER COLUMN "create_access" TYPE "oem"."oem_roles_create_access_enum" USING "create_access"::"text"::"oem"."oem_roles_create_access_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "oem"."oem_roles_create_access_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_notification_preferences" DROP CONSTRAINT "FK_38d194211b55e13e69fbe0371c1"`,
    );
    // await queryRunner.query(
    //   `ALTER TABLE "oem"."oem_notification_preferences" ADD CONSTRAINT "UQ_38d194211b55e13e69fbe0371c1" UNIQUE ("user_id")`,
    // );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_products" ALTER COLUMN "quantity" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" ALTER COLUMN "quantity" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_notification_preferences" ADD CONSTRAINT "FK_38d194211b55e13e69fbe0371c1" FOREIGN KEY ("user_id") REFERENCES "oem"."oem_users"("user_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_notification_preferences" DROP CONSTRAINT "FK_38d194211b55e13e69fbe0371c1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_customers_products" ALTER COLUMN "quantity" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_products" ALTER COLUMN "quantity" TYPE numeric`,
    );
    // await queryRunner.query(
    //   `ALTER TABLE "oem"."oem_notification_preferences" DROP CONSTRAINT "UQ_38d194211b55e13e69fbe0371c1"`,
    // );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_notification_preferences" ADD CONSTRAINT "FK_38d194211b55e13e69fbe0371c1" FOREIGN KEY ("user_id") REFERENCES "oem"."oem_users"("user_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_roles_create_access_enum_old" AS ENUM('All', 'Create', 'Edit & Approve Only', 'View Only')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_roles" ALTER COLUMN "create_access" TYPE "oem"."oem_roles_create_access_enum_old" USING "create_access"::"text"::"oem"."oem_roles_create_access_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "oem"."oem_roles_create_access_enum"`);
    await queryRunner.query(
      `ALTER TYPE "oem"."oem_roles_create_access_enum_old" RENAME TO "oem_roles_create_access_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_unit_tiers" ALTER COLUMN "end_range" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_unit_tiers" ALTER COLUMN "start_range" TYPE numeric`,
    );
  }
}
