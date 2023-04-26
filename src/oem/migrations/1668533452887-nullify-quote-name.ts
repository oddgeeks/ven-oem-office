import { MigrationInterface, QueryRunner } from 'typeorm';

export class nullifyQuoteName1668533452887 implements MigrationInterface {
  name = 'nullifyQuoteName1668533452887';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ALTER COLUMN "quote_name" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ALTER COLUMN "quote_name" SET NOT NULL`,
    );
  }
}
