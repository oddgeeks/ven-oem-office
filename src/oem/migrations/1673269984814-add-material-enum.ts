import { MigrationInterface, QueryRunner } from 'typeorm';

export class addMaterialEnum1673269984814 implements MigrationInterface {
  name = 'addMaterialEnum1673269984814';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "oem"."oem_action_logs_type_enum" RENAME TO "oem_action_logs_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_action_logs_type_enum" AS ENUM('Vendo', 'Quote', 'Role', 'Material', 'ShadingRule', 'WorkflowRule', 'CompanyChannel', 'Company', 'DiscountRule', 'Discount', 'ProductsRelationships', 'PricingModel')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" ALTER COLUMN "type" TYPE "oem"."oem_action_logs_type_enum" USING "type"::"text"::"oem"."oem_action_logs_type_enum"`,
    );
    await queryRunner.query(`DROP TYPE "oem"."oem_action_logs_type_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_action_logs_type_enum_old" AS ENUM('Company', 'CompanyChannel', 'Discount', 'DiscountRule', 'PricingModel', 'ProductsRelationships', 'Quote', 'Role', 'ShadingRule', 'Vendo', 'WorkflowRule')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" ALTER COLUMN "type" TYPE "oem"."oem_action_logs_type_enum_old" USING "type"::"text"::"oem"."oem_action_logs_type_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "oem"."oem_action_logs_type_enum"`);
    await queryRunner.query(
      `ALTER TYPE "oem"."oem_action_logs_type_enum_old" RENAME TO "oem_action_logs_type_enum"`,
    );
  }
}
