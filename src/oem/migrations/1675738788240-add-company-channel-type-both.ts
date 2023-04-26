import { MigrationInterface, QueryRunner } from 'typeorm';

export class addCompanyChannelTypeBoth1675738788240
  implements MigrationInterface
{
  name = 'addCompanyChannelTypeBoth1675738788240';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "oem"."oem_company_channels_channel_type_enum" RENAME TO "oem_company_channels_channel_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_company_channels_channel_type_enum" AS ENUM('Reseller', 'Distributor', 'Both')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" ALTER COLUMN "channel_type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" ALTER COLUMN "channel_type" TYPE "oem"."oem_company_channels_channel_type_enum" USING "channel_type"::"text"::"oem"."oem_company_channels_channel_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" ALTER COLUMN "channel_type" SET DEFAULT 'Reseller'`,
    );
    await queryRunner.query(
      `DROP TYPE "oem"."oem_company_channels_channel_type_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_company_channels_channel_type_enum_old" AS ENUM('Distributor', 'Reseller')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" ALTER COLUMN "channel_type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" ALTER COLUMN "channel_type" TYPE "oem"."oem_company_channels_channel_type_enum_old" USING "channel_type"::"text"::"oem"."oem_company_channels_channel_type_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_company_channels" ALTER COLUMN "channel_type" SET DEFAULT 'Reseller'`,
    );
    await queryRunner.query(
      `DROP TYPE "oem"."oem_company_channels_channel_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "oem"."oem_company_channels_channel_type_enum_old" RENAME TO "oem_company_channels_channel_type_enum"`,
    );
  }
}
