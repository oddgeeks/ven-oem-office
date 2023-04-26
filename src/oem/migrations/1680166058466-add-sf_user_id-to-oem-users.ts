import { MigrationInterface, QueryRunner } from 'typeorm';

export class addSfUserIdToOemUsers1680166058466 implements MigrationInterface {
  name = 'addSfUserIdToOemUsers1680166058466';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_users" ADD "sf_user_id" character varying(24)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_users" DROP COLUMN "sf_user_id"`,
    );
  }
}
