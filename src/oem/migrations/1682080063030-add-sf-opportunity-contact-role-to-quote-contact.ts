import { MigrationInterface, QueryRunner } from 'typeorm';

export class addSfOpportunityContactRoleToQuoteContact1682080063030
  implements MigrationInterface
{
  name = 'addSfOpportunityContactRoleToQuoteContact1682080063030';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_contacts" ADD "sf_opportunity_contact_role_id" character varying(36)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_contacts" DROP COLUMN "sf_opportunity_contact_role_id"`,
    );
  }
}
