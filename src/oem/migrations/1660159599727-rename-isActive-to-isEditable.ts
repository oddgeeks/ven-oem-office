import { MigrationInterface, QueryRunner } from 'typeorm';

export class renameIsActiveToIsEditable1660159599727
  implements MigrationInterface
{
  name = 'renameIsActiveToIsEditable1660159599727';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_hierarchy_levels" RENAME COLUMN "is_active" TO "is_editable"`,
    );
    await queryRunner.query(
      `UPDATE oem.oem_hierarchy_levels SET is_editable = FALSE WHERE level <= 3`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_hierarchy_levels" RENAME COLUMN "is_editable" TO "is_active"`,
    );
    await queryRunner.query(
      `UPDATE oem.oem_hierarchy_levels SET is_editable = TRUE WHERE level <= 3`,
    );
  }
}
