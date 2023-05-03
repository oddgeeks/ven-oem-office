//TODO: there is should be more smarter algorithm, bc it brakes system if data is empty, probably need to integrate with seeds
import { MigrationInterface, QueryRunner } from 'typeorm';

export class addGlobalHierarchy1682092510950 implements MigrationInterface {
  name = 'addGlobalHierarchy1682092510950';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_hierarchy_levels" DROP COLUMN "is_global"`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_hierarchy_levels" ADD "is_global" boolean NOT NULL DEFAULT false`,
    );

    // Insert global hierarchy level
    await queryRunner.query(
      `INSERT INTO oem.oem_hierarchy_levels (company_id, level, level_name, hierarchy_type, is_editable, is_global) VALUES (1, 0, 'Global', 'User Geography', true, true)`,
    );
    const globalHierarchyLevels = await queryRunner.query(
      `SELECT hierarchy_level_id FROM oem.oem_hierarchy_levels WHERE level_name = 'Global'`,
    );
    const globalHierarchyLevelId = globalHierarchyLevels[0].hierarchy_level_id;
    console.log('globalHierarchyLevelId', globalHierarchyLevelId);

    // Insert global hierarchy
    await queryRunner.query(
      `INSERT INTO oem.oem_hierarchies (company_id, hierarchy_level_id, hierarchy_name, mpath) VALUES (1, ${globalHierarchyLevelId}, 'Global', '')`,
    );
    const globalHierarchies = await queryRunner.query(
      `SELECT hierarchy_id FROM oem.oem_hierarchies WHERE hierarchy_name = 'Global'`,
    );
    const globalHierarchyId = globalHierarchies[0].hierarchy_id;
    console.log('globalHierarchyId', globalHierarchyId);

    // Get all geo hierarchies
    const hierarchies = await queryRunner.query(
      `SELECT hierarchy_id, hl.level FROM oem.oem_hierarchies h INNER JOIN oem.oem_hierarchy_levels hl ON h.hierarchy_level_id = hl.hierarchy_level_id WHERE hl.hierarchy_type = 'User Geography'`,
    );
    if (hierarchies.length === 0) {
      return;
    }

    console.log('hierarchies', hierarchies);
    const hierarchyIds = hierarchies.map((h: any) => h.hierarchy_id);

    // Set mpath
    await queryRunner.query(
      `UPDATE oem.oem_hierarchies SET mpath = CONCAT('${globalHierarchyId}.', mpath) WHERE hierarchy_id IN (${hierarchyIds.join(
        ',',
      )})`,
    );

    // Set parent
    const continentHierarchyIds = hierarchies
      .filter((h: any) => Number(h.level) === 1)
      .map((h: any) => h.hierarchy_id);
    console.log('continentHierarchyIds', continentHierarchyIds);
    if (continentHierarchyIds.length > 0) {
      await queryRunner.query(
        `UPDATE oem.oem_hierarchies SET parent_id = ${globalHierarchyId}, "parentHierarchyId" = ${globalHierarchyId} WHERE hierarchy_id IN (${continentHierarchyIds.join(
          ',',
        )})`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const globalHierarchies = await queryRunner.query(
      `SELECT hierarchy_id FROM oem.oem_hierarchies WHERE hierarchy_name = 'Global'`,
    );
    const globalHierarchyId = globalHierarchies[0].hierarchy_id;

    // Get all geo hierarchies
    const hierarchies = await queryRunner.query(
      `SELECT hierarchy_id, hl.level FROM oem.oem_hierarchies h INNER JOIN oem.oem_hierarchy_levels hl ON h.hierarchy_level_id = hl.hierarchy_level_id WHERE hl.hierarchy_type = 'User Geography'`,
    );
    if (hierarchies.length > 0) {
      const hierarchyIds = hierarchies.map((h: any) => h.hierarchy_id);

      // Set mpath
      await queryRunner.query(
        `UPDATE oem.oem_hierarchies SET mpath = REGEXP_REPLACE(mpath, '^${globalHierarchyId}.', '') WHERE hierarchy_id IN (${hierarchyIds.join(
          ',',
        )})`,
      );

      // Set parent
      const continentHierarchyIds = hierarchies
        .filter((h: any) => Number(h.level) === 1)
        .map((h: any) => h.hierarchy_id);
      if (continentHierarchyIds.length > 0) {
        await queryRunner.query(
          `UPDATE oem.oem_hierarchies SET parent_id = NULL, "parentHierarchyId" = NULL WHERE hierarchy_id IN (${continentHierarchyIds.join(
            ',',
          )})`,
        );
      }
    }

    await queryRunner.query(
      `DELETE FROM oem.oem_hierarchies WHERE hierarchy_name = 'Global'`,
    );
    await queryRunner.query(
      `DELETE FROM oem.oem_hierarchy_levels WHERE level_name = 'Global'`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_hierarchy_levels" ALTER COLUMN "is_global" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "oem"."oem_hierarchy_levels" ALTER COLUMN "is_global" DROP NOT NULL`,
    );
  }
}
