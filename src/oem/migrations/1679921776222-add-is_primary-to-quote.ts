import { MigrationInterface, QueryRunner } from 'typeorm';

export class addIsPrimaryToQuote1679921776222 implements MigrationInterface {
  name = 'addIsPrimaryToQuote1679921776222';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ADD "is_primary" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" DROP COLUMN "is_primary"`,
    );
  }
}
