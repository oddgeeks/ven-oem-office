import { MigrationInterface, QueryRunner } from 'typeorm';

export class hierarchyIsGlobal1681845535166 implements MigrationInterface {
  name = 'hierarchyIsGlobal1681845535166';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_hierarchy_levels" ADD "is_global" boolean`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_hierarchy_levels" DROP COLUMN "is_global"`,
    );
  }
}
