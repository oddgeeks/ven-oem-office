import { MigrationInterface, QueryRunner } from 'typeorm';

export class addGlobalProductHierarchy1682300662772
  implements MigrationInterface
{
  name = 'addGlobalProductHierarchy1682300662772';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "oem"."oem_product_hierarchy_levels_level_name_level_key"`,
    );
    await queryRunner.query(
      `CREATE INDEX "oem_product_hierarchy_levels_level_name_level_key" ON "oem"."oem_hierarchy_levels" ("level", "level_name", "company_id") `,
    );

    // Insert global hierarchy level
    await queryRunner.query(
      `INSERT INTO oem.oem_hierarchy_levels (company_id, level, level_name, hierarchy_type, is_editable, is_global) VALUES (1, 0, 'Global', 'Product Level', true, true)`,
    );
    const globalHierarchyLevels = await queryRunner.query(
      `SELECT hierarchy_level_id FROM oem.oem_hierarchy_levels WHERE level_name = 'Global' AND hierarchy_type = 'Product Level'`,
    );
    const globalHierarchyLevelId = globalHierarchyLevels[0].hierarchy_level_id;
    console.log('globalHierarchyLevelId', globalHierarchyLevelId);

    // Insert global hierarchy
    await queryRunner.query(
      `INSERT INTO oem.oem_hierarchies (company_id, hierarchy_level_id, hierarchy_name, mpath) VALUES (1, ${globalHierarchyLevelId}, 'Global', '')`,
    );
    const globalHierarchies = await queryRunner.query(
      `SELECT hierarchy_id FROM oem.oem_hierarchies WHERE hierarchy_level_id = ${globalHierarchyLevelId}`,
    );
    const globalHierarchyId = globalHierarchies[0].hierarchy_id;
    console.log('globalHierarchyId', globalHierarchyId);

    // Get all product hierarchies
    const hierarchies = await queryRunner.query(
      `SELECT hierarchy_id, hl.level FROM oem.oem_hierarchies h INNER JOIN oem.oem_hierarchy_levels hl ON h.hierarchy_level_id = hl.hierarchy_level_id WHERE hl.hierarchy_type = 'Product Level'`,
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
    const level1HierarchyIds = hierarchies
      .filter((h: any) => Number(h.level) === 1)
      .map((h: any) => h.hierarchy_id);
    console.log('level1HierarchyIds', level1HierarchyIds);
    if (level1HierarchyIds.length > 0) {
      await queryRunner.query(
        `UPDATE oem.oem_hierarchies SET parent_id = ${globalHierarchyId}, "parentHierarchyId" = ${globalHierarchyId} WHERE hierarchy_id IN (${level1HierarchyIds.join(
          ',',
        )})`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "oem"."oem_product_hierarchy_levels_level_name_level_key"`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "oem_product_hierarchy_levels_level_name_level_key" ON "oem"."oem_hierarchy_levels" ("level_name", "level") `,
    );

    const globalHierarchyLevels = await queryRunner.query(
      `SELECT hierarchy_level_id FROM oem.oem_hierarchy_levels WHERE level_name = 'Global' AND hierarchy_type = 'Product Level'`,
    );
    const globalHierarchyLevelId = globalHierarchyLevels[0].hierarchy_level_id;

    const globalHierarchies = await queryRunner.query(
      `SELECT hierarchy_id FROM oem.oem_hierarchies WHERE hierarchy_level_id = ${globalHierarchyLevelId}`,
    );
    const globalHierarchyId = globalHierarchies[0].hierarchy_id;

    // Get all geo hierarchies
    const hierarchies = await queryRunner.query(
      `SELECT hierarchy_id, hl.level FROM oem.oem_hierarchies h INNER JOIN oem.oem_hierarchy_levels hl ON h.hierarchy_level_id = hl.hierarchy_level_id WHERE hl.hierarchy_type = 'Product Level'`,
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
      const level1HierarchyIds = hierarchies
        .filter((h: any) => Number(h.level) === 1)
        .map((h: any) => h.hierarchy_id);
      if (level1HierarchyIds.length > 0) {
        await queryRunner.query(
          `UPDATE oem.oem_hierarchies SET parent_id = NULL, "parentHierarchyId" = NULL WHERE hierarchy_id IN (${level1HierarchyIds.join(
            ',',
          )})`,
        );
      }
    }

    await queryRunner.query(
      `DELETE FROM oem.oem_hierarchies WHERE hierarchy_level_id = ${globalHierarchyLevelId}`,
    );
    await queryRunner.query(
      `DELETE FROM oem.oem_hierarchy_levels WHERE hierarchy_level_id = ${globalHierarchyLevelId}`,
    );
  }
}
