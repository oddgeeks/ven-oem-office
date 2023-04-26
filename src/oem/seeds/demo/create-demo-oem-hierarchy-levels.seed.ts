import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { OemHierarchyLevelEntity } from '../../main/oem-hierarchy-levels/oem-hierarchy-level.entity';
import { HierarchyTypeEnum } from '../../main/oem-hierarchy-levels/oem-hierarchy-level.enums/hierarchy-type.enum';
import { seedEntities } from '../../../utils/seed-factory.util';

export default ({ companyId = 1 }: { companyId?: number }) =>
  class CreateOemHierarchyLevels implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
      const hierarchyLevels: Partial<OemHierarchyLevelEntity>[] = [
        {
          companyId,
          levelName: 'Continent',
          hierarchyType: HierarchyTypeEnum.USER_GEOGRAPHY,
          level: 1,
          isEditable: false,
          isEnabled: true,
          isActive: true,
        },
        {
          companyId,
          levelName: 'Country',
          hierarchyType: HierarchyTypeEnum.USER_GEOGRAPHY,
          level: 2,
          isEditable: false,
          isEnabled: true,
          isActive: true,
        },
        {
          companyId,
          levelName: 'Region',
          hierarchyType: HierarchyTypeEnum.USER_GEOGRAPHY,
          level: 3,
          isEditable: false,
          isEnabled: true,
          isActive: true,
        },
        {
          companyId,
          levelName: 'City',
          hierarchyType: HierarchyTypeEnum.USER_GEOGRAPHY,
          level: 4,
          isEditable: true,
          isEnabled: true,
          isActive: true,
        },
        {
          companyId,
          levelName: 'Category',
          hierarchyType: HierarchyTypeEnum.PRODUCT_LEVEL,
          level: 1,
          isEditable: false,
          isEnabled: true,
          isActive: true,
        },
        {
          companyId,
          levelName: 'Type',
          hierarchyType: HierarchyTypeEnum.PRODUCT_LEVEL,
          level: 2,
          isEditable: false,
          isEnabled: true,
          isActive: true,
        },
        {
          companyId,
          levelName: 'Geo LV-7',
          hierarchyType: HierarchyTypeEnum.USER_GEOGRAPHY,
          level: 7,
          isEditable: true,
          isEnabled: true,
          isActive: false,
        },
        {
          companyId,
          levelName: 'Geo LV-8',
          hierarchyType: HierarchyTypeEnum.USER_GEOGRAPHY,
          level: 8,
          isEditable: true,
          isEnabled: true,
          isActive: false,
        },
        {
          companyId,
          levelName: 'District',
          hierarchyType: HierarchyTypeEnum.USER_GEOGRAPHY,
          level: 5,
          isEditable: true,
          isEnabled: true,
          isActive: false,
        },
        {
          companyId,
          levelName: 'Geo LV-6',
          hierarchyType: HierarchyTypeEnum.USER_GEOGRAPHY,
          level: 6,
          isEditable: true,
          isEnabled: true,
          isActive: false,
        },
        {
          companyId,
          levelName: 'Edition / Model',
          hierarchyType: HierarchyTypeEnum.PRODUCT_LEVEL,
          level: 4,
          isEditable: true,
          isEnabled: true,
          isActive: true,
        },
        {
          companyId,
          levelName: 'Product LV-7',
          hierarchyType: HierarchyTypeEnum.PRODUCT_LEVEL,
          level: 7,
          isEditable: true,
          isEnabled: true,
          isActive: true,
        },
        {
          companyId,
          levelName: 'Product LV-8',
          hierarchyType: HierarchyTypeEnum.PRODUCT_LEVEL,
          level: 8,
          isEditable: true,
          isEnabled: true,
          isActive: true,
        },
        {
          companyId,
          levelName: 'Product LV-5',
          hierarchyType: HierarchyTypeEnum.PRODUCT_LEVEL,
          level: 5,
          isEditable: true,
          isEnabled: true,
          isActive: true,
        },
        {
          companyId,
          levelName: 'Vertical',
          hierarchyType: HierarchyTypeEnum.PRODUCT_LEVEL,
          level: 3,
          isEditable: false,
          isEnabled: true,
          isActive: true,
        },
        {
          companyId,
          levelName: 'Product LV-6',
          hierarchyType: HierarchyTypeEnum.PRODUCT_LEVEL,
          level: 6,
          isEditable: true,
          isEnabled: true,
          isActive: true,
        },
      ];

      const hierarchyLevelEntities = await seedEntities(
        connection,
        OemHierarchyLevelEntity,
        hierarchyLevels,
      );

      return hierarchyLevelEntities;
    }
  };
