import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateIsLockedOnQuotesVendos1660193314286
  implements MigrationInterface
{
  name = 'updateIsLockedOnQuotesVendos1660193314286';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE oem.oem_quotes SET is_locked = TRUE where quote_status in ('Approved', 'Auto-Approved', 'Transacted')`,
    );
    await queryRunner.query(
      `UPDATE oem.oem_vendos SET is_locked = TRUE where vendo_status in ('Approved', 'Auto-Approved', 'Transacted')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
