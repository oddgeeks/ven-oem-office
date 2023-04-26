import { MigrationInterface, QueryRunner } from 'typeorm';

export class expandMaterialName1663014369020 implements MigrationInterface {
  name = 'expandMaterialName1663014369020';

  public async up(queryRunner: QueryRunner): Promise<void> {
    /*
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_materials" DROP COLUMN "material_name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_materials" ADD "material_name" character varying(512) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_materials" DROP COLUMN "file_url"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_materials" ADD "file_url" character varying(1024) NOT NULL`,
    );
    */
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_materials" ALTER COLUMN "material_name" TYPE character varying(512)`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_materials" ALTER COLUMN "file_url" TYPE character varying(1024)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    /*
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_materials" DROP COLUMN "file_url"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_materials" ADD "file_url" character varying(256) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_materials" DROP COLUMN "material_name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_materials" ADD "material_name" character varying(128) NOT NULL`,
    );
    */
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_materials" ALTER COLUMN "file_url" TYPE character varying(256)`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_materials" ALTER COLUMN "material_name" TYPE character varying(128)`,
    );
  }
}
