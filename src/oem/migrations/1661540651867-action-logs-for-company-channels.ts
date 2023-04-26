import { MigrationInterface, QueryRunner } from 'typeorm';

export class actionLogsForCompanyChannels1661540651867
  implements MigrationInterface
{
  name = 'actionLogsForCompanyChannels1661540651867';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "oem"."oem_action_logs_type_enum" RENAME TO "oem_action_logs_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_action_logs_type_enum" AS ENUM('Vendo Changes', 'Quote Changes', 'Shading Rules', 'Workflow Rules', 'Company Channels')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" ALTER COLUMN "type" TYPE "oem"."oem_action_logs_type_enum" USING "type"::"text"::"oem"."oem_action_logs_type_enum"`,
    );
    await queryRunner.query(`DROP TYPE "oem"."oem_action_logs_type_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "oem"."oem_action_logs_type_enum" RENAME TO "oem_action_logs_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "oem"."oem_action_logs_type_enum" AS ENUM('Vendo Changes', 'Quote Changes', 'Shading Rules', 'Workflow Rules')`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_action_logs" ALTER COLUMN "type" TYPE "oem"."oem_action_logs_type_enum" USING "type"::"text"::"oem"."oem_action_logs_type_enum"`,
    );
    await queryRunner.query(`DROP TYPE "oem"."oem_action_logs_type_enum_old"`);
  }
}
