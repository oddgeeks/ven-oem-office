import { MigrationInterface, QueryRunner } from 'typeorm';

export class addLockedFields1680014839515 implements MigrationInterface {
  name = 'addLockedFields1680014839515';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ADD "locked_fields" jsonb DEFAULT '[]'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" DROP COLUMN "locked_fields"`,
    );
  }
}
