import { MigrationInterface, QueryRunner } from 'typeorm';

export class addWebsiteIntoCompany1679587780580 implements MigrationInterface {
  name = 'addWebsiteIntoCompany1679587780580';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_companies" ADD "website_url" character varying(1024)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_companies" DROP COLUMN "website_url"`,
    );
  }
}
