import { MigrationInterface, QueryRunner } from 'typeorm';

export class addAddressActionLogsEnum1673276791988
  implements MigrationInterface
{
  name = 'addAddressActionLogsEnum1673276791988';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "oem"."oem_action_logs_type_enum" RENAME TO "oem_action_logs_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_action_logs_type_enum" AS ENUM('Vendo', 'Quote', 'Role', 'Material', 'Address', 'ShadingRule', 'WorkflowRule', 'CompanyChannel', 'Company', 'DiscountRule', 'Discount', 'ProductsRelationships', 'PricingModel')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" ALTER COLUMN "type" TYPE "oem"."oem_action_logs_type_enum" USING "type"::"text"::"oem"."oem_action_logs_type_enum"`,
    );
    await queryRunner.query(`DROP TYPE "oem"."oem_action_logs_type_enum_old"`);
    await queryRunner.query(
      `ALTER TYPE "oem"."oem_action_logs_action_enum" RENAME TO "oem_action_logs_action_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_action_logs_action_enum" AS ENUM('Create', 'Update', 'Delete', 'Submit', 'Reject', 'Approve', 'Transact', 'Expire', 'Attach', 'Detach')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" ALTER COLUMN "action" TYPE "oem"."oem_action_logs_action_enum" USING "action"::"text"::"oem"."oem_action_logs_action_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "oem"."oem_action_logs_action_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_action_logs_action_enum_old" AS ENUM('Approve', 'Attach', 'Create', 'Delete', 'Expire', 'Reject', 'Submit', 'Transact', 'Update')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" ALTER COLUMN "action" TYPE "oem"."oem_action_logs_action_enum_old" USING "action"::"text"::"oem"."oem_action_logs_action_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "oem"."oem_action_logs_action_enum"`);
    await queryRunner.query(
      `ALTER TYPE "oem"."oem_action_logs_action_enum_old" RENAME TO "oem_action_logs_action_enum"`,
    );
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
