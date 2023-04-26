import { MigrationInterface, QueryRunner } from 'typeorm';

export class addSfMetadataToQuotes1680333702812 implements MigrationInterface {
  name = 'addSfMetadataToQuotes1680333702812';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ADD "sf_metadata" jsonb DEFAULT '[]'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" DROP COLUMN "sf_metadata"`,
    );
  }
}
