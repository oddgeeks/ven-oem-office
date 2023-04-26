import { MigrationInterface, QueryRunner } from 'typeorm';

export class addSettingsJsonbToSalesforceIntegration1679926132732
  implements MigrationInterface
{
  name = 'addSettingsJsonbToSalesforceIntegration1679926132732';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_salesforce_integrations" ADD "settings" jsonb DEFAULT '{}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_salesforce_integrations" DROP COLUMN "settings"`,
    );
  }
}
