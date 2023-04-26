import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateCompanySettings1674240366460 implements MigrationInterface {
  name = 'updateCompanySettings1674240366460';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_companies" ALTER COLUMN "settings" SET DEFAULT '{"companyPrimaryColor":{"a":1,"b":187,"g":137,"r":74},"customListPriceName":"List Price","customCustomerPriceName":"Price To Customer"}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_companies" ALTER COLUMN "settings" SET DEFAULT '{"customListPriceName": "List Price", "customCustomerPriceName": "Price To Customer"}'`,
    );
  }
}
