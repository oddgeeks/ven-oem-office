import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateAddressType1664891971030 implements MigrationInterface {
  name = 'updateAddressType1664891971030';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "oem"."oem_roles_role_name_idx"`);
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_addresses" DROP COLUMN "is_billing"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_addresses" DROP COLUMN "is_shipping"`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_addresses_address_type_enum" AS ENUM('Billing', 'Shipping')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_addresses" ADD "address_type" "oem"."oem_addresses_address_type_enum" NOT NULL DEFAULT 'Billing'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_addresses" DROP COLUMN "address_type"`,
    );
    await queryRunner.query(
      `DROP TYPE "oem"."oem_addresses_address_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_addresses" ADD "is_shipping" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_addresses" ADD "is_billing" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "oem_roles_role_name_idx" ON "oem"."oem_roles" ("role_name") `,
    );
  }
}
