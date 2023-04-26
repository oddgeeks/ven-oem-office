import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateQuoteVendoMaterialPosition1664804202199
  implements MigrationInterface
{
  name = 'updateQuoteVendoMaterialPosition1664804202199';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_materials" ALTER COLUMN "position" TYPE smallint`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos_materials" ALTER COLUMN "position" TYPE smallint`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_materials" ADD CONSTRAINT "CHK_88ecfe78b353adfae46d21c28a" CHECK ("position" <> 0)`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos_materials" ADD CONSTRAINT "CHK_cfe2ba65a3a568e990b006e63b" CHECK ("position" <> 0)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos_materials" DROP CONSTRAINT "CHK_cfe2ba65a3a568e990b006e63b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_materials" DROP CONSTRAINT "CHK_88ecfe78b353adfae46d21c28a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes_materials" ALTER COLUMN "position" TYPE numeric(3,0)`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos_materials" ALTER COLUMN "position" TYPE numeric(3,0)`,
    );
  }
}
