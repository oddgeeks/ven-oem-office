import { MigrationInterface, QueryRunner } from 'typeorm';

export class addLockedFieldsToQuotesVendos1660864385901
  implements MigrationInterface
{
  name = 'addLockedFieldsToQuotesVendos1660864385901';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos_quotes" ADD "is_locked" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos_quotes" ADD "locked_fields" jsonb NOT NULL DEFAULT '[]'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos_quotes" DROP COLUMN "locked_fields"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos_quotes" DROP COLUMN "is_locked"`,
    );
  }
}
