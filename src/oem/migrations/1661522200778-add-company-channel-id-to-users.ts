import { MigrationInterface, QueryRunner } from 'typeorm';

export class addCompanyChannelIdToUsers1661522200778
  implements MigrationInterface
{
  name = 'addCompanyChannelIdToUsers1661522200778';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_users" ADD "company_channel_id" integer`,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_users_company_channel_id_idx" ON "oem"."oem_users" ("company_channel_id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "oem"."oem_users_company_channel_id_idx"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_users" DROP COLUMN "company_channel_id"`,
    );
  }
}
