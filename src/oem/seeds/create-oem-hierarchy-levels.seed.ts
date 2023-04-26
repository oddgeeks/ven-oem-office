import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { OemHierarchyLevelEntity } from '../main/oem-hierarchy-levels/oem-hierarchy-level.entity';
import { HierarchyTypeEnum } from '../main/oem-hierarchy-levels/oem-hierarchy-level.enums/hierarchy-type.enum';

export default class CreateOemHierarchyLevels implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const GEOLevels: Array<OemHierarchyLevelEntity> = [];
    const ProductLevels: Array<OemHierarchyLevelEntity> = [];

    // TODO: update demo/clean seeds
    GEOLevels[0] = await factory(OemHierarchyLevelEntity)().create({
      hierarchyLevelId: 1,
      level: 0,
      levelName: `Global`,
      hierarchyType: HierarchyTypeEnum.USER_GEOGRAPHY,
      isEditable: true,
      isGlobal: true,
    });

    GEOLevels[1] = await factory(OemHierarchyLevelEntity)().create({
      hierarchyLevelId: 2,
      level: 1,
      levelName: `Continent`,
      hierarchyType: HierarchyTypeEnum.USER_GEOGRAPHY,
      isEditable: false,
    });

    GEOLevels[2] = await factory(OemHierarchyLevelEntity)().create({
      hierarchyLevelId: 3,
      level: 2,
      levelName: `Country`,
      hierarchyType: HierarchyTypeEnum.USER_GEOGRAPHY,
      isEditable: false,
    });

    GEOLevels[3] = await factory(OemHierarchyLevelEntity)().create({
      hierarchyLevelId: 4,
      level: 3,
      levelName: `Region`,
      hierarchyType: HierarchyTypeEnum.USER_GEOGRAPHY,
      isEditable: false,
    });

    GEOLevels[4] = await factory(OemHierarchyLevelEntity)().create({
      hierarchyLevelId: 5,
      level: 4,
      levelName: `City`,
      hierarchyType: HierarchyTypeEnum.USER_GEOGRAPHY,
    });

    GEOLevels[5] = await factory(OemHierarchyLevelEntity)().create({
      hierarchyLevelId: 6,
      level: 5,
      levelName: `District`,
      hierarchyType: HierarchyTypeEnum.USER_GEOGRAPHY,
    });

    GEOLevels[6] = await factory(OemHierarchyLevelEntity)().create({
      hierarchyLevelId: 7,
      level: 6,
      levelName: `Geo LV-6`,
      hierarchyType: HierarchyTypeEnum.USER_GEOGRAPHY,
    });

    GEOLevels[7] = await factory(OemHierarchyLevelEntity)().create({
      hierarchyLevelId: 8,
      level: 7,
      levelName: `Geo LV-7`,
      hierarchyType: HierarchyTypeEnum.USER_GEOGRAPHY,
    });

    GEOLevels[8] = await factory(OemHierarchyLevelEntity)().create({
      hierarchyLevelId: 9,
      level: 8,
      levelName: `Geo LV-8`,
      hierarchyType: HierarchyTypeEnum.USER_GEOGRAPHY,
    });

    GEOLevels[9] = await factory(OemHierarchyLevelEntity)().create({
      hierarchyLevelId: 10,
      level: 0,
      levelName: `Global`,
      hierarchyType: HierarchyTypeEnum.PRODUCT_LEVEL,
      isEditable: true,
      isGlobal: true,
    });

    ProductLevels[10] = await factory(OemHierarchyLevelEntity)().create({
      hierarchyLevelId: 11,
      level: 1,
      levelName: `Edition`,
      hierarchyType: HierarchyTypeEnum.PRODUCT_LEVEL,
      isEditable: false,
    });

    ProductLevels[11] = await factory(OemHierarchyLevelEntity)().create({
      hierarchyLevelId: 12,
      level: 2,
      levelName: `Vertical`,
      hierarchyType: HierarchyTypeEnum.PRODUCT_LEVEL,
      isEditable: false,
    });

    ProductLevels[12] = await factory(OemHierarchyLevelEntity)().create({
      hierarchyLevelId: 13,
      level: 3,
      levelName: `Licensing Model`,
      hierarchyType: HierarchyTypeEnum.PRODUCT_LEVEL,
      isEditable: false,
    });

    ProductLevels[13] = await factory(OemHierarchyLevelEntity)().create({
      hierarchyLevelId: 14,
      level: 4,
      levelName: `Path`,
      hierarchyType: HierarchyTypeEnum.PRODUCT_LEVEL,
    });

    ProductLevels[14] = await factory(OemHierarchyLevelEntity)().create({
      hierarchyLevelId: 15,
      level: 5,
      levelName: `Product LV-5`,
      hierarchyType: HierarchyTypeEnum.PRODUCT_LEVEL,
    });

    ProductLevels[15] = await factory(OemHierarchyLevelEntity)().create({
      hierarchyLevelId: 16,
      level: 6,
      levelName: `Product LV-6`,
      hierarchyType: HierarchyTypeEnum.PRODUCT_LEVEL,
    });

    ProductLevels[16] = await factory(OemHierarchyLevelEntity)().create({
      hierarchyLevelId: 17,
      level: 7,
      levelName: `Product LV-7`,
      hierarchyType: HierarchyTypeEnum.PRODUCT_LEVEL,
    });

    ProductLevels[17] = await factory(OemHierarchyLevelEntity)().create({
      hierarchyLevelId: 18,
      level: 8,
      levelName: `Product LV-8`,
      hierarchyType: HierarchyTypeEnum.PRODUCT_LEVEL,
    });

    return GEOLevels[1];
  }
}
