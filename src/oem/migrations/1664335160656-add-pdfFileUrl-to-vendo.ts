import { MigrationInterface, QueryRunner } from 'typeorm';

export class addPdfFileUrlToVendo1664335160656 implements MigrationInterface {
  name = 'addPdfFileUrlToVendo1664335160656';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos" ADD "pdf_file_url" character varying(1024)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos" DROP COLUMN "pdf_file_url"`,
    );
  }
}
