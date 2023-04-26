import { MigrationInterface, QueryRunner } from 'typeorm';

export class addCompanyIdGroupIndex1677201531794 implements MigrationInterface {
  name = 'addCompanyIdGroupIndex1677201531794';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "oem"."oem_users_sso_login_email_phone_key"`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "oem_users_sso_login_email_phone_key" ON "oem"."oem_users" ("phone", "sso_login_email", "company_id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "oem"."oem_users_sso_login_email_phone_key"`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "oem_users_sso_login_email_phone_key" ON "oem"."oem_users" ("sso_login_email", "phone") `,
    );
  }
}
