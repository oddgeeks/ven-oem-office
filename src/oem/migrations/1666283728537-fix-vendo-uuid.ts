import { MigrationInterface, QueryRunner } from 'typeorm';

export class fixVendoUuid1666283728537 implements MigrationInterface {
  name = 'fixVendoUuid1666283728537';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos" ALTER COLUMN "vendo_uuid" TYPE character varying(36)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_vendos" ALTER COLUMN "vendo_uuid" TYPE character(36)`,
    );
  }
}
