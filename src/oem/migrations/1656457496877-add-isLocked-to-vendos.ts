import { MigrationInterface, QueryRunner } from 'typeorm';

export class addIsLockedToVendos1656457496877 implements MigrationInterface {
  name = 'addIsLockedToVendos1656457496877';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos" ADD "is_locked" boolean`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos" DROP COLUMN "is_locked"`,
    );
  }
}
