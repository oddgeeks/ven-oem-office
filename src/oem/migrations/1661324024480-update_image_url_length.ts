import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateImageUrlLength1661324024480 implements MigrationInterface {
  name = 'updateImageUrlLength1661324024480';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_companies" ALTER COLUMN "logo_url" TYPE character varying(1024)`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_users" ALTER COLUMN "image_url" TYPE character varying(1024)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_companies" ALTER COLUMN "logo_url" TYPE character varying(1024)`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_users" ALTER COLUMN "image_url" TYPE character varying(1024)`,
    );
  }
}
