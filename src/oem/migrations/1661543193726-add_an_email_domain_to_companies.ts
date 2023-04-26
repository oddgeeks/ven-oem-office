import { MigrationInterface, QueryRunner } from 'typeorm';

export class addAnEmailDomainToCompanies1661543193726
  implements MigrationInterface
{
  name = 'addAnEmailDomainToCompanies1661543193726';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_companies" ADD "email_domain" character varying(128) DEFAULT 'bloodandtreasure,vendori' NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_companies" DROP COLUMN "email_domain"`,
    );
  }
}
