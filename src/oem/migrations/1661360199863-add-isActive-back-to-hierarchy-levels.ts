import { MigrationInterface, QueryRunner } from 'typeorm';

export class addIsActiveBackToHierarchyLevels1661360199863
  implements MigrationInterface
{
  name = 'addIsActiveBackToHierarchyLevels1661360199863';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_hierarchy_levels" ADD "is_active" boolean NOT NULL DEFAULT true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_hierarchy_levels" DROP COLUMN "is_active"`,
    );
  }
}
