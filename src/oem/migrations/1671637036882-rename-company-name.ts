import { MigrationInterface, QueryRunner } from 'typeorm';

export class renameCompanyName1671637036882 implements MigrationInterface {
  name = 'renameCompanyName1671637036882';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_contacts" RENAME COLUMN "company_name" TO "company_organisation_name"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_users" ADD "company_organisation_name" character varying(64)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_users" DROP COLUMN "company_organisation_name"`,
    );

    await queryRunner.query(
      `ALTER TABLE "oem"."oem_contacts" RENAME COLUMN "company_organisation_name" TO "company_name"`,
    );
  }
}
