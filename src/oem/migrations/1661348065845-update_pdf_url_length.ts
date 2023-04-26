import { MigrationInterface, QueryRunner } from 'typeorm';

export class updatePdfUrlLength1661348065845 implements MigrationInterface {
  name = 'updatePdfUrlLength1661348065845';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ALTER COLUMN "pdf_file_url" TYPE character varying(1024)`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ALTER COLUMN "excel_file_url" TYPE character varying(1024)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ALTER COLUMN "pdf_file_url" TYPE character varying(256)`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_quotes" ALTER COLUMN "excel_file_url" TYPE character varying(256)`,
    );
  }
}
