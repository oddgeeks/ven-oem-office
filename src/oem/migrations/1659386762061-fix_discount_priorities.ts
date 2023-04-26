import { MigrationInterface, QueryRunner } from 'typeorm';

export class fixDiscountPriorities1659386762061 implements MigrationInterface {
  name = 'fixDiscountPriorities1659386762061';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_discount_priorities" ALTER COLUMN "priority" SET DEFAULT '1'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_discount_priorities" ALTER COLUMN "priority" DROP DEFAULT`,
    );
  }
}
