import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddQuotePinCode1677006242440 implements MigrationInterface {
  name = 'AddQuotePinCode1677006242440';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ADD "pin_code" character varying(6)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" DROP COLUMN "pin_code"`,
    );
  }
}
