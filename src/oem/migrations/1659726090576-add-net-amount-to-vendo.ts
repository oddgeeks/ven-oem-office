import { MigrationInterface, QueryRunner } from 'typeorm';

export class addNetAmountToVendo1659726090576 implements MigrationInterface {
  name = 'addNetAmountToVendo1659726090576';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos" ADD "net_amount" numeric NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos" DROP COLUMN "net_amount"`,
    );
  }
}
